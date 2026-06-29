import { DatasetStore } from "./repository"

export function createDatasetRepository(): DatasetStore {
  return new DatasetStore()
}
