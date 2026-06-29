import type { ColumnDefinition } from "@/core/data-import/domain/models/column"

export type ColumnType = ColumnDefinition["type"]

export const COLUMN_TYPES: ColumnType[] = [
  "string",
  "number",
  "boolean",
  "date",
  "currency",
  "percentage",
  "email",
  "url",
  "custom",
]

export const TRANSFORMER_TYPES = [
  { id: "trim", label: "Trim" },
  { id: "uppercase", label: "Uppercase" },
  { id: "lowercase", label: "Lowercase" },
  { id: "parse-number", label: "Parse Number" },
  { id: "custom", label: "Custom Regex" },
] as const

export function getColumnHealth(col: ColumnDefinition): {
  status: "valid" | "warning" | "error"
  message: string
} {
  if (!col.header?.trim()) {
    return { status: "error", message: "Sin nombre" }
  }
  if (!COLUMN_TYPES.includes(col.type as ColumnType)) {
    return { status: "error", message: `Tipo desconocido: ${col.type}` }
  }
  if (col.type === "custom" && !col.format) {
    return { status: "warning", message: "Tipo custom sin formato" }
  }
  return { status: "valid", message: "OK" }
}
