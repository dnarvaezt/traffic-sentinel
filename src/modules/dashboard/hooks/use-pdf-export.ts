"use client"

import { jsPDF } from "jspdf"
import { useRef, useState } from "react"
import type { Widget } from "@/core/project"

export function usePdfExport() {
  const [exporting, setExporting] = useState(false)
  const dashboardRef = useRef<HTMLDivElement>(null)

  const exportPdf = async (widgets: Widget[], title: string) => {
    setExporting(true)
    try {
      const pdf = new jsPDF("l", "mm", "a4")
      const pageWidth = pdf.internal.pageSize.getWidth()
      let y = 20

      pdf.setFontSize(18)
      pdf.text(title, pageWidth / 2, y, { align: "center" })
      y += 15

      for (let i = 0; i < widgets.length; i++) {
        if (y > 180) {
          pdf.addPage()
          y = 20
        }

        pdf.setFontSize(12)
        pdf.text(`Widget ${i + 1}: ${widgets[i].type}`, 14, y)
        y += 15

        const elements = document.querySelectorAll(`[data-widget-id="${widgets[i].id}"]`)
        if (elements.length > 0) {
          try {
            const html2canvas = (await import("html2canvas")).default
            const canvas = await html2canvas(elements[0] as HTMLElement)
            const imgData = canvas.toDataURL("image/png")
            const imgWidth = pageWidth - 28
            const imgHeight = (canvas.height / canvas.width) * imgWidth
            pdf.addImage(imgData, "PNG", 14, y, imgWidth, Math.min(imgHeight, 80))
            y += Math.min(imgHeight, 80) + 10
          } catch {
            pdf.setFontSize(10)
            pdf.text("(No se pudo capturar la imagen del widget)", 14, y)
            y += 10
          }
        }
      }

      pdf.save("dashboard-report.pdf")
    } finally {
      setExporting(false)
    }
  }

  return { exportPdf, exporting, dashboardRef }
}
