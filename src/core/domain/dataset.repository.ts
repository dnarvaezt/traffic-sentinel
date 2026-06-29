import { getIndexedDbClient } from "../db"
import type { ColumnDefinition } from "./column"
import type { Dataset } from "./dataset"
import { createDataset } from "./dataset"

const STORE = "datasets"

export class DatasetStore {
  async create(
    projectId: string,
    name: string,
    rawData: Record<string, unknown>[],
    columns: ColumnDefinition[],
    description?: string,
  ): Promise<Dataset> {
    const dataset = createDataset(projectId, name, rawData, columns, description)
    await getIndexedDbClient().transaction(STORE, "readwrite", (store) =>
      store.add(structuredClone(dataset)),
    )
    return dataset
  }

  async read(id: string): Promise<Dataset | undefined> {
    const result = await getIndexedDbClient().transaction(STORE, "readonly", (store) =>
      store.get(id),
    )
    return (result as Dataset) ?? undefined
  }

  async update(
    id: string,
    updates: Partial<Pick<Dataset, "name" | "description" | "favorite">>,
  ): Promise<Dataset | undefined> {
    const existing = await this.read(id)
    if (!existing) return undefined
    const updated: Dataset = { ...existing, ...updates }
    await getIndexedDbClient().transaction(STORE, "readwrite", (store) =>
      store.put(structuredClone(updated)),
    )
    return updated
  }

  async delete(id: string): Promise<boolean> {
    const existing = await this.read(id)
    if (!existing) return false
    await getIndexedDbClient().transaction(STORE, "readwrite", (store) => store.delete(id))
    return true
  }

  async listByProject(projectId: string): Promise<Dataset[]> {
    const db = await getIndexedDbClient().open()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE, "readonly")
      const store = transaction.objectStore(STORE)
      const index = store.index("by_projectId")
      const request = index.getAll(projectId)
      transaction.oncomplete = () => resolve(request.result as Dataset[])
      transaction.onerror = () => reject(transaction.error)
    })
  }
}
