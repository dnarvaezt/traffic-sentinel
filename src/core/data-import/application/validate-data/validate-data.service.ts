import type { ValidationError, Validator } from "../../domain/models/validation"

export class ValidateDataService {
  async execute(data: Record<string, any>[], validators: Validator[]): Promise<ValidationError[]> {
    const errors: ValidationError[] = []

    if (!validators || validators.length === 0) return errors

    // Dataset level validation
    const datasetValidators = validators.filter((v) => v.level === "dataset")
    for (const v of datasetValidators) {
      const isValid = await v.validate(data)
      if (!isValid) {
        errors.push({ code: v.code, message: v.message })
      }
    }

    // Column level validation
    const columnValidators = validators.filter((v) => v.level === "column")
    for (const v of columnValidators) {
      if (v.column) {
        const columnValues = data.map((row) => row[v.column!])
        const isValid = await v.validate(columnValues)
        if (!isValid) {
          errors.push({ column: v.column, code: v.code, message: v.message })
        }
      }
    }

    // Row and Cell level validation
    const rowValidators = validators.filter((v) => v.level === "row")
    const cellValidators = validators.filter((v) => v.level === "cell")

    for (let i = 0; i < data.length; i++) {
      const row = data[i]
      const rowId = row._rowId

      // Row validation
      for (const v of rowValidators) {
        const isValid = await v.validate(row)
        if (!isValid) {
          errors.push({ rowId, row: i, code: v.code, message: v.message })
        }
      }

      // Cell validation
      for (const v of cellValidators) {
        if (v.column) {
          const isValid = await v.validate(row[v.column])
          if (!isValid) {
            errors.push({ rowId, row: i, column: v.column, code: v.code, message: v.message })
          }
        }
      }
    }

    return errors
  }
}

export const validateDataService = new ValidateDataService()
