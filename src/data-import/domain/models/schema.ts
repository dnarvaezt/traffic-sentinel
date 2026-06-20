import type { ColumnDefinition } from "./column"
import type { Validator } from "./validation"
import type { FilterDefinition } from "./filter"
import type { GroupDefinition } from "./group"
import type { Transformer } from "./transformation"
import type { Calculator } from "./calculation"

export interface SchemaDefinition {
  columns: ColumnDefinition[]
  validators?: Validator[]
  filters?: FilterDefinition[]
  groups?: GroupDefinition[]
  calculations?: Calculator[]
  transformers?: Transformer[]
}

export function createSchema(config: SchemaDefinition): SchemaDefinition {
  return {
    ...config,
    validators: config.validators || [],
    filters: config.filters || [],
    groups: config.groups || [],
    calculations: config.calculations || [],
    transformers: config.transformers || [],
  }
}
