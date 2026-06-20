"use client"

import {
  ArrowLeft,
  FileSpreadsheet,
  Filter,
  LayoutDashboard,
  Pencil,
  Settings,
  Table2,
  Wrench,
} from "lucide-react"
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/shared/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { useProjectStore } from "../hooks/use-project-store"

export type TabId = "datasets" | "data" | "config" | "filters" | "schema" | "dashboard"

interface NavItem {
  id: TabId
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  count?: number
}

export function ProjectLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const projectId = params.id as string
  const { getProject, updateProject } = useProjectStore()
  const projectData = getProject(projectId)

  const [mounted, setMounted] = useState(false)
  const [editProjectOpen, setEditProjectOpen] = useState(false)
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (projectData) {
      setProjectName(projectData.name)
      setProjectDescription(projectData.description || "")
    }
  }, [projectData])

  const activeTab: TabId = pathname.endsWith("/filters")
    ? "filters"
    : pathname.endsWith("/schema")
      ? "schema"
      : pathname.endsWith("/dashboard")
        ? "dashboard"
        : (searchParams.get("tab") as TabId) || "datasets"

  function handleSaveProject() {
    if (!projectName.trim()) return
    updateProject(projectId, { name: projectName.trim(), description: projectDescription.trim() })
    setEditProjectOpen(false)
  }

  function navigate(item: NavItem) {
    router.push(item.href)
  }

  if (!mounted) return null

  if (!projectData) {
    return (
      <main className="min-h-screen p-8">
        <p>Proyecto no encontrado</p>
        <Button onClick={() => router.push("/projects")}>Volver a proyectos</Button>
      </main>
    )
  }

  const navItems: NavItem[] = [
    {
      id: "datasets",
      label: "Datasets",
      href: `/projects/${projectId}`,
      icon: FileSpreadsheet,
    },
    {
      id: "data",
      label: "Datos",
      href: `/projects/${projectId}?tab=data`,
      icon: Table2,
    },
    {
      id: "dashboard",
      label: "Dashboard",
      href: `/projects/${projectId}/dashboard`,
      icon: LayoutDashboard,
    },
    {
      id: "config",
      label: "Configuración",
      href: `/projects/${projectId}?tab=config`,
      icon: Wrench,
    },
    {
      id: "filters",
      label: "Filtros",
      href: `/projects/${projectId}/filters`,
      icon: Filter,
      count: projectData.filters?.length ?? 0,
    },
    {
      id: "schema",
      label: "Schema",
      href: `/projects/${projectId}/schema`,
      icon: Settings,
    },
  ]

  return (
    <main className="min-h-screen flex">
      <aside className="w-64 border-r p-4 space-y-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/projects")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>

        <div className="pt-2 border-t">
          <p className="text-sm font-semibold px-2 mb-2 truncate">{projectData.name}</p>
          <p className="text-xs text-muted-foreground px-2 line-clamp-2">
            {projectData.description || "Sin descripción"}
          </p>
        </div>

        <div className="pt-2 border-t">
          <h2 className="text-sm font-semibold px-2 mb-2">Navegación</h2>
          {navItems.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => navigate(item)}
              className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-colors ${
                activeTab === item.id ? "bg-secondary" : "hover:bg-accent"
              }`}
            >
              <span className="flex items-center gap-2">
                <item.icon className="h-4 w-4" />
                {item.label}
              </span>
              {item.count !== undefined && (
                <span className="text-xs bg-muted px-1.5 py-0.5 rounded">{item.count}</span>
              )}
            </button>
          ))}
        </div>

        <div className="pt-2 border-t">
          <h2 className="text-sm font-semibold px-2 mb-2">Configuración</h2>
          <Dialog open={editProjectOpen} onOpenChange={setEditProjectOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Pencil className="mr-2 h-4 w-4" />
                Editar proyecto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Proyecto</DialogTitle>
                <DialogDescription>Modifica los datos de tu proyecto.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="project-name">Nombre</Label>
                  <Input
                    id="project-name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="project-desc">Descripción</Label>
                  <Textarea
                    id="project-desc"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditProjectOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveProject}>Guardar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </aside>

      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-6">{children}</div>
      </div>
    </main>
  )
}
