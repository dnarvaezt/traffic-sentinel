import { useCallback, useEffect, useRef, useState } from "react"
import type { ColumnDefinition, Project } from "@/core"
import { createProjectRepository, type ProjectStore } from "@/core"

export function useSchemaConfig(projectId: string) {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [columns, setColumns] = useState<ColumnDefinition[]>([])
  const storeRef = useRef<ProjectStore>(createProjectRepository())

  useEffect(() => {
    async function load() {
      const p = await storeRef.current.read(projectId)
      if (p) {
        setProject(p)
        setColumns(p.schema.columns)
      }
      setLoading(false)
    }
    load()
  }, [projectId])

  const addColumn = useCallback(() => {
    const id = crypto.randomUUID()
    const newCol: ColumnDefinition = {
      id,
      header: `columna_${columns.length + 1}`,
      type: "string",
    }
    setColumns((prev) => [...prev, newCol])
  }, [columns.length])

  const removeColumn = useCallback((colId: string) => {
    setColumns((prev) => prev.filter((c) => c.id !== colId))
  }, [])

  const moveUp = useCallback((index: number) => {
    if (index <= 0) return
    setColumns((prev) => {
      const next = [...prev]
      ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
      return next
    })
  }, [])

  const moveDown = useCallback((index: number) => {
    setColumns((prev) => {
      if (index >= prev.length - 1) return prev
      const next = [...prev]
      ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
      return next
    })
  }, [])

  const updateColumn = useCallback((colId: string, updates: Partial<ColumnDefinition>) => {
    setColumns((prev) => prev.map((c) => (c.id === colId ? { ...c, ...updates } : c)))
  }, [])

  const save = useCallback(async () => {
    if (!project) return
    setSaving(true)
    await storeRef.current.update(project.id, {
      schema: { columns },
    })
    setSaving(false)
  }, [project, columns])

  return {
    project,
    columns,
    loading,
    saving,
    addColumn,
    removeColumn,
    moveUp,
    moveDown,
    updateColumn,
    save,
  }
}
