import type { ColumnTransformer } from "../domain/models/column"
import type { GroupedData } from "../domain/models/group"
import type { SchemaDefinition } from "../domain/models/schema"
import type { ValidationError, Validator } from "../domain/models/validation"
import { groupDataService } from "./group-data/group-data.service"
import { mapDataService } from "./map-data/map-data.service"
import { parseCSVService } from "./parse-csv/parse-csv.service"
import { validateDataService } from "./validate-data/validate-data.service"

export interface PipelineResult {
  rawData: Record<string, any>[]
  transformedData: Record<string, any>[]
  validatedData: Record<string, any>[]
  calculatedData: Record<string, any>[]
  filteredData: Record<string, any>[]
  groupedData: GroupedData[] | Record<string, any>[]
  errors: ValidationError[]
}

function applyColumnTransformers(
  data: Record<string, any>[],
  schema: SchemaDefinition,
): Record<string, any>[] {
  return data.map((row) => {
    const newRow = { ...row }
    for (const col of schema.columns) {
      if (!col.transformers?.length) continue
      const _value = newRow[col.id]
      for (const t of col.transformers) {
        newRow[col.id] = createTransformFn(t)(newRow[col.id])
      }
    }
    return newRow
  })
}

function createTransformFn(t: ColumnTransformer): (value: any) => any {
  switch (t.type) {
    case "trim":
      return (v: any) => (typeof v === "string" ? v.trim() : v)
    case "uppercase":
      return (v: any) => (typeof v === "string" ? v.toUpperCase() : v)
    case "lowercase":
      return (v: any) => (typeof v === "string" ? v.toLowerCase() : v)
    case "slug":
      return (v: any) =>
        typeof v === "string"
          ? v
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, "")
          : v
    case "parseInt":
      return (v: any) => {
        const n = parseInt(v, 10)
        return Number.isNaN(n) ? v : n
      }
    case "parseFloat":
    case "parse-number":
      return (v: any) => {
        const n = Number(v)
        return Number.isNaN(n) ? v : n
      }
    case "dateParse":
      return (v: any) => {
        if (typeof v !== "string") return v
        const d = new Date(v)
        return Number.isNaN(d.getTime()) ? v : d.toISOString()
      }
    case "stripHtml":
      return (v: any) => (typeof v === "string" ? v.replace(/<[^>]*>/g, "").trim() : v)
    case "custom":
      return (v: any) => {
        const code = (t.params?.code as string) ?? ""
        if (!code.trim()) return v
        try {
          return new Function("value", code)(v)
        } catch {
          return v
        }
      }
    default:
      return (v: any) => v
  }
}

function evaluateCalculatedColumns(
  data: Record<string, any>[],
  schema: SchemaDefinition,
  errors: ValidationError[],
): Record<string, any>[] {
  const calcCols = schema.columns.filter((c) => c.calculate)
  if (calcCols.length === 0) return data

  return data.map((row, i) => {
    const newRow = { ...row }
    for (const col of calcCols) {
      try {
        newRow[col.id] = new Function("row", col.calculate!)(newRow)
      } catch (e) {
        newRow[col.id] = null
        errors.push({
          rowId: row._rowId,
          row: i,
          column: col.header,
          code: "calc_error",
          message: `Error evaluating '${col.header}': ${(e as Error).message}`,
        })
      }
    }
    return newRow
  })
}

function collectValidators(schema: SchemaDefinition): Validator[] {
  return schema.columns.flatMap((col) =>
    (col.validations || []).map((v) => {
      let validate: (data: any) => boolean
      switch (v.type) {
        case "required":
          validate = (val: any) => val !== null && val !== undefined && val !== ""
          break
        case "unique":
          validate = (() => {
            const seen = new Set()
            return (val: any) => {
              if (seen.has(val)) return false
              seen.add(val)
              return true
            }
          })()
          break
        case "min":
          validate = (val: any) => {
            const min = (v.params?.value as number) ?? 0
            return Number(val) >= min
          }
          break
        case "max":
          validate = (val: any) => {
            const max = (v.params?.value as number) ?? 0
            return Number(val) <= max
          }
          break
        case "regex":
          validate = (val: any) => {
            const pattern = (v.params?.pattern as string) ?? ""
            return new RegExp(pattern).test(String(val))
          }
          break
        case "email":
          validate = (val: any) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val))
          break
        case "custom":
          validate = (val: any) => {
            try {
              return new Function("value", `return ${v.params?.code as string}`)(val)
            } catch {
              return true
            }
          }
          break
        default:
          validate = () => true
      }
      return {
        id: `${col.id}-${v.type}`,
        level: "cell" as const,
        column: col.header,
        validate,
        message: v.message,
        code: v.type,
      }
    }),
  )
}

export class ImportEngine {
  async run(
    file: File,
    schema: SchemaDefinition,
    _runtimeFilters: Record<string, any> = {},
  ): Promise<PipelineResult> {
    // 1. Parse
    const { data: rawCSVData } = await parseCSVService.execute(file)

    // 2. Map (Normalize headers to Column IDs)
    const rawData = mapDataService.execute(rawCSVData, schema.columns)

    // 3. Apply per-column transformers
    const transformedData = applyColumnTransformers(rawData, schema)

    // 4. Validate (from per-column validations)
    const validators: Validator[] = collectValidators(schema)
    const errors: ValidationError[] = []
    const validationErrors = await validateDataService.execute(transformedData, validators)
    errors.push(...validationErrors)

    // 5. Evaluate calculated columns
    const calculatedData = evaluateCalculatedColumns(transformedData, schema, errors)

    // 6. Group
    const groupedData = groupDataService.execute(calculatedData, schema.groups || [])

    return {
      rawData,
      transformedData,
      validatedData: transformedData,
      calculatedData,
      filteredData: calculatedData,
      groupedData,
      errors,
    }
  }
}

export const importEngine = new ImportEngine()
