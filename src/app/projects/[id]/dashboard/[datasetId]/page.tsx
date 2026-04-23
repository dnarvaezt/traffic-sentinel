"use client"

import {
  ArrowLeft,
  BarChart3,
  ChevronRight,
  List,
  Plus,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { useProjectStore } from "@/application/stores/project-store"
import type { FilterDefinition, GroupByDefinition, MetricDefinition } from "@/application/types"
import { ChartWidget } from "@/components/charts/chart-widget"
import { FilterBuilder } from "@/components/filters/filter-builder"
import { Badge } from "@/infrastructure/components/ui/badge"
import { Button } from "@/infrastructure/components/ui/button"
import { Input } from "@/infrastructure/components/ui/input"
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
  const [panelOpen, setPanelOpen] = useState(true)

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
  const numericColumns = schemaColumns.filter((c) => c.type === "number")
  const activeFiltersCount = filters.length + metrics.length + groupBys.length

  if (!mounted) return null
  if (!projectData) return <p className="p-8 text-muted-foreground">Proyecto no encontrado</p>
  if (!dataset) return <p className="p-8 text-muted-foreground">Dataset no encontrado</p>

  function handleAddChart() {
    setCharts([
      ...charts,
      {
        id: crypto.randomUUID(),
        type: "bar",
        labelColumn: schemaColumns.find((c) => c.filterable)?.name,
        valueColumn: numericColumns[0]?.name,
        title: `Gráfico ${charts.length + 1}`,
      },
    ])
    if (!panelOpen) setPanelOpen(true)
  }

  function handleUpdateChart(chartId: string, updates: Partial<ChartConfig>) {
    setCharts(charts.map((c) => (c.id === chartId ? { ...c, ...updates } : c)))
  }

  function handleDeleteChart(chartId: string) {
    setCharts(charts.filter((c) => c.id !== chartId))
  }

  return (
    <main className="h-screen flex flex-col overflow-hidden">
      {/* ── Toolbar ── */}
      <header className="h-12 border-b px-3 flex items-center gap-1.5 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={() => router.push(`/projects/${projectId}`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1 text-sm min-w-0">
          <span className="text-muted-foreground truncate hidden sm:block max-w-[100px]">
            {projectData.name}
          </span>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0 hidden sm:block" />
          <span className="font-medium truncate max-w-[160px]">{dataset.name}</span>
        </div>

        <Badge variant="outline" className="text-xs shrink-0 hidden md:flex">
          {loadedData.length.toLocaleString()} filas
        </Badge>

        {/* Tab switcher */}
        <nav className="flex items-center bg-muted rounded-lg p-0.5 mx-auto shrink-0">
          <Link
            href={`/projects/${projectId}/datasets/${datasetId}`}
            className="flex items-center gap-1.5 px-3 h-7 rounded-md text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <List className="h-3.5 w-3.5" />
            Datos
          </Link>
          <span className="flex items-center gap-1.5 px-3 h-7 rounded-md text-sm bg-background text-foreground shadow-sm">
            <BarChart3 className="h-3.5 w-3.5" />
            Dashboard
          </span>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-0.5 ml-auto">
          <Button variant="ghost" size="sm" className="h-8 gap-1.5 px-2.5" onClick={handleAddChart}>
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline text-sm">Gráfico</span>
          </Button>

          <div className="w-px h-5 bg-border mx-1 shrink-0" />

          <Button
            variant={panelOpen ? "secondary" : "ghost"}
            size="sm"
            className="h-8 gap-1.5 px-2.5"
            onClick={() => setPanelOpen(!panelOpen)}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span className="hidden sm:inline text-sm">Panel</span>
            {activeFiltersCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-medium">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left panel */}
        {panelOpen && (
          <aside className="w-72 border-r flex flex-col shrink-0 overflow-hidden">
            <div className="flex items-center justify-between px-4 h-10 border-b shrink-0">
              <span className="text-sm font-medium">Configuración</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setPanelOpen(false)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Charts section */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Gráficos
                    {charts.length > 0 && (
                      <span className="ml-1.5 text-xs text-muted-foreground">
                        ({charts.length})
                      </span>
                    )}
                  </span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleAddChart}>
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {charts.length === 0 && (
                  <p className="text-xs text-muted-foreground py-1">
                    Aún no hay gráficos. Usa + para agregar.
                  </p>
                )}

                {charts.map((chart) => (
                  <div key={chart.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        value={chart.title}
                        onChange={(e) => handleUpdateChart(chart.id, { title: e.target.value })}
                        className="h-7 text-xs flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDeleteChart(chart.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>

                    <Select
                      value={chart.type}
                      onValueChange={(v) =>
                        handleUpdateChart(chart.id, { type: v as ChartConfig["type"] })
                      }
                    >
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bar">Barras</SelectItem>
                        <SelectItem value="line">Líneas</SelectItem>
                        <SelectItem value="pie">Circular</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={chart.labelColumn || ""}
                      onValueChange={(v) => handleUpdateChart(chart.id, { labelColumn: v })}
                    >
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue placeholder="Eje X / etiqueta" />
                      </SelectTrigger>
                      <SelectContent>
                        {schemaColumns.map((c) => (
                          <SelectItem key={c.id} value={c.name}>
                            {c.label || c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={chart.valueColumn || ""}
                      onValueChange={(v) => handleUpdateChart(chart.id, { valueColumn: v })}
                    >
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue placeholder="Eje Y / valor" />
                      </SelectTrigger>
                      <SelectContent>
                        {numericColumns.length > 0 ? (
                          numericColumns.map((c) => (
                            <SelectItem key={c.id} value={c.name}>
                              {c.label || c.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="_none" disabled>
                            No hay columnas numéricas
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>

              <div className="border-t" />

              {/* Filters section */}
              <div className="p-4 space-y-3">
                <span className="text-sm font-medium">Filtros y métricas</span>
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
            </div>
          </aside>
        )}

        {/* Chart canvas */}
        <div className="flex-1 overflow-auto p-5 min-w-0">
          {loading ? (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
              Cargando...
            </div>
          ) : charts.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 auto-rows-[320px]">
              {charts.map((chart) => (
                <div key={chart.id} className="border rounded-xl p-4 flex flex-col overflow-hidden">
                  <h3 className="text-sm font-semibold mb-3 shrink-0">{chart.title}</h3>
                  <div className="flex-1 min-h-0">
                    <ChartWidget
                      data={processedData}
                      columns={schemaColumns}
                      chartType={chart.type}
                      labelColumn={chart.labelColumn}
                      valueColumn={chart.valueColumn}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-3">
              <BarChart3 className="w-10 h-10 opacity-25" />
              <p className="text-sm">No hay gráficos configurados</p>
              <Button variant="outline" size="sm" onClick={handleAddChart}>
                <Plus className="h-4 w-4 mr-1.5" />
                Agregar gráfico
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
