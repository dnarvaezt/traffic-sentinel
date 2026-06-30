import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { ColumnTransformer, Dataset, Project } from "@/core"
import {
  createDatasetRepository,
  createProjectRepository,
  type DatasetStore,
  type ProjectStore,
} from "@/core"

export const PAGE_SIZE = 100

function applyTransformers(value: unknown, transformers: ColumnTransformer[]): unknown {
  let result = value
  for (const t of transformers) {
    switch (t.type) {
      case "trim":
        result = typeof result === "string" ? result.trim() : result
        break
      case "uppercase":
        result = typeof result === "string" ? result.toUpperCase() : result
        break
      case "lowercase":
        result = typeof result === "string" ? result.toLowerCase() : result
        break
      case "slug":
        result =
          typeof result === "string"
            ? result
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "")
            : result
        break
      case "parseInt":
        result = Number.isNaN(parseInt(String(result), 10)) ? result : parseInt(String(result), 10)
        break
      case "parseFloat":
      case "parse-number":
        result = Number.isNaN(Number(result)) ? result : Number(result)
        break
      case "dateParse":
        if (typeof result === "string") {
          const d = new Date(result)
          result = Number.isNaN(d.getTime()) ? result : d.toISOString()
        }
        break
      case "stripHtml":
        result = typeof result === "string" ? result.replace(/<[^>]*>/g, "").trim() : result
        break
      case "custom": {
        const code = (t.params?.code as string) ?? ""
        if (code.trim()) {
          try {
            result = new Function("value", code)(result)
          } catch {
            /* skip */
          }
        }
        break
      }
    }
  }
  return result
}

export function useSchemaDataViewer(projectId: string) {
  const [project, setProject] = useState<Project | null>(null)
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [selectedDatasetId, setSelectedDatasetId] = useState<string | null>(null)
  const [rawData, setRawData] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const projectStore = useRef<ProjectStore>(createProjectRepository())
  const datasetStore = useRef<DatasetStore>(createDatasetRepository())
  useEffect(() => {
    async function init() {
      const [p, ds] = await Promise.all([
        projectStore.current.read(projectId),
        datasetStore.current.listByProject(projectId),
      ])
      setProject(p ?? null)
      setDatasets(ds)
      setSelectedDatasetId((prev) => prev ?? (ds.length > 0 ? ds[0].id : null))
      setLoading(false)
    }
    init()
  }, [projectId])

  useEffect(() => {
    if (!selectedDatasetId) return
    const id: string = selectedDatasetId
    ;(async () => {
      const ds = await datasetStore.current.read(id)
      setRawData(ds?.rawData ?? [])
    })()
  }, [selectedDatasetId])

  const handleDatasetChange = useCallback((datasetId: string) => {
    setSelectedDatasetId(datasetId)
    setPage(1)
  }, [])

  const processedData = useMemo(() => {
    if (!project || rawData.length === 0) return []
    const columns = project.schema.columns
    return rawData.map((rawRow) => {
      const processedRow: Record<string, unknown> = { _rowId: rawRow._rowId }
      for (const col of columns) {
        if (col.kind === "virtual") {
          if (col.calculate) {
            try {
              processedRow[col.id] = new Function("row", col.calculate)(processedRow)
            } catch {
              processedRow[col.id] = null
            }
          }
        } else {
          const sourceKey = col.sourceColumn || col.header
          let value = rawRow[sourceKey]
          if (col.transformers && col.transformers.length > 0) {
            value = applyTransformers(value, col.transformers)
          }
          processedRow[col.id] = value
        }
      }
      return processedRow
    })
  }, [project, rawData])

  const columns = project?.schema.columns ?? []
  const totalPages = Math.max(1, Math.ceil(processedData.length / PAGE_SIZE))
  const pageData = processedData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return {
    project,
    datasets,
    selectedDatasetId,
    columns,
    pageData,
    loading,
    page,
    totalPages,
    totalRows: processedData.length,
    handleDatasetChange,
    setPage,
  }
}
