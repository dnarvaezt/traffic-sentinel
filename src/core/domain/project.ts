import type { Dashboard } from "./dashboard"
import type { Dataset } from "./dataset"
import type { Schema } from "./schema"
import { createSchema } from "./schema"

export interface Project {
  id: string
  name: string
  description?: string
  schema: Schema
  datasets: Dataset[]
  dashboards: Dashboard[]
  createdAt: Date
  updatedAt: Date
}

export function createProject(name: string, description?: string): Project {
  return {
    id: crypto.randomUUID(),
    name,
    description,
    schema: createSchema(),
    datasets: [],
    dashboards: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}
