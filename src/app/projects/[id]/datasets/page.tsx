"use client"

import { ArrowLeft, FileSpreadsheet, Trash2, Upload } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useProjectStore } from "@/application/stores/project-store"
import type { Dataset } from "@/application/types"
import { Button } from "@/infrastructure/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/infrastructure/components/ui/table"
import { parseCSV } from "@/infrastructure/services/csv-service"
import {
  deleteDataset as deleteFromDB,
  loadDataset,
  saveDataset,
} from "@/infrastructure/services/indexed-db"

export default function DatasetsPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const { getProject, addDataset, deleteDataset, setActiveDataset, activeDatasetId } =
    useProjectStore()

  const project = getProject(projectId)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadedData, setLoadedData] = useState<Record<string, unknown>[]>([])

  useEffect(() => {
    if (activeDatasetId) {
      loadDataset(activeDatasetId).then((loaded) => {
        if (loaded) setLoadedData(loaded.data)
      })
    }
  }, [activeDatasetId])

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

  async function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith(".csv")) {
      setError("Solo se permiten archivos CSV")
      return
    }

    setUploading(true)
    setError(null)

    try {
      const parsed = await parseCSV(file)

      const dataset: Dataset = {
        id: crypto.randomUUID(),
        projectId,
        name: file.name.replace(".csv", ""),
        tableId: "",
        data: parsed.data,
        rowCount: parsed.rowCount,
        columns: parsed.columns,
        uploadedAt: new Date(),
      }

      await saveDataset({
        id: dataset.id,
        projectId: dataset.projectId,
        data: dataset.data,
      })

      addDataset(projectId, dataset)
      setActiveDataset(dataset.id)
    } catch (err) {
      setError("Error al procesar el archivo")
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(datasetId: string) {
    try {
      await deleteFromDB(datasetId)
      if (activeDatasetId === datasetId) {
        setActiveDataset(null)
        setLoadedData([])
      }
      deleteDataset(projectId, datasetId)
    } catch (err) {
      console.error(err)
    }
  }

  async function handleSelect(datasetId: string) {
    setActiveDataset(datasetId)
    const loaded = await loadDataset(datasetId)
    if (loaded) setLoadedData(loaded.data)
  }

  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b px-6 py-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push(`/projects/${projectId}`)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Datasets</h1>
          <p className="text-sm text-muted-foreground">
            {project.name} - Sube y gestiona tus archivos CSV
          </p>
        </div>
      </header>

      <div className="flex-1 flex">
        <aside className="w-80 border-r p-6 overflow-y-auto">
          <div className="space-y-4">
            <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
              <Upload className="w-5 h-5" />
              <span className="font-medium">Subir CSV</span>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
              />
            </label>

            {uploading && (
              <p className="text-sm text-muted-foreground text-center">Procesando...</p>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          {project.datasets.length > 0 ? (
            <div className="mt-6 space-y-2">
              <h2 className="text-sm font-medium text-muted-foreground">
                Archivos ({project.datasets.length})
              </h2>
              {project.datasets.map((dataset) => (
                <div
                  key={dataset.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    activeDatasetId === dataset.id ? "bg-primary/10 border-primary" : ""
                  }`}
                >
                  <Button
                    variant="ghost"
                    onClick={() => handleSelect(dataset.id)}
                    className="flex items-center justify-start gap-3 flex-1 text-left h-auto py-2 px-3"
                  >
                    <FileSpreadsheet className="w-5 h-5 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{dataset.name}</p>
                      <p className="text-xs text-muted-foreground font-normal">
                        {dataset.rowCount.toLocaleString()} filas
                      </p>
                    </div>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(dataset.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 text-center text-muted-foreground">
              <p className="text-sm">No hay archivos</p>
            </div>
          )}
        </aside>

        <main className="flex-1 p-6 overflow-auto">
          {activeDatasetId ? (
            <DatasetPreview
              dataset={project.datasets.find((d) => d.id === activeDatasetId)!}
              data={loadedData}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Selecciona o sube un dataset</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </main>
  )
}

function DatasetPreview({ dataset, data }: { dataset: Dataset; data: Record<string, unknown>[] }) {
  const previewData = data.length > 0 ? data : dataset.data
  const previewRows = previewData.slice(0, 5)
  const previewCols = dataset.columns.slice(0, 6)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{dataset.name}</h2>
          <p className="text-sm text-muted-foreground">
            {dataset.rowCount.toLocaleString()} filas × {dataset.columns.length} columnas
          </p>
        </div>
      </div>

      <div className="border rounded-lg overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {previewCols.map((col) => (
                <TableHead key={col.id}>
                  {col.label || col.name}
                  <span className="ml-2 text-xs text-muted-foreground">({col.type})</span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {previewRows.map((row, i) => (
              <TableRow key={i}>
                {previewCols.map((col) => (
                  <TableCell key={col.id} className="truncate max-w-xs">
                    {String(row[col.name] ?? "-")}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {previewData.length > 5 && (
        <p className="text-sm text-muted-foreground text-center">
          Mostrando 5 de {previewData.length.toLocaleString()} filas
        </p>
      )}

      <div className="grid grid-cols-3 gap-4 text-sm">
        {dataset.columns.slice(0, 6).map((col) => (
          <div key={col.id} className="border rounded-lg p-3">
            <p className="font-medium">{col.label || col.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{col.type}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
