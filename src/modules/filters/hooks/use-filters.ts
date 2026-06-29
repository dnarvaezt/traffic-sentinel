"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { loadDatabaseData } from "@/core/dataset"
import type { FilterCondition, FilterDefinition, FilterOperator } from "@/core/project"
import { useProjectStore } from "@/modules/project"

export const FILTER_OPERATORS: { value: FilterOperator; label: string }[] = [
  { value: "contains", label: "Contiene" },
  { value: "notContains", label: "No contiene" },
  { value: "equals", label: "Igual a" },
  { value: "notEquals", label: "Diferente de" },
  { value: "greaterThan", label: "Mayor que" },
  { value: "lessThan", label: "Menor que" },
  { value: "greaterThanOrEquals", label: "Mayor o igual" },
  { value: "lessThanOrEquals", label: "Menor o igual" },
  { value: "isNull", label: "Es nulo" },
  { value: "isNotNull", label: "No es nulo" },
]

export function useFilters() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const { getProject, addFilter, updateFilter, deleteFilter } = useProjectStore()
  const [mounted, setMounted] = useState(false)

  const [filterDialogOpen, setFilterDialogOpen] = useState(false)
  const [editingFilter, setEditingFilter] = useState<FilterDefinition | null>(null)
  const [filterName, setFilterName] = useState("")
  const [filterDescription, setFilterDescription] = useState("")
  const [filterColumnId, setFilterColumnId] = useState("")
  const [filterOperator, setFilterOperator] = useState<FilterOperator>("contains")
  const [filterValue, setFilterValue] = useState("")
  const [filterGroupOperator, setFilterGroupOperator] = useState<"and" | "or">("and")
  const [filterConditions, setFilterConditions] = useState<FilterCondition[]>([])
  const [previewCount, setPreviewCount] = useState<number | null>(null)
  const [previewTotal, setPreviewTotal] = useState<number | null>(null)

  // Search
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  const projectData = getProject(projectId)

  const availableColumns = useMemo(() => {
    const seen = new Set<string>()
    const cols: { name: string; type: string }[] = []
    for (const db of projectData?.databases ?? []) {
      for (const col of db.columns ?? []) {
        if (!seen.has(col.header)) {
          seen.add(col.header)
          cols.push({ name: col.header, type: col.type })
        }
      }
    }
    return cols
  }, [projectData])

  const filteredFilters = useMemo(() => {
    if (!projectData?.filters) return []
    if (!searchQuery.trim()) return projectData.filters
    const q = searchQuery.toLowerCase()
    return projectData.filters.filter((f) => f.name.toLowerCase().includes(q))
  }, [projectData, searchQuery])

  async function computePreview(columnId: string, operator: FilterOperator, value: unknown) {
    const db = projectData?.databases?.[0]
    if (!db) {
      setPreviewCount(null)
      setPreviewTotal(null)
      return
    }
    const record = await loadDatabaseData(db.id)
    const data = record?.data ?? []
    setPreviewTotal(data.length)

    let matchCount = 0
    for (const row of data) {
      const cell = row[columnId]
      let match = false
      switch (operator) {
        case "equals":
          match = String(cell) === String(value)
          break
        case "notEquals":
          match = String(cell) !== String(value)
          break
        case "contains":
          match = String(cell).toLowerCase().includes(String(value).toLowerCase())
          break
        case "notContains":
          match = !String(cell).toLowerCase().includes(String(value).toLowerCase())
          break
        case "greaterThan":
          match = Number(cell) > Number(value)
          break
        case "lessThan":
          match = Number(cell) < Number(value)
          break
        case "greaterThanOrEquals":
          match = Number(cell) >= Number(value)
          break
        case "lessThanOrEquals":
          match = Number(cell) <= Number(value)
          break
        case "isNull":
          match = cell === null || cell === undefined || cell === ""
          break
        case "isNotNull":
          match = cell !== null && cell !== undefined && cell !== ""
          break
      }
      if (match) matchCount++
    }
    setPreviewCount(matchCount)
  }

  function openFilterDialog(filter?: FilterDefinition) {
    if (filter) {
      setEditingFilter(filter)
      setFilterName(filter.name)
      setFilterDescription(filter.description || "")
      setFilterColumnId(filter.columnId)
      setFilterOperator(filter.operator)
      setFilterValue(String(filter.value ?? ""))
      setFilterGroupOperator(filter.groupOperator ?? "and")
      setFilterConditions(filter.conditions ?? [])
    } else {
      setEditingFilter(null)
      setFilterName("")
      setFilterDescription("")
      setFilterColumnId(availableColumns[0]?.name ?? "")
      setFilterOperator("contains")
      setFilterValue("")
      setFilterGroupOperator("and")
      setFilterConditions([])
    }
    setPreviewCount(null)
    setPreviewTotal(null)
    setFilterDialogOpen(true)
  }

  function handleFilterSave() {
    if (!filterName.trim() || !filterColumnId) return
    const filterData: Omit<FilterDefinition, "id"> = {
      name: filterName.trim(),
      description: filterDescription.trim() || undefined,
      columnId: filterColumnId,
      operator: filterOperator,
      value: filterOperator === "isNull" || filterOperator === "isNotNull" ? null : filterValue,
      groupOperator: filterConditions.length > 0 ? filterGroupOperator : undefined,
      conditions: filterConditions.length > 0 ? filterConditions : undefined,
    }
    if (editingFilter) {
      updateFilter(projectId, editingFilter.id, filterData)
    } else {
      addFilter(projectId, { id: crypto.randomUUID(), enabled: true, ...filterData })
    }
    setFilterDialogOpen(false)
  }

  function addCondition() {
    setFilterConditions([
      ...filterConditions,
      { columnId: filterColumnId, operator: "contains", value: "" },
    ])
  }

  function updateCondition(index: number, updates: Partial<FilterCondition>) {
    setFilterConditions(filterConditions.map((c, i) => (i === index ? { ...c, ...updates } : c)))
  }

  function removeCondition(index: number) {
    setFilterConditions(filterConditions.filter((_, i) => i !== index))
  }

  function toggleFilterEnabled(filter: FilterDefinition) {
    updateFilter(projectId, filter.id, { enabled: !(filter.enabled ?? true) })
  }

  return {
    projectId,
    projectData,
    mounted,
    router,
    availableColumns,
    searchQuery,
    setSearchQuery,
    filteredFilters,
    filterDialogOpen,
    setFilterDialogOpen,
    editingFilter,
    filterName,
    setFilterName,
    filterDescription,
    setFilterDescription,
    filterColumnId,
    setFilterColumnId,
    filterOperator,
    setFilterOperator,
    filterValue,
    setFilterValue,
    filterGroupOperator,
    setFilterGroupOperator,
    filterConditions,
    addCondition,
    updateCondition,
    removeCondition,
    previewCount,
    previewTotal,
    computePreview,
    openFilterDialog,
    handleFilterSave,
    handleDeleteFilter: (id: string) => deleteFilter(projectId, id),
    toggleFilterEnabled,
  }
}
