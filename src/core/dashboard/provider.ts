import { DashboardStore } from "./repository"

export function createDashboardRepository(): DashboardStore {
  return new DashboardStore()
}
