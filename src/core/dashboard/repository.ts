import { getIndexedDbClient } from "../db"
import type { Dashboard } from "./interface"
import { createDashboard } from "./interface"

const STORE = "dashboards"

export class DashboardStore {
  async create(projectId: string, name: string): Promise<Dashboard> {
    const dashboard = createDashboard(projectId, name)
    await getIndexedDbClient().transaction(STORE, "readwrite", (store) =>
      store.add(structuredClone(dashboard)),
    )
    return dashboard
  }

  async read(id: string): Promise<Dashboard | undefined> {
    const result = await getIndexedDbClient().transaction(STORE, "readonly", (store) =>
      store.get(id),
    )
    return (result as Dashboard) ?? undefined
  }

  async update(
    id: string,
    updates: Partial<Pick<Dashboard, "name" | "widgets">>,
  ): Promise<Dashboard | undefined> {
    const existing = await this.read(id)
    if (!existing) return undefined
    const updated: Dashboard = { ...existing, ...updates, updatedAt: new Date() }
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

  async listByProject(projectId: string): Promise<Dashboard[]> {
    const db = await getIndexedDbClient().open()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE, "readonly")
      const store = transaction.objectStore(STORE)
      const index = store.index("by_projectId")
      const request = index.getAll(projectId)
      transaction.oncomplete = () => resolve(request.result as Dashboard[])
      transaction.onerror = () => reject(transaction.error)
    })
  }
}
