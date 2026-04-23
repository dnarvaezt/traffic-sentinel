"use client"

import { ArrowLeft, BarChart3, FileSpreadsheet, List, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { useProjectStore } from "@/application/stores/project-store"
import type { FilterDefinition, GroupByDefinition, MetricDefinition } from "@/application/types"
import { ChartWidget } from "@/components/charts/chart-widget"
import { FilterBuilder } from "@/components/filters/filter-builder"
import { Button } from "@/infrastructure/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/infrastructure/components/ui/select"
import { loadDatabaseData } from "@/infrastructure/services/indexed-db"
import { executeQuery } from "@/infrastructure/services/query-service"

interface ChartConfig {
  id: string
  type: "bar" | "line" | "pie"
  labelColumn?: string
  valueColumn?: string
  title: string
}

export default function DashboardDatasetPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const datasetId = params.datasetId as string

  const { getProject } = useProjectStore()
  const [mounted, setMounted] = useState(false)
  const [loadedData, setLoadedData] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [charts, setCharts] = useState<ChartConfig[]>([])
  const [filters, setFilters] = useState<FilterDefinition[]>([])
  const [metrics, setMetrics] = useState<MetricDefinition[]>([])
  const [groupBys, setGroupBys] = useState<GroupByDefinition[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  const projectData = getProject(projectId)
  const dataset = projectData?.databases?.find((d) => d.id === datasetId)

  useEffect(() => {
    if (datasetId) {
      setLoading(true)
      loadDatabaseData(datasetId)
        .then((loaded) => {
          if (loaded) setLoadedData(loaded.data)
        })
        .finally(() => setLoading(false))
    }
  }, [datasetId])

  const processedData = useMemo(() => {
    if (!dataset || loadedData.length === 0) return []
    return executeQuery(loadedData, {
      filters,
      metrics,
      groupBy: groupBys.length > 0 ? groupBys : undefined,
    })
  }, [dataset, loadedData, filters, metrics, groupBys])

  const schemaColumns = projectData?.schema?.columns || []

  if (!mounted) return null
  if (!projectData) return <p>Proyecto no encontrado</p>
  if (!dataset) return <p>Dataset no encontrado</p>

  function handleAddChart() {
    const numericCols = schemaColumns.filter((c) => c.type === "number")
    const labelCols = schemaColumns.filter((c) => c.filterable)
    const newChart: ChartConfig = {
      id: crypto.randomUUID(),
      type: "bar",
      labelColumn: labelCols[0]?.name,
      valueColumn: numericCols[0]?.name,
      title: `Gráfico ${charts.length + 1}`,
    }
    setCharts([...charts, newChart])
  }

  function handleUpdateChart(chartId: string, updates: Partial<ChartConfig>) {
    setCharts(charts.map((c) => (c.id === chartId ? { ...c, ...updates } : c)))
  }

  function handleDeleteChart(chartId: string) {
    setCharts(charts.filter((c) => c.id !== chartId))
  }

  const navItems = [
    { label: "Datos", href: `/projects/${projectId}/datasets/${datasetId}`, icon: List },
    {
      label: "Dashboard",
      href: `/projects/${projectId}/dashboard/${datasetId}`,
      icon: BarChart3,
      active: true,
    },
  ]

  return (
    <main className="min-h-screen flex">
      <aside className="w-64 border-r p-4 space-y-4">
        <Button variant="ghost" size="sm" onClick={() => router.push(`/projects/${projectId}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al proyecto
        </Button>

        <div className="pt-2 border-t">
          <div className="flex items-center justify-between px-2 mb-2">
            <h2 className="text-sm font-semibold">Dataset</h2>
            <span className="text-xs text-muted-foreground">
              {dataset.rowCount?.toLocaleString()} filas
            </span>
          </div>
          <p className="text-sm font-medium px-2">{dataset.name}</p>
        </div>

        <div className="pt-2 border-t">
          <h2 className="text-sm font-semibold px-2 mb-2">Navegación</h2>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={item.active ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </div>

        <div className="pt-2 border-t">
          <h2 className="text-sm font-semibold px-2 mb-2">Otros Datasets</h2>
          {projectData.databases
            .filter((d) => d.id !== datasetId)
            .map((d) => (
              <Link key={d.id} href={`/projects/${projectId}/datasets/${d.id}`}>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  {d.name}
                </Button>
              </Link>
            ))}
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b px-6 py-3">
          <h1 className="text-lg font-semibold">Dashboard - {dataset.name}</h1>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <aside className="w-72 border-r p-4 overflow-y-auto space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Filtros</h3>
              <FilterBuilder
                columns={schemaColumns}
                filters={filters}
                metrics={metrics}
                groupBys={groupBys}
                sorts={[]}
                onFiltersChange={setFilters}
                onMetricsChange={setMetrics}
                onGroupBysChange={setGroupBys}
                onSortsChange={() => {}}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Gráficos</h3>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleAddChart}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {charts.map((chart) => (
                  <div key={chart.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{chart.title}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleDeleteChart(chart.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <Select
                      value={chart.type}
                      onValueChange={(value) =>
                        handleUpdateChart(chart.id, { type: value as "bar" | "line" | "pie" })
                      }
                    >
                      <SelectTrigger className="w-full h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bar">Barras</SelectItem>
                        <SelectItem value="line">Líneas</SelectItem>
                        <SelectItem value="pie">Circular</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <div className="flex-1 overflow-auto p-4">
            {loading ? (
              <div className="h-full flex items-center justify-center">Cargando...</div>
            ) : charts.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {charts.map((chart) => (
                  <div key={chart.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-4">{chart.title}</h3>
                    <ChartWidget
                      data={processedData}
                      columns={schemaColumns}
                      chartType={chart.type}
                      labelColumn={chart.labelColumn}
                      valueColumn={chart.valueColumn}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No hay gráficos configurados</p>
                  <Button variant="link" size="sm" onClick={handleAddChart} className="mt-2">
                    Agregar gráfico
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
