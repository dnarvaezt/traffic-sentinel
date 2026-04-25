"use client"

import { Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import type {
  AggregationType,
  ColumnDefinition,
  FilterItem,
  FilterOperator,
  GroupByDefinition,
  MetricDefinition,
  SortDefinition,
} from "@/core/project"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"

interface FilterBuilderProps {
  columns: ColumnDefinition[]
  filters: FilterItem[]
  metrics: MetricDefinition[]
  groupBys: GroupByDefinition[]
  sorts: SortDefinition[]
  onFiltersChange: (filters: FilterItem[]) => void
  onMetricsChange: (metrics: MetricDefinition[]) => void
  onGroupBysChange: (groupBys: GroupByDefinition[]) => void
  onSortsChange: (sorts: SortDefinition[]) => void
}

const OPERATORS: { value: FilterOperator; label: string }[] = [
  { value: "equals", label: "Es igual a" },
  { value: "notEquals", label: "No es igual a" },
  { value: "contains", label: "Contiene" },
  { value: "notContains", label: "No contiene" },
  { value: "greaterThan", label: "Mayor que" },
  { value: "lessThan", label: "Menor que" },
  { value: "greaterThanOrEquals", label: "Mayor o igual" },
  { value: "lessThanOrEquals", label: "Menor o igual" },
  { value: "isNull", label: "Es nulo" },
  { value: "isNotNull", label: "No es nulo" },
]

const AGGREGATIONS: { value: AggregationType; label: string }[] = [
  { value: "count", label: "Conteo" },
  { value: "sum", label: "Suma" },
  { value: "avg", label: "Promedio" },
  { value: "min", label: "Mínimo" },
  { value: "max", label: "Máximo" },
  { value: "countDistinct", label: "Conteo Distincto" },
]

export function FilterBuilder({
  columns,
  filters,
  metrics,
  groupBys,
  sorts,
  onFiltersChange,
  onMetricsChange,
  onGroupBysChange,
  onSortsChange,
}: FilterBuilderProps) {
  const [activeTab, setActiveTab] = useState<"filters" | "metrics" | "sort">("filters")

  function addFilter() {
    const firstCol = columns[0]
    const newFilter: FilterItem = {
      id: crypto.randomUUID(),
      name: "Filtro",
      columnId: firstCol?.id || "",
      operator: "equals",
      value: "",
    }
    onFiltersChange([...filters, newFilter])
  }

  function updateFilter(index: number, updates: Partial<FilterItem>) {
    const updated = [...filters]
    updated[index] = { ...updated[index], ...updates }
    onFiltersChange(updated)
  }

  function removeFilter(index: number) {
    onFiltersChange(filters.filter((_, i) => i !== index))
  }

  function addMetric() {
    const numericCols = columns.filter((c) => c.type === "number")
    const col = numericCols[0] || columns[0]
    if (!col) return

    const newMetric: MetricDefinition = {
      id: crypto.randomUUID(),
      columnId: col.id,
      aggregation: "sum",
      alias: `${col.name}_sum`,
    }
    onMetricsChange([...metrics, newMetric])
  }

  function updateMetric(index: number, updates: Partial<MetricDefinition>) {
    const updated = [...metrics]
    updated[index] = { ...updated[index], ...updates }
    onMetricsChange(updated)
  }

  function removeMetric(index: number) {
    onMetricsChange(metrics.filter((_, i) => i !== index))
  }

  function toggleGroupBy(columnId: string) {
    const existing = groupBys.find((g) => g.columnId === columnId)
    if (existing) {
      onGroupBysChange(groupBys.filter((g) => g.columnId !== columnId))
    } else {
      onGroupBysChange([...groupBys, { id: crypto.randomUUID(), columnId }])
    }
  }

  function addSort() {
    const col = columns[0]
    if (!col) return

    const newSort: SortDefinition = {
      id: crypto.randomUUID(),
      columnId: col.id,
      direction: "asc",
    }
    onSortsChange([...sorts, newSort])
  }

  function updateSort(index: number, updates: Partial<SortDefinition>) {
    const updated = [...sorts]
    updated[index] = { ...updated[index], ...updates }
    onSortsChange(updated)
  }

  function removeSort(index: number) {
    onSortsChange(sorts.filter((_, i) => i !== index))
  }

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex gap-2 border-b pb-2">
        <Button
          variant={activeTab === "filters" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("filters")}
        >
          Filtros ({filters.length})
        </Button>
        <Button
          variant={activeTab === "metrics" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("metrics")}
        >
          Métricas ({metrics.length})
        </Button>
        <Button
          variant={activeTab === "sort" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("sort")}
        >
          Orden ({sorts.length})
        </Button>
      </div>

      {activeTab === "filters" && (
        <div className="space-y-3">
          {filters.map((filter, index) => {
            const column = columns.find((c) => c.id === filter.columnId)
            return (
              <div key={filter.id} className="flex gap-2 items-start">
                <Select
                  value={filter.columnId}
                  onValueChange={(value) => updateFilter(index, { columnId: value })}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {columns.map((col) => (
                      <SelectItem key={col.id} value={col.id}>
                        {col.label || col.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={filter.operator}
                  onValueChange={(value) =>
                    updateFilter(index, { operator: value as FilterOperator })
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {OPERATORS.map((op) => (
                      <SelectItem key={op.value} value={op.value}>
                        {op.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!["isNull", "isNotNull"].includes(filter.operator) && (
                  <Input
                    type={column?.type === "number" ? "number" : "text"}
                    value={String(filter.value)}
                    onChange={(e) => updateFilter(index, { value: e.target.value })}
                    className="flex-1"
                  />
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFilter(index)}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )
          })}
          <Button variant="ghost" size="sm" onClick={addFilter} className="text-primary">
            <Plus className="w-4 h-4 mr-2" />
            Agregar filtro
          </Button>
        </div>
      )}

      {activeTab === "metrics" && (
        <div className="space-y-3">
          {metrics.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-muted-foreground">Agrupar por:</span>
              {columns
                .filter((c) => c.type !== "boolean")
                .map((col) => {
                  const isSelected = groupBys.some((g) => g.columnId === col.id)
                  return (
                    <Button
                      key={col.id}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleGroupBy(col.id)}
                    >
                      {col.label || col.name}
                    </Button>
                  )
                })}
            </div>
          )}

          {metrics.map((metric, index) => (
            <div key={metric.id} className="flex gap-2 items-center">
              <Select
                value={metric.columnId}
                onValueChange={(value) => updateMetric(index, { columnId: value })}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {columns
                    .filter((c) => c.type === "number")
                    .map((col) => (
                      <SelectItem key={col.id} value={col.id}>
                        {col.label || col.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Select
                value={metric.aggregation}
                onValueChange={(value) =>
                  updateMetric(index, { aggregation: value as AggregationType })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AGGREGATIONS.map((agg) => (
                    <SelectItem key={agg.value} value={agg.value}>
                      {agg.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={metric.alias || ""}
                onChange={(e) => updateMetric(index, { alias: e.target.value })}
                placeholder="Alias"
                className="w-32"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeMetric(index)}
                className="text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button variant="ghost" size="sm" onClick={addMetric} className="text-primary">
            <Plus className="w-4 h-4 mr-2" />
            Agregar métrica
          </Button>
        </div>
      )}

      {activeTab === "sort" && (
        <div className="space-y-3">
          {sorts.map((sort, index) => (
            <div key={sort.id} className="flex gap-2 items-center">
              <Select
                value={sort.columnId}
                onValueChange={(value) => updateSort(index, { columnId: value })}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((col) => (
                    <SelectItem key={col.id} value={col.id}>
                      {col.label || col.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={sort.direction}
                onValueChange={(value) => updateSort(index, { direction: value as "asc" | "desc" })}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascendente</SelectItem>
                  <SelectItem value="desc">Descendente</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeSort(index)}
                className="text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button variant="ghost" size="sm" onClick={addSort} className="text-primary">
            <Plus className="w-4 h-4 mr-2" />
            Agregar orden
          </Button>
        </div>
      )}
    </div>
  )
}
