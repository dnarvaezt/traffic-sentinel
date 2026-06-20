"use client"

import { GridLayout, type Layout } from "react-grid-layout"
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"
import type { Widget, WidgetConfig } from "@/core/project"
import { DashboardChartWidget } from "./DashboardChartWidget"
import { DashboardFilterWidget } from "./DashboardFilterWidget"
import { DashboardTableWidget } from "./DashboardTableWidget"
import { MetricWidget } from "./MetricWidget"

interface DashboardGridProps {
  widgets: Widget[]
  data: Record<string, unknown>[]
  columns: { name: string; label?: string; inferredType?: string }[]
  onLayoutChange: (layout: Layout) => void
  onWidgetUpdate: (widgetId: string, config: WidgetConfig) => void
  onRemoveWidget: (widgetId: string) => void
}

const COLUMNS = 12
const ROW_HEIGHT = 100

export function DashboardGrid({
  widgets,
  data,
  columns,
  onLayoutChange,
  onWidgetUpdate,
  onRemoveWidget,
}: DashboardGridProps) {
  const layout: Layout = widgets.map((w) => ({
    i: w.id,
    x: w.position.x,
    y: w.position.y,
    w: w.position.width,
    h: w.position.height,
    minW: 2,
    minH: 2,
  }))

  return (
    <GridLayout
      layout={layout}
      width={1200}
      gridConfig={{ cols: COLUMNS, rowHeight: ROW_HEIGHT }}
      onLayoutChange={onLayoutChange}
      dragConfig={{ enabled: true, handle: ".drag-handle" }}
    >
      {widgets.map((widget) => {
        const commonProps = {
          key: widget.id,
          data,
          columns,
          config: widget.config,
          onConfigChange: (config: WidgetConfig) => onWidgetUpdate(widget.id, config),
          onRemove: () => onRemoveWidget(widget.id),
        }

        switch (widget.type) {
          case "chart":
            return (
              <div key={widget.id} className="drag-handle">
                <DashboardChartWidget {...commonProps} config={widget.config} />
              </div>
            )
          case "metric":
            return (
              <div key={widget.id} className="drag-handle">
                <MetricWidget {...commonProps} config={widget.config} />
              </div>
            )
          case "table":
            return (
              <div key={widget.id} className="drag-handle">
                <DashboardTableWidget {...commonProps} config={widget.config} />
              </div>
            )
          case "filter":
            return (
              <div key={widget.id} className="drag-handle">
                <DashboardFilterWidget {...commonProps} config={widget.config} />
              </div>
            )
          default:
            return null
        }
      })}
    </GridLayout>
  )
}
