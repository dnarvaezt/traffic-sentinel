"use client"

import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  FileSpreadsheet,
  Filter,
  Layers,
  LayoutDashboard,
  Settings2,
  Wrench,
} from "lucide-react"
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { exportDataService } from "@/core/data-import/application/export-data/export-data.service"
import { loadDatabaseData } from "@/core/dataset"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip"
import { useProjectStore } from "../hooks/use-project-store"

export type TabId = "datasets" | "config" | "filters" | "dashboard" | "groups"

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
  const { getProject, updateProject, deleteProject } = useProjectStore()
  const projectData = getProject(projectId)

  const [mounted, setMounted] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [editProjectOpen, setEditProjectOpen] = useState(false)
  const [deleteProjectOpen, setDeleteProjectOpen] = useState(false)
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("insighthub-sidebar-collapsed")
    if (saved !== null) setCollapsed(JSON.parse(saved))
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("insighthub-sidebar-collapsed", JSON.stringify(collapsed))
    }
  }, [collapsed, mounted])

  useEffect(() => {
    if (projectData) {
      setProjectName(projectData.name)
      setProjectDescription(projectData.description || "")
    }
  }, [projectData])

  const activeTab: TabId = pathname.endsWith("/filters")
    ? "filters"
    : pathname.endsWith("/dashboard")
      ? "dashboard"
      : pathname.endsWith("/groups")
        ? "groups"
        : (searchParams.get("tab") as TabId) || "datasets"

  function handleSaveProject() {
    if (!projectName.trim()) return
    updateProject(projectId, { name: projectName.trim(), description: projectDescription.trim() })
    setEditProjectOpen(false)
  }

  function handleDeleteProject() {
    deleteProject(projectId)
    setDeleteProjectOpen(false)
    router.push("/projects")
  }

  function handleExportData() {
    if (!projectData) return
    const configJson = JSON.stringify(projectData.config || {}, null, 2)
    const configBlob = new Blob([configJson], { type: "application/json" })
    const configUrl = URL.createObjectURL(configBlob)
    const configLink = document.createElement("a")
    configLink.setAttribute("href", configUrl)
    configLink.setAttribute("download", `${projectData.name}-config.json`)
    configLink.click()
    URL.revokeObjectURL(configUrl)

    for (const db of projectData.databases || []) {
      loadDatabaseData(db.id).then((record) => {
        const data = record?.data || []
        if (data.length > 0) {
          exportDataService.execute(data, `${projectData.name}-${db.name}.csv`)
        }
      })
    }
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
      count: projectData.databases?.length ?? 0,
    },
    {
      id: "groups",
      label: "Agrupaciones",
      href: `/projects/${projectId}/groups`,
      icon: Layers,
      count: projectData.config?.groups?.length ?? 0,
    },
    {
      id: "dashboard",
      label: "Dashboard",
      href: `/projects/${projectId}/dashboard`,
      icon: LayoutDashboard,
      count: projectData.dashboards?.[0]?.widgets?.length ?? 0,
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
  ]

  const sidebarWidth = collapsed ? "w-16" : "w-64"

  return (
    <main className="min-h-screen flex">
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col border-r ${sidebarWidth} transition-all duration-200 p-2 space-y-2 flex-shrink-0`}
      >
        <div className="flex items-center justify-between p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/projects")}
            className={collapsed ? "p-2" : ""}
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="ml-2 text-xs">Volver</span>}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="p-2"
            aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {!collapsed && (
          <div className="pt-2 border-t px-2">
            <p className="text-sm font-semibold mb-1 truncate">{projectData.name}</p>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {projectData.description || "Sin descripción"}
            </p>
          </div>
        )}

        <div className="pt-2 border-t flex-1">
          {!collapsed && (
            <h2 className="text-xs font-semibold px-2 mb-2 text-muted-foreground">Navegación</h2>
          )}
          <TooltipProvider>
            {navItems.map((item) => {
              const isActive = activeTab === item.id
              const button = (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => navigate(item)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors ${
                    collapsed ? "justify-center px-0" : "justify-between"
                  } ${isActive ? "bg-secondary" : "hover:bg-accent"}`}
                >
                  <span className={`flex items-center gap-2 ${collapsed ? "" : ""}`}>
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </span>
                  {!collapsed && item.count !== undefined && (
                    <span className="text-xs bg-muted px-1.5 py-0.5 rounded">{item.count}</span>
                  )}
                </button>
              )
              if (collapsed) {
                return (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>{button}</TooltipTrigger>
                    <TooltipContent side="right" sideOffset={8}>
                      <div className="flex items-center gap-2">
                        {item.label}
                        {item.count !== undefined && (
                          <span className="text-xs bg-muted px-1.5 py-0.5 rounded">
                            {item.count}
                          </span>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                )
              }
              return button
            })}
          </TooltipProvider>
        </div>

        {!collapsed && (
          <div className="pt-2 border-t">
            <h2 className="text-xs font-semibold px-2 mb-2 text-muted-foreground">Configuración</h2>
            <Dialog open={editProjectOpen} onOpenChange={setEditProjectOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Settings2 className="mr-2 h-4 w-4" />
                  Ajustes
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajustes del Proyecto</DialogTitle>
                  <DialogDescription>Administra la configuración de tu proyecto.</DialogDescription>
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
                  <div className="pt-4 border-t space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={handleExportData}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Exportar datos
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setDeleteProjectOpen(true)}
                    >
                      Eliminar proyecto
                    </Button>
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
            <Dialog open={deleteProjectOpen} onOpenChange={setDeleteProjectOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Eliminar Proyecto</DialogTitle>
                  <DialogDescription>
                    ¿Estás seguro? Esta acción eliminará el proyecto &quot;{projectData.name}&quot;
                    y todos sus datasets.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDeleteProjectOpen(false)}>
                    Cancelar
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteProject}>
                    Eliminar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background z-50 flex justify-around py-1 safe-area-bottom">
        {navItems.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => navigate(item)}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md text-[10px] transition-colors ${
              activeTab === item.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <item.icon className="h-4 w-4" />
            <span className="truncate max-w-14">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="flex-1 p-4 md:p-8 overflow-auto pb-20 md:pb-8">
        <div className="max-w-5xl mx-auto space-y-6">{children}</div>
      </div>
    </main>
  )
}
