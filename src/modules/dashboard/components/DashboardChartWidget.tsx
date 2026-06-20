"use client"

import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

import { Settings2 } from "lucide-react"
import { useMemo, useState } from "react"
import { Bar, Line, Pie } from "react-chartjs-2"
import { executeQuery } from "@/core/dataset/dataset.service"
import type { ColumnDefinition, WidgetConfig } from "@/core/project"
import { Button } from "@/shared/components/ui/button"
import { Label } from "@/shared/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { WidgetWrapper } from "./WidgetWrapper"

interface ChartWidgetDashboardProps {
  data: Record<string, unknown>[]
  columns: ColumnDefinition[]
  config: WidgetConfig
  onConfigChange?: (config: WidgetConfig) => void
  onRemove?: () => void
  onSettings?: () => void
}

export function DashboardChartWidget({
  data,
  columns,
  config,
  onConfigChange,
  onRemove,
  onSettings,
}: ChartWidgetDashboardProps) {
  const [showConfig, setShowConfig] = useState(false)
  const chartType = config.chartType || "bar"

  const numericColumns = columns.filter(
    (c) => c.type === "number" || c.type === "currency" || c.type === "percentage",
  )
  const allColumns = columns

  const labelCol = config.metrics?.[0]?.columnId || allColumns[0]?.header || ""
  const valueCol = config.metrics?.[1]?.columnId || numericColumns[0]?.header || ""
  const groupByCol = config.groupBy?.[0]?.columnId

  const chartData = useMemo(() => {
    const filtered = executeQuery(data, {
      filters: config.filters?.map((f) => ({ ...f, name: f.name || "" })) || [],
    })

    if (!labelCol || !valueCol) return { labels: [], datasets: [] }

    if (groupByCol) {
      const groups = new Map<string, Record<string, unknown>[]>()
      for (const row of filtered) {
        const key = String(row[groupByCol] ?? "")
        if (!groups.has(key)) groups.set(key, [])
        groups.get(key)!.push(row)
      }

      const labels = [...new Set(filtered.map((r) => String(r[labelCol] ?? "")))]
      const datasets: {
        label: string
        data: number[]
        backgroundColor: string
        borderColor: string
      }[] = []
      const colors = [
        "rgba(59, 130, 246, 0.5)",
        "rgba(16, 185, 129, 0.5)",
        "rgba(245, 158, 11, 0.5)",
        "rgba(239, 68, 68, 0.5)",
        "rgba(139, 92, 246, 0.5)",
        "rgba(236, 72, 153, 0.5)",
      ]
      const borderColors = [
        "rgba(59, 130, 246, 1)",
        "rgba(16, 185, 129, 1)",
        "rgba(245, 158, 11, 1)",
        "rgba(239, 68, 68, 1)",
        "rgba(139, 92, 246, 1)",
        "rgba(236, 72, 153, 1)",
      ]

      let ci = 0
      for (const [group, rows] of groups) {
        const values = labels.map((l) => {
          const match = rows.find((r) => String(r[labelCol] ?? "") === l)
          return match ? Number(match[valueCol]) || 0 : 0
        })
        datasets.push({
          label: group,
          data: values,
          backgroundColor: colors[ci % colors.length],
          borderColor: borderColors[ci % borderColors.length],
        })
        ci++
      }

      return { labels, datasets }
    }

    const labels = filtered.map((r) => String(r[labelCol] ?? ""))
    const values = filtered.map((r) => Number(r[valueCol]) || 0)

    return {
      labels,
      datasets: [
        {
          label: valueCol,
          data: values,
          backgroundColor: "rgba(59, 130, 246, 0.5)",
          borderColor: "rgba(59, 130, 246, 1)",
          borderWidth: 1,
          fill: chartType === "area" || chartType === "line",
        },
      ],
    }
  }, [data, config, labelCol, valueCol, groupByCol, chartType])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: !!groupByCol },
    },
  }

  const handleTypeChange = (type: string) => {
    onConfigChange?.({ ...config, chartType: type as WidgetConfig["chartType"] })
  }

  const handleLabelChange = (col: string) => {
    onConfigChange?.({
      ...config,
      metrics: [
        { id: "label", columnId: col, aggregation: "count" },
        ...(config.metrics?.slice(1) || []),
      ],
    })
  }

  const handleValueChange = (col: string) => {
    onConfigChange?.({
      ...config,
      metrics: [
        config.metrics?.[0] || { id: "label", columnId: "", aggregation: "count" },
        { id: "value", columnId: col, aggregation: "sum" },
      ],
    })
  }

  const handleGroupByChange = (col: string) => {
    onConfigChange?.({
      ...config,
      groupBy: col ? [{ id: "group", columnId: col }] : [],
    })
  }

  return (
    <WidgetWrapper
      title={`Gráfico ${chartType === "bar" ? "Barras" : chartType === "line" ? "Líneas" : chartType === "pie" ? "Pastel" : "Área"}`}
      onRemove={onRemove}
      onSettings={onSettings}
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs gap-1"
            onClick={() => setShowConfig(!showConfig)}
          >
            <Settings2 className="h-3 w-3" />
            Configurar
          </Button>
        </div>

        {showConfig && (
          <div className="grid grid-cols-2 gap-2 p-2 border rounded-md bg-muted/20 text-xs">
            <div>
              <Label className="text-xs">Tipo</Label>
              <Select value={chartType} onValueChange={handleTypeChange}>
                <SelectTrigger className="h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Línea</SelectItem>
                  <SelectItem value="bar">Barra</SelectItem>
                  <SelectItem value="pie">Pastel</SelectItem>
                  <SelectItem value="area">Área</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Columna etiqueta</Label>
              <Select value={labelCol} onValueChange={handleLabelChange}>
                <SelectTrigger className="h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {allColumns.map((c) => (
                    <SelectItem key={c.header} value={c.header}>
                      {c.tooltip || c.header}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Columna valor</Label>
              <Select value={valueCol} onValueChange={handleValueChange}>
                <SelectTrigger className="h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {numericColumns.map((c) => (
                    <SelectItem key={c.header} value={c.header}>
                      {c.tooltip || c.header}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Agrupar por</Label>
              <Select value={groupByCol || ""} onValueChange={handleGroupByChange}>
                <SelectTrigger className="h-7 text-xs">
                  <SelectValue placeholder="Sin agrupar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">Sin agrupar</SelectItem>
                  {allColumns.map((c) => (
                    <SelectItem key={c.header} value={c.header}>
                      {c.tooltip || c.header}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <div className="h-[250px]">
          {chartData.labels.length > 0 ? (
            <>
              {chartType === "line" && <Line data={chartData} options={options} />}
              {chartType === "bar" && <Bar data={chartData} options={options} />}
              {chartType === "pie" && <Pie data={chartData} options={options} />}
              {chartType === "area" && (
                <Line
                  data={{
                    ...chartData,
                    datasets: chartData.datasets.map((ds) => ({ ...ds, fill: true })),
                  }}
                  options={options}
                />
              )}
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
              No hay datos para mostrar
            </div>
          )}
        </div>
      </div>
    </WidgetWrapper>
  )
}
