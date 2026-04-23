import type {
  FilterItem,
  GroupByDefinition,
  MetricDefinition,
  SortDefinition,
} from "../../application/types"
import {
  aggregateDataFrame,
  filterDataFrame,
  sortDataFrame,
  toDataFrame,
  toRecords,
} from "./dataframe-service"

export function applyFilters(
  data: Record<string, unknown>[],
  filters: FilterItem[],
): Record<string, unknown>[] {
  if (filters.length === 0) return data
  return toRecords(filterDataFrame(toDataFrame(data), filters))
}

export function applySort(
  data: Record<string, unknown>[],
  sorts: SortDefinition[],
): Record<string, unknown>[] {
  if (sorts.length === 0) return data
  return toRecords(sortDataFrame(toDataFrame(data), sorts))
}

export function applyAggregation(
  data: Record<string, unknown>[],
  metrics: MetricDefinition[],
  groupBy?: GroupByDefinition[],
): Record<string, unknown>[] {
  if (metrics.length === 0) return data
  return toRecords(aggregateDataFrame(toDataFrame(data), metrics, groupBy))
}

export function executeQuery(
  data: Record<string, unknown>[],
  config: {
    filters?: FilterItem[]
    sorts?: SortDefinition[]
    metrics?: MetricDefinition[]
    groupBy?: GroupByDefinition[]
  },
): Record<string, unknown>[] {
  if (data.length === 0) return []

  // Build one DataFrame and chain all operations without intermediate array conversions
  let df = toDataFrame(data)

  if (config.filters?.length) {
    df = filterDataFrame(df, config.filters)
  }

  if (config.metrics?.length) {
    df = aggregateDataFrame(df, config.metrics, config.groupBy)
  }

  if (config.sorts?.length) {
    df = sortDataFrame(df, config.sorts)
  }

  return toRecords(df)
}
