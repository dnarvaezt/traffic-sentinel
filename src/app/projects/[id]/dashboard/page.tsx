"use client"

import { ArrowLeft, Database, Plus, Trash2 } from "lucide-react"
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
import { loadDataset } from "@/infrastructure/services/indexed-db"
import { executeQuery } from "@/infrastructure/services/query-service"

interface ChartConfig {
  id: string
  type: "bar" | "line" | "pie"
  labelColumn?: string
  valueColumn?: string
  title: string
}

export default function DashboardPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const { getProject, setActiveDataset, activeDatasetId } = useProjectStore()

  const project = getProject(projectId)
  const [datasetData, setDatasetData] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(false)
  const [charts, setCharts] = useState<ChartConfig[]>([])

  const [filters, setFilters] = useState<FilterDefinition[]>([])
  const [metrics, setMetrics] = useState<MetricDefinition[]>([])
  const [groupBys, setGroupBys] = useState<GroupByDefinition[]>([])

  const selectedDataset = project?.datasets.find((d) => d.id === activeDatasetId)

  useEffect(() => {
    if (!activeDatasetId) {
      if (project?.datasets.length) {
        setActiveDataset(project.datasets[0].id)
      }
    }
  }, [project, activeDatasetId, setActiveDataset])

  useEffect(() => {
    if (activeDatasetId) {
      setLoading(true)
      loadDataset(activeDatasetId)
        .then((loaded) => {
          if (loaded) setDatasetData(loaded.data)
        })
        .finally(() => setLoading(false))
    }
  }, [activeDatasetId])

  const processedData = useMemo(() => {
    if (!selectedDataset || datasetData.length === 0) return []
    return executeQuery(selectedDataset, {
      filters,
      metrics,
      groupBy: groupBys.length > 0 ? groupBys : undefined,
    })
  }, [selectedDataset, datasetData, filters, metrics, groupBys])

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (!project) {
    return (
      <main className="min-h-screen p-8">
        <p>Proyecto no encontrado</p>
        <Button asChild className="mt-4">
          <Link href="/projects">Volver</Link>
        </Button>
      </main>
    )
  }

  function handleAddChart() {
    const numericCols = selectedDataset?.columns.filter((c) => c.type === "number") || []
    const labelCols = selectedDataset?.columns.filter((c) => c.filterable) || []

    const newChart: ChartConfig = {
      id: crypto.randomUUID(),
      type: "bar",
      labelColumn: labelCols[0]?.id,
      valueColumn: numericCols[0]?.id,
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

  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b px-6 py-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push(`/projects/${projectId}`)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            {project.name} - Visualiza tus datos en gráficos
          </p>
        </div>
        {project.datasets.length > 0 && (
          <Select value={activeDatasetId || ""} onValueChange={(value) => setActiveDataset(value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {project.datasets.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-80 border-r p-4 overflow-y-auto bg-card space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Filtros Globales</h3>
            <FilterBuilder
              columns={selectedDataset?.columns || []}
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
                      className="h-6 w-6 text-destructive hover:bg-destructive/10 hover:text-destructive"
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
          {selectedDataset ? (
            loading ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <p>Cargando...</p>
              </div>
            ) : charts.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {charts.map((chart) => {
                  return (
                    <div key={chart.id} className="border rounded-lg p-4 bg-card">
                      <h3 className="font-semibold mb-4">{chart.title}</h3>
                      <ChartWidget
                        data={processedData}
                        columns={selectedDataset.columns}
                        chartType={chart.type}
                        labelColumn={chart.labelColumn}
                        valueColumn={chart.valueColumn}
                      />
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <p>No hay gráficos configurados</p>
                  <Button variant="link" size="sm" onClick={handleAddChart} className="mt-2">
                    Agregar gráfico
                  </Button>
                </div>
              </div>
            )
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No hay datasets disponibles</p>
                <Button asChild variant="link" className="mt-2">
                  <Link href={`/projects/${projectId}/datasets`}>Ir a datasets</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
