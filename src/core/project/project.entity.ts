// ─── Domain entities & types for the Project domain ─────────────────────────

import type { ColumnDefinition, SchemaDefinition } from "@/data-import/domain/models/schema"

export interface Project {
  id: string
  name: string
  description?: string
  config: SchemaDefinition
  databases: Database[]
  filters: FilterDefinition[]
  dashboards: Dashboard[]
  wizardCompleted: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Database {
  id: string
  projectId: string
  name: string
  description?: string
  favorite?: boolean
  activeFilterId?: string
  temporaryFilter?: FilterDefinition
  columns: ColumnDefinition[]
  data: Record<string, unknown>[]
  rowCount: number
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

export interface FilterItem extends Omit<FilterDefinition, "name"> {
  name?: string
}

export interface FilterDefinition {
  id: string
  name: string
  description?: string
  columnId: string
  operator: FilterOperator
  value: unknown
  enabled?: boolean
  groupOperator?: "and" | "or"
  conditions?: FilterCondition[]
}

export interface FilterCondition {
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
