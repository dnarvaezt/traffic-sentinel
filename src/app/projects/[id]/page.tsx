"use client"

import {
  ArrowLeft,
  FileSpreadsheet,
  LayoutDashboard,
  Pencil,
  Settings,
  Star,
  Trash2,
  Upload,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useProjectStore } from "@/application/stores/project-store"
import type { Database as DbType } from "@/application/types"
import { Button } from "@/infrastructure/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/infrastructure/components/ui/dialog"
import { Input } from "@/infrastructure/components/ui/input"
import { Label } from "@/infrastructure/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/infrastructure/components/ui/table"
import { Textarea } from "@/infrastructure/components/ui/textarea"
import { parseCSV } from "@/infrastructure/services/csv-service"
import { deleteDatabaseData, saveDatabaseData } from "@/infrastructure/services/indexed-db"

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const { getProject, updateProject, addDatabase, updateDatabase, deleteDatabase } =
    useProjectStore()
  const [mounted, setMounted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const projectData = getProject(projectId)

  const [editOpen, setEditOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [datasetEditOpen, setDatasetEditOpen] = useState(false)
  const [editingDataset, setEditingDataset] = useState<DbType | null>(null)
  const [datasetName, setDatasetName] = useState("")
  const [datasetDescription, setDatasetDescription] = useState("")

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
        <p>Proyecto no encontrado</p>
        <Link href="/projects">
          <Button className="mt-4">Volver a proyectos</Button>
        </Link>
      </main>
    )
  }

  function handleSave() {
    if (!name.trim()) return
    updateProject(projectId, { name: name.trim(), description: description.trim() })
    setEditOpen(false)
  }

  async function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith(".csv")) {
      setError("Solo se permiten archivos CSV")
      return
    }

    setUploading(true)
    setError(null)

    try {
      const parsed = await parseCSV(file)

      const database: DbType = {
        id: crypto.randomUUID(),
        projectId,
        name: file.name.replace(".csv", ""),
        columns: parsed.columns.map((c) => ({ name: c.name, inferredType: c.type })),
        data: parsed.data,
        rowCount: parsed.rowCount,
        uploadedAt: new Date(),
      }

      await saveDatabaseData({
        id: database.id,
        projectId: database.projectId,
        data: database.data,
      })

      addDatabase(projectId, database)
    } catch (err) {
      setError("Error al procesar el archivo")
      console.error(err)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  async function handleDelete(databaseId: string) {
    try {
      await deleteDatabaseData(databaseId)
      deleteDatabase(projectId, databaseId)
    } catch (err) {
      console.error(err)
    }
  }

  function openDatasetEdit(db: DbType) {
    setEditingDataset(db)
    setDatasetName(db.name)
    setDatasetDescription(db.description || "")
    setDatasetEditOpen(true)
  }

  function handleDatasetSave() {
    if (!editingDataset || !datasetName.trim()) return
    updateDatabase(projectId, editingDataset.id, {
      name: datasetName.trim(),
      description: datasetDescription.trim(),
    })
    setDatasetEditOpen(false)
    setEditingDataset(null)
  }

  function handleToggleFavorite(db: DbType) {
    updateDatabase(projectId, db.id, {
      favorite: !db.favorite,
    })
  }

  const navItems = [
    { label: "Datasets", href: `/projects/${projectId}`, icon: FileSpreadsheet, active: true },
    { label: "Schema", href: `/projects/${projectId}/schema`, icon: Settings },
    { label: "Dashboard", href: `/projects/${projectId}/dashboard`, icon: LayoutDashboard },
  ]

  return (
    <main className="min-h-screen flex">
      <aside className="w-64 border-r p-4 space-y-2">
        <Button variant="ghost" size="sm" onClick={() => router.push("/projects")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>

        <div className="pt-4">
          <h2 className="text-sm font-semibold px-2 mb-2">Navegación</h2>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={item.active ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </div>

        <div className="pt-4 border-t">
          <h2 className="text-sm font-semibold px-2 mb-2">Configuración</h2>
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" className="w-full justify-start">
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
                  <Label htmlFor="name">Nombre</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave}>Guardar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </aside>

      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{projectData.name}</h1>
              {projectData.description && (
                <p className="text-sm text-muted-foreground">{projectData.description}</p>
              )}
            </div>
            <label className="flex items-center gap-2 px-3 py-1.5 border rounded-lg cursor-pointer hover:bg-accent transition-colors text-sm">
              <Upload className="h-4 w-4" />
              <span>Subir CSV</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          {projectData.databases && projectData.databases.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Fav</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Filas</TableHead>
                  <TableHead>Columnas</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectData.databases.map((db) => (
                  <TableRow key={db.id}>
                    <TableCell>
                      <button
                        type="button"
                        onClick={() => handleToggleFavorite(db)}
                        className="flex items-center justify-center"
                      >
                        <Star
                          className={`h-4 w-4 ${db.favorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                        />
                      </button>
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link
                        href={`/projects/${projectId}/datasets/${db.id}`}
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                      >
                        <FileSpreadsheet className="h-4 w-4" />
                        {db.name}
                      </Link>
                    </TableCell>
                    <TableCell>{db.rowCount?.toLocaleString() || 0}</TableCell>
                    <TableCell>{db.columns?.length || 0}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openDatasetEdit(db)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(db.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground border rounded-lg">
              <FileSpreadsheet className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No hay datasets cargados</p>
              <p className="text-xs">Sube un archivo CSV para comenzar</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={datasetEditOpen} onOpenChange={setDatasetEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Dataset</DialogTitle>
            <DialogDescription>Modifica los datos del dataset.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="dataset-name">Nombre</Label>
              <Input
                id="dataset-name"
                value={datasetName}
                onChange={(e) => setDatasetName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dataset-description">Descripción</Label>
              <Textarea
                id="dataset-description"
                value={datasetDescription}
                onChange={(e) => setDatasetDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDatasetEditOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleDatasetSave}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
