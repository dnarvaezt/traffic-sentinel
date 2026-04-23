"use client"

import { ArrowLeft, BarChart3, FileSpreadsheet, List, Settings, Star, Upload } from "lucide-react"
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
import { Button } from "@/infrastructure/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

  useEffect(() => {
    setMounted(true)
  }, [])

  const projectData = getProject(projectId)
  const dataset = projectData?.databases?.find((d) => d.id === datasetId)

  const [data, setData] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterDefinition[]>([])
  const [sorts, setSorts] = useState<SortDefinition[]>([])
  const [metrics, setMetrics] = useState<MetricDefinition[]>([])
  const [groupBys, setGroupBys] = useState<GroupByDefinition[]>([])

  const [uploading, setUploading] = useState(false)

  const [editOpen, setEditOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

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

  if (!mounted) return null
  if (!projectData) return <p>Proyecto no encontrado</p>
  if (!dataset) return <p>Dataset no encontrado</p>

  async function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file?.name.endsWith(".csv")) {
      return
    }

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

  async function handleDelete() {
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

  const navItems = [
    {
      label: "Datos",
      href: `/projects/${projectId}/datasets/${datasetId}`,
      icon: List,
      active: true,
    },
    { label: "Dashboard", href: `/projects/${projectId}/dashboard/${datasetId}`, icon: BarChart3 },
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
            <button type="button" onClick={handleToggleFavorite}>
              <Star
                className={`h-4 w-4 ${dataset.favorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
              />
            </button>
          </div>
          <p className="text-sm font-medium px-2">{dataset.name}</p>
          <p className="text-xs text-muted-foreground px-2">
            {dataset.rowCount?.toLocaleString()} filas
          </p>
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
          <label className="flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground cursor-pointer">
            <Upload className="h-4 w-4" />
            Subir CSV
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>

        <div className="pt-2 border-t">
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Editar
              </Button>
            </DialogTrigger>
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
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-destructive"
            onClick={handleDelete}
          >
            Eliminar
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b px-6 py-3">
          <h1 className="text-lg font-semibold">Datos - {dataset.name}</h1>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <aside className="w-72 border-r p-4 overflow-y-auto">
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
            <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
              <p>{data.length.toLocaleString()} registros</p>
              {processedData.length !== data.length && (
                <p>{processedData.length.toLocaleString()} resultados</p>
              )}
            </div>
          </aside>

          <div className="flex-1 overflow-auto p-4">
            {loading ? (
              <div className="h-full flex items-center justify-center">Cargando...</div>
            ) : (
              <DataTable
                data={processedData}
                columns={
                  metrics.length > 0 ? schemaColumns.slice(0, metrics.length) : schemaColumns
                }
                filters={filters}
                sorts={sorts}
                onFiltersChange={setFilters}
                onSortsChange={setSorts}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
