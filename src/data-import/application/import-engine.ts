import type { GroupedData } from "../domain/models/group"
import type { SchemaDefinition } from "../domain/models/schema"
import type { ValidationError } from "../domain/models/validation"
import { calculateColumnsService } from "./calculate-columns/calculate-columns.service"
import { filterDataService } from "./filter-data/filter-data.service"
import { groupDataService } from "./group-data/group-data.service"
import { mapDataService } from "./map-data/map-data.service"
import { parseCSVService } from "./parse-csv/parse-csv.service"
import { transformDataService } from "./transform-data/transform-data.service"
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

export class ImportEngine {
  async run(
    file: File,
    schema: SchemaDefinition,
    runtimeFilters: Record<string, any> = {},
  ): Promise<PipelineResult> {
    // 1. Parse
    const { data: rawCSVData } = await parseCSVService.execute(file)

    // 2. Map (Normalize headers to Column IDs)
    const rawData = mapDataService.execute(rawCSVData, schema.columns)

    // 3. Transform
    const transformedData = transformDataService.execute(rawData, schema.transformers || [])

    // 4. Validate
    const errors = await validateDataService.execute(transformedData, schema.validators || [])

    // 5. Calculate
    const calculatedData = calculateColumnsService.execute(
      transformedData,
      schema.calculations || [],
    )

    // 6. Filter
    const filteredData = filterDataService.execute(
      calculatedData,
      schema.filters || [],
      runtimeFilters,
    )

    // 7. Group
    const groupedData = groupDataService.execute(filteredData, schema.groups || [])

    return {
      rawData,
      transformedData,
      validatedData: transformedData, // In this pipeline, validated data is the same as transformed
      calculatedData,
      filteredData,
      groupedData,
      errors,
    }
  }
}

export const importEngine = new ImportEngine()
