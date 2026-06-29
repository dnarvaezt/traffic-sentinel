import type { ColumnDefinition } from "./column"

export interface Schema {
  columns: ColumnDefinition[]
}

export interface SchemaConfig {
  groups?: GroupConfig[]
}

export interface GroupConfig {
  columnId: string
  label?: string
}

export function createSchema(config?: Partial<Schema>): Schema {
  return {
    columns: config?.columns ?? [],
  }
}
