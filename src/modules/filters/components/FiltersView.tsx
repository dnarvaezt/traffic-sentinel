"use client"

import { Filter, Pencil, Plus, Search, Trash2 } from "lucide-react"
import type { FilterOperator } from "@/core/project"
import { ProjectLayout } from "@/modules/project/components/ProjectLayout"
import { Button } from "@/shared/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Switch } from "@/shared/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"
import { FILTER_OPERATORS, useFilters } from "../hooks/use-filters"

export function FiltersView() {
  const {
    projectData,
    mounted,
    availableColumns,
    searchQuery,
    setSearchQuery,
    filteredFilters,
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
    filterGroupOperator,
    setFilterGroupOperator,
    filterConditions,
    addCondition,
    updateCondition,
    removeCondition,
    previewCount,
    previewTotal,
    computePreview,
    openFilterDialog,
    handleFilterSave,
    handleDeleteFilter,
    toggleFilterEnabled,
  } = useFilters()

  if (!mounted) return null
  if (!projectData) return null

  return (
    <ProjectLayout>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold shrink-0">Filtros guardados</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar filtros..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-sm w-48"
            />
          </div>
          <Button
            size="sm"
            onClick={() => openFilterDialog()}
            disabled={availableColumns.length === 0}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nuevo filtro
          </Button>
        </div>
      </div>

      {availableColumns.length === 0 && (
        <div className="text-sm text-muted-foreground p-4 bg-muted rounded-lg">
          Sube un dataset primero para poder crear filtros.
        </div>
      )}

      {filteredFilters.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Activo</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Columna</TableHead>
              <TableHead>Operador</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFilters.map((filter) => {
              const operatorLabel = FILTER_OPERATORS.find((o) => o.value === filter.operator)?.label
              return (
                <TableRow key={filter.id} className={filter.enabled === false ? "opacity-50" : ""}>
                  <TableCell>
                    <Switch
                      checked={filter.enabled !== false}
                      onCheckedChange={() => toggleFilterEnabled(filter)}
                    />
                  </TableCell>
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
                      <Button variant="ghost" size="sm" onClick={() => openFilterDialog(filter)}>
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
      ) : projectData.filters && projectData.filters.length > 0 && searchQuery ? (
        <div className="text-center py-12 text-muted-foreground border rounded-lg">
          <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No se encontraron filtros</p>
          <p className="text-xs">Prueba con otro término de búsqueda</p>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground border rounded-lg">
          <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No hay filtros guardados</p>
          <p className="text-xs">Los filtros creados en un dataset aparecen aquí</p>
        </div>
      )}

      <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
        <DialogContent className="max-w-lg">
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
              <div className="flex items-center justify-between">
                <Label>Condiciones</Label>
                <Select
                  value={filterGroupOperator}
                  onValueChange={(v) => setFilterGroupOperator(v as "and" | "or")}
                >
                  <SelectTrigger className="w-24 h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="and">AND</SelectItem>
                    <SelectItem value="or">OR</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 border rounded-lg p-3">
                <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end">
                  <div>
                    <Label className="text-xs text-muted-foreground">Operador</Label>
                    <Select
                      value={filterOperator}
                      onValueChange={(v) => {
                        setFilterOperator(v as FilterOperator)
                        computePreview(filterColumnId, v as FilterOperator, filterValue)
                      }}
                    >
                      <SelectTrigger className="h-8 text-xs">
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
                    <div className="col-span-2">
                      <Label className="text-xs text-muted-foreground">Valor</Label>
                      <Input
                        value={filterValue}
                        onChange={(e) => {
                          setFilterValue(e.target.value)
                          computePreview(filterColumnId, filterOperator, e.target.value)
                        }}
                        className="h-8 text-xs"
                        placeholder="Valor"
                      />
                    </div>
                  )}
                </div>

                {filterConditions.map((cond, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end border-t pt-2"
                  >
                    <div>
                      <Label className="text-xs text-muted-foreground">Columna</Label>
                      <Select
                        value={cond.columnId}
                        onValueChange={(v) => updateCondition(i, { columnId: v })}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {availableColumns.map((col) => (
                            <SelectItem key={col.name} value={col.name}>
                              {col.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Operador</Label>
                      <Select
                        value={cond.operator}
                        onValueChange={(v) => updateCondition(i, { operator: v as FilterOperator })}
                      >
                        <SelectTrigger className="h-8 text-xs">
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
                    {cond.operator !== "isNull" && cond.operator !== "isNotNull" && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Valor</Label>
                        <Input
                          value={String(cond.value ?? "")}
                          onChange={(e) => updateCondition(i, { value: e.target.value })}
                          className="h-8 text-xs"
                        />
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCondition(i)}
                      className="h-8"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={addCondition}
                  className="w-full text-xs"
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Agregar condición
                </Button>
              </div>
            </div>

            {previewTotal !== null && (
              <div className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                Vista previa: {previewCount ?? "..."} de {previewTotal} filas coinciden
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
    </ProjectLayout>
  )
}
