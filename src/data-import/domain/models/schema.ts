import type { ColumnDefinition, ColumnKind, ColumnType } from "./column"

export type { ColumnDefinition, ColumnKind, ColumnType }

import type { GroupDefinition } from "./group"

export interface SchemaDefinition {
  columns: ColumnDefinition[]
  groups?: GroupDefinition[]
}

export function createSchema(config: SchemaDefinition): SchemaDefinition {
  return {
    ...config,
    groups: config.groups || [],
  }
}
