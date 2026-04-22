import type { Dataset } from "./dataset.interface"

export interface DatasetRepository {
  save(dataset: Dataset, filename?: string): Promise<string>
  getById(id: string): Promise<Dataset | null>
  getAll(): Promise<Dataset[]>
  delete(id: string): Promise<void>
  clear(): Promise<void>
  getAllMetadata(): Promise<
    Array<{
      id: string
      filename?: string
      createdAt: number
      rowCount: number
    }>
  >
}
