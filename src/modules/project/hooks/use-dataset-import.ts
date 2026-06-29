import Papa from "papaparse"
import { useCallback, useEffect, useRef, useState } from "react"
import type { Dataset, Project } from "@/core"
import {
  createDatasetRepository,
  createProjectRepository,
  type DatasetStore,
  type ProjectStore,
} from "@/core"

export function useDatasetImport(projectId: string) {
  const [project, setProject] = useState<Project | null>(null)
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const projectStore = useRef<ProjectStore>(createProjectRepository())
  const datasetStore = useRef<DatasetStore>(createDatasetRepository())

  const load = useCallback(async () => {
    const p = await projectStore.current.read(projectId)
    setProject(p ?? null)
    const ds = await datasetStore.current.listByProject(projectId)
    setDatasets(ds)
    setLoading(false)
  }, [projectId])

  useEffect(() => {
    load()
  }, [load])

  const handleFile = useCallback(
    async (file: File) => {
      setUploading(true)
      const result = await new Promise<Papa.ParseResult<Record<string, unknown>>>(
        (resolve, reject) => {
          Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            complete: resolve,
            error: reject,
          })
        },
      )
      const columns =
        result.meta.fields?.map((f) => ({
          id: crypto.randomUUID(),
          header: f,
          type: "string" as const,
        })) ?? []
      const name = file.name.replace(/\.csv$/i, "")
      await datasetStore.current.create(projectId, name, result.data, columns)
      setUploading(false)
      await load()
    },
    [projectId, load],
  )

  const handleDelete = useCallback(
    async (datasetId: string) => {
      await datasetStore.current.delete(datasetId)
      await load()
    },
    [load],
  )

  return { project, datasets, loading, uploading, handleFile, handleDelete }
}
