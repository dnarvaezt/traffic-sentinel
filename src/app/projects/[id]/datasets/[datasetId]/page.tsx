"use client"

import { ArrowLeft, BarChart3, ChevronRight, List, SlidersHorizontal, Star } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { useProjectStore } from "@/application/stores/project-store"
import type {
  Database as DbType,
  FilterDefinition,
  GroupByDefinition,
  MetricDefinition,
  SortDefinition,
} from "@/application/types"
import { FilterBuilder } from "@/components/filters/filter-builder"
import { DataTable } from "@/components/table/data-table"
import { Badge } from "@/infrastructure/components/ui/badge"
import { Button } from "@/infrastructure/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/infrastructure/components/ui/dialog"
import { Input } from "@/infrastructure/components/ui/input"
import { Label } from "@/infrastructure/components/ui/label"
import { Textarea } from "@/infrastructure/components/ui/textarea"
import { parseCSV } from "@/infrastructure/services/csv-service"
import {
  deleteDatabaseData,
  loadDatabaseData,
  saveDatabaseData,
} from "@/infrastructure/services/indexed-db"
import { executeQuery } from "@/infrastructure/services/query-service"

export default function DatasetViewPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const datasetId = params.datasetId as string

  const { getProject, addDatabase, updateDatabase, deleteDatabase } = useProjectStore()
  const [mounted, setMounted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [data, setData] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterDefinition[]>([])
  const [sorts, setSorts] = useState<SortDefinition[]>([])
  const [metrics, setMetrics] = useState<MetricDefinition[]>([])
  const [groupBys, setGroupBys] = useState<GroupByDefinition[]>([])

  const [uploading, setUploading] = useState(false)
  const [filterDialogOpen, setFilterDialogOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  const projectData = getProject(projectId)
  const dataset = projectData?.databases?.find((d) => d.id === datasetId)

  useEffect(() => {
    if (dataset) {
      setName(dataset.name)
      setDescription(dataset.description || "")
    }
  }, [dataset])

  useEffect(() => {
    if (datasetId) {
      setLoading(true)
      loadDatabaseData(datasetId)
        .then((loaded) => {
          if (loaded) setData(loaded.data)
        })
        .finally(() => setLoading(false))
    }
  }, [datasetId])

  const processedData = useMemo(() => {
    if (!dataset || data.length === 0) return []
    return executeQuery(data, {
      filters,
      sorts,
      metrics,
      groupBy: groupBys.length > 0 ? groupBys : undefined,
    })
  }, [dataset, data, filters, sorts, metrics, groupBys])

  const schemaColumns = projectData?.schema?.columns || []
  const activeFiltersCount = filters.length + metrics.length + sorts.length + groupBys.length

  if (!mounted) return null
  if (!projectData) return <p className="p-8 text-muted-foreground">Proyecto no encontrado</p>
  if (!dataset) return <p className="p-8 text-muted-foreground">Dataset no encontrado</p>

  async function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file?.name.endsWith(".csv")) return
    setUploading(true)
    try {
      const parsed = await parseCSV(file)
      const database: DbType = {
        id: crypto.randomUUID(),
        projectId,
        name: file.name.replace(".csv", ""),
        columns: parsed.columns.map((c) => ({ name: c.name, inferredType: c.type })),
        data: parsed.data,
        rowCount: parsed.rowCount,
        uploadedAt: new Date(),
      }
      await saveDatabaseData({ id: database.id, projectId, data: database.data })
      addDatabase(projectId, database)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  async function _handleDelete() {
    await deleteDatabaseData(datasetId)
    deleteDatabase(projectId, datasetId)
    router.push(`/projects/${projectId}`)
  }

  function handleSave() {
    if (!name.trim()) return
    updateDatabase(projectId, datasetId, { name: name.trim(), description: description.trim() })
    setEditOpen(false)
  }

  function handleToggleFavorite() {
    if (!dataset) return
    updateDatabase(projectId, datasetId, { favorite: !dataset.favorite })
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
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleToggleFavorite}>
            <Star
              className={`h-4 w-4 ${dataset.favorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
            />
          </Button>
          <span className="font-medium truncate max-w-[160px]">{dataset.name}</span>
        </div>

        <Badge variant="outline" className="text-xs shrink-0 hidden md:flex">
          {data.length.toLocaleString()} filas
        </Badge>

        {/* Tab switcher */}
        <nav className="flex items-center bg-muted rounded-lg p-0.5 mx-auto shrink-0">
          <span className="flex items-center gap-1.5 px-3 h-7 rounded-md text-sm bg-background text-foreground shadow-sm">
            <List className="h-3.5 w-3.5" />
            Datos
          </span>
          <Link
            href={`/projects/${projectId}/dashboard/${datasetId}`}
            className="flex items-center gap-1.5 px-3 h-7 rounded-md text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Dashboard
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-0.5 ml-auto">
          <div className="w-px h-5 bg-border mx-1 shrink-0" />

          <Button
            variant={filterDialogOpen ? "secondary" : "ghost"}
            size="sm"
            className="h-8 gap-1.5 px-2.5"
            onClick={() => setFilterDialogOpen(true)}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span className="hidden sm:inline text-sm">Filtros</span>
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
        <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>Filtros y métricas</DialogTitle>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto py-2">
              <FilterBuilder
                columns={schemaColumns}
                filters={filters}
                metrics={metrics}
                groupBys={groupBys}
                sorts={sorts}
                onFiltersChange={setFilters}
                onMetricsChange={setMetrics}
                onGroupBysChange={setGroupBys}
                onSortsChange={setSorts}
              />
            </div>
            <DialogFooter className="flex-row! gap-2">
              <div className="flex-1 text-xs text-muted-foreground">
                <p>{data.length.toLocaleString()} registros totales</p>
                {processedData.length !== data.length && (
                  <p>{processedData.length.toLocaleString()} resultados</p>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={() => setFilters([])}>
                Limpiar
              </Button>
              <Button size="sm" onClick={() => setFilterDialogOpen(false)}>
                Aplicar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Table */}
        <div className="flex-1 overflow-auto min-w-0">
          {loading ? (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
              Cargando...
            </div>
          ) : (
            <DataTable
              data={processedData}
              columns={metrics.length > 0 ? schemaColumns.slice(0, metrics.length) : schemaColumns}
              filters={filters}
              sorts={sorts}
              onFiltersChange={setFilters}
              onSortsChange={setSorts}
            />
          )}
        </div>
      </div>

      {/* Edit dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Dataset</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Nombre</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Descripción</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />
    </main>
  )
}
