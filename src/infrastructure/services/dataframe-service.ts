import { DataFrame, Series } from "danfojs"
import type {
  AggregationType,
  FilterItem,
  GroupByDefinition,
  MetricDefinition,
  SortDefinition,
} from "../../application/types"

type DanfoAgg = "sum" | "mean" | "min" | "max" | "count"
const DANFO_AGG: Record<Exclude<AggregationType, "countDistinct">, DanfoAgg> = {
  count: "count",
  sum: "sum",
  avg: "mean",
  min: "min",
  max: "max",
}

export function toDataFrame(data: Record<string, unknown>[]): DataFrame {
  if (data.length === 0) return new DataFrame()
  return new DataFrame(data)
}

export function toRecords(df: DataFrame): Record<string, unknown>[] {
  if (df.shape[0] === 0) return []
  const cols = df.columns as string[]
  const rows = df.values as unknown[][]
  return rows.map((row) => {
    const record: Record<string, unknown> = {}
    cols.forEach((col, i) => {
      record[col] = row[i]
    })
    return record
  })
}

// Returns true when the column Danfo dtype is numeric (int32 or float32).
function isNumericDtype(df: DataFrame, columnId: string): boolean {
  const idx = (df.columns as string[]).indexOf(columnId)
  if (idx === -1) return false
  const dtype = (df.dtypes as string[])[idx]
  return dtype === "int32" || dtype === "float32"
}

function buildMask(df: DataFrame, filter: FilterItem): Series | null {
  const { columnId, operator, value } = filter
  if (!(df.columns as string[]).includes(columnId)) return null

  const s = df[columnId] as Series
  const numeric = isNumericDtype(df, columnId)
  const strVal = String(value ?? "").toLowerCase()

  switch (operator) {
    case "isNull":
      return s.isNa()

    case "isNotNull":
      return s.map((v: unknown) => v !== null && v !== undefined && v !== "") as Series

    // ── Equality ──────────────────────────────────────────────────────────
    case "equals":
      if (numeric) return s.eq(Number(value))
      return s.map((v: unknown) => String(v ?? "").toLowerCase() === strVal) as Series

    case "notEquals":
      if (numeric) return s.ne(Number(value))
      return s.map((v: unknown) => String(v ?? "").toLowerCase() !== strVal) as Series

    // ── String containment ────────────────────────────────────────────────
    case "contains":
      return s.map((v: unknown) =>
        String(v ?? "")
          .toLowerCase()
          .includes(strVal),
      ) as Series

    case "notContains":
      return s.map(
        (v: unknown) =>
          !String(v ?? "")
            .toLowerCase()
            .includes(strVal),
      ) as Series

    // ── Ordered comparison ────────────────────────────────────────────────
    // For numeric columns use Danfo's native typed operators.
    // For string / date columns fall back to lexicographic comparison
    // (ISO date strings YYYY-MM-DD sort correctly lexicographically).
    case "greaterThan":
      if (numeric) return s.gt(Number(value))
      return s.map((v: unknown) => String(v ?? "") > String(value ?? "")) as Series

    case "lessThan":
      if (numeric) return s.lt(Number(value))
      return s.map((v: unknown) => String(v ?? "") < String(value ?? "")) as Series

    case "greaterThanOrEquals":
      if (numeric) return s.ge(Number(value))
      return s.map((v: unknown) => String(v ?? "") >= String(value ?? "")) as Series

    case "lessThanOrEquals":
      if (numeric) return s.le(Number(value))
      return s.map((v: unknown) => String(v ?? "") <= String(value ?? "")) as Series

    case "between": {
      const [min, max] = Array.isArray(value) ? value : [value, value]
      if (numeric) {
        const nMin = Number(min)
        const nMax = Number(max)
        return s.map((v: unknown) => {
          const n = Number(v)
          return n >= nMin && n <= nMax
        }) as Series
      }
      // String / date range (lexicographic, works for ISO dates)
      const sMin = String(min ?? "")
      const sMax = String(max ?? "")
      return s.map((v: unknown) => {
        const sv = String(v ?? "")
        return sv >= sMin && sv <= sMax
      }) as Series
    }

    default:
      return null
  }
}

