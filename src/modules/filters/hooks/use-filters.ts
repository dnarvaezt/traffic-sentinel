"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import type { FilterDefinition, FilterOperator } from "@/core/project"
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

  useEffect(() => {
    setMounted(true)
  }, [])

  const projectData = getProject(projectId)

  const availableColumns = useMemo(() => {
    const seen = new Set<string>()
    const cols: { name: string; type: string }[] = []
    for (const db of projectData?.databases ?? []) {
      for (const col of db.columns ?? []) {
        if (!seen.has(col.name)) {
          seen.add(col.name)
          cols.push({ name: col.name, type: col.inferredType })
        }
      }
    }
    return cols
  }, [projectData])

  function openFilterDialog(filter?: FilterDefinition) {
    if (filter) {
      setEditingFilter(filter)
      setFilterName(filter.name)
      setFilterDescription(filter.description || "")
      setFilterColumnId(filter.columnId)
      setFilterOperator(filter.operator)
      setFilterValue(String(filter.value ?? ""))
    } else {
      setEditingFilter(null)
      setFilterName("")
      setFilterDescription("")
      setFilterColumnId(availableColumns[0]?.name ?? "")
      setFilterOperator("contains")
      setFilterValue("")
    }
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
    }
    if (editingFilter) {
      updateFilter(projectId, editingFilter.id, filterData)
    } else {
      addFilter(projectId, { id: crypto.randomUUID(), ...filterData })
    }
    setFilterDialogOpen(false)
  }

  return {
    projectId,
    projectData,
    mounted,
    router,
    availableColumns,
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
    openFilterDialog,
    handleFilterSave,
    handleDeleteFilter: (id: string) => deleteFilter(projectId, id),
  }
}
