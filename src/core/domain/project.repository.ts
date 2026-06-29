import { getIndexedDbClient } from "../db"
import type { Project } from "./project"
import { createProject } from "./project"

export type ProjectSortField = "name" | "createdAt" | "updatedAt" | "datasetCount"
export type SortOrder = "asc" | "desc"

export interface ProjectFilter {
  createdAfter?: Date
  createdBefore?: Date
  hasDatasets?: boolean
}

export interface ListOptions {
  page?: number
  pageSize?: number
  sortBy?: ProjectSortField
  sortOrder?: SortOrder
  search?: string
  filter?: ProjectFilter
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

const STORE = "projects"

export class ProjectStore {
  async create(name: string, description?: string): Promise<Project> {
    const project = createProject(name, description)
    await getIndexedDbClient().transaction(STORE, "readwrite", (store) =>
      store.add(structuredClone(project)),
    )
    return project
  }

  async read(id: string): Promise<Project | undefined> {
    const result = await getIndexedDbClient().transaction(STORE, "readonly", (store) =>
      store.get(id),
    )
    return (result as Project) ?? undefined
  }

  async update(
    id: string,
    updates: Partial<Pick<Project, "name" | "description">>,
  ): Promise<Project | undefined> {
    const existing = await this.read(id)
    if (!existing) return undefined
    const updated: Project = { ...existing, ...updates, updatedAt: new Date() }
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

  async list(options?: ListOptions): Promise<PaginatedResult<Project>> {
    const all = await getIndexedDbClient().transaction(STORE, "readonly", (store) => store.getAll())
    let result = (all as Project[]) ?? []

    if (options?.search) {
      const q = options.search.toLowerCase()
      result = result.filter((p) => p.name.toLowerCase().includes(q))
    }

    if (options?.filter) {
      const { createdAfter, createdBefore, hasDatasets } = options.filter
      if (createdAfter) result = result.filter((p) => p.createdAt >= createdAfter)
      if (createdBefore) result = result.filter((p) => p.createdAt <= createdBefore)
      if (hasDatasets !== undefined)
        result = result.filter((p) => (hasDatasets ? p.datasets.length > 0 : true))
    }

    const sortBy = options?.sortBy ?? "createdAt"
    const sortOrder = options?.sortOrder ?? "desc"
    result.sort((a, b) => {
      let cmp = 0
      switch (sortBy) {
        case "name":
          cmp = a.name.localeCompare(b.name)
          break
        case "createdAt":
          cmp = a.createdAt.getTime() - b.createdAt.getTime()
          break
        case "updatedAt":
          cmp = a.updatedAt.getTime() - b.updatedAt.getTime()
          break
        case "datasetCount":
          cmp = a.datasets.length - b.datasets.length
          break
      }
      return sortOrder === "asc" ? cmp : -cmp
    })

    const page = options?.page ?? 1
    const pageSize = options?.pageSize ?? 20
    const start = (page - 1) * pageSize
    const paged = result.slice(start, start + pageSize)

    return { data: paged, total: result.length, page, pageSize }
  }
}
