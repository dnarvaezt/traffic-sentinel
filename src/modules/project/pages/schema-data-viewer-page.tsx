"use client"

import { useParams } from "next/navigation"
import { Button } from "@/shared/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"
import { PAGE_SIZE, useSchemaDataViewer } from "../hooks/use-schema-data-viewer"

export function SchemaDataViewerPage() {
  const params = useParams()
  const projectId = params.id as string
  const {
    project,
    datasets,
    selectedDatasetId,
    columns,
    pageData,
    loading,
    page,
    totalPages,
    totalRows,
    handleDatasetChange,
    setPage,
  } = useSchemaDataViewer(projectId)

  if (loading) {
    return (
      <div className="min-h-screen p-8 max-w-6xl mx-auto">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen p-8 max-w-6xl mx-auto">
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
    <div className="min-h-screen p-8 max-w-6xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <a
            href={`/projects/${project.id}`}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            &larr; {project.name}
          </a>
          <h1 className="text-2xl font-bold mt-1">Datos</h1>
        </div>
        {datasets.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Dataset:</span>
            <Select
              value={selectedDatasetId ?? undefined}
              onValueChange={(v) => handleDatasetChange(v)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Seleccionar dataset" />
              </SelectTrigger>
              <SelectContent>
                {datasets.map((ds) => (
                  <SelectItem key={ds.id} value={ds.id}>
                    {ds.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {!selectedDatasetId ? (
        <div className="text-center py-12 border rounded-lg text-muted-foreground">
          <p className="font-medium text-foreground">Sin datasets</p>
          <p className="text-sm mt-1">Sube un dataset para visualizar los datos.</p>
        </div>
      ) : columns.length === 0 ? (
        <div className="text-center py-12 border rounded-lg text-muted-foreground">
          <p className="font-medium text-foreground">Schema vacío</p>
          <p className="text-sm mt-1">
            Configura las columnas del schema para ver los datos procesados.
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {totalRows.toLocaleString()} filas — Página {page} de {totalPages}
          </p>
          <div className="border rounded-lg overflow-auto max-h-[70vh]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  {columns.map((col) => (
                    <TableHead key={col.id} title={col.tooltip}>
                      {col.header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageData.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-xs text-muted-foreground">
                      {(page - 1) * PAGE_SIZE + i + 1}
                    </TableCell>
                    {columns.map((col) => (
                      <TableCell key={col.id} className="text-sm max-w-[200px] truncate">
                        {String(row[col.id] ?? "")}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Anterior
              </Button>
              <span className="text-sm text-muted-foreground">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Siguiente
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
