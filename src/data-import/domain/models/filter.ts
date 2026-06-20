export type FilterType = "text" | "number" | "select" | "date-range" | "boolean"

export interface FilterDefinition {
  id: string
  columnId: string
  type: FilterType
  label?: string
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
