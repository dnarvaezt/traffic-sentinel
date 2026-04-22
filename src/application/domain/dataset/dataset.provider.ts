import type { DatasetRepository } from "./dataset.repository.interface"
import { DatasetService } from "./dataset.service"

export class DatasetProvider {
  private static instance: DatasetService | null = null
  private static repository: DatasetRepository | null = null

  static setRepository(repository: DatasetRepository): void {
    DatasetProvider.repository = repository
  }

  static getInstance(): DatasetService {
    if (!DatasetProvider.instance) {
      if (!DatasetProvider.repository) {
        throw new Error("Repository not set. Call setRepository first.")
      }
      DatasetProvider.instance = new DatasetService({
        dataset: [],
        cellsPerRow: 0,
        cellActions: [],
      })
    }
    return DatasetProvider.instance
  }

  static getRepository(): DatasetRepository {
    if (!DatasetProvider.repository) {
      throw new Error("Repository not set. Call setRepository first.")
    }
    return DatasetProvider.repository
  }

  static reset(): void {
    DatasetProvider.instance = null
    DatasetProvider.repository = null
  }
}
