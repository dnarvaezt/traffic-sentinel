"use client"

import { Download, FileSpreadsheet, FileText } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import type { Layout } from "react-grid-layout"
import { loadDatabaseData } from "@/core/dataset"
import type { FilterDefinition, WidgetConfig, WidgetType } from "@/core/project"
import { useProjectStore } from "@/modules/project/hooks/use-project-store"
import { Button } from "@/shared/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { useDashboardStore } from "../hooks/use-dashboard-store"
import { usePdfExport } from "../hooks/use-pdf-export"
import { useXlsxExport } from "../hooks/use-xlsx-export"
import { AddWidgetPanel } from "./AddWidgetPanel"
import { DashboardGrid } from "./DashboardGrid"
import { WIDGET_REGISTRY } from "./WidgetRegistry"

interface DashboardPageProps {
  projectId: string
}

export function DashboardPage({ projectId }: DashboardPageProps) {
  const project = useProjectStore((s) => s.projects.find((p) => p.id === projectId))
  const {
    selectedDatasetId,
    setSelectedDataset,
    addWidget,
    updateWidget,
    removeWidget,
    reorderWidgets,
  } = useDashboardStore()

  const [rawData, setRawData] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(false)

  const dashboard = project?.dashboards?.[0]
  const dataset = project?.databases?.find((d) => d.id === selectedDatasetId)
  const datasets = project?.databases ?? []

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

  const handleAddWidget = (type: WidgetType) => {
    const registry = WIDGET_REGISTRY[type]
    addWidget(projectId, type, registry.defaultConfig)
  }

  const handleWidgetUpdate = (widgetId: string, config: WidgetConfig) => {
    updateWidget(projectId, widgetId, { config })
  }

  const handleRemoveWidget = (widgetId: string) => {
    removeWidget(projectId, widgetId)
  }

  const handleLayoutChange = (layout: Layout) => {
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
  }

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

  const getWidgetData = (_widgetId: string) => {
    return rawData
  }

  const { exportPdf, exporting: pdfExporting } = usePdfExport()
  const { exportAllWidgets, exporting: xlsxExporting } = useXlsxExport()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Dashboard</h2>
        <div className="flex items-center gap-2">
          <Select value={selectedDatasetId || ""} onValueChange={setSelectedDataset}>
            <SelectTrigger className="w-[200px] h-8 text-xs">
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

          {dashboard && dashboard.widgets.length > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 h-8 text-xs"
                disabled={pdfExporting}
                onClick={() => exportPdf(dashboard.widgets, project?.name || "Dashboard")}
              >
                {pdfExporting ? (
                  <Download className="h-3.5 w-3.5 animate-pulse" />
                ) : (
                  <FileText className="h-3.5 w-3.5" />
                )}
                PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 h-8 text-xs"
                disabled={xlsxExporting}
                onClick={() => exportAllWidgets(dashboard.widgets, getWidgetData)}
              >
                {xlsxExporting ? (
                  <Download className="h-3.5 w-3.5 animate-pulse" />
                ) : (
                  <FileSpreadsheet className="h-3.5 w-3.5" />
                )}
                XLSX
              </Button>
            </>
          )}
        </div>
      </div>

      {!selectedDatasetId && (
        <div className="flex items-center justify-center h-40 border rounded-lg text-muted-foreground text-sm">
          Selecciona un dataset para comenzar
        </div>
      )}

      {selectedDatasetId && loading && (
        <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
          Cargando datos...
        </div>
      )}

      {selectedDatasetId && !loading && (!dashboard || dashboard.widgets.length === 0) && (
        <div className="flex flex-col items-center justify-center h-40 border rounded-lg text-muted-foreground text-sm gap-2">
          <p>No hay widgets configurados</p>
          <AddWidgetPanel onAdd={handleAddWidget} />
        </div>
      )}

      {selectedDatasetId && !loading && dashboard && dashboard.widgets.length > 0 && (
        <DashboardGrid
          widgets={widgetsWithFilters}
          data={rawData}
          columns={columns}
          onLayoutChange={handleLayoutChange}
          onWidgetUpdate={handleWidgetUpdate}
          onRemoveWidget={handleRemoveWidget}
        />
      )}
    </div>
  )
}
