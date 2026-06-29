import { parseCSV } from "../../infrastructure/csv/csv-parser"

export interface ParseCSVResult {
  data: Record<string, any>[]
  headers: string[]
}

export class ParseCSVService {
  async execute(file: File): Promise<ParseCSVResult> {
    const result = await parseCSV(file)
    // Inject stable unique row IDs immediately after parsing
    const dataWithIds = result.data.map((row) => ({
      ...row,
      _rowId: crypto.randomUUID(),
    }))

    return {
      data: dataWithIds,
      headers: result.headers,
    }
  }
}

export const parseCSVService = new ParseCSVService()
