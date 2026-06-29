"use client"

import { useState } from "react"
import type { ProjectSortField, SortOrder } from "@/core"
import { useProjects } from "@/modules/project/hooks/use-projects"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"

export function HomePage() {
  const {
    projects,
    total,
    totalPages,
    loading,
    search,
    page,
    pageSize,
    sortField,
    sortOrder,
    handleSearchChange,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
    handleCreate,
  } = useProjects()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [newName, setNewName] = useState("")
  const [newDescription, setNewDescription] = useState("")

  async function onCreate() {
    if (!newName.trim()) return
    await handleCreate(newName.trim(), newDescription.trim() || undefined)
    setNewName("")
    setNewDescription("")
    setDialogOpen(false)
  }

  return (
    <div className="min-h-screen p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Proyectos</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Nuevo proyecto</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear proyecto</DialogTitle>
              <DialogDescription>
                Completa los campos para crear un nuevo proyecto.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej. Ventas Q1"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descripción (opcional)</Label>
                <Input
                  id="description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Breve descripción del proyecto"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={onCreate} disabled={!newName.trim()}>
                Crear
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar proyectos..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={`${sortField}:${sortOrder}`}
            onValueChange={(v) => {
              const [field, order] = v.split(":") as [ProjectSortField, SortOrder]
              handleSortChange(field, order)
            }}
          >
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt:desc">Más recientes</SelectItem>
              <SelectItem value="createdAt:asc">Más antiguos</SelectItem>
              <SelectItem value="name:asc">Nombre A-Z</SelectItem>
              <SelectItem value="name:desc">Nombre Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Cargando...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 border rounded-lg text-muted-foreground">
          {search ? (
            <p>No se encontraron proyectos con ese nombre.</p>
          ) : (
            <div className="space-y-2">
              <p className="font-medium text-foreground">Aún no hay proyectos</p>
              <p className="text-sm">Crea tu primer proyecto para empezar.</p>
            </div>
          )}
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Fecha de creación</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">
                    <a href={`/projects/${p.id}`} className="hover:text-primary transition-colors">
                      {p.name}
                    </a>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p.description || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {p.createdAt.toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {total} proyecto{total !== 1 ? "s" : ""}
            </span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Por página:</span>
                <Select
                  value={String(pageSize)}
                  onValueChange={(v) => handlePageSizeChange(Number(v))}
                >
                  <SelectTrigger className="w-16 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => handlePageChange(page - 1)}
                >
                  Anterior
                </Button>
                <span className="px-2 text-muted-foreground">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => handlePageChange(page + 1)}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
