import type { FilterDefinition } from "./filter"

export type WidgetType = "chart" | "table" | "metric" | "filter"

export interface WidgetPosition {
  x: number
  y: number
  width: number
  height: number
}

export interface WidgetConfig {
  chartType?: "line" | "bar" | "pie" | "area"
  datasetId?: string
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

export interface SortDefinition {
  id: string
  columnId: string
  direction: "asc" | "desc"
}

export interface Widget {
  id: string
  type: WidgetType
  config: WidgetConfig
  position: WidgetPosition
}

export interface Dashboard {
  id: string
  projectId: string
  name: string
  widgets: Widget[]
  createdAt: Date
  updatedAt: Date
}

export function createDashboard(projectId: string, name: string): Dashboard {
  return {
    id: crypto.randomUUID(),
    projectId,
    name,
    widgets: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

export function createWidget(type: WidgetType, config?: Partial<WidgetConfig>): Widget {
  return {
    id: crypto.randomUUID(),
    type,
    config: {
      datasetId: config?.datasetId,
      chartType: config?.chartType,
      metrics: config?.metrics,
      groupBy: config?.groupBy,
      filters: config?.filters,
      sort: config?.sort,
      displayColumns: config?.displayColumns,
    },
    position: { x: 0, y: 0, width: 6, height: 4 },
  }
}
