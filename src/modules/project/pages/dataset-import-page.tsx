"use client"

import { useParams } from "next/navigation"
import { useRef } from "react"
import { Button } from "@/shared/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"
import { useDatasetImport } from "../hooks/use-dataset-import"

export function DatasetImportPage() {
  const params = useParams()
  const projectId = params.id as string
  const { project, datasets, loading, uploading, handleFile, handleDelete } =
    useDatasetImport(projectId)
  const fileRef = useRef<HTMLInputElement>(null)

  if (loading) {
    return (
      <div className="min-h-screen p-8 max-w-4xl mx-auto">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen p-8 max-w-4xl mx-auto">
        <a
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; Volver
        </a>
        <p className="mt-8 text-center text-muted-foreground">Proyecto no encontrado.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <a
            href={`/projects/${project.id}`}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            &larr; {project.name}
          </a>
          <h1 className="text-2xl font-bold mt-1">Datasets</h1>
        </div>
        <div>
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFile(file)
            }}
          />
          <Button onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? "Subiendo..." : "Subir CSV"}
          </Button>
        </div>
      </div>

      {datasets.length === 0 ? (
        <div className="text-center py-12 border rounded-lg text-muted-foreground">
          <p className="font-medium text-foreground">Sin datasets</p>
          <p className="text-sm mt-1">Sube tu primer archivo CSV para empezar.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Filas</TableHead>
              <TableHead>Subido</TableHead>
              <TableHead className="text-right">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {datasets.map((ds) => (
              <TableRow key={ds.id}>
                <TableCell className="font-medium">
                  <a
                    href={`/projects/${project.id}/datasets/${ds.id}`}
                    className="hover:text-primary transition-colors"
                  >
                    {ds.name}
                  </a>
                </TableCell>
                <TableCell>{ds.rowCount.toLocaleString()}</TableCell>
                <TableCell className="text-muted-foreground">
                  {ds.uploadedAt.toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => handleDelete(ds.id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
