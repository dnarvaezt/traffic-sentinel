"use client"

import { useState } from "react"
import { Button } from "@/infrastructure/components/ui/button"
import { Input } from "@/infrastructure/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/infrastructure/components/ui/table"
import type { ColumnDefinition, FilterItem, SortDefinition } from "../../application/types"

interface DataTableProps {
  data: Record<string, unknown>[]
  columns: ColumnDefinition[]
  filters?: FilterItem[]
  sorts?: SortDefinition[]
  onFiltersChange?: (filters: FilterItem[]) => void
  onSortsChange?: (sorts: SortDefinition[]) => void
  pageSize?: number
}

// DataTable is a pure display component. All filtering and sorting is done
// externally via Danfo.js (executeQuery) before data reaches this component.
export function DataTable({
  data,
  columns,
  filters = [],
  sorts = [],
  onFiltersChange,
  onSortsChange,
  pageSize = 50,
}: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(0)

  const totalPages = Math.ceil(data.length / pageSize)
  const pageData = data.slice(currentPage * pageSize, (currentPage + 1) * pageSize)

  function getColumnFilterValue(columnId: string): string {
    return String(
      filters.find((f) => f.columnId === columnId && f.operator === "contains")?.value ?? "",
    )
  }

  function handleFilterChange(columnId: string, value: string) {
    if (!onFiltersChange) return
    const without = filters.filter((f) => !(f.columnId === columnId && f.operator === "contains"))
    const updated = value
      ? [...without, { id: `inline-${columnId}`, columnId, operator: "contains" as const, value }]
      : without
    setCurrentPage(0)
    onFiltersChange(updated)
  }

  function handleSortToggle(columnId: string) {
    if (!onSortsChange) return
    const current = sorts.find((s) => s.columnId === columnId)
    let next: SortDefinition[]
    if (!current) {
      next = [{ id: crypto.randomUUID(), columnId, direction: "asc" }]
    } else {
      next = [{ ...current, direction: current.direction === "asc" ? "desc" : "asc" }]
    }
    setCurrentPage(0)
    onSortsChange(next)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto border rounded-lg">
        <Table>
          <TableHeader className="sticky top-0 bg-muted/50 z-10 backdrop-blur">
            <TableRow>
              {columns.map((col) => {
                const sortDir = sorts.find((s) => s.columnId === col.id)?.direction
                return (
                  <TableHead key={col.id} className="align-top whitespace-nowrap">
                    <div className="flex flex-col gap-2 py-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSortToggle(col.id)}
                        className="h-8 flex items-center justify-start gap-1 px-2 -ml-2"
                      >
                        <span>{col.label || col.name}</span>
                        {sortDir === "asc" && <span>↑</span>}
                        {sortDir === "desc" && <span>↓</span>}
                      </Button>
                      {col.filterable && onFiltersChange && (
                        <Input
                          type="text"
                          placeholder="Filtrar..."
                          value={getColumnFilterValue(col.id)}
                          onChange={(e) => handleFilterChange(col.id, e.target.value)}
                          className="h-7 text-xs px-2 w-full min-w-[120px]"
                        />
                      )}
                    </div>
                  </TableHead>
                )
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageData.map((row, i) => (
              <TableRow key={i}>
                {columns.map((col) => (
                  <TableCell key={col.id} className="truncate max-w-xs">
                    {String(row[col.name] ?? "")}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between pt-2 text-sm text-muted-foreground">
        <span>
          Mostrando {data.length === 0 ? 0 : currentPage * pageSize + 1}–
          {Math.min((currentPage + 1) * pageSize, data.length)} de {data.length.toLocaleString()}{" "}
          registros
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage >= totalPages - 1}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}
