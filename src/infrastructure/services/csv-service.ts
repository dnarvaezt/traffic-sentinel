import { DataFrame } from "danfojs"
import Papa from "papaparse"
import type { ColumnDefinition, ColumnType } from "../../application/types"

export interface ParsedCSV {
  data: Record<string, unknown>[]
  columns: ColumnDefinition[]
  rowCount: number
}

// Strict date patterns — prevents numbers like "1" or "2020" from being
// misclassified as dates by the permissive `new Date(string)` constructor.
const DATE_RE = [
  /^\d{4}-\d{2}-\d{2}$/, // 2023-01-15
  /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/, // 2023-01-15T10:30
  /^\d{2}\/\d{2}\/\d{4}$/, // 01/15/2023
  /^\d{2}-\d{2}-\d{4}$/, // 15-01-2023
]

function isDateString(v: string): boolean {
  return DATE_RE.some((re) => re.test(v)) && !Number.isNaN(new Date(v).getTime())
}

// Refine Danfo's "string" dtype into boolean / date / email / url / string.
// Called only when Danfo already ruled out int32 / float32.
function refineStringType(values: unknown[]): ColumnType {
  const sample = values.slice(0, 100).filter((v) => v !== null && v !== undefined && v !== "")
  if (sample.length === 0) return "string"

  if (
    sample.every((v) => {
      const lower = String(v).toLowerCase()
      return lower === "true" || lower === "false" || lower === "1" || lower === "0"
    })
  )
    return "boolean"

  if (sample.every((v) => isDateString(String(v)))) return "date"

  if (sample.every((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v)))) return "email"

  if (sample.every((v) => /^https?:\/\//.test(String(v)))) return "url"

  return "string"
}

function danfoDtypeToColumnType(dtype: string, values: unknown[]): ColumnType {
  if (dtype === "int32" || dtype === "float32") return "number"
  if (dtype === "boolean") return "boolean"
  return refineStringType(values)
}

// Coerce a raw string value from PapaParse into the proper JS type so that
// data stored in IndexedDB already carries correct types (number, boolean,
// ISO date string, or plain string).  This is what makes Danfo comparisons
// and JS sorts work correctly without further transformation.
function coerceValue(raw: unknown, type: ColumnType): unknown {
  if (raw === null || raw === undefined || raw === "") return null
  const str = String(raw)

  switch (type) {
    case "number": {
      const n = Number(str)
      return Number.isNaN(n) ? null : n
    }
    case "boolean": {
      const lower = str.toLowerCase()
      return lower === "true" || lower === "1"
    }
    case "date": {
      const d = new Date(str)
      if (Number.isNaN(d.getTime())) return str
      // Normalize to YYYY-MM-DD so lexicographic sort == chronological sort
      return d.toISOString().slice(0, 10)
    }
    default:
      return str
  }
}

export function parseCSV(file: File): Promise<ParsedCSV> {
  return new Promise((resolve, reject) => {
    // Step 1 — PapaParse: robust CSV text parsing with header detection
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false, // keep everything as string for our own coercion
      complete: (results) => {
        const rawData = results.data as Record<string, unknown>[]
        const headers = results.meta.fields || []

        // Step 2 — Danfo.js DataFrame: leverage vectorised dtype inference
        const df = new DataFrame(rawData)
        const dtypes = df.dtypes as string[]
        const dfColumns = df.columns as string[]

        const columns: ColumnDefinition[] = headers.map((name) => {
          const dtypeIndex = dfColumns.indexOf(name)
          const dtype = dtypeIndex >= 0 ? dtypes[dtypeIndex] : "string"
          const values = rawData.map((row) => row[name])
          const type = danfoDtypeToColumnType(dtype, values)

          return {
            id: crypto.randomUUID(),
            name,
            type,
            label: name,
            aggregatable: type === "number",
            filterable: true,
          }
        })

        // Step 3 — Coerce raw string values to the detected JS types so that
        // IndexedDB stores numbers as numbers, booleans as booleans, etc.
        const typeMap = new Map(columns.map((c) => [c.name, c.type]))
        const data = rawData.map((row) => {
          const coerced: Record<string, unknown> = {}
          for (const name of headers) {
            coerced[name] = coerceValue(row[name], typeMap.get(name) ?? "string")
          }
          return coerced
        })

        resolve({ data, columns, rowCount: data.length })
      },
      error: (error) => reject(error),
    })
  })
}

export function exportToCSV(data: Record<string, unknown>[], filename: string): void {
  const csv = Papa.unparse(data)
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
