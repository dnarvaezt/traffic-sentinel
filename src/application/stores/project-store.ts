import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Dashboard, Dataset, Project, Relationship, Schema, TableDefinition } from "../types"

interface ProjectState {
  projects: Project[]
  activeProjectId: string | null
  activeDatasetId: string | null
  createProject: (name: string, description?: string) => Project
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  setActiveProject: (id: string | null) => void
  setActiveDataset: (id: string | null) => void
  updateSchema: (projectId: string, schema: Schema) => void
  addTable: (projectId: string, table: TableDefinition) => void
  updateTable: (projectId: string, tableId: string, table: Partial<TableDefinition>) => void
  deleteTable: (projectId: string, tableId: string) => void
  addRelationship: (projectId: string, relationship: Relationship) => void
  deleteRelationship: (projectId: string, relationshipId: string) => void
  addDataset: (projectId: string, dataset: Dataset) => void
  deleteDataset: (projectId: string, datasetId: string) => void
  addDashboard: (projectId: string, dashboard: Dashboard) => void
  updateDashboard: (projectId: string, dashboardId: string, updates: Partial<Dashboard>) => void
  deleteDashboard: (projectId: string, dashboardId: string) => void
  getProject: (id: string) => Project | undefined
  getDataset: (projectId: string, datasetId: string) => Dataset | undefined
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],
      activeProjectId: null,
      activeDatasetId: null,

      createProject: (name, description) => {
        const project: Project = {
          id: crypto.randomUUID(),
          name,
          description,
          schema: { tables: [], relationships: [] },
          datasets: [],
          dashboards: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set((state) => ({ projects: [...state.projects, project] }))
        return project
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p,
          ),
        }))
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          activeProjectId: state.activeProjectId === id ? null : state.activeProjectId,
        }))
      },

      setActiveProject: (id) => set({ activeProjectId: id }),
      setActiveDataset: (id) => set({ activeDatasetId: id }),

      updateSchema: (projectId, schema) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId ? { ...p, schema, updatedAt: new Date() } : p,
          ),
        }))
      },

      addTable: (projectId, table) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  schema: {
                    ...p.schema,
                    tables: [...p.schema.tables, table],
                  },
                  updatedAt: new Date(),
                }
              : p,
          ),
        }))
      },

      updateTable: (projectId, tableId, tableUpdates) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  schema: {
                    ...p.schema,
                    tables: p.schema.tables.map((t) =>
                      t.id === tableId ? { ...t, ...tableUpdates } : t,
                    ),
                  },
                  updatedAt: new Date(),
                }
              : p,
          ),
        }))
      },

      deleteTable: (projectId, tableId) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  schema: {
                    ...p.schema,
                    tables: p.schema.tables.filter((t) => t.id !== tableId),
                  },
                  updatedAt: new Date(),
                }
              : p,
          ),
        }))
      },

      addRelationship: (projectId, relationship) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  schema: {
                    ...p.schema,
                    relationships: [...p.schema.relationships, relationship],
                  },
                  updatedAt: new Date(),
                }
              : p,
          ),
        }))
      },

      deleteRelationship: (projectId, relationshipId) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  schema: {
                    ...p.schema,
                    relationships: p.schema.relationships.filter((r) => r.id !== relationshipId),
                  },
                  updatedAt: new Date(),
                }
              : p,
          ),
        }))
      },

      addDataset: (projectId, dataset) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? { ...p, datasets: [...p.datasets, dataset], updatedAt: new Date() }
              : p,
          ),
        }))
      },

      deleteDataset: (projectId, datasetId) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  datasets: p.datasets.filter((d) => d.id !== datasetId),
                  updatedAt: new Date(),
                }
              : p,
          ),
        }))
      },

      addDashboard: (projectId, dashboard) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? { ...p, dashboards: [...p.dashboards, dashboard], updatedAt: new Date() }
              : p,
          ),
        }))
      },

      updateDashboard: (projectId, dashboardId, updates) => {
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
        }))
      },

      deleteDashboard: (projectId, dashboardId) => {
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
        }))
      },

      getProject: (id) => get().projects.find((p) => p.id === id),
      getDataset: (projectId, datasetId) =>
        get()
          .projects.find((p) => p.id === projectId)
          ?.datasets.find((d) => d.id === datasetId),
    }),
    {
      name: "traffic-sentinel-projects",
    },
  ),
)
