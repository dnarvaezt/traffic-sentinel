import type {
  AggregationType,
  FilterDefinition,
  FilterOperator,
  GroupByDefinition,
  MetricDefinition,
  SortDefinition,
} from "../../application/types"

export function applyFilters(
  data: Record<string, unknown>[],
  filters: FilterDefinition[],
): Record<string, unknown>[] {
  return data.filter((row) => {
    return filters.every((filter) => {
      const value = row[filter.columnId]
      return evaluateFilter(value, filter.operator, filter.value)
    })
  })
}

function evaluateFilter(value: unknown, operator: FilterOperator, filterValue: unknown): boolean {
  if (operator === "isNull") return value === null || value === undefined
  if (operator === "isNotNull") return value !== null && value !== undefined

  const strValue = String(value ?? "").toLowerCase()
  const strFilterValue = String(filterValue ?? "").toLowerCase()

  switch (operator) {
    case "equals":
      return strValue === strFilterValue
    case "notEquals":
      return strValue !== strFilterValue
    case "contains":
      return strValue.includes(strFilterValue)
    case "notContains":
      return !strValue.includes(strFilterValue)
    case "greaterThan":
      return Number(value) > Number(filterValue)
    case "lessThan":
      return Number(value) < Number(filterValue)
    case "greaterThanOrEquals":
      return Number(value) >= Number(filterValue)
    case "lessThanOrEquals":
      return Number(value) <= Number(filterValue)
    case "between": {
      const numValue = Number(value)
      const [min, max] = Array.isArray(filterValue) ? filterValue : [filterValue, filterValue]
      return numValue >= Number(min) && numValue <= Number(max)
    }
    default:
      return true
  }
}

export function applySort(
  data: Record<string, unknown>[],
  sorts: SortDefinition[],
): Record<string, unknown>[] {
  if (sorts.length === 0) return data

  return [...data].sort((a, b) => {
    for (const sort of sorts) {
      const aVal = a[sort.columnId]
      const bVal = b[sort.columnId]

      if (aVal === bVal) continue
      if (aVal == null) return 1
      if (bVal == null) return -1

      const comparison =
        typeof aVal === "number" && typeof bVal === "number"
          ? aVal - bVal
          : String(aVal).localeCompare(String(bVal))

      return sort.direction === "desc" ? -comparison : comparison
    }
    return 0
  })
}

export function applyAggregation(
  data: Record<string, unknown>[],
  metrics: MetricDefinition[],
  groupBy?: GroupByDefinition[],
): Record<string, unknown>[] {
  if (metrics.length === 0) return data

  if (!groupBy || groupBy.length === 0) {
    const result: Record<string, unknown> = {}
    for (const metric of metrics) {
      result[metric.alias || metric.id] = calculateAggregation(
        data.map((row) => row[metric.columnId]),
        metric.aggregation,
      )
    }
    return [result]
  }

  const groups = new Map<string, Record<string, unknown>[]>()

  for (const row of data) {
    const groupKey = groupBy.map((g) => String(row[g.columnId])).join("|")
    if (!groups.has(groupKey)) {
      groups.set(groupKey, [])
    }
    groups.get(groupKey)!.push(row)
  }

  const aggregated: Record<string, unknown>[] = []
  for (const [key, rows] of groups) {
    const result: Record<string, unknown> = {}

    const keyParts = key.split("|")
    for (let i = 0; i < groupBy.length; i++) {
      result[groupBy[i].columnId] = keyParts[i]
    }

    for (const metric of metrics) {
      result[metric.alias || metric.id] = calculateAggregation(
        rows.map((row) => row[metric.columnId]),
        metric.aggregation,
      )
    }

    aggregated.push(result)
  }

  return aggregated
}

function calculateAggregation(values: unknown[], type: AggregationType): number {
  const numbers = values.map((v) => Number(v)).filter((v) => !Number.isNaN(v))

  switch (type) {
    case "count":
      return values.length
    case "sum":
      return numbers.reduce((acc, v) => acc + v, 0)
    case "avg":
      return numbers.length > 0 ? numbers.reduce((acc, v) => acc + v, 0) / numbers.length : 0
    case "min":
      return numbers.length > 0 ? Math.min(...numbers) : 0
    case "max":
      return numbers.length > 0 ? Math.max(...numbers) : 0
    case "countDistinct":
      return new Set(values.map((v) => String(v))).size
    default:
      return 0
  }
}

export function executeQuery(
  data: Record<string, unknown>[],
  config: {
    filters?: FilterDefinition[]
    sorts?: SortDefinition[]
    metrics?: MetricDefinition[]
    groupBy?: GroupByDefinition[]
  },
): Record<string, unknown>[] {
  let result = data

  if (config.filters && config.filters.length > 0) {
    result = applyFilters(result, config.filters)
  }

  if (config.metrics && config.metrics.length > 0) {
    result = applyAggregation(result, config.metrics, config.groupBy)
  }

  if (config.sorts && config.sorts.length > 0) {
    result = applySort(result, config.sorts)
  }

  return result
}
