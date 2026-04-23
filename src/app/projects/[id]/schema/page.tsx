"use client"

import { ArrowLeft, GripVertical, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useProjectStore } from "@/application/stores/project-store"
import type { ColumnDefinition, ColumnType, TableDefinition } from "@/application/types"
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
import { Badge } from "@/infrastructure/components/ui/badge"
import { Button } from "@/infrastructure/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/infrastructure/components/ui/card"
import { Checkbox } from "@/infrastructure/components/ui/checkbox"
import { Input } from "@/infrastructure/components/ui/input"
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

const COLUMN_TYPES: { value: ColumnType; label: string }[] = [
  { value: "string", label: "Texto" },
  { value: "number", label: "Número" },
  { value: "date", label: "Fecha" },
  { value: "boolean", label: "Booleano" },
  { value: "email", label: "Email" },
  { value: "url", label: "URL" },
]

export default function SchemaPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const { getProject, addTable, updateTable, deleteTable } = useProjectStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const projectData = getProject(projectId)!

  const [newTableName, setNewTableName] = useState("")

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

  function handleAddTable() {
    if (!newTableName.trim()) return
    const table: TableDefinition = {
      id: crypto.randomUUID(),
      name: newTableName.trim(),
      columns: [],
    }
    addTable(projectId, table)
    setNewTableName("")
  }

  function handleUpdateColumn(
    tableId: string,
    columnId: string,
    updates: Partial<ColumnDefinition>,
  ) {
    const table = projectData.schema.tables.find((t) => t.id === tableId)
    if (!table) return

    const updatedColumns = table.columns.map((col) =>
      col.id === columnId ? { ...col, ...updates } : col,
    )
    updateTable(projectId, tableId, { columns: updatedColumns })
  }

  function handleAddColumn(tableId: string) {
    const table = projectData.schema.tables.find((t) => t.id === tableId)
    if (!table) return

    const newColumn: ColumnDefinition = {
      id: crypto.randomUUID(),
      name: `column_${table.columns.length + 1}`,
      type: "string",
      aggregatable: false,
      filterable: true,
    }
    updateTable(projectId, tableId, { columns: [...table.columns, newColumn] })
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
            <CardHeader>
              <CardTitle>Agregar Tabla</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Input
                value={newTableName}
                onChange={(e) => setNewTableName(e.target.value)}
                placeholder="Nombre de la tabla"
                onKeyDown={(e) => e.key === "Enter" && handleAddTable()}
              />
              <Button onClick={handleAddTable}>
                <Plus className="mr-2 h-4 w-4" />
                Agregar
              </Button>
            </CardContent>
          </Card>

          {projectData.schema.tables.length === 0 ? (
            <Card className="py-12">
              <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground">
                <p className="text-lg">No hay tablas definidas</p>
                <p className="text-sm">Agrega tablas para estructurar tus datos</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {projectData.schema.tables.map((table) => (
                <Card key={table.id}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <CardTitle>{table.name}</CardTitle>
                      <Badge variant="secondary">{table.columns.length} columnas</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleAddColumn(table.id)}>
                        <Plus className="mr-1 h-3 w-3" />
                        Columna
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar tabla?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción eliminará la tabla y todas sus columnas.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteTable(projectId, table.id)}>
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardHeader>

                  {table.columns.length > 0 && (
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-1/4">Nombre</TableHead>
                            <TableHead className="w-1/4">Tipo</TableHead>
                            <TableHead className="w-1/4">Label</TableHead>
                            <TableHead className="w-16 text-center">Agregable</TableHead>
                            <TableHead className="w-16 text-center">Filtrable</TableHead>
                            <TableHead className="w-12"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {table.columns.map((col) => (
                            <TableRow key={col.id}>
                              <TableCell>
                                <Input
                                  value={col.name}
                                  onChange={(e) =>
                                    handleUpdateColumn(table.id, col.id, { name: e.target.value })
                                  }
                                  className="h-8"
                                />
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={col.type}
                                  onValueChange={(value) =>
                                    handleUpdateColumn(table.id, col.id, {
                                      type: value as ColumnType,
                                      aggregatable: value === "number",
                                    })
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
                                  onChange={(e) =>
                                    handleUpdateColumn(table.id, col.id, { label: e.target.value })
                                  }
                                  placeholder="Label"
                                  className="h-8"
                                />
                              </TableCell>
                              <TableCell className="text-center">
                                <Checkbox
                                  checked={col.aggregatable}
                                  onCheckedChange={(checked) =>
                                    handleUpdateColumn(table.id, col.id, {
                                      aggregatable: checked === true,
                                    })
                                  }
                                />
                              </TableCell>
                              <TableCell className="text-center">
                                <Checkbox
                                  checked={col.filterable}
                                  onCheckedChange={(checked) =>
                                    handleUpdateColumn(table.id, col.id, {
                                      filterable: checked === true,
                                    })
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    const updatedColumns = table.columns.filter(
                                      (c) => c.id !== col.id,
                                    )
                                    updateTable(projectId, table.id, { columns: updatedColumns })
                                  }}
                                >
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
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
