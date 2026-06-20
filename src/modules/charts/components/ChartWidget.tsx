"use client"

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js"
import { Bar, Line, Pie } from "react-chartjs-2"
import type { ColumnDefinition } from "@/core/project"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Title,
  Tooltip,
  Legend,
)

interface ChartWidgetProps {
  data: Record<string, unknown>[]
  columns: ColumnDefinition[]
  chartType: "line" | "bar" | "pie" | "area"
  labelColumn?: string
  valueColumn?: string
  groupByColumn?: string
  title?: string
}

export function ChartWidget({
  data,
  columns,
  chartType,
  labelColumn,
  valueColumn,
  groupByColumn,
  title,
}: ChartWidgetProps) {
  const numericCols = columns.filter((c) => c.type === "number")
  const labelCol = labelColumn
    ? columns.find((c) => c.id === labelColumn || c.name === labelColumn)
    : columns.find((_c) => true)
  const valueCol = valueColumn
    ? columns.find((c) => c.id === valueColumn || c.name === valueColumn)
    : numericCols[0]

  const getColValue = (col: ColumnDefinition): string => col.name || col.id

  if (groupByColumn) {
    const groupCol = columns.find((c) => c.id === groupByColumn || c.name === groupByColumn)
    if (!groupCol || !labelCol || !valueCol) {
      return (
        <div className="h-full min-h-[300px] flex items-center justify-center text-muted-foreground text-sm">
          Configuración de columnas incompleta
        </div>
      )
    }

    const groups = new Map<string, Record<string, unknown>[]>()
    for (const row of data) {
      const key = String(row[getColValue(groupCol)] ?? "")
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key)!.push(row)
    }

    const labels = [
      ...new Set(
        data.map((r) => String(labelCol ? r[getColValue(labelCol)] : (r[Object.keys(r)[0]] ?? ""))),
      ),
    ]
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

    const datasets = Array.from(groups.entries()).map(([group, rows], i) => ({
      label: group,
      data: labels.map((l) => {
        const match = rows.find((r) => String(r[getColValue(labelCol)] ?? "") === l)
        return match ? Number(match[getColValue(valueCol)]) || 0 : 0
      }),
      backgroundColor: colors[i % colors.length],
      borderColor: borderColors[i % borderColors.length],
      borderWidth: 1,
      fill: chartType === "area",
    }))

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top" as const },
        title: { display: !!title, text: title },
      },
    }

    return (
      <div className="h-full min-h-[300px]">
        {chartType === "line" && <Line data={{ labels, datasets }} options={options} />}
        {chartType === "bar" && <Bar data={{ labels, datasets }} options={options} />}
        {chartType === "pie" && (
          <Pie
            data={{
              labels,
              datasets: datasets.map((ds) => ({
                ...ds,
                data: [ds.data.reduce((a, b) => a + b, 0)],
              })),
            }}
            options={options}
          />
        )}
        {chartType === "area" && (
          <Line
            data={{ labels, datasets: datasets.map((ds) => ({ ...ds, fill: true })) }}
            options={{ ...options, plugins: { ...options.plugins } }}
          />
        )}
      </div>
    )
  }

  const labels = data.map((row) =>
    String(labelCol ? row[getColValue(labelCol)] : row[Object.keys(row)[0]]),
  )
  const values = data.map(
    (row) => Number(valueCol ? row[getColValue(valueCol)] : Object.values(row)[0]) || 0,
  )

  const chartData = {
    labels,
    datasets: [
      {
        label: valueCol?.label || valueCol?.name || "Valor",
        data: values,
        backgroundColor: [
          "rgba(59, 130, 246, 0.5)",
          "rgba(16, 185, 129, 0.5)",
          "rgba(245, 158, 11, 0.5)",
          "rgba(239, 68, 68, 0.5)",
          "rgba(139, 92, 246, 0.5)",
          "rgba(236, 72, 153, 0.5)",
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(139, 92, 246, 1)",
          "rgba(236, 72, 153, 1)",
        ],
        borderWidth: 1,
        fill: chartType === "area",
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const },
      title: { display: !!title, text: title },
    },
  }

  return (
    <div className="h-full min-h-[300px]">
      {chartType === "line" && <Line data={chartData} options={options} />}
      {chartType === "bar" && <Bar data={chartData} options={options} />}
      {chartType === "pie" && <Pie data={chartData} options={options} />}
      {chartType === "area" && (
        <Line
          data={{ ...chartData, datasets: chartData.datasets.map((ds) => ({ ...ds, fill: true })) }}
          options={options}
        />
      )}
    </div>
  )
}
