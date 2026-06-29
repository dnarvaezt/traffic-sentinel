"use client"

import { useState } from "react"
import type { SchemaDefinition } from "@/core/data-import/domain/models/schema"
import type { StoredPipelineResult } from "@/core/dataset/pipeline.service"
import { deletePipeline, loadPipeline, runPipeline } from "@/core/dataset/pipeline.service"
import { useProjectStore } from "./use-project-store"

export function useProjectImport(projectId: string) {
  const [loading, setLoading] = useState(false)
  const [pipelineResult, setPipelineResult] = useState<StoredPipelineResult | null>(null)
  const { addDatabase, deleteDatabase, getProject } = useProjectStore()

  async function importCSV(
    file: File,
    schema: SchemaDefinition,
  ): Promise<{ databaseId: string } | null> {
    setLoading(true)
    try {
      const databaseId = crypto.randomUUID()
      const result = await runPipeline(projectId, databaseId, { file, schema })

      const project = getProject(projectId)
      const existingNames = new Set((project?.databases || []).map((d) => d.name))
      let name = file.name.replace(/\.csv$/i, "")
      if (existingNames.has(name)) {
        let suffix = 1
        while (existingNames.has(`${name} (${suffix})`)) suffix++
        name = `${name} (${suffix})`
      }

      const columnInfo = schema.columns

      addDatabase(projectId, {
        id: databaseId,
        projectId,
        name,
        columns: columnInfo,
        data: result.calculatedData,
        rowCount: result.calculatedData.length,
        uploadedAt: new Date(),
      })

      setPipelineResult(result)
      return { databaseId }
    } finally {
      setLoading(false)
    }
  }

  async function loadFromStore(databaseId: string) {
    const result = await loadPipeline(projectId, databaseId)
    if (result) {
      setPipelineResult(result)
    }
    return result
  }

  async function removeDataset(databaseId: string) {
    await deletePipeline(projectId, databaseId)
    deleteDatabase(projectId, databaseId)
    if (pipelineResult?.databaseId === databaseId) {
      setPipelineResult(null)
    }
  }

  return {
    loading,
    pipelineResult,
    importCSV,
    loadFromStore,
    removeDataset,
  }
}
