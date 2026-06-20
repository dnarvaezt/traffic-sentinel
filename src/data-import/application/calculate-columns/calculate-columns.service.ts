import type { Calculator } from "../../domain/models/calculation"

export class CalculateColumnsService {
  execute(data: Record<string, any>[], calculations: Calculator[]): Record<string, any>[] {
    if (!calculations || calculations.length === 0) return data

    return data.map((row) => {
      const newRow = { ...row }
      for (const calculation of calculations) {
        newRow[calculation.id] = calculation.calculate(newRow)
      }
      return newRow
    })
  }
}

export const calculateColumnsService = new CalculateColumnsService()
