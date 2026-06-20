"use client"

import { create } from "zustand"
import type { FilterDefinition, Widget, WidgetConfig, WidgetType } from "@/core/project"
import { useProjectStore } from "@/modules/project/hooks/use-project-store"

interface DashboardState {
  selectedDatasetId: string | null
  sharedFilters: FilterDefinition[]
  setSelectedDataset: (datasetId: string | null) => void
  addSharedFilter: (filter: FilterDefinition) => void
  updateSharedFilter: (filterId: string, updates: Partial<FilterDefinition>) => void
  removeSharedFilter: (filterId: string) => void
  clearSharedFilters: () => void
  addWidget: (projectId: string, type: WidgetType, config: WidgetConfig) => void
  updateWidget: (projectId: string, widgetId: string, updates: Partial<Widget>) => void
  removeWidget: (projectId: string, widgetId: string) => void
  reorderWidgets: (projectId: string, widgets: Widget[]) => void
  getOrCreateDashboard: (projectId: string) => { id: string }
}

export const useDashboardStore = create<DashboardState>()((set, get) => ({
  selectedDatasetId: null,
  sharedFilters: [],

  setSelectedDataset: (datasetId) => set({ selectedDatasetId: datasetId }),

  addSharedFilter: (filter) =>
    set((state) => ({ sharedFilters: [...state.sharedFilters, filter] })),

  updateSharedFilter: (filterId, updates) =>
    set((state) => ({
      sharedFilters: state.sharedFilters.map((f) => (f.id === filterId ? { ...f, ...updates } : f)),
    })),

  removeSharedFilter: (filterId) =>
    set((state) => ({
      sharedFilters: state.sharedFilters.filter((f) => f.id !== filterId),
    })),

  clearSharedFilters: () => set({ sharedFilters: [] }),

  getOrCreateDashboard: (projectId) => {
    const project = useProjectStore.getState().getProject(projectId)
    if (!project) return { id: "" }

    let dashboard = project.dashboards?.[0]
    if (!dashboard) {
      dashboard = {
        id: crypto.randomUUID(),
        projectId,
        name: "Dashboard Principal",
        widgets: [],
      }
      useProjectStore.getState().addDashboard(projectId, dashboard)
    }
    return { id: dashboard.id }
  },

  addWidget: (projectId, type, config) => {
    const { getOrCreateDashboard } = get()
    const { id: dashboardId } = getOrCreateDashboard(projectId)
    if (!dashboardId) return

    const dashboard = useProjectStore
      .getState()
      .getProject(projectId)
      ?.dashboards?.find((d) => d.id === dashboardId)
    const existingWidgets = dashboard?.widgets ?? []
    const count = existingWidgets.length

    const widget: Widget = {
      id: crypto.randomUUID(),
      type,
      config,
      position: {
        x: (count * 2) % 12,
        y: Math.floor(count / 2) * 6,
        width: 6,
        height: 4,
      },
    }

    useProjectStore.getState().updateDashboard(projectId, dashboardId, {
      widgets: [...existingWidgets, widget],
    })
  },

  updateWidget: (projectId, widgetId, updates) => {
    const project = useProjectStore.getState().getProject(projectId)
    const dashboard = project?.dashboards?.[0]
    if (!dashboard) return

    useProjectStore.getState().updateDashboard(projectId, dashboard.id, {
      widgets: dashboard.widgets.map((w) => (w.id === widgetId ? { ...w, ...updates } : w)),
    })
  },

  removeWidget: (projectId, widgetId) => {
    const project = useProjectStore.getState().getProject(projectId)
    const dashboard = project?.dashboards?.[0]
    if (!dashboard) return

    useProjectStore.getState().updateDashboard(projectId, dashboard.id, {
      widgets: dashboard.widgets.filter((w) => w.id !== widgetId),
    })
  },

  reorderWidgets: (projectId, widgets) => {
    const project = useProjectStore.getState().getProject(projectId)
    const dashboard = project?.dashboards?.[0]
    if (!dashboard) return

    useProjectStore.getState().updateDashboard(projectId, dashboard.id, { widgets })
  },
}))