export function filterDataFrame(df: DataFrame, filters: FilterItem[]): DataFrame {
  if (filters.length === 0 || df.shape[0] === 0) return df
  let result = df
  for (const filter of filters) {
    const mask = buildMask(result, filter)
    if (mask !== null) result = result.query(mask)
  }
  return result
}

export function sortDataFrame(df: DataFrame, sorts: SortDefinition[]): DataFrame {
  if (sorts.length === 0 || df.shape[0] === 0) return df
  const valid = sorts.filter((s) => (df.columns as string[]).includes(s.columnId))
  if (valid.length === 0) return df

  // Always use JS sort with explicit type-aware comparison.
  // Danfo's sortValues sorts string-encoded numbers lexicographically
  // even when dtype is int32, so we cannot rely on it.
  const records = toRecords(df)
  records.sort((a, b) => {
    for (const sort of valid) {
      const av = a[sort.columnId]
      const bv = b[sort.columnId]
      if (av === bv) continue
      if (av == null) return 1
      if (bv == null) return -1
      const cmp = isNumericDtype(df, sort.columnId)
        ? Number(av) - Number(bv)
        : String(av).localeCompare(String(bv))
      return sort.direction === "desc" ? -cmp : cmp
    }
    return 0
  })
  return new DataFrame(records)
}

function scalarAgg(series: Series, agg: AggregationType): number {
  switch (agg) {
    case "count":
      return series.count() as number
    case "sum":
      return (series.sum() as number) ?? 0
    case "avg":
      return (series.mean() as number) ?? 0
    case "min":
      return (series.min() as number) ?? 0
    case "max":
      return (series.max() as number) ?? 0
    case "countDistinct":
      return series.nUnique()
    default:
      return 0
  }
}

export function aggregateDataFrame(
  df: DataFrame,
  metrics: MetricDefinition[],
  groupBy?: GroupByDefinition[],
): DataFrame {
  if (metrics.length === 0 || df.shape[0] === 0) return df

  const groupCols = (groupBy ?? [])
    .map((g) => g.columnId)
    .filter((c) => (df.columns as string[]).includes(c))

  if (groupCols.length === 0) {
    const row: Record<string, unknown> = {}
    for (const m of metrics) {
      const key = m.alias || m.id
      if (!(df.columns as string[]).includes(m.columnId)) {
        row[key] = 0
        continue
      }
      row[key] = scalarAgg(df[m.columnId] as Series, m.aggregation)
    }
    return new DataFrame([row])
  }

  if (metrics.some((m) => m.aggregation === "countDistinct")) {
    return manualGroupAggregate(df, metrics, groupCols)
  }

  const aggSpec: Record<string, DanfoAgg> = {}
  for (const m of metrics) {
    if ((df.columns as string[]).includes(m.columnId)) {
      aggSpec[m.columnId] = DANFO_AGG[m.aggregation as Exclude<AggregationType, "countDistinct">]
    }
  }

  let result = df.groupby(groupCols).agg(aggSpec)

  const renameMap: Record<string, string> = {}
  for (const m of metrics) {
    const suffix = `_${DANFO_AGG[m.aggregation as Exclude<AggregationType, "countDistinct">]}`
    const danfoName = `${m.columnId}${suffix}`
    const alias = m.alias || m.id
    if (danfoName !== alias) renameMap[danfoName] = alias
  }
  if (Object.keys(renameMap).length > 0) result = result.rename(renameMap)

  return result
}

function manualGroupAggregate(
  df: DataFrame,
  metrics: MetricDefinition[],
  groupCols: string[],
): DataFrame {
  const records = toRecords(df)
  const groups = new Map<string, Record<string, unknown>[]>()

  for (const row of records) {
    const key = groupCols.map((c) => String(row[c])).join("\0")
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(row)
  }

  const aggregated: Record<string, unknown>[] = []
  for (const [key, rows] of groups) {
    const result: Record<string, unknown> = {}
    const parts = key.split("\0")
    groupCols.forEach((c, i) => {
      result[c] = parts[i]
    })

    for (const m of metrics) {
      const alias = m.alias || m.id
      const vals = rows.map((r) => r[m.columnId])
      if (m.aggregation === "countDistinct") {
        result[alias] = new Set(vals.map(String)).size
      } else {
        result[alias] = scalarAgg(new Series(vals as number[]), m.aggregation)
      }
    }
    aggregated.push(result)
  }

  return new DataFrame(aggregated)
}
