"use client"

import { useState } from "react"
import * as XLSX from "xlsx"
import type { Widget } from "@/core/project"

export function useXlsxExport() {
  const [exporting, setExporting] = useState(false)

  const exportAllWidgets = async (
    widgets: Widget[],
    getWidgetData: (widgetId: string) => Record<string, unknown>[],
  ) => {
    setExporting(true)
    try {
      const wb = XLSX.utils.book_new()

      for (const widget of widgets) {
        const data = getWidgetData(widget.id)
        if (data.length === 0) continue

        const ws = XLSX.utils.json_to_sheet(data)
        const sheetName =
          widget.type === "chart"
            ? "Gráfico"
            : widget.type === "metric"
              ? "Métrica"
              : widget.type === "table"
                ? "Tabla"
                : "Filtro"
        XLSX.utils.book_append_sheet(wb, ws, `${sheetName} ${widget.id.slice(0, 4)}`)
      }

      XLSX.writeFile(wb, "dashboard-data.xlsx")
    } finally {
      setExporting(false)
    }
  }

  return { exportAllWidgets, exporting }
}
