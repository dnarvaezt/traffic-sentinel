"use client"

import { useState } from "react"
import type { ColumnDefinition, FilterDefinition, WidgetConfig } from "@/core/project"
import { WidgetWrapper } from "./WidgetWrapper"

interface DashboardFilterWidgetProps {
  data: Record<string, unknown>[]
  columns: ColumnDefinition[]
  config: WidgetConfig
  onConfigChange?: (config: WidgetConfig) => void
  onRemove?: () => void
  onSettings?: () => void
}

export function DashboardFilterWidget({
  data,
  columns,
  config,
  onConfigChange,
  onRemove,
  onSettings,
}: DashboardFilterWidgetProps) {
  const [activeFilters, setActiveFilters] = useState<Map<string, string>>(new Map())
  const columnId = config.displayColumns?.[0]
  const column = columns.find((c) => c.header === columnId)
  const uniqueValues = columnId ? [...new Set(data.map((r) => String(r[columnId] ?? "")))] : []

  const toggleFilter = (value: string) => {
    if (!columnId) return
    const next = new Map(activeFilters)
    if (next.get(columnId) === value) {
      next.delete(columnId)
    } else {
      next.set(columnId, value)
    }
    setActiveFilters(next)

    const filters: FilterDefinition[] = Array.from(next.entries()).map(([col, val]) => ({
      id: `${col}-${val}`,
      name: `${col}: ${val}`,
      columnId: col,
      operator: "equals" as const,
      value: val,
    }))

    onConfigChange?.({
      ...config,
      filters,
    })
  }

  const handleColumnChange = (col: string) => {
    setActiveFilters(new Map())
    onConfigChange?.({
      ...config,
      displayColumns: [col],
      filters: [],
    })
  }

  return (
    <WidgetWrapper title="Filtro Rápido" onRemove={onRemove} onSettings={onSettings}>
      <div className="space-y-2">
        <select
          className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs"
          value={columnId || ""}
          onChange={(e) => handleColumnChange(e.target.value)}
        >
          <option value="">Seleccionar columna</option>
          {columns.map((c) => (
            <option key={c.header} value={c.header}>
              {c.tooltip || c.header}
            </option>
          ))}
        </select>

        {column && (
          <div className="space-y-1 max-h-[200px] overflow-y-auto">
            <p className="text-xs text-muted-foreground">Valores disponibles:</p>
            <div className="flex flex-wrap gap-1">
              {uniqueValues.slice(0, 50).map((val) => {
                const isActive = columnId ? activeFilters.get(columnId) === val : false
                return (
                  <button
                    key={val}
                    type="button"
                    className={`px-2 py-0.5 text-xs rounded-full border transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground border-primary"
                        : "hover:bg-accent"
                    }`}
                    onClick={() => toggleFilter(val)}
                  >
                    {val || "(vacío)"}
                  </button>
                )
              })}
              {uniqueValues.length > 50 && (
                <span className="text-xs text-muted-foreground">
                  +{uniqueValues.length - 50} más
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </WidgetWrapper>
  )
}
