"use client"

import { ChartPie, FileSpreadsheet, GripVertical } from "lucide-react"
import type { Database, WidgetType } from "@/core/project"
import { Button } from "@/shared/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { WIDGET_TYPES } from "./WidgetRegistry"

interface DashboardEmptyStatesProps {
  projectId: string
  hasColumns: boolean
  hasDatasets: boolean
  hasWidgets: boolean
  selectedDatasetId: string | null
  loading: boolean
  datasets: Database[]
  handleAddWidget: (type: WidgetType) => void
  setSelectedDataset: (id: string) => void
}

export function DashboardEmptyStates({
  projectId,
  hasColumns,
  hasDatasets,
  hasWidgets,
  selectedDatasetId,
  loading,
  datasets,
  handleAddWidget,
  setSelectedDataset,
}: DashboardEmptyStatesProps) {
  return (
    <>
      {/* Phase 1: No columns defined */}
      {!hasColumns && (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg text-muted-foreground text-sm gap-4">
          <GripVertical className="h-12 w-12 opacity-20" />
          <div className="text-center">
            <p className="font-medium text-foreground">Define columnas en Configuración</p>
            <p className="text-xs mt-1">
              Necesitas definir al menos una columna antes de usar el Dashboard.
            </p>
          </div>
          <Button variant="default" size="sm" asChild>
            <a href={`/projects/${projectId}?tab=config`}>Ir a Configuración</a>
          </Button>
        </div>
      )}

      {/* Phase 2: Columns defined but no datasets */}
      {hasColumns && !hasDatasets && (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg text-muted-foreground text-sm gap-4">
          <FileSpreadsheet className="h-12 w-12 opacity-20" />
          <div className="text-center">
            <p className="font-medium text-foreground">Sube un dataset</p>
            <p className="text-xs mt-1">Sube un archivo CSV para ver tus datos en el Dashboard.</p>
          </div>
          <Button variant="default" size="sm" asChild>
            <a href={`/projects/${projectId}?tab=datasets`}>Ir a Datasets</a>
          </Button>
        </div>
      )}

      {/* Phase 3: Dataset selected, loading */}
      {hasColumns && hasDatasets && !selectedDatasetId && (
        <div className="flex flex-col items-center justify-center h-40 border rounded-lg text-muted-foreground text-sm gap-4">
          <ChartPie className="h-10 w-10 opacity-30" />
          <p>Selecciona un dataset para comenzar</p>
          {datasets.length > 0 && (
            <Select value="" onValueChange={setSelectedDataset}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Elegir dataset..." />
              </SelectTrigger>
              <SelectContent>
                {datasets.map((ds) => (
                  <SelectItem key={ds.id} value={ds.id}>
                    {ds.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      {/* Phase 4: Data exists but no widgets (retained from existing) */}
      {selectedDatasetId && !loading && !hasWidgets && hasColumns && hasDatasets && (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg text-muted-foreground text-sm gap-4">
          <ChartPie className="h-12 w-12 opacity-20" />
          <div className="text-center">
            <p className="font-medium text-foreground">Crea tu primer widget</p>
            <p className="text-xs mt-1">Elige un tipo de widget para empezar</p>
          </div>
          <div className="flex gap-2">
            {WIDGET_TYPES.map((wt) => (
              <Button
                key={wt.type}
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => handleAddWidget(wt.type)}
              >
                <wt.icon className="h-4 w-4" />
                {wt.label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
