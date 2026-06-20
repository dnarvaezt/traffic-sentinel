import { DataFrame } from "danfojs"
import Papa from "papaparse"
import type { ColumnDefinition, ColumnType } from "@/core/project"

export interface ParsedCSV {
  data: Record<string, unknown>[]
  columns: ColumnDefinition[]
  rowCount: number
}

const DATE_RE = [
  /^\d{4}-\d{2}-\d{2}$/,
  /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/,
  /^\d{2}\/\d{2}\/\d{4}$/,
  /^\d{2}-\d{2}-\d{4}$/,
]

function isDateString(v: string): boolean {
  return DATE_RE.some((re) => re.test(v)) && !Number.isNaN(new Date(v).getTime())
}

function refineStringType(values: unknown[]): ColumnType {
  const sample = values.slice(0, 100).filter((v) => v !== null && v !== undefined && v !== "")
  if (sample.length === 0) return "string"
  if (
    sample.every((v) => {
      const l = String(v).toLowerCase()
      return l === "true" || l === "false" || l === "1" || l === "0"
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

function coerceValue(raw: unknown, type: ColumnType): unknown {
  if (raw === null || raw === undefined || raw === "") return null
  const str = String(raw)
  switch (type) {
    case "number": {
      const n = Number(str)
      return Number.isNaN(n) ? null : n
    }
    case "boolean": {
      const l = str.toLowerCase()
      return l === "true" || l === "1"
    }
    case "date": {
      const d = new Date(str)
      if (Number.isNaN(d.getTime())) return str
      return d.toISOString().slice(0, 10)
    }
    default:
      return str
  }
}

export function parseCSV(file: File): Promise<ParsedCSV> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      complete: (results) => {
        const rawData = results.data as Record<string, unknown>[]
        const headers = results.meta.fields || []
        const df = new DataFrame(rawData)
        const dtypes = df.dtypes as string[]
        const dfColumns = df.columns as string[]

        const columns: ColumnDefinition[] = headers.map((name) => {
          const dtypeIndex = dfColumns.indexOf(name)
          const dtype = dtypeIndex >= 0 ? dtypes[dtypeIndex] : "string"
          const values = rawData.map((row) => row[name])
          const type = danfoDtypeToColumnType(dtype, values)
          return { id: crypto.randomUUID(), header: name, type, tooltip: name }
        })

        const typeMap = new Map(columns.map((c) => [c.header, c.type]))
        const data = rawData.map((row) => {
          const coerced: Record<string, unknown> = {}
          for (const name of headers)
            coerced[name] = coerceValue(row[name], typeMap.get(name) ?? "string")
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
