"use client"

import { useMemo, useState } from "react"
import { executeQuery } from "@/core/dataset/dataset.service"
import type { ColumnDefinition, WidgetConfig } from "@/core/project"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"
import { WidgetWrapper } from "./WidgetWrapper"

interface DashboardTableWidgetProps {
  data: Record<string, unknown>[]
  columns: ColumnDefinition[]
  config: WidgetConfig
  onConfigChange?: (config: WidgetConfig) => void
  onRemove?: () => void
  onSettings?: () => void
}

const PAGE_SIZE = 20

export function DashboardTableWidget({
  data,
  columns,
  config,
  onRemove,
  onSettings,
}: DashboardTableWidgetProps) {
  const [page, setPage] = useState(0)
  const displayColumns = config.displayColumns ?? columns.map((c) => c.header)

  const filteredData = useMemo(
    () =>
      executeQuery(data, {
        filters: config.filters?.map((f) => ({ ...f, name: f.name || "" })) || [],
      }),
    [data, config],
  )

  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE))
  const pageData = filteredData.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <WidgetWrapper title="Tabla de Datos" onRemove={onRemove} onSettings={onSettings}>
      <div className="space-y-2">
        <div className="border rounded-md overflow-auto max-h-[300px]">
          <Table>
            <TableHeader>
              <TableRow>
                {displayColumns.map((col) => (
                  <TableHead key={col} className="text-xs whitespace-nowrap">
                    {columns.find((c) => c.header === col)?.tooltip || col}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={displayColumns.length}
                    className="h-20 text-center text-muted-foreground text-sm"
                  >
                    No hay datos
                  </TableCell>
                </TableRow>
              ) : (
                pageData.map((row, i) => (
                  <TableRow key={i}>
                    {displayColumns.map((col) => (
                      <TableCell key={col} className="text-xs">
                        {String(row[col] ?? "")}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Página {page + 1} de {totalPages}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                className="px-2 py-1 rounded hover:bg-accent disabled:opacity-50"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                Anterior
              </button>
              <button
                type="button"
                className="px-2 py-1 rounded hover:bg-accent disabled:opacity-50"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </WidgetWrapper>
  )
}
