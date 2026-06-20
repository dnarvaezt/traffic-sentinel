"use client"

import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"
import type { Layout } from "react-grid-layout"
import { loadDatabaseData } from "@/core/dataset"
import type { FilterDefinition, Widget, WidgetConfig, WidgetType } from "@/core/project"
import { useProjectStore } from "@/modules/project/hooks/use-project-store"
import { Button } from "@/shared/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/shared/components/ui/sheet"
import { useDashboardStore } from "../hooks/use-dashboard-store"
import { AddWidgetPanel } from "./AddWidgetPanel"
import { DashboardEmptyStates } from "./DashboardEmptyStates"
import { DashboardGrid } from "./DashboardGrid"
import { WIDGET_REGISTRY, WIDGET_TYPES } from "./WidgetRegistry"

interface DashboardPageProps {
  projectId: string
}

export function DashboardPage({ projectId }: DashboardPageProps) {
  const searchParams = useSearchParams()
  const project = useProjectStore((s) => s.projects.find((p) => p.id === projectId))
  const {
    selectedDatasetId,
    setSelectedDataset,
    addWidget,
    updateWidget,
    removeWidget,
    reorderWidgets,
  } = useDashboardStore()

  useEffect(() => {
    const datasetParam = searchParams.get("dataset")
    if (datasetParam) {
      setSelectedDataset(datasetParam)
    }
  }, [searchParams, setSelectedDataset])

  const [rawData, setRawData] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(false)
  const [settingsWidget, setSettingsWidget] = useState<Widget | null>(null)

  const dashboard = project?.dashboards?.[0]
  const dataset = project?.databases?.find((d) => d.id === selectedDatasetId)
  const datasets = project?.databases ?? []

  const hasColumns = (project?.config?.columns?.length ?? 0) > 0
  const hasDatasets = datasets.length > 0
  const hasWidgets = (dashboard?.widgets?.length ?? 0) > 0

  const columns = dataset?.columns ?? []

  useEffect(() => {
    if (selectedDatasetId && datasets.length > 0 && !dataset) {
      setSelectedDataset(datasets[0].id)
    }
  }, [selectedDatasetId, datasets, dataset, setSelectedDataset])

  useEffect(() => {
    if (!selectedDatasetId) {
      setRawData([])
      return
    }
    setLoading(true)
    loadDatabaseData(selectedDatasetId)
      .then((record) => {
        setRawData(record?.data ?? [])
      })
      .finally(() => setLoading(false))
  }, [selectedDatasetId])

  const handleAddWidget = useCallback(
    (type: WidgetType) => {
      const registry = WIDGET_REGISTRY[type]
      addWidget(projectId, type, registry.defaultConfig)
    },
    [projectId, addWidget],
  )

  const handleWidgetUpdate = useCallback(
    (widgetId: string, config: WidgetConfig) => {
      updateWidget(projectId, widgetId, { config })
    },
    [projectId, updateWidget],
  )

  const handleRemoveWidget = useCallback(
    (widgetId: string) => {
      removeWidget(projectId, widgetId)
    },
    [projectId, removeWidget],
  )

  const handleLayoutChange = useCallback(
    (layout: Layout) => {
      if (!dashboard) return
      const updated = dashboard.widgets.map((w) => {
        const item = layout.find((l) => l.i === w.id)
        if (!item) return w
        return {
          ...w,
          position: { x: item.x, y: item.y, width: item.w, height: item.h },
        }
      })
      reorderWidgets(projectId, updated)
    },
    [dashboard, projectId, reorderWidgets],
  )

  const sharedFilters = useMemo(() => {
    if (!dashboard) return [] as FilterDefinition[]
    const filterWidgets = dashboard.widgets.filter((w) => w.type === "filter")
    return filterWidgets.flatMap((w) => w.config.filters || [])
  }, [dashboard])

  const widgetsWithFilters = useMemo(() => {
    if (!dashboard) return []
    return dashboard.widgets.map((w) => {
      if (w.type === "filter") return w
      return {
        ...w,
        config: {
          ...w.config,
          filters: [...(sharedFilters || []), ...(w.config.filters || [])],
        },
      }
    })
  }, [dashboard, sharedFilters])

  const settingsWidgetType = settingsWidget
    ? WIDGET_TYPES.find((wt) => wt.type === settingsWidget.type)
    : null

  return (
    <div className="space-y-4">
      {/* Header toolbar - always visible */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Dashboard</h2>
        <div className="flex items-center gap-2">
          <Select value={selectedDatasetId || ""} onValueChange={setSelectedDataset}>
            <SelectTrigger className="w-[180px] h-8 text-xs">
              <SelectValue placeholder="Seleccionar dataset" />
            </SelectTrigger>
            <SelectContent>
              {datasets.map((ds) => (
                <SelectItem key={ds.id} value={ds.id}>
                  {ds.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <AddWidgetPanel onAdd={handleAddWidget} />
        </div>
      </div>

      {/* Quick-add toolbar */}
      {selectedDatasetId && !loading && (
        <div className="flex items-center gap-2 p-2 border rounded-lg bg-muted/20">
          <span className="text-xs text-muted-foreground shrink-0">Añadir widget:</span>
          {WIDGET_TYPES.map((wt) => (
            <Button
              key={wt.type}
              variant="ghost"
              size="sm"
              className="gap-1.5 h-7 text-xs"
              onClick={() => handleAddWidget(wt.type)}
            >
              <wt.icon className="h-3.5 w-3.5" />
              {wt.label}
            </Button>
          ))}
        </div>
      )}

      <DashboardEmptyStates
        projectId={projectId}
        hasColumns={hasColumns}
        hasDatasets={hasDatasets}
        hasWidgets={hasWidgets}
        selectedDatasetId={selectedDatasetId}
        loading={loading}
        datasets={datasets}
        handleAddWidget={handleAddWidget}
        setSelectedDataset={setSelectedDataset}
      />

      {/* Loading state */}
      {selectedDatasetId && loading && (
        <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
          Cargando datos...
        </div>
      )}

      {/* Dashboard grid */}
      {selectedDatasetId && !loading && hasWidgets && (
        <DashboardGrid
          widgets={widgetsWithFilters}
          data={rawData}
          columns={columns}
          onLayoutChange={handleLayoutChange}
          onWidgetUpdate={handleWidgetUpdate}
          onRemoveWidget={handleRemoveWidget}
          onSettingsWidget={(w) => setSettingsWidget(w)}
        />
      )}

      {/* Widget settings sheet */}
      <Sheet
        open={!!settingsWidget}
        onOpenChange={(open) => {
          if (!open) setSettingsWidget(null)
        }}
      >
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{settingsWidgetType?.label || "Widget"} — Configuración</SheetTitle>
            <SheetDescription>Personaliza las opciones de este widget.</SheetDescription>
          </SheetHeader>
          <div className="py-4 text-sm text-muted-foreground">
            {settingsWidget && (
              <p>
                Configuración del widget <strong>{settingsWidget.id}</strong>. Los cambios se
                aplican en tiempo real.
              </p>
            )}
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Cerrar</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
