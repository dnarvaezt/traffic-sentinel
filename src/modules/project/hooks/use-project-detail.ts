"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { saveDatabaseData } from "@/core/dataset"
import type { Database as DbType } from "@/core/project"
import { useProjectImport } from "./use-project-import"
import { useProjectStore } from "./use-project-store"

export type SortField = "name" | "rowCount" | "columns" | "uploadedAt"
export type SortDir = "asc" | "desc"

export function useProjectDetail() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const { getProject, addDatabase, updateDatabase, updateConfig, setWizardCompleted } =
    useProjectStore()

  const [mounted, setMounted] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const projectImport = useProjectImport(projectId)

  // Dataset search + sort
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDir, setSortDir] = useState<SortDir>("asc")

  // Dataset edit dialog
  const [datasetEditOpen, setDatasetEditOpen] = useState(false)
  const [editingDataset, setEditingDataset] = useState<DbType | null>(null)
  const [datasetName, setDatasetName] = useState("")
  const [datasetDescription, setDatasetDescription] = useState("")

  // Delete confirmation
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deletingDataset, setDeletingDataset] = useState<DbType | null>(null)

  // Inline rename
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renamingValue, setRenamingValue] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  const projectData = getProject(projectId)

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDir("asc")
    }
  }

  const filteredDatasets = (projectData?.databases || [])
    .filter((db) => {
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase()
      return db.name.toLowerCase().includes(q)
    })
    .sort((a, b) => {
      let cmp = 0
      switch (sortField) {
        case "name":
          cmp = a.name.localeCompare(b.name)
          break
        case "rowCount":
          cmp = (a.rowCount ?? 0) - (b.rowCount ?? 0)
          break
        case "columns":
          cmp = (a.columns?.length ?? 0) - (b.columns?.length ?? 0)
          break
        case "uploadedAt":
          cmp = new Date(a.uploadedAt ?? 0).getTime() - new Date(b.uploadedAt ?? 0).getTime()
          break
      }
      return sortDir === "asc" ? cmp : -cmp
    })

  async function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file?.name.endsWith(".csv")) return
    setUploading(true)
    try {
      const schema = projectData?.config
      if (!schema || schema.columns.length === 0) {
        const parsed = await (await import("@/core/dataset")).parseCSV(file)
        const database: DbType = {
          id: crypto.randomUUID(),
          projectId,
          name: file.name.replace(".csv", ""),
          columns: parsed.columns.map((c) => ({
            id: crypto.randomUUID(),
            header: c.header,
            type: c.type,
          })),
          data: parsed.data,
          rowCount: parsed.rowCount,
          uploadedAt: new Date(),
        }
        await saveDatabaseData({ id: database.id, projectId, data: database.data })
        addDatabase(projectId, database)
      } else {
        await projectImport.importCSV(file, schema)
      }
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  function handleDeleteDataset(db: DbType) {
    setDeletingDataset(db)
    setDeleteConfirmOpen(true)
  }

  async function confirmDelete() {
    if (!deletingDataset) return
    await projectImport.removeDataset(deletingDataset.id)
    setDeleteConfirmOpen(false)
    setDeletingDataset(null)
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

  function startRename(db: DbType) {
    setRenamingId(db.id)
    setRenamingValue(db.name)
  }

  function commitRename() {
    if (renamingId && renamingValue.trim()) {
      updateDatabase(projectId, renamingId, { name: renamingValue.trim() })
    }
    setRenamingId(null)
    setRenamingValue("")
  }

  function cancelRename() {
    setRenamingId(null)
    setRenamingValue("")
  }

  return {
    projectId,
    projectData,
    mounted,
    uploading,
    fileInputRef,
    searchQuery,
    setSearchQuery,
    sortField,
    sortDir,
    toggleSort,
    filteredDatasets,
    handleFileSelect,
    handleDeleteDataset,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    deletingDataset,
    confirmDelete,
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
    renamingId,
    renamingValue,
    setRenamingValue,
    startRename,
    commitRename,
    cancelRename,
    updateConfig,
    setWizardCompleted,
    addDatabase,
    router,
  }
}
