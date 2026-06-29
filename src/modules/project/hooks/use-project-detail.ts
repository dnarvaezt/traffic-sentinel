import { useCallback, useEffect, useRef, useState } from "react"
import type { Project } from "@/core"
import { createProjectRepository, type ProjectStore } from "@/core"

export type ProjectDetailState =
  | { status: "loading" }
  | { status: "not-found" }
  | { status: "loaded"; project: Project }

export function useProjectDetail(projectId: string) {
  const [state, setState] = useState<ProjectDetailState>({ status: "loading" })
  const storeRef = useRef<ProjectStore>(createProjectRepository())

  const load = useCallback(async () => {
    setState({ status: "loading" })
    const project = await storeRef.current.read(projectId)
    if (!project) {
      setState({ status: "not-found" })
      return
    }
    setState({ status: "loaded", project })
  }, [projectId])

  useEffect(() => {
    load()
  }, [load])

  return state
}
