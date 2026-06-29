export interface FilterDefinition {
  id: string
  name: string
  description?: string
  columnId: string
  operator: FilterOperator
  value: unknown
  enabled?: boolean
  groupOperator?: "and" | "or"
  conditions?: FilterCondition[]
}

export interface FilterCondition {
  columnId: string
  operator: FilterOperator
  value: unknown
}

export type FilterOperator =
  | "equals"
  | "notEquals"
  | "contains"
  | "notContains"
  | "greaterThan"
  | "lessThan"
  | "greaterThanOrEquals"
  | "lessThanOrEquals"
  | "between"
  | "isNull"
  | "isNotNull"
