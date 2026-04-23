export interface Project {
  id: string
  name: string
  description?: string
  schema: Schema
  datasets: Dataset[]
  dashboards: Dashboard[]
  createdAt: Date
  updatedAt: Date
}

export interface Schema {
  tables: TableDefinition[]
  relationships: Relationship[]
}

export interface TableDefinition {
  id: string
  name: string
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

export interface Relationship {
  id: string
  sourceTableId: string
  sourceColumnId: string
  targetTableId: string
  targetColumnId: string
  type: "one-to-one" | "one-to-many"
}

export interface Dataset {
  id: string
  projectId: string
  name: string
  tableId: string
  data: Record<string, unknown>[]
  rowCount: number
  columns: ColumnDefinition[]
  uploadedAt: Date
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
  datasetId: string
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
