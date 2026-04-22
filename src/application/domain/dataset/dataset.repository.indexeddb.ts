import type { Dataset } from "./dataset.interface"
import type { DatasetRepository } from "./dataset.repository.interface"

const DB_NAME = "TransformateDB"
const STORE_NAME = "datasets"

interface StoredDataset {
  id: string
  data: Dataset
  filename?: string
  createdAt: number
  updatedAt: number
}

export class DatasetRepositoryIndexedDB implements DatasetRepository {
  private db: IDBDatabase | null = null

  private async openDatabase(): Promise<IDBDatabase> {
    if (this.db) {
      return this.db
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1)

      request.onerror = () => {
        reject(new Error("Failed to open IndexedDB"))
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve(this.db)
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id" })
        }
      }
    })
  }

  async save(dataset: Dataset, filename?: string): Promise<string> {
    const db = await this.openDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readwrite")
      const store = transaction.objectStore(STORE_NAME)
      const id = crypto.randomUUID()
      const storedDataset: StoredDataset = {
        id,
        data: dataset,
        filename,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }

      const request = store.add(storedDataset)

      request.onsuccess = () => resolve(id)
      request.onerror = () => reject(new Error("Failed to save dataset"))
    })
  }

  async getById(id: string): Promise<Dataset | null> {
    const db = await this.openDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readonly")
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get(id)

      request.onsuccess = () => {
        const result = request.result as StoredDataset | undefined
        resolve(result?.data ?? null)
      }
      request.onerror = () => reject(new Error("Failed to get dataset"))
    })
  }

  async getAll(): Promise<Dataset[]> {
    const db = await this.openDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readonly")
      const store = transaction.objectStore(STORE_NAME)
      const request = store.getAll()

      request.onsuccess = () => {
        const results = request.result as StoredDataset[]
        const datasets = results.map((item) => item.data)
        resolve(datasets)
      }
      request.onerror = () => reject(new Error("Failed to get all datasets"))
    })
  }

  async delete(id: string): Promise<void> {
    const db = await this.openDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readwrite")
      const store = transaction.objectStore(STORE_NAME)
      const request = store.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error("Failed to delete dataset"))
    })
  }

  async clear(): Promise<void> {
    const db = await this.openDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readwrite")
      const store = transaction.objectStore(STORE_NAME)
      const request = store.clear()

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error("Failed to clear datasets"))
    })
  }

  async getAllMetadata(): Promise<
    Array<{
      id: string
      filename?: string
      createdAt: number
      rowCount: number
    }>
  > {
    const db = await this.openDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readonly")
      const store = transaction.objectStore(STORE_NAME)
      const request = store.getAll()

      request.onsuccess = () => {
        const results = request.result as StoredDataset[]
        const metadata = results.map((item) => ({
          id: item.id,
          filename: item.filename,
          createdAt: item.createdAt,
          rowCount: item.data.length,
        }))
        resolve(metadata)
      }
      request.onerror = () => reject(new Error("Failed to get all metadata"))
    })
  }
}
