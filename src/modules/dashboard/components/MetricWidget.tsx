"use client"

import { useMemo } from "react"
import { executeQuery } from "@/core/dataset/dataset.service"
import type { ColumnDefinition, WidgetConfig } from "@/core/project"
import { WidgetWrapper } from "./WidgetWrapper"

interface MetricWidgetProps {
  data: Record<string, unknown>[]
  columns: ColumnDefinition[]
  config: WidgetConfig
  onConfigChange?: (config: WidgetConfig) => void
  onRemove?: () => void
  onSettings?: () => void
}

export function MetricWidget({ data, columns, config, onRemove, onSettings }: MetricWidgetProps) {
  const metricDef = config.metrics?.[0]
  const numericColumns = columns.filter(
    (c) => c.type === "number" || c.type === "currency" || c.type === "percentage",
  )
  const columnId = metricDef?.columnId || numericColumns[0]?.header || ""
  const aggregation = metricDef?.aggregation || "sum"
  const alias = metricDef?.alias || columnId

  const value = useMemo(() => {
    const filtered = executeQuery(data, {
      filters: config.filters?.map((f) => ({ ...f, name: f.name || "" })) || [],
    })
    if (filtered.length === 0 || !columnId) return 0

    const numbers = filtered.map((r) => Number(r[columnId])).filter((n) => !Number.isNaN(n))

    if (numbers.length === 0) return 0

    switch (aggregation) {
      case "sum":
        return numbers.reduce((a, b) => a + b, 0)
      case "avg":
        return numbers.reduce((a, b) => a + b, 0) / numbers.length
      case "min":
        return Math.min(...numbers)
      case "max":
        return Math.max(...numbers)
      case "count":
        return filtered.length
      case "countDistinct":
        return new Set(filtered.map((r) => r[columnId])).size
      default:
        return 0
    }
  }, [data, config, columnId, aggregation])

  const formattedValue =
    typeof value === "number"
      ? value.toLocaleString("es-ES", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })
      : String(value)

  return (
    <WidgetWrapper title={alias} onRemove={onRemove} onSettings={onSettings}>
      <div className="h-full flex flex-col items-center justify-center gap-1">
        <span className="text-3xl font-bold tracking-tight">{formattedValue}</span>
        <span className="text-xs text-muted-foreground">
          {aggregation === "sum"
            ? "Suma"
            : aggregation === "avg"
              ? "Promedio"
              : aggregation === "min"
                ? "Mínimo"
                : aggregation === "max"
                  ? "Máximo"
                  : aggregation === "count"
                    ? "Conteo"
                    : aggregation === "countDistinct"
                      ? "Únicos"
                      : aggregation}
        </span>
      </div>
    </WidgetWrapper>
  )
}
