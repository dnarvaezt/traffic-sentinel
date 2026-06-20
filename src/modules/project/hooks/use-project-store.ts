import { create } from "zustand"
import { persist } from "zustand/middleware"
import type {
  ColumnDefinition,
  Dashboard,
  Database,
  FilterDefinition,
  Mapping,
  Project,
  Schema,
} from "@/core/project"
import type { SchemaDefinition } from "@/data-import/domain/models/schema"

interface ProjectState {
  projects: Project[]
  activeProjectId: string | null
  activeDatabaseId: string | null
  createProject: (name: string, description?: string) => Project
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  setActiveProject: (id: string | null) => void
  setActiveDatabase: (id: string | null) => void
  updateSchema: (projectId: string, schema: Schema) => void
  addColumn: (projectId: string, column: ColumnDefinition) => void
  updateColumn: (projectId: string, columnId: string, updates: Partial<ColumnDefinition>) => void
  deleteColumn: (projectId: string, columnId: string) => void
  addDatabase: (projectId: string, database: Database) => void
  updateDatabase: (projectId: string, databaseId: string, updates: Partial<Database>) => void
  deleteDatabase: (projectId: string, databaseId: string) => void
  addFilter: (projectId: string, filter: FilterDefinition) => void
  updateFilter: (projectId: string, filterId: string, updates: Partial<FilterDefinition>) => void
  deleteFilter: (projectId: string, filterId: string) => void
  addMapping: (projectId: string, mapping: Mapping) => void
  deleteMapping: (projectId: string, mappingId: string) => void
  addDashboard: (projectId: string, dashboard: Dashboard) => void
  updateDashboard: (projectId: string, dashboardId: string, updates: Partial<Dashboard>) => void
  deleteDashboard: (projectId: string, dashboardId: string) => void
  updateImportConfig: (projectId: string, config: SchemaDefinition) => void
  getProject: (id: string) => Project | undefined
  getDatabase: (projectId: string, databaseId: string) => Database | undefined
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],
      activeProjectId: null,
      activeDatabaseId: null,

      createProject: (name, description) => {
        const project: Project = {
          id: crypto.randomUUID(),
          name,
          description,
          schema: { columns: [] },
          importConfig: {
            columns: [],
            validators: [],
            filters: [],
            groups: [],
            calculations: [],
            transformers: [],
          },
          databases: [],
          filters: [],
          metrics: [],
          groupBys: [],
          sorts: [],
          mappings: [],
          dashboards: [],
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
          activeProjectId: state.activeProjectId === id ? null : state.activeProjectId,
        })),

      setActiveProject: (id) => set({ activeProjectId: id }),
      setActiveDatabase: (id) => set({ activeDatabaseId: id }),

      updateSchema: (projectId, schema) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId ? { ...p, schema, updatedAt: new Date() } : p,
          ),
        })),

      addColumn: (projectId, column) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  schema: { ...p.schema, columns: [...(p.schema?.columns ?? []), column] },
                  updatedAt: new Date(),
                }
              : p,
          ),
        })),

      updateColumn: (projectId, columnId, updates) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  schema: {
                    ...p.schema,
                    columns: (p.schema?.columns ?? []).map((c) =>
                      c.id === columnId ? { ...c, ...updates } : c,
                    ),
                  },
                  updatedAt: new Date(),
                }
              : p,
          ),
        })),

      deleteColumn: (projectId, columnId) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  schema: {
                    ...p.schema,
                    columns: (p.schema?.columns ?? []).filter((c) => c.id !== columnId),
                  },
                  updatedAt: new Date(),
                }
              : p,
          ),
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

      addMapping: (projectId, mapping) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? { ...p, mappings: [...(p.mappings || []), mapping], updatedAt: new Date() }
              : p,
          ),
        })),

      deleteMapping: (projectId, mappingId) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  mappings: (p.mappings || []).filter((m) => m.id !== mappingId),
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

      updateImportConfig: (projectId, config) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId ? { ...p, importConfig: config, updatedAt: new Date() } : p,
          ),
        })),

      getProject: (id) => get().projects.find((p) => p.id === id),
      getDatabase: (projectId, databaseId) =>
        get()
          .projects.find((p) => p.id === projectId)
          ?.databases?.find((d) => d.id === databaseId),
    }),
    { name: "insighthub-projects" },
  ),
)
