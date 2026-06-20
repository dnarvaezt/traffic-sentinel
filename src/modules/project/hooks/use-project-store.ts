import { create } from "zustand"
import { persist } from "zustand/middleware"
import type {
  ColumnDefinition,
  Dashboard,
  Database,
  FilterDefinition,
  Project,
} from "@/core/project"
import type { SchemaDefinition as SchemaDef } from "@/data-import/domain/models/schema"

function migrateProject(project: Project): Project {
  const hasConfig = !!(project as any).config?.columns?.length
  const columns = hasConfig
    ? (project as any).config.columns
    : ((project as any).schema?.columns ?? []).map((c: any) => ({
        id: c.id,
        header: c.name,
        type: c.type as ColumnDefinition["type"],
        tooltip: c.label || undefined,
      }))
  const config: SchemaDef = hasConfig
    ? (project as any).config
    : {
        columns,
        groups: (project as any).importConfig?.groups ?? [],
      }
  return {
    ...project,
    config,
    wizardCompleted:
      project.wizardCompleted ?? (columns.length > 0 && (project.databases?.length ?? 0) > 0),
  }
}

interface ProjectState {
  projects: Project[]
  activeProjectId: string | null
  activeDatabaseId: string | null
  createProject: (name: string, description?: string) => Project
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  addDatabase: (projectId: string, database: Database) => void
  updateDatabase: (projectId: string, databaseId: string, updates: Partial<Database>) => void
  deleteDatabase: (projectId: string, databaseId: string) => void
  addFilter: (projectId: string, filter: FilterDefinition) => void
  updateFilter: (projectId: string, filterId: string, updates: Partial<FilterDefinition>) => void
  deleteFilter: (projectId: string, filterId: string) => void
  addDashboard: (projectId: string, dashboard: Dashboard) => void
  updateDashboard: (projectId: string, dashboardId: string, updates: Partial<Dashboard>) => void
  deleteDashboard: (projectId: string, dashboardId: string) => void
  updateConfig: (projectId: string, config: SchemaDef) => void
  getProject: (id: string) => Project | undefined
  getDatabase: (projectId: string, databaseId: string) => Database | undefined
  setWizardCompleted: (projectId: string, completed: boolean) => void
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => {
      // Migrate existing persisted projects on load
      const stored =
        typeof window !== "undefined" ? localStorage.getItem("insighthub-projects") : null
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (parsed?.state?.projects) {
            parsed.state.projects = parsed.state.projects.map(migrateProject)
            localStorage.setItem("insighthub-projects", JSON.stringify(parsed))
          }
        } catch {
          /* ignore parse errors */
        }
      }

      return {
        projects: [],
        activeProjectId: null,
        activeDatabaseId: null,

        createProject: (name, description) => {
          const config: SchemaDef = {
            columns: [],
            groups: [],
          }
          const project: Project = {
            id: crypto.randomUUID(),
            name,
            description,
            config,
            databases: [],
            filters: [],
            dashboards: [],
            wizardCompleted: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
          set((state) => ({ projects: [...state.projects, project] }))
          return project
        },

        updateProject: (id, updates) =>
          set((state) => ({
            projects: state.projects.map((p) =>
              p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p,
            ),
          })),

        deleteProject: (id) =>
          set((state) => ({
            projects: state.projects.filter((p) => p.id !== id),
          })),

        addDatabase: (projectId, database) =>
          set((state) => ({
            projects: state.projects.map((p) =>
              p.id === projectId
                ? { ...p, databases: [...(p.databases || []), database], updatedAt: new Date() }
                : p,
            ),
          })),

        updateDatabase: (projectId, databaseId, updates) =>
          set((state) => ({
            projects: state.projects.map((p) =>
              p.id === projectId
                ? {
                    ...p,
                    databases: (p.databases || []).map((d) =>
                      d.id === databaseId ? { ...d, ...updates } : d,
                    ),
                    updatedAt: new Date(),
                  }
                : p,
            ),
          })),

        deleteDatabase: (projectId, databaseId) =>
          set((state) => ({
            projects: state.projects.map((p) =>
              p.id === projectId
                ? {
                    ...p,
                    databases: (p.databases || []).filter((d) => d.id !== databaseId),
                    updatedAt: new Date(),
                  }
                : p,
            ),
          })),

        addFilter: (projectId, filter) =>
          set((state) => ({
            projects: state.projects.map((p) =>
              p.id === projectId
                ? { ...p, filters: [...(p.filters || []), filter], updatedAt: new Date() }
                : p,
            ),
          })),

        updateFilter: (projectId, filterId, updates) =>
          set((state) => ({
            projects: state.projects.map((p) =>
              p.id === projectId
                ? {
                    ...p,
                    filters: (p.filters || []).map((f) =>
                      f.id === filterId ? { ...f, ...updates } : f,
                    ),
                    updatedAt: new Date(),
                  }
                : p,
            ),
          })),

        deleteFilter: (projectId, filterId) =>
          set((state) => ({
            projects: state.projects.map((p) =>
              p.id === projectId
                ? {
                    ...p,
                    filters: (p.filters || []).filter((f) => f.id !== filterId),
                    updatedAt: new Date(),
                  }
                : p,
            ),
          })),

        addDashboard: (projectId, dashboard) =>
          set((state) => ({
            projects: state.projects.map((p) =>
              p.id === projectId
                ? { ...p, dashboards: [...p.dashboards, dashboard], updatedAt: new Date() }
                : p,
            ),
          })),

        updateDashboard: (projectId, dashboardId, updates) =>
          set((state) => ({
            projects: state.projects.map((p) =>
              p.id === projectId
                ? {
                    ...p,
                    dashboards: p.dashboards.map((d) =>
                      d.id === dashboardId ? { ...d, ...updates } : d,
                    ),
                    updatedAt: new Date(),
                  }
                : p,
            ),
          })),

        deleteDashboard: (projectId, dashboardId) =>
          set((state) => ({
            projects: state.projects.map((p) =>
              p.id === projectId
                ? {
                    ...p,
                    dashboards: p.dashboards.filter((d) => d.id !== dashboardId),
                    updatedAt: new Date(),
                  }
                : p,
            ),
          })),

        updateConfig: (projectId, config) =>
          set((state) => ({
            projects: state.projects.map((p) =>
              p.id === projectId ? { ...p, config, updatedAt: new Date() } : p,
            ),
          })),

        setWizardCompleted: (projectId, completed) =>
          set((state) => ({
            projects: state.projects.map((p) =>
              p.id === projectId ? { ...p, wizardCompleted: completed, updatedAt: new Date() } : p,
            ),
          })),

        getProject: (id) => {
          const project = get().projects.find((p) => p.id === id)
          return project ? migrateProject(project) : undefined
        },
        getDatabase: (projectId, databaseId) =>
          get()
            .projects.find((p) => p.id === projectId)
            ?.databases?.find((d) => d.id === databaseId),
      }
    },
    { name: "insighthub-projects" },
  ),
)
