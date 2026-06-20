import type { Transformer } from "../../domain/models/transformation"

export class TransformDataService {
  execute(data: Record<string, any>[], transformers: Transformer[]): Record<string, any>[] {
    if (!transformers || transformers.length === 0) return data

    return data.map((row) => {
      const newRow = { ...row }
      for (const transformer of transformers) {
        const { column, transform } = transformer
        if (column in newRow) {
          newRow[column] = transform(newRow[column])
        }
      }
      return newRow
    })
  }
}

export const transformDataService = new TransformDataService()
