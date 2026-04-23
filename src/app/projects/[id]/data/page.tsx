"use client"

import { ArrowLeft, Database } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { useProjectStore } from "@/application/stores/project-store"
import type {
  FilterDefinition,
  GroupByDefinition,
  MetricDefinition,
  SortDefinition,
} from "@/application/types"
import { FilterBuilder } from "@/components/filters/filter-builder"
import { DataTable } from "@/components/table/data-table"
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

export default function DataPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const { getProject, setActiveDataset, activeDatasetId } = useProjectStore()

  const project = getProject(projectId)
  const [datasetData, setDatasetData] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(false)

  const [filters, setFilters] = useState<FilterDefinition[]>([])
  const [sorts, setSorts] = useState<SortDefinition[]>([])
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
      sorts,
      metrics,
      groupBy: groupBys.length > 0 ? groupBys : undefined,
    })
  }, [selectedDataset, datasetData, filters, sorts, metrics, groupBys])

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

  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b px-6 py-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push(`/projects/${projectId}`)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Explorar Datos</h1>
          <p className="text-sm text-muted-foreground">
            {project.name} - Filtra, ordena y analiza tus datos
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
        <aside className="w-80 border-r p-4 overflow-y-auto bg-card">
          <FilterBuilder
            columns={selectedDataset?.columns || []}
            filters={filters}
            metrics={metrics}
            groupBys={groupBys}
            sorts={sorts}
            onFiltersChange={setFilters}
            onMetricsChange={setMetrics}
            onGroupBysChange={setGroupBys}
            onSortsChange={setSorts}
          />

          <div className="mt-6 pt-4 border-t space-y-2">
            <p className="text-sm text-muted-foreground">
              {datasetData.length.toLocaleString()} registros
            </p>
            {processedData.length !== datasetData.length && (
              <p className="text-sm text-primary">
                {processedData.length.toLocaleString()} después de filtros
              </p>
            )}
          </div>
        </aside>

        <div className="flex-1 flex flex-col overflow-hidden p-4">
          {selectedDataset ? (
            loading ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <p>Cargando...</p>
              </div>
            ) : (
              <DataTable
                data={processedData}
                columns={
                  metrics.length > 0
                    ? selectedDataset.columns.slice(0, metrics.length)
                    : selectedDataset.columns
                }
                filters={filters}
                sorts={sorts}
                onFiltersChange={setFilters}
                onSortsChange={setSorts}
              />
            )
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No hay datasets disponibles</p>
                <Link
                  href={`/projects/${projectId}/datasets`}
                  className="text-primary hover:underline text-sm mt-2 inline-block"
                >
                  Ir a datasets
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
