"use client"

import { ArrowLeft, GripVertical, Plus, Table2, Trash2 } from "lucide-react"
import Link from "next/link"
import type { ColumnType } from "@/core/project"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
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
import { useSchema } from "../hooks/use-schema"

export function SchemaView() {
  const {
    projectId,
    projectData,
    mounted,
    router,
    databases,
    selectedDatabaseId,
    setSelectedDatabaseId,
    selectedDatabase,
    previewColumns,
    pendingColumns,
    existingColumns,
    loadDialogOpen,
    setLoadDialogOpen,
    confirmReplaceOpen,
    setConfirmReplaceOpen,
    COLUMN_TYPES,
    handleLoadColumns,
    handleConfirmReplace,
    handleUpdateColumn,
    handleAddColumn,
    deleteColumn,
  } = useSchema()

  if (!mounted) return null

  if (!projectData) {
    return (
      <main className="min-h-screen p-8">
        <Card>
          <CardContent className="py-8 text-center">
            <p>Proyecto no encontrado</p>
            <Link href="/projects">
              <Button className="mt-4">Volver</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b px-6 py-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push(`/projects/${projectId}`)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Esquema del Proyecto</h1>
          <p className="text-sm text-muted-foreground">
            {projectData.name} - Define las tablas y columnas
          </p>
        </div>
      </header>

      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <CardTitle>Columnas del Esquema</CardTitle>
                <Badge variant="secondary">{existingColumns.length} columnas</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedDatabaseId("")
                    setLoadDialogOpen(true)
                  }}
                  disabled={databases.length === 0}
                  title={
                    databases.length === 0 ? "No hay datasets cargados en este proyecto" : undefined
                  }
                >
                  <Table2 className="mr-1 h-3 w-3" />
                  Cargar desde dataset
                </Button>
                <Button variant="outline" size="sm" onClick={handleAddColumn}>
                  <Plus className="mr-1 h-3 w-3" />
                  Agregar Columna
                </Button>
              </div>
            </CardHeader>

            {existingColumns.length === 0 ? (
              <CardContent className="py-12 flex flex-col items-center justify-center text-center text-muted-foreground">
                <p className="text-lg">No hay columnas definidas</p>
                <p className="text-sm">
                  {databases.length > 0
                    ? "Agrega columnas manualmente o carga desde un dataset"
                    : "Agrega columnas para definir el esquema maestro"}
                </p>
              </CardContent>
            ) : (
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/4">Nombre Lógico</TableHead>
                      <TableHead className="w-1/4">Tipo</TableHead>
                      <TableHead className="w-1/4">Label Visión</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {existingColumns.map((col) => (
                      <TableRow key={col.id}>
                        <TableCell>
                          <Input
                            value={col.name}
                            onChange={(e) => handleUpdateColumn(col.id, { name: e.target.value })}
                            className="h-8"
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={col.type}
                            onValueChange={(value) =>
                              handleUpdateColumn(col.id, { type: value as ColumnType })
                            }
                          >
                            <SelectTrigger className="h-8 w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {COLUMN_TYPES.map((t) => (
                                <SelectItem key={t.value} value={t.value}>
                                  {t.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            value={col.label || ""}
                            onChange={(e) => handleUpdateColumn(col.id, { label: e.target.value })}
                            placeholder="Label"
                            className="h-8"
                          />
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => deleteColumn(col.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            )}
          </Card>
        </div>
      </div>

      <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Cargar esquema desde dataset</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="dataset-select">
                Dataset
              </label>
              <Select value={selectedDatabaseId} onValueChange={setSelectedDatabaseId}>
                <SelectTrigger id="dataset-select">
                  <SelectValue placeholder="Selecciona un dataset" />
                </SelectTrigger>
                <SelectContent>
                  {databases.map((db) => (
                    <SelectItem key={db.id} value={db.id}>
                      {db.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {previewColumns.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-sm font-medium">
                  Vista previa{" "}
                  <span className="text-muted-foreground font-normal">
                    ({previewColumns.length} columnas)
                  </span>
                </p>
                <div className="border rounded-lg max-h-48 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Tipo inferido</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewColumns.map((col) => (
                        <TableRow key={col.id}>
                          <TableCell className="py-1.5 text-sm">{col.name}</TableCell>
                          <TableCell className="py-1.5">
                            <Badge variant="secondary" className="text-xs">
                              {COLUMN_TYPES.find((t) => t.value === col.type)?.label ?? col.type}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setLoadDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleLoadColumns} disabled={!selectedDatabase}>
              Cargar columnas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmReplaceOpen} onOpenChange={setConfirmReplaceOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Reemplazar esquema actual?</AlertDialogTitle>
            <AlertDialogDescription>
              Ya tienes {existingColumns.length} columna
              {existingColumns.length !== 1 ? "s" : ""} definida
              {existingColumns.length !== 1 ? "s" : ""}. Esta acción las reemplazará con las{" "}
              {pendingColumns.length} columnas del dataset seleccionado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmReplace}>Reemplazar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
