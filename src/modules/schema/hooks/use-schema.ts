"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { ColumnDefinition, ColumnType, DatabaseColumn } from "@/core/project"
import { useProjectStore } from "@/modules/project"

export const COLUMN_TYPES: { value: ColumnType; label: string }[] = [
  { value: "string", label: "Texto" },
  { value: "number", label: "Número" },
  { value: "date", label: "Fecha" },
  { value: "boolean", label: "Booleano" },
  { value: "email", label: "Email" },
  { value: "url", label: "URL" },
]

function inferTypeToColumnType(inferredType: string): ColumnType {
  switch (inferredType.toLowerCase()) {
    case "number":
    case "integer":
    case "float":
    case "decimal":
      return "number"
    case "date":
    case "datetime":
    case "timestamp":
      return "date"
    case "boolean":
    case "bool":
      return "boolean"
    case "email":
      return "email"
    case "url":
    case "uri":
      return "url"
    default:
      return "string"
  }
}

function buildColumnsFromTable(columns: DatabaseColumn[]): ColumnDefinition[] {
  return columns.map((col) => {
    const type = inferTypeToColumnType(col.inferredType)
    return { id: crypto.randomUUID(), name: col.name, type, label: col.name }
  })
}

export function useSchema() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const { getProject, addColumn, updateColumn, deleteColumn, updateSchema } = useProjectStore()
  const [mounted, setMounted] = useState(false)
  const [loadDialogOpen, setLoadDialogOpen] = useState(false)
  const [selectedDatabaseId, setSelectedDatabaseId] = useState<string>("")
  const [confirmReplaceOpen, setConfirmReplaceOpen] = useState(false)
  const [pendingColumns, setPendingColumns] = useState<ColumnDefinition[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  const projectData = getProject(projectId)
  const databases = projectData?.databases || []
  const selectedDatabase = databases.find((db) => db.id === selectedDatabaseId)
  const previewColumns = selectedDatabase ? buildColumnsFromTable(selectedDatabase.columns) : []
  const existingColumns = projectData?.schema?.columns || []

  function handleLoadColumns() {
    if (!selectedDatabase) return
    const cols = buildColumnsFromTable(selectedDatabase.columns)
    if (existingColumns.length > 0) {
      setPendingColumns(cols)
      setLoadDialogOpen(false)
      setConfirmReplaceOpen(true)
    } else {
      updateSchema(projectId, { columns: cols })
      setLoadDialogOpen(false)
    }
  }

  function handleConfirmReplace() {
    updateSchema(projectId, { columns: pendingColumns })
    setPendingColumns([])
    setConfirmReplaceOpen(false)
  }

  function handleUpdateColumn(columnId: string, updates: Partial<ColumnDefinition>) {
    updateColumn(projectId, columnId, updates)
  }

  function handleAddColumn() {
    addColumn(projectId, {
      id: crypto.randomUUID(),
      name: `column_${existingColumns.length + 1}`,
      type: "string",
    })
  }

  return {
    projectId,
    projectData,
    mounted,
    router,
    databases,
    selectedDatabaseId,
    setSelectedDatabaseId,
    selectedDatabase,
    previewColumns,
    existingColumns,
    pendingColumns,
    loadDialogOpen,
    setLoadDialogOpen,
    confirmReplaceOpen,
    setConfirmReplaceOpen,
    COLUMN_TYPES,
    handleLoadColumns,
    handleConfirmReplace,
    handleUpdateColumn,
    handleAddColumn,
    deleteColumn: (columnId: string) => deleteColumn(projectId, columnId),
  }
}
