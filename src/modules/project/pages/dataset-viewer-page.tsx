"use client"

import { useParams } from "next/navigation"
import { Button } from "@/shared/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"
import { useDatasetViewer } from "../hooks/use-dataset-viewer"

export function DatasetViewerPage() {
  const params = useParams()
  const datasetId = params.datasetId as string
  const projectId = params.id as string
  const { dataset, loading, page, totalPages, pageData, headers, handlePageChange } =
    useDatasetViewer(datasetId)

  if (loading) {
    return (
      <div className="min-h-screen p-8 max-w-6xl mx-auto">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    )
  }

  if (!dataset) {
    return (
      <div className="min-h-screen p-8 max-w-6xl mx-auto">
        <a
          href={`/projects/${projectId}/datasets`}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; Volver a datasets
        </a>
        <p className="mt-8 text-center text-muted-foreground">Dataset no encontrado.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto space-y-4">
      <div>
        <a
          href={`/projects/${projectId}/datasets`}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; Volver a datasets
        </a>
        <h1 className="text-2xl font-bold mt-1">{dataset.name}</h1>
        <p className="text-sm text-muted-foreground">
          {dataset.rowCount.toLocaleString()} filas — Página {page} de {totalPages}
        </p>
      </div>

      <div className="border rounded-lg overflow-auto max-h-[70vh]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">#</TableHead>
              {headers.map((h) => (
                <TableHead key={h}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={headers.length + 1}
                  className="text-center py-8 text-muted-foreground"
                >
                  Sin datos
                </TableCell>
              </TableRow>
            ) : (
              pageData.map((row, i) => (
                <TableRow key={i}>
                  <TableCell className="text-xs text-muted-foreground">
                    {(page - 1) * 100 + i + 1}
                  </TableCell>
                  {headers.map((h) => (
                    <TableCell key={h} className="text-sm max-w-[200px] truncate">
                      {String(row[h] ?? "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => handlePageChange(page - 1)}
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
            onClick={() => handlePageChange(page + 1)}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  )
}
