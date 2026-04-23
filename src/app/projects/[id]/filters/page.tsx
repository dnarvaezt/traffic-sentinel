"use client"

import { Filter, Pencil, Plus, Trash2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { useProjectStore } from "@/application/stores/project-store"
import type { FilterDefinition, FilterOperator } from "@/application/types"
import { Button } from "@/infrastructure/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/infrastructure/components/ui/dialog"
import { Input } from "@/infrastructure/components/ui/input"
import { Label } from "@/infrastructure/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/infrastructure/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/infrastructure/components/ui/table"

const FILTER_OPERATORS: { value: FilterOperator; label: string }[] = [
  { value: "contains", label: "Contiene" },
  { value: "notContains", label: "No contiene" },
  { value: "equals", label: "Igual a" },
  { value: "notEquals", label: "Diferente de" },
  { value: "greaterThan", label: "Mayor que" },
  { value: "lessThan", label: "Menor que" },
  { value: "greaterThanOrEquals", label: "Mayor o igual" },
  { value: "lessThanOrEquals", label: "Menor o igual" },
  { value: "isNull", label: "Es nulo" },
  { value: "isNotNull", label: "No es nulo" },
]

export default function FiltersPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const { getProject, addFilter, updateFilter, deleteFilter } = useProjectStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const projectData = getProject(projectId)

  // Collect unique column names from all datasets (columnId = col.name for Danfo.js)
  const availableColumns = useMemo(() => {
    const seen = new Set<string>()
    const cols: { name: string; type: string }[] = []
    for (const db of projectData?.databases ?? []) {
      for (const col of db.columns ?? []) {
        if (!seen.has(col.name)) {
          seen.add(col.name)
          cols.push({ name: col.name, type: col.inferredType })
        }
      }
    }
    return cols
  }, [projectData])

  const [filterDialogOpen, setFilterDialogOpen] = useState(false)
  const [editingFilter, setEditingFilter] = useState<FilterDefinition | null>(null)
  const [filterName, setFilterName] = useState("")
  const [filterDescription, setFilterDescription] = useState("")
  const [filterColumnId, setFilterColumnId] = useState("")
  const [filterOperator, setFilterOperator] = useState<FilterOperator>("contains")
  const [filterValue, setFilterValue] = useState("")

  if (!mounted) return null
  if (!projectData) {
    return (
      <main className="min-h-screen p-8">
        <p>Proyecto no encontrado</p>
        <Button onClick={() => router.push("/projects")}>Volver a proyectos</Button>
      </main>
    )
  }

  function openFilterDialog(filter?: FilterDefinition) {
    if (filter) {
      setEditingFilter(filter)
      setFilterName(filter.name)
      setFilterDescription(filter.description || "")
      setFilterColumnId(filter.columnId)
      setFilterOperator(filter.operator)
      setFilterValue(String(filter.value ?? ""))
    } else {
      setEditingFilter(null)
      setFilterName("")
      setFilterDescription("")
      setFilterColumnId(availableColumns[0]?.name ?? "")
      setFilterOperator("contains")
      setFilterValue("")
    }
    setFilterDialogOpen(true)
  }

  function handleFilterSave() {
    if (!filterName.trim() || !filterColumnId) return
    const filterData: Omit<FilterDefinition, "id"> = {
      name: filterName.trim(),
      description: filterDescription.trim() || undefined,
      columnId: filterColumnId,
      operator: filterOperator,
      value: filterOperator === "isNull" || filterOperator === "isNotNull" ? null : filterValue,
    }
    if (editingFilter) {
      updateFilter(projectId, editingFilter.id, filterData)
    } else {
      addFilter(projectId, { id: crypto.randomUUID(), ...filterData })
    }
    setFilterDialogOpen(false)
  }

  return (
    <main className="min-h-screen flex">
      <aside className="w-64 border-r p-4 space-y-4">
        <Button variant="ghost" size="sm" onClick={() => router.push(`/projects/${projectId}`)}>
          Volver al proyecto
        </Button>

        <div className="pt-2 border-t">
          <p className="text-sm font-semibold px-2 mb-2 truncate">{projectData.name}</p>
        </div>

        <div className="pt-2 border-t">
          <h2 className="text-sm font-semibold px-2 mb-2">Navegación</h2>
          <button
            type="button"
            onClick={() => router.push(`/projects/${projectId}`)}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm hover:bg-accent"
          >
            Datasets
          </button>
          <button
            type="button"
            onClick={() => router.push(`/projects/${projectId}/filters`)}
            className="w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm bg-secondary"
          >
            <span className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </span>
            <span className="text-xs bg-muted px-1.5 py-0.5 rounded">
              {projectData.filters?.length ?? 0}
            </span>
          </button>
          <button
            type="button"
            onClick={() => router.push(`/projects/${projectId}/schema`)}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm hover:bg-accent"
          >
            Schema
          </button>
        </div>
      </aside>

      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Filtros guardados</h2>
            <Button
              size="sm"
              onClick={() => openFilterDialog()}
              disabled={availableColumns.length === 0}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo filtro
            </Button>
          </div>

          {availableColumns.length === 0 && (
            <div className="text-sm text-muted-foreground p-4 bg-muted rounded-lg">
              Sube un dataset primero para poder crear filtros.
            </div>
          )}

          {projectData.filters?.length ? (
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
                {projectData.filters.map((filter) => {
                  const operatorLabel = FILTER_OPERATORS.find(
                    (o) => o.value === filter.operator,
                  )?.label
                  return (
                    <TableRow key={filter.id}>
                      <TableCell>
                        <div className="font-medium">{filter.name}</div>
                        {filter.description && (
                          <div className="text-xs text-muted-foreground">{filter.description}</div>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{filter.columnId}</TableCell>
                      <TableCell>{operatorLabel}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {filter.value !== null && filter.value !== undefined
                          ? String(filter.value)
                          : "—"}
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
                            onClick={() => deleteFilter(projectId, filter.id)}
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
              <p className="text-sm">No hay filtros guardados</p>
              <p className="text-xs">Los filtros creados en un dataset aparecen aquí</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingFilter ? "Editar filtro" : "Nuevo filtro"}</DialogTitle>
            <DialogDescription>Este filtro se guardará en el proyecto.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="filter-name">Nombre</Label>
              <Input
                id="filter-name"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                placeholder="Ej. Ventas mayores a 1000"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="filter-column">Columna</Label>
              <Select value={filterColumnId} onValueChange={setFilterColumnId}>
                <SelectTrigger id="filter-column">
                  <SelectValue placeholder="Selecciona una columna" />
                </SelectTrigger>
                <SelectContent>
                  {availableColumns.map((col) => (
                    <SelectItem key={col.name} value={col.name}>
                      {col.name} <span className="text-muted-foreground">({col.type})</span>
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
            <Button onClick={handleFilterSave} disabled={!filterName.trim() || !filterColumnId}>
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
