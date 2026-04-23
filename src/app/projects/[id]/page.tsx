"use client"

import { ArrowLeft, Database, LayoutDashboard, Pencil, Settings, Trash2 } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useProjectStore } from "@/application/stores/project-store"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/infrastructure/components/ui/alert-dialog"
import { Button } from "@/infrastructure/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/infrastructure/components/ui/card"
import { Input } from "@/infrastructure/components/ui/input"
import { Label } from "@/infrastructure/components/ui/label"
import { Separator } from "@/infrastructure/components/ui/separator"
import { Textarea } from "@/infrastructure/components/ui/textarea"

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const { getProject, updateProject, deleteProject } = useProjectStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const projectData = getProject(projectId)

  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(projectData?.name || "")
  const [description, setDescription] = useState(projectData?.description || "")

  useEffect(() => {
    if (projectData) {
      setName(projectData.name)
      setDescription(projectData.description || "")
    }
  }, [projectData])

  if (!mounted) {
    return null
  }

  if (!projectData) {
    return (
      <main className="min-h-screen p-8">
        <Card>
          <CardContent className="py-8 text-center">
            <p>Proyecto no encontrado</p>
            <Link href="/projects">
              <Button className="mt-4">Volver a proyectos</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    )
  }

  function handleSave() {
    if (!name.trim()) return
    updateProject(projectId, { name: name.trim(), description: description.trim() })
    setEditing(false)
  }

  function handleCancel() {
    setName(projectData!.name)
    setDescription(projectData!.description || "")
    setEditing(false)
  }

  const menuItems = [
    {
      label: "Datasets",
      href: `/projects/${projectId}/datasets`,
      icon: Database,
      description: `${projectData!.datasets.length} archivos cargados`,
    },
    {
      label: "Esquema",
      href: `/projects/${projectId}/schema`,
      icon: Settings,
      description: `${projectData!.schema.tables.length} tablas definidas`,
    },
    {
      label: "Tabla",
      href: `/projects/${projectId}/data`,
      icon: Database,
      description: "Explorar y filtrar datos",
    },
    {
      label: "Dashboard",
      href: `/projects/${projectId}/dashboard`,
      icon: LayoutDashboard,
      description: "Visualizar gráficos",
    },
  ]

  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b px-6 py-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/projects")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          {editing ? (
            <div className="flex items-center gap-2">
              <Input value={name} onChange={(e) => setName(e.target.value)} className="max-w-md" />
              <Button size="sm" onClick={handleSave}>
                Guardar
              </Button>
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancelar
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">{projectData!.name}</h1>
              <Button variant="ghost" size="icon" onClick={() => setEditing(true)}>
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          )}
          {projectData!.description && !editing && (
            <CardDescription>{projectData!.description}</CardDescription>
          )}
        </div>
        <CardDescription>
          Creado: {new Date(projectData!.createdAt).toLocaleDateString()}
        </CardDescription>
      </header>

      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {editing && (
            <Card>
              <CardHeader>
                <CardTitle>Editar Proyecto</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Nombre</Label>
                  <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Descripción</Label>
                  <Textarea
                    id="edit-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave}>Guardar</Button>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardHeader className="flex flex-row items-start space-y-0 gap-4">
                    <item.icon className="h-6 w-6 mt-1 text-muted-foreground" />
                    <div>
                      <CardTitle>{item.label}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>

          <Separator />

          <div>
            <CardTitle className="mb-4">Estadísticas</CardTitle>
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold">{projectData!.datasets.length}</p>
                  <p className="text-sm text-muted-foreground">Datasets</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold">{projectData!.schema.tables.length}</p>
                  <p className="text-sm text-muted-foreground">Tablas en esquema</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold">
                    {projectData!.datasets.reduce((acc, d) => acc + d.rowCount, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total filas</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar proyecto
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Eliminar este proyecto?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. El proyecto y todos sus datos serán eliminados
                  permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    deleteProject(projectId)
                    router.push("/projects")
                  }}
                >
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </main>
  )
}
