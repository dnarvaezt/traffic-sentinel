// ─── IndexedDB repository for raw dataset data ───────────────────────────────

const DB_NAME = "insighthub-databases"
const DB_VERSION = 1
const STORE_NAME = "databases"

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" })
      }
    }
  })
}

export interface DatasetRecord {
  id: string
  projectId: string
  data: Record<string, unknown>[]
}

export async function saveDatabaseData(database: DatasetRecord): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite")
    const store = transaction.objectStore(STORE_NAME)
    const request = store.put(database)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

export async function loadDatabaseData(id: string): Promise<DatasetRecord | undefined> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly")
    const store = transaction.objectStore(STORE_NAME)
    const request = store.get(id)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

export async function deleteDatabaseData(id: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite")
    const store = transaction.objectStore(STORE_NAME)
    const request = store.delete(id)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

export async function listDatabases(): Promise<DatasetRecord[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly")
    const store = transaction.objectStore(STORE_NAME)
    const request = store.getAll()
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}
