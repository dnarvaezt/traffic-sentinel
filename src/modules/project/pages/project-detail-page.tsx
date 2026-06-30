"use client"

import { useParams } from "next/navigation"
import { useProjectDetail } from "../hooks/use-project-detail"

export function ProjectDetailPage() {
  const params = useParams()
  const projectId = params.id as string
  const state = useProjectDetail(projectId)

  if (state.status === "loading") {
    return (
      <div className="min-h-screen p-8 max-w-3xl mx-auto">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    )
  }

  if (state.status === "not-found") {
    return (
      <div className="min-h-screen p-8 max-w-3xl mx-auto">
        <a
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; Volver
        </a>
        <div className="mt-12 text-center">
          <h1 className="text-2xl font-bold">Proyecto no encontrado</h1>
          <p className="text-muted-foreground mt-2">El proyecto que buscas no existe.</p>
        </div>
      </div>
    )
  }

  const { project, datasetCount } = state

  return (
    <div className="min-h-screen p-8 max-w-3xl mx-auto space-y-6">
      <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
        &larr; Volver
      </a>

      <div>
        <h1 className="text-2xl font-bold">{project.name}</h1>
        {project.description && <p className="text-muted-foreground mt-1">{project.description}</p>}
      </div>

      <div className="border rounded-lg p-4 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Creado</span>
          <span>{project.createdAt.toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Última modificación</span>
          <span>{project.updatedAt.toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Columnas</span>
          <span>{project.schema.columns.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Datasets</span>
          <span>{datasetCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Dashboards</span>
          <span>{project.dashboards.length}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <a
          href={`/projects/${project.id}/config`}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Configurar Schema
        </a>
        <a
          href={`/projects/${project.id}/data`}
          className="inline-flex items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:opacity-90 transition-opacity"
        >
          Ver Datos
        </a>
        <a
          href={`/projects/${project.id}/datasets`}
          className="inline-flex items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:opacity-90 transition-opacity"
        >
          Datasets
        </a>
      </div>
    </div>
  )
}
