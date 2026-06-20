import type { ColumnDefinition } from "../../domain/models/column"

export class MapDataService {
  execute(data: Record<string, any>[], columns: ColumnDefinition[]): Record<string, any>[] {
    return data.map((row) => {
      const mappedRow: Record<string, any> = {
        _rowId: row._rowId || crypto.randomUUID(),
      }

      for (const col of columns) {
        if (col.kind === "virtual") continue
        const sourceKey = col.sourceColumn || col.header
        const value = row[sourceKey] !== undefined ? row[sourceKey] : row[col.id]
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
