"use client"

import { GridLayout, type Layout } from "react-grid-layout"
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"
import type { ColumnDefinition, Widget, WidgetConfig } from "@/core/project"
import { DashboardChartWidget } from "./dashboard-chart-widget"
import { DashboardFilterWidget } from "./dashboard-filter-widget"
import { DashboardTableWidget } from "./dashboard-table-widget"
import { MetricWidget } from "./metric-widget"

interface DashboardGridProps {
  widgets: Widget[]
  data: Record<string, unknown>[]
  columns: ColumnDefinition[]
  onLayoutChange: (layout: Layout) => void
  onWidgetUpdate: (widgetId: string, config: WidgetConfig) => void
  onRemoveWidget: (widgetId: string) => void
  onSettingsWidget?: (widget: Widget) => void
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
  onSettingsWidget,
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
          data,
          columns,
          config: widget.config,
          onConfigChange: (config: WidgetConfig) => onWidgetUpdate(widget.id, config),
          onRemove: () => onRemoveWidget(widget.id),
          onSettings: onSettingsWidget ? () => onSettingsWidget(widget) : undefined,
        }

        switch (widget.type) {
          case "chart":
            return (
              <div key={widget.id} className="drag-handle">
                <DashboardChartWidget key={widget.id} {...commonProps} config={widget.config} />
              </div>
            )
          case "metric":
            return (
              <div key={widget.id} className="drag-handle">
                <MetricWidget key={widget.id} {...commonProps} config={widget.config} />
              </div>
            )
          case "table":
            return (
              <div key={widget.id} className="drag-handle">
                <DashboardTableWidget key={widget.id} {...commonProps} config={widget.config} />
              </div>
            )
          case "filter":
            return (
              <div key={widget.id} className="drag-handle">
                <DashboardFilterWidget key={widget.id} {...commonProps} config={widget.config} />
              </div>
            )
          default:
            return null
        }
      })}
    </GridLayout>
  )
}
