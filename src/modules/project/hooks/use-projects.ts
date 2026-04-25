"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useProjectStore } from "./use-project-store"

export function useProjects() {
  const router = useRouter()
  const { projects, createProject, deleteProject } = useProjectStore()
  const [mounted, setMounted] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  function handleCreate() {
    if (!name.trim()) return
    const project = createProject(name.trim(), description.trim())
    setDialogOpen(false)
    setName("")
    setDescription("")
    router.push(`/projects/${project.id}`)
  }

  function handleDelete(id: string) {
    deleteProject(id)
  }

  return {
    mounted,
    projects,
    dialogOpen,
    setDialogOpen,
    name,
    setName,
    description,
    setDescription,
    handleCreate,
    handleDelete,
  }
}
