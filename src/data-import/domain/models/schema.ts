import type { Calculator } from "./calculation"
import type { ColumnDefinition } from "./column"
import type { FilterDefinition } from "./filter"
import type { GroupDefinition } from "./group"
import type { Transformer } from "./transformation"
import type { Validator } from "./validation"

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
