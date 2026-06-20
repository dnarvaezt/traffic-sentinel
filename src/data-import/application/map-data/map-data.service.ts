import type { ColumnDefinition } from "../../domain/models/column"

export class MapDataService {
  execute(data: Record<string, any>[], columns: ColumnDefinition[]): Record<string, any>[] {
    return data.map((row) => {
      const mappedRow: Record<string, any> = {
        _rowId: row._rowId || crypto.randomUUID(),
      }

      for (const col of columns) {
        // Try to find the value by header or by id
        const value = row[col.header] !== undefined ? row[col.header] : row[col.id]
        mappedRow[col.id] = value
      }

      // Preserve other internal fields if any
      for (const key in row) {
        if (key.startsWith("_") && mappedRow[key] === undefined) {
          mappedRow[key] = row[key]
        }
      }

      return mappedRow
    })
  }
}

export const mapDataService = new MapDataService()
