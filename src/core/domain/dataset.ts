import type { ColumnDefinition } from "./column"

export interface Dataset {
  id: string
  projectId: string
  name: string
  description?: string
  rawData: Record<string, unknown>[]
  rowCount: number
  columns: ColumnDefinition[]
  uploadedAt: Date
  favorite?: boolean
}

export function createDataset(
  projectId: string,
  name: string,
  rawData: Record<string, unknown>[],
  columns: ColumnDefinition[],
  description?: string,
): Dataset {
  return {
    id: crypto.randomUUID(),
    projectId,
    name,
    description,
    rawData,
    rowCount: rawData.length,
    columns,
    uploadedAt: new Date(),
  }
}
