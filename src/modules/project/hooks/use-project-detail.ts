"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { deleteDatabaseData, parseCSV, saveDatabaseData } from "@/core/dataset"
import type { Database as DbType, FilterDefinition, FilterOperator } from "@/core/project"
import { useProjectStore } from "./use-project-store"

export type TabView = "datasets" | "filters" | "schema"

export function useProjectDetail() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const {
    getProject,
    updateProject,
    addDatabase,
    updateDatabase,
    deleteDatabase,
    addFilter,
    updateFilter,
    deleteFilter,
  } = useProjectStore()

  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<TabView>("datasets")
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Project edit
  const [editProjectOpen, setEditProjectOpen] = useState(false)
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")

  // Dataset edit
  const [datasetEditOpen, setDatasetEditOpen] = useState(false)
  const [editingDataset, setEditingDataset] = useState<DbType | null>(null)
  const [datasetName, setDatasetName] = useState("")
  const [datasetDescription, setDatasetDescription] = useState("")

  // Filter dialog
  const [filterDialogOpen, setFilterDialogOpen] = useState(false)
  const [editingFilter, setEditingFilter] = useState<FilterDefinition | null>(null)
  const [filterName, setFilterName] = useState("")
  const [filterDescription, setFilterDescription] = useState("")
  const [filterColumnId, setFilterColumnId] = useState("")
  const [filterOperator, setFilterOperator] = useState<FilterOperator>("equals")
  const [filterValue, setFilterValue] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  const projectData = getProject(projectId)

  useEffect(() => {
    if (projectData) {
      setProjectName(projectData.name)
      setProjectDescription(projectData.description || "")
    }
  }, [projectData])

  function handleSaveProject() {
    if (!projectName.trim()) return
    updateProject(projectId, { name: projectName.trim(), description: projectDescription.trim() })
    setEditProjectOpen(false)
  }

  async function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file?.name.endsWith(".csv")) return
    setUploading(true)
    try {
      const parsed = await parseCSV(file)
      const database: DbType = {
        id: crypto.randomUUID(),
        projectId,
        name: file.name.replace(".csv", ""),
        columns: parsed.columns.map((c) => ({ name: c.name, inferredType: c.type })),
        data: parsed.data,
        rowCount: parsed.rowCount,
        uploadedAt: new Date(),
      }
      await saveDatabaseData({ id: database.id, projectId, data: database.data })
      addDatabase(projectId, database)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  async function handleDeleteDataset(databaseId: string) {
    await deleteDatabaseData(databaseId)
    deleteDatabase(projectId, databaseId)
  }

  function openDatasetEdit(db: DbType) {
    setEditingDataset(db)
    setDatasetName(db.name)
    setDatasetDescription(db.description || "")
    setDatasetEditOpen(true)
  }

  function handleDatasetSave() {
    if (!editingDataset || !datasetName.trim()) return
    updateDatabase(projectId, editingDataset.id, {
      name: datasetName.trim(),
      description: datasetDescription.trim(),
    })
    setDatasetEditOpen(false)
    setEditingDataset(null)
  }

  function handleToggleFavorite(db: DbType) {
    updateDatabase(projectId, db.id, { favorite: !db.favorite })
  }

  function openFilterDialog(filter?: FilterDefinition) {
    if (!projectData) return
    if (filter) {
      setEditingFilter(filter)
      setFilterName(filter.name || "")
      setFilterDescription(filter.description || "")
      setFilterColumnId(filter.columnId)
      setFilterOperator(filter.operator)
      setFilterValue(String(filter.value ?? ""))
    } else {
      setEditingFilter(null)
      setFilterName("")
      setFilterDescription("")
      setFilterColumnId(projectData.schema.columns[0]?.id || "")
      setFilterOperator("equals")
      setFilterValue("")
    }
    setFilterDialogOpen(true)
  }

  function handleFilterSave() {
    if (!filterName.trim() || !filterColumnId) return
    const filterData = {
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

  function handleDeleteFilter(filterId: string) {
    deleteFilter(projectId, filterId)
  }

  return {
    projectId,
    projectData,
    mounted,
    router,
    activeTab,
    setActiveTab,
    uploading,
    fileInputRef,
    editProjectOpen,
    setEditProjectOpen,
    projectName,
    setProjectName,
    projectDescription,
    setProjectDescription,
    handleSaveProject,
    handleFileSelect,
    handleDeleteDataset,
    datasetEditOpen,
    setDatasetEditOpen,
    editingDataset,
    datasetName,
    setDatasetName,
    datasetDescription,
    setDatasetDescription,
    openDatasetEdit,
    handleDatasetSave,
    handleToggleFavorite,
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
    handleDeleteFilter,
  }
}
