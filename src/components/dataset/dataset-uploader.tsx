"use client"

import { FileSpreadsheet, Trash2, Upload } from "lucide-react"
import { useState } from "react"
import { Button } from "@/infrastructure/components/ui/button"
import type { Dataset } from "../../application/types"
import { parseCSV } from "../../infrastructure/services/csv-service"
import {
  deleteDataset as deleteFromDB,
  saveDataset,
} from "../../infrastructure/services/indexed-db"

interface DatasetUploaderProps {
  projectId: string
  datasets: Dataset[]
  onUploadComplete: (dataset: Dataset) => void
  onDelete: (datasetId: string) => void
  onSelect: (datasetId: string) => void
  selectedDatasetId?: string | null
}

export function DatasetUploader({
  projectId,
  datasets,
  onUploadComplete,
  onDelete,
  onSelect,
  selectedDatasetId,
}: DatasetUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

      onUploadComplete(dataset)
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
      onDelete(datasetId)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button asChild disabled={uploading}>
          <label className="flex items-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Subir CSV</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </Button>

        {uploading && <span className="text-sm text-muted-foreground">Procesando...</span>}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {datasets.length > 0 && (
        <div className="border rounded-lg divide-y">
          {datasets.map((dataset) => (
            <div
              key={dataset.id}
              className={`flex items-center justify-between p-3 ${
                selectedDatasetId === dataset.id ? "bg-primary/10" : ""
              }`}
            >
              <Button
                variant="ghost"
                onClick={() => onSelect(dataset.id)}
                className="flex items-center justify-start gap-3 flex-1 text-left h-auto py-2 px-3"
              >
                <FileSpreadsheet className="w-5 h-5 text-muted-foreground shrink-0" />
                <div className="flex-1">
                  <p className="font-medium">{dataset.name}</p>
                  <p className="text-sm text-muted-foreground font-normal">
                    {dataset.rowCount.toLocaleString()} filas | {dataset.columns.length} columnas
                  </p>
                </div>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(dataset.id)}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
