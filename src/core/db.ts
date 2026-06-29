export interface IndexedDbStoreConfig {
  name: string
  keyPath: string
  indexes?: { name: string; keyPath: string }[]
}

const STORE_CONFIGS: IndexedDbStoreConfig[] = [
  { name: "projects", keyPath: "id", indexes: [{ name: "by_name", keyPath: "name" }] },
  { name: "datasets", keyPath: "id", indexes: [{ name: "by_projectId", keyPath: "projectId" }] },
  { name: "dashboards", keyPath: "id", indexes: [{ name: "by_projectId", keyPath: "projectId" }] },
]

export class IndexedDbClient {
  private db: IDBDatabase | null = null
  private dbName: string
  private version: number

  constructor(dbName: string, version: number) {
    this.dbName = dbName
    this.version = version
  }

  async open(): Promise<IDBDatabase> {
    if (this.db) return this.db
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)
      request.onupgradeneeded = () => {
        const db = request.result
        for (const config of STORE_CONFIGS) {
          if (!db.objectStoreNames.contains(config.name)) {
            const store = db.createObjectStore(config.name, { keyPath: config.keyPath })
            for (const index of config.indexes ?? []) {
              store.createIndex(index.name, index.keyPath, { unique: false })
            }
          }
        }
      }
      request.onsuccess = () => {
        this.db = request.result
        resolve(this.db)
      }
      request.onerror = () => reject(request.error)
    })
  }

  async transaction<R>(
    storeName: string,
    mode: IDBTransactionMode,
    callback: (store: IDBObjectStore) => IDBRequest<R> | IDBRequest<R[]>,
  ): Promise<R | R[]> {
    const db = await this.open()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, mode)
      const store = transaction.objectStore(storeName)
      const request = callback(store)
      transaction.oncomplete = () => resolve(request.result as R | R[])
      transaction.onerror = () => reject(transaction.error)
    })
  }

  close(): void {
    this.db?.close()
    this.db = null
  }
}

let _instance: IndexedDbClient | null = null

export function getIndexedDbClient(): IndexedDbClient {
  if (!_instance) {
    _instance = new IndexedDbClient("insighthub", 2)
  }
  return _instance
}
