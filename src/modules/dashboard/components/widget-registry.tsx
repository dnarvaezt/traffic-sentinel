"use client"

import { ChartPie, Filter, Table2, TrendingUp } from "lucide-react"
import type { WidgetConfig, WidgetType } from "@/core/project"

export interface WidgetRegistration {
  type: WidgetType
  label: string
  icon: React.ComponentType<{ className?: string }>
  defaultConfig: WidgetConfig
}

export const WIDGET_REGISTRY: Record<WidgetType, WidgetRegistration> = {
  chart: {
    type: "chart",
    label: "Gráfico",
    icon: ChartPie,
    defaultConfig: {
      chartType: "bar",
    },
  },
  metric: {
    type: "metric",
    label: "Métrica",
    icon: TrendingUp,
    defaultConfig: {
      metrics: [{ id: "metric-1", columnId: "", aggregation: "sum" }],
    },
  },
  table: {
    type: "table",
    label: "Tabla",
    icon: Table2,
    defaultConfig: {},
  },
  filter: {
    type: "filter",
    label: "Filtro",
    icon: Filter,
    defaultConfig: {},
  },
}

export const WIDGET_TYPES = Object.values(WIDGET_REGISTRY)
