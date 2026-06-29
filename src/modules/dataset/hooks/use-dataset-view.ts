"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { executeQuery, loadDatabaseData } from "@/core/dataset"
import type { FilterItem, FilterOperator, SortDefinition } from "@/core/project"
import { useProjectStore } from "@/modules/project"

const NO_VALUE_OPS = new Set<FilterOperator>(["isNull", "isNotNull"])

export function useDatasetView() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const datasetId = params.datasetId as string

  const { getProject, addFilter: saveFilterToProject } = useProjectStore()
  const [mounted, setMounted] = useState(false)
  const [rawData, setRawData] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [sessionFilters, setSessionFilters] = useState<FilterItem[]>([])
  const [quickFilters, setQuickFilters] = useState<FilterItem[]>([])
  const [sorts, setSorts] = useState<SortDefinition[]>([])
  const [panelOpen, setPanelOpen] = useState(false)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [saveName, setSaveName] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  const project = getProject(projectId)
  const dataset = project?.databases?.find((d) => d.id === datasetId)

  useEffect(() => {
    if (!datasetId) return
    setLoading(true)
    loadDatabaseData(datasetId)
      .then((loaded) => {
        if (loaded) setRawData(loaded.data)
      })
      .finally(() => setLoading(false))
  }, [datasetId])

  const columns = useMemo(
    () =>
      (dataset?.columns ?? []).map((col) => ({
        id: col.id,
        header: col.header,
        tooltip: col.header,
        type: col.type ?? "string",
      })),
    [dataset],
  )

  const processedData = useMemo(() => {
    if (rawData.length === 0) return []
    const activeSessionFilters = sessionFilters.filter(
      (f) =>
        NO_VALUE_OPS.has(f.operator) ||
        String(f.value ?? "").trim() !== "" ||
        Array.isArray(f.value),
    )
    return executeQuery(rawData, { filters: [...activeSessionFilters, ...quickFilters], sorts })
  }, [rawData, sessionFilters, quickFilters, sorts])

  const activeFilterCount =
    sessionFilters.filter(
      (f) => NO_VALUE_OPS.has(f.operator) || String(f.value ?? "").trim() !== "",
    ).length + quickFilters.filter((f) => String(f.value ?? "").trim() !== "").length

  function addSessionFilter() {
    const firstCol = columns[0]
    if (!firstCol) return
    const newFilter: FilterItem = {
      id: crypto.randomUUID(),
      columnId: firstCol.header,
      operator: "contains",
      value: "",
    }
    setSessionFilters((prev) => [...prev, newFilter])
    if (!panelOpen) setPanelOpen(true)
  }

  function updateSessionFilter(id: string, patch: Partial<FilterItem>) {
    setSessionFilters((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)))
  }

  function removeSessionFilter(id: string) {
    setSessionFilters((prev) => prev.filter((f) => f.id !== id))
    if (savingId === id) setSavingId(null)
  }

  function startSave(id: string) {
    setSavingId(id)
    setSaveName("")
  }

  function confirmSave(filter: FilterItem) {
    if (!saveName.trim()) return
    saveFilterToProject(projectId, {
      id: crypto.randomUUID(),
      name: saveName.trim(),
      columnId: filter.columnId,
      operator: filter.operator,
      value: filter.value,
    })
    setSavingId(null)
    setSaveName("")
  }

  function cancelSave() {
    setSavingId(null)
    setSaveName("")
  }

  return {
    projectId,
    datasetId,
    project,
    dataset,
    mounted,
    loading,
    router,
    rawData,
    processedData,
    columns,
    sessionFilters,
    setSessionFilters,
    quickFilters,
    setQuickFilters,
    sorts,
    setSorts,
    panelOpen,
    setPanelOpen,
    activeFilterCount,
    savingId,
    saveName,
    setSaveName,
    NO_VALUE_OPS,
    addSessionFilter,
    updateSessionFilter,
    removeSessionFilter,
    startSave,
    confirmSave,
    cancelSave,
  }
}
