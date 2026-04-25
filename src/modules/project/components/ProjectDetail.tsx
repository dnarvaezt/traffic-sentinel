"use client"

import {
  ArrowLeft,
  FileSpreadsheet,
  Filter,
  Pencil,
  Plus,
  Settings,
  Star,
  Trash2,
  Upload,
} from "lucide-react"
import Link from "next/link"
import type { FilterOperator } from "@/core/project"
import { FILTER_OPERATORS } from "@/modules/filters"
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
import { Textarea } from "@/shared/components/ui/textarea"
import { useProjectDetail } from "../hooks/use-project-detail"

export function ProjectDetail() {
  const {
    projectId,
    projectData,
    mounted,
    router,
    activeTab,
    setActiveTab,
    uploading,
    fileInputRef,
    editProjectOpen,
    setEditProjectOpen,
    projectName,
    setProjectName,
    projectDescription,
    setProjectDescription,
    handleSaveProject,
    handleFileSelect,
    handleDeleteDataset,
    datasetEditOpen,
    setDatasetEditOpen,
    datasetName,
    setDatasetName,
    datasetDescription,
    setDatasetDescription,
    openDatasetEdit,
    handleDatasetSave,
    handleToggleFavorite,
    filterDialogOpen,
    setFilterDialogOpen,
    editingFilter,
    filterName,
    setFilterName,
    filterDescription,
    setFilterDescription,
    filterColumnId,
    setFilterColumnId,
    filterOperator,
    setFilterOperator,
    filterValue,
    setFilterValue,
    openFilterDialog,
    handleFilterSave,
    handleDeleteFilter,
  } = useProjectDetail()

  if (!mounted) return null

  const schemaColumns = projectData?.schema?.columns || []

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

  const navItems = [
    {
      id: "datasets" as const,
      label: "Datasets",
      href: `/projects/${projectId}`,
      icon: FileSpreadsheet,
    },
    {
      id: "filters" as const,
      label: "Filtros",
      href: `/projects/${projectId}/filters`,
      icon: Filter,
      count: projectData.filters?.length ?? 0,
    },
    {
      id: "schema" as const,
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
              onClick={() => {
                if (item.id === "datasets" || item.id === "filters") {
                  setActiveTab(item.id)
                }
                router.push(item.href)
              }}
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
        <div className="max-w-4xl mx-auto space-y-6">
          {activeTab === "datasets" && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Datasets</h2>
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

              {projectData.databases.length > 0 ? (
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
                            className="flex items-center gap-2 hover:text-primary"
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
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteDataset(db.id)}
                            >
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
            </>
          )}

          {activeTab === "filters" && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Filtros del Proyecto</h2>
                <Button
                  size="sm"
                  onClick={() => openFilterDialog()}
                  disabled={schemaColumns.length === 0}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Filtro
                </Button>
              </div>

              {projectData.filters?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Columna</TableHead>
                      <TableHead>Operador</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projectData.filters?.map((filter) => {
                      const column = schemaColumns.find((c) => c.id === filter.columnId)
                      const operatorLabel = FILTER_OPERATORS.find(
                        (o) => o.value === filter.operator,
                      )?.label
                      return (
                        <TableRow key={filter.id}>
                          <TableCell>
                            <div className="font-medium">{filter.name || "Sin nombre"}</div>
                            {filter.description && (
                              <div className="text-xs text-muted-foreground">
                                {filter.description}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>{column?.name || filter.columnId}</TableCell>
                          <TableCell>{operatorLabel}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {filter.value !== null ? String(filter.value) : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openFilterDialog(filter)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteFilter(filter.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12 text-muted-foreground border rounded-lg">
                  <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No hay filtros configurados</p>
                  <p className="text-xs">Crea filtros para aplicarlos a tus datasets</p>
                </div>
              )}

              {schemaColumns.length === 0 && (
                <div className="text-sm text-muted-foreground p-4 bg-muted rounded-lg">
                  Define columnas en el Schema primero para poder crear filtros.
                </div>
              )}
            </>
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
              <Label htmlFor="dataset-desc">Descripción</Label>
              <Textarea
                id="dataset-desc"
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

      <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingFilter ? "Editar Filtro" : "Nuevo Filtro"}</DialogTitle>
            <DialogDescription>
              Configura el filtro para aplicarlo a tus datasets.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="filter-name">Nombre (opcional)</Label>
              <Input
                id="filter-name"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                placeholder="Nombre del filtro"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="filter-column">Columna</Label>
              <Select value={filterColumnId} onValueChange={setFilterColumnId}>
                <SelectTrigger id="filter-column">
                  <SelectValue placeholder="Selecciona una columna" />
                </SelectTrigger>
                <SelectContent>
                  {schemaColumns.map((col) => (
                    <SelectItem key={col.id} value={col.id}>
                      {col.name} ({col.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="filter-operator">Operador</Label>
              <Select
                value={filterOperator}
                onValueChange={(v) => setFilterOperator(v as FilterOperator)}
              >
                <SelectTrigger id="filter-operator">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FILTER_OPERATORS.map((op) => (
                    <SelectItem key={op.value} value={op.value}>
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {filterOperator !== "isNull" && filterOperator !== "isNotNull" && (
              <div className="grid gap-2">
                <Label htmlFor="filter-value">Valor</Label>
                <Input
                  id="filter-value"
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="filter-description">Descripción (opcional)</Label>
              <Input
                id="filter-description"
                value={filterDescription}
                onChange={(e) => setFilterDescription(e.target.value)}
                placeholder="Descripción del filtro"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFilterDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleFilterSave}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
