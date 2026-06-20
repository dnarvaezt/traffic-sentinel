"use client"

import { useMemo } from "react"
import { loadDatabaseData } from "@/core/dataset"
import { useProjectStore } from "@/modules/project/hooks/use-project-store"
import { useDashboardStore } from "./use-dashboard-store"

export function useDashboardData(projectId: string) {
  const { selectedDatasetId } = useDashboardStore()
  const project = useProjectStore((s) => s.projects.find((p) => p.id === projectId))
  const dataset = project?.databases?.find((d) => d.id === selectedDatasetId)

  const rawData = useMemo(async () => {
    if (!selectedDatasetId) return []
    const record = await loadDatabaseData(selectedDatasetId)
    return record?.data ?? []
  }, [selectedDatasetId])

  return {
    project,
    dataset,
    rawData,
    columns: dataset?.columns ?? [],
    datasets: project?.databases ?? [],
  }
}
