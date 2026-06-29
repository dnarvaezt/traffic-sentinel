// ─── IndexedDB repository for import pipeline results ────────────────────────

import type { ValidationError } from "@/core/data-import/domain/models/validation"

const DB_NAME = "insighthub-pipeline"
const DB_VERSION = 1
const STORE_NAME = "pipeline-results"

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" })
        store.createIndex("projectId", "projectId", { unique: false })
      }
    }
  })
}

export function buildPipelineKey(projectId: string, databaseId: string): string {
  return `${projectId}::${databaseId}`
}

export interface StoredPipelineResult {
  id: string
  projectId: string
  databaseId: string
  rawData: Record<string, unknown>[]
  transformedData: Record<string, unknown>[]
  calculatedData: Record<string, unknown>[]
  errors: ValidationError[]
}

export async function savePipelineResult(result: StoredPipelineResult): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite")
    const store = transaction.objectStore(STORE_NAME)
    const request = store.put(result)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

export async function loadPipelineResult(
  projectId: string,
  databaseId: string,
): Promise<StoredPipelineResult | undefined> {
  const db = await openDB()
  const id = buildPipelineKey(projectId, databaseId)
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly")
    const store = transaction.objectStore(STORE_NAME)
    const request = store.get(id)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

export async function deletePipelineResult(projectId: string, databaseId: string): Promise<void> {
  const db = await openDB()
  const id = buildPipelineKey(projectId, databaseId)
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite")
    const store = transaction.objectStore(STORE_NAME)
    const request = store.delete(id)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

export async function listProjectPipelineResults(
  projectId: string,
): Promise<StoredPipelineResult[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly")
    const store = transaction.objectStore(STORE_NAME)
    const index = store.index("projectId")
    const request = index.getAll(projectId)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}
