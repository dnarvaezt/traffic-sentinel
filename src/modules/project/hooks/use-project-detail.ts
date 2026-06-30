import { useCallback, useEffect, useRef, useState } from "react"
import type { Project } from "@/core"
import {
  createDatasetRepository,
  createProjectRepository,
  type DatasetStore,
  type ProjectStore,
} from "@/core"

export type ProjectDetailState =
  | { status: "loading" }
  | { status: "not-found" }
  | { status: "loaded"; project: Project; datasetCount: number }

export function useProjectDetail(projectId: string) {
  const [state, setState] = useState<ProjectDetailState>({ status: "loading" })
  const projectStore = useRef<ProjectStore>(createProjectRepository())
  const datasetStore = useRef<DatasetStore>(createDatasetRepository())

  const load = useCallback(async () => {
    setState({ status: "loading" })
    const [project, datasets] = await Promise.all([
      projectStore.current.read(projectId),
      datasetStore.current.listByProject(projectId),
    ])
    if (!project) {
      setState({ status: "not-found" })
      return
    }
    setState({ status: "loaded", project, datasetCount: datasets.length })
  }, [projectId])

  useEffect(() => {
    load()
  }, [load])

  return state
}
