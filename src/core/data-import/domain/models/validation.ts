export type ValidationLevel = "cell" | "row" | "column" | "dataset"

export interface ValidationError {
  rowId?: string
  row?: number // Keep as fallback/context
  column?: string
  code: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

export interface Validator {
  id: string
  level: ValidationLevel
  column?: string
  validate: (data: any) => boolean | Promise<boolean>
  message: string
  code: string
}

export type CellValidator = (value: any) => boolean
export type RowValidator = (row: any) => boolean
export type ColumnValidator = (values: any[]) => boolean
export type DatasetValidator = (data: any[]) => boolean
