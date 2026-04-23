import Papa from "papaparse"
import type { ColumnDefinition, ColumnType } from "../../application/types"

export interface ParsedCSV {
  data: Record<string, unknown>[]
  columns: ColumnDefinition[]
  rowCount: number
}

function inferColumnType(values: unknown[]): ColumnType {
  const sample = values.slice(0, 100).filter((v) => v !== null && v !== undefined && v !== "")

  if (sample.every((v) => !Number.isNaN(Number(v)) && v !== "")) return "number"
  if (
    sample.every((v) => {
      if (typeof v === "boolean") return true
      const lower = String(v).toLowerCase()
      return lower === "true" || lower === "false" || lower === "1" || lower === "0"
    })
  )
    return "boolean"
  if (
    sample.every((v) => {
      const d = new Date(String(v))
      return !Number.isNaN(d.getTime())
    })
  )
    return "date"
  if (
    sample.every((v) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(String(v))
    })
  )
    return "email"
  if (
    sample.every((v) => {
      const urlRegex = /^https?:\/\//
      return urlRegex.test(String(v))
    })
  )
    return "url"

  return "string"
}

export function parseCSV(file: File): Promise<ParsedCSV> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      complete: (results) => {
        const data = results.data as Record<string, unknown>[]
        const headers = results.meta.fields || []

        const columns: ColumnDefinition[] = headers.map((name) => {
          const values = data.map((row) => row[name])
          const type = inferColumnType(values)

          return {
            id: crypto.randomUUID(),
            name,
            type,
            label: name,
            aggregatable: type === "number",
            filterable: true,
          }
        })

        resolve({
          data,
          columns,
          rowCount: data.length,
        })
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
