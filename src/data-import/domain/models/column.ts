export type ColumnType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "currency"
  | "percentage"
  | "email"
  | "url"
  | "custom"

export type Alignment = "left" | "center" | "right"

export interface ColumnDefinition {
  id: string
  header: string
  type: ColumnType
  tooltip?: string
  format?: string
  alignment?: Alignment
  width?: number | string
  visibility?: boolean
  sortable?: boolean
  filterable?: boolean
  // For calculated columns
  calculate?: (row: any) => any
}
