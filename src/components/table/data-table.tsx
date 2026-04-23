"use client"

import { useMemo, useState } from "react"
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
import type { ColumnDefinition, FilterDefinition, SortDefinition } from "../../application/types"

interface DataTableProps {
  data: Record<string, unknown>[]
  columns: ColumnDefinition[]
  filters?: FilterDefinition[]
  sorts?: SortDefinition[]
  onFiltersChange?: (filters: FilterDefinition[]) => void
  onSortsChange?: (sorts: SortDefinition[]) => void
  pageSize?: number
}

export function DataTable({
  data,
  columns,
  sorts,
  onFiltersChange,
  onSortsChange,
  pageSize = 50,
}: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})

  const filteredData = useMemo(() => {
    let result = [...data]

    for (const [columnId, filterValue] of Object.entries(activeFilters)) {
      if (!filterValue) continue
      result = result.filter((row) =>
        String(row[columnId] ?? "")
          .toLowerCase()
          .includes(filterValue.toLowerCase()),
      )
    }

    return result
  }, [data, activeFilters])

  const sortedData = useMemo(() => {
    if (!sorts || sorts.length === 0) return filteredData

    return [...filteredData].sort((a, b) => {
      for (const sort of sorts) {
        const aVal = a[sort.columnId]
        const bVal = b[sort.columnId]
        if (aVal === bVal) continue

        const comparison =
          typeof aVal === "number" && typeof bVal === "number"
            ? (aVal as number) - (bVal as number)
            : String(aVal).localeCompare(String(bVal))

        return sort.direction === "desc" ? -comparison : comparison
      }
      return 0
    })
  }, [filteredData, sorts])

  const totalPages = Math.ceil(sortedData.length / pageSize)
  const pageData = sortedData.slice(currentPage * pageSize, (currentPage + 1) * pageSize)

  function toggleSort(columnId: string) {
    if (!onSortsChange || !sorts) return

    const current = sorts.find((s) => s.columnId === columnId)
    let newSorts: SortDefinition[]

    if (!current) {
      newSorts = [{ id: crypto.randomUUID(), columnId, direction: "asc" }]
    } else if (current.direction === "asc") {
      newSorts = sorts.map((s) =>
        s.columnId === columnId ? { ...s, direction: "desc" as const } : s,
      )
    } else {
      newSorts = sorts.filter((s) => s.columnId !== columnId)
    }

    onSortsChange(newSorts)
  }

  function handleFilterChange(columnId: string, value: string) {
    setActiveFilters((prev) => ({ ...prev, [columnId]: value }))
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto border rounded-lg">
        <Table>
          <TableHeader className="sticky top-0 bg-muted/50 z-10 backdrop-blur">
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.id} className="align-top whitespace-nowrap">
                  <div className="flex flex-col gap-2 py-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSort(col.id)}
                      className="h-8 flex items-center justify-start gap-1 px-2 -ml-2"
                    >
                      <span>{col.label || col.name}</span>
                      {sorts?.find((s) => s.columnId === col.id)?.direction === "asc" && (
                        <span>↑</span>
                      )}
                      {sorts?.find((s) => s.columnId === col.id)?.direction === "desc" && (
                        <span>↓</span>
                      )}
                    </Button>
                    {col.filterable && onFiltersChange && (
                      <Input
                        type="text"
                        placeholder="Filtrar..."
                        value={activeFilters[col.id] || ""}
                        onChange={(e) => handleFilterChange(col.id, e.target.value)}
                        className="h-7 text-xs px-2 w-full min-w-[120px]"
                      />
                    )}
                  </div>
                </TableHead>
              ))}
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
          Mostrando {currentPage * pageSize + 1} -{" "}
          {Math.min((currentPage + 1) * pageSize, sortedData.length)} de{" "}
          {sortedData.length.toLocaleString()} registros
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
