export interface Project {
  id: string
  name: string
  description?: string
  schema: Schema
  databases: Database[]
  mappings: Mapping[]
  dashboards: Dashboard[]
  createdAt: Date
  updatedAt: Date
}

export interface Schema {
  columns: ColumnDefinition[]
}

export interface ColumnDefinition {
  id: string
  name: string
  type: ColumnType
  label?: string
  description?: string
  aggregatable: boolean
  filterable: boolean
}

export type ColumnType = "string" | "number" | "date" | "boolean" | "email" | "url"

export interface Database {
  id: string
  projectId: string
  name: string
  description?: string
  favorite?: boolean
  columns: DatabaseColumn[]
  data: Record<string, unknown>[]
  rowCount: number
  uploadedAt: Date
}

export interface DatabaseColumn {
  name: string
  inferredType: string
}

export interface Mapping {
  id: string
  projectId: string
  databaseId: string
  physicalTableId: string
  columnMappings: ColumnMapping[]
}

export interface ColumnMapping {
  schemaColumnId: string
  physicalColumnName: string
}

export interface Dashboard {
  id: string
  projectId: string
  name: string
  widgets: Widget[]
}

export interface Widget {
  id: string
  type: WidgetType
  config: WidgetConfig
  position: WidgetPosition
}

export type WidgetType = "chart" | "table" | "metric" | "filter"

export interface WidgetConfig {
  chartType?: "line" | "bar" | "pie" | "area"
  metrics?: MetricDefinition[]
  groupBy?: GroupByDefinition[]
  filters?: FilterDefinition[]
  sort?: SortDefinition[]
  displayColumns?: string[]
}

export interface MetricDefinition {
  id: string
  columnId: string
  aggregation: AggregationType
  alias?: string
}

export type AggregationType = "count" | "sum" | "avg" | "min" | "max" | "countDistinct"

export interface GroupByDefinition {
  id: string
  columnId: string
}

export interface FilterDefinition {
  id: string
  columnId: string
  operator: FilterOperator
  value: unknown
}

export type FilterOperator =
  | "equals"
  | "notEquals"
  | "contains"
  | "notContains"
  | "greaterThan"
  | "lessThan"
  | "greaterThanOrEquals"
  | "lessThanOrEquals"
  | "between"
  | "isNull"
  | "isNotNull"

export interface SortDefinition {
  id: string
  columnId: string
  direction: "asc" | "desc"
}

export interface WidgetPosition {
  x: number
  y: number
  width: number
  height: number
}
