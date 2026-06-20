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

export type ColumnKind = "source" | "virtual"

export interface ColumnValidation {
  type: string
  message: string
  params?: Record<string, unknown>
}

export interface ColumnTransformer {
  type: string
  params?: Record<string, unknown>
}

export interface ColumnDefinition {
  id: string
  header: string
  type: ColumnType
  kind?: ColumnKind
  sourceColumn?: string
  tooltip?: string
  format?: string
  alignment?: Alignment
  width?: number | string
  visibility?: boolean
  sortable?: boolean
  filterable?: boolean
  validations?: ColumnValidation[]
  transformers?: ColumnTransformer[]
  calculate?: string
}
