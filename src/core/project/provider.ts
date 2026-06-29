import { ProjectStore } from "./repository"

export function createProjectRepository(): ProjectStore {
  return new ProjectStore()
}
