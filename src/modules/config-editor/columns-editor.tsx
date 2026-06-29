"use client"

import { Database, FunctionSquare, Plus, ShieldCheck, Trash2, Wand2 } from "lucide-react"
import { useMemo, useState } from "react"
import type {
  ColumnDefinition,
  ColumnKind,
  ColumnTransformer,
  ColumnValidation,
} from "@/core/data-import/domain/models/column"
import type { Database as DbRecord } from "@/core/project"
import { TransformersEditor } from "@/modules/config-editor/transformers-editor"
import { ValidatorsEditor } from "@/modules/config-editor/validators-editor"
import { VirtualColumnsEditor } from "@/modules/config-editor/virtual-columns-editor"
import { Badge } from "@/shared/components/ui/badge"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"
import type { ColumnType } from "./constants"
import { COLUMN_TYPES, getColumnHealth } from "./constants"

export function ColumnsEditor({
  columns,
  onChange,
  databases = [],
}: {
  columns: ColumnDefinition[]
  onChange: (columns: ColumnDefinition[]) => void
  databases?: DbRecord[]
}) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<ColumnDefinition | null>(null)
  const [name, setName] = useState("")
  const [label, setLabel] = useState("")
  const [type, setType] = useState<ColumnType>("string")
  const [format, setFormat] = useState("")
  const [alignment, setAlignment] = useState<"left" | "center" | "right">("left")
  const [validations, setValidations] = useState<ColumnValidation[]>([])
  const [transformers, setTransformers] = useState<ColumnTransformer[]>([])
  const [kind, setKind] = useState<ColumnKind>("source")
  const [sourceColumn, setSourceColumn] = useState("")
  const [calculate, setCalculate] = useState("")
  const [inlineEditingId, setInlineEditingId] = useState<string | null>(null)
  const [loadDialogOpen, setLoadDialogOpen] = useState(false)

  function resetForm() {
    setName("")
    setLabel("")
    setType("string")
    setKind("source")
    setSourceColumn("")
    setFormat("")
    setAlignment("left")
    setValidations([])
    setTransformers([])
    setCalculate("")
    setEditing(null)
  }

  function openNew() {
    resetForm()
    setDialogOpen(true)
  }

  function openEdit(col: ColumnDefinition) {
    setEditing(col)
    setName(col.header)
    setLabel(col.tooltip || "")
    setType(col.type)
    setKind(col.kind || "source")
    setSourceColumn(col.sourceColumn || "")
    setFormat(col.format || "")
    setAlignment(col.alignment || "left")
    setValidations(col.validations || [])
    setTransformers(col.transformers || [])
    setCalculate(col.calculate || "")
    setDialogOpen(true)
  }

  function save() {
    if (!name.trim()) return
    const col: ColumnDefinition = {
      id: editing?.id ?? crypto.randomUUID(),
      header: name.trim(),
      type,
      kind,
      sourceColumn: kind === "source" ? sourceColumn || undefined : undefined,
      format: format || undefined,
      alignment,
      tooltip: label.trim() || undefined,
      validations: validations.length > 0 ? validations : undefined,
      transformers: transformers.length > 0 ? transformers : undefined,
      calculate: kind === "virtual" ? calculate.trim() || undefined : undefined,
    }
    if (editing) {
      onChange(columns.map((c) => (c.id === editing.id ? col : c)))
    } else {
      onChange([...columns, col])
    }
    setDialogOpen(false)
    resetForm()
  }

  function remove(id: string) {
    onChange(columns.filter((c) => c.id !== id))
  }

  const [previewOpen, setPreviewOpen] = useState(false)

  const columnHealth = useMemo(() => {
    const results: { col: ColumnDefinition; status: string; message: string }[] = []
    for (const col of columns) {
      const health = getColumnHealth(col)
      results.push({ col, ...health })
    }
    return results
  }, [columns])

  const validCount = columnHealth.filter((h) => h.status === "valid").length
  const warningCount = columnHealth.filter((h) => h.status === "warning").length
  const errorCount = columnHealth.filter((h) => h.status === "error").length

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Columnas</h3>
        <div className="flex items-center gap-2">
          {databases.length > 0 && (
            <Button variant="outline" size="sm" onClick={() => setLoadDialogOpen(true)}>
              <Database className="mr-2 h-4 w-4" />
              Cargar desde dataset
            </Button>
          )}
          {columns.length > 0 && (
            <Button variant="outline" size="sm" onClick={() => setPreviewOpen(!previewOpen)}>
              <span className="flex items-center gap-1.5">
                {validCount > 0 && (
                  <Badge className="bg-green-500 hover:bg-green-500 text-[10px] px-1 py-0">
                    {validCount} OK
                  </Badge>
                )}
                {warningCount > 0 && (
                  <Badge className="bg-yellow-500 hover:bg-yellow-500 text-[10px] px-1 py-0">
                    {warningCount} WARN
                  </Badge>
                )}
                {errorCount > 0 && (
                  <Badge className="bg-red-500 hover:bg-red-500 text-[10px] px-1 py-0">
                    {errorCount} ERR
                  </Badge>
                )}
              </span>
            </Button>
          )}
          <Button size="sm" onClick={openNew}>
            <Plus className="mr-2 h-4 w-4" />
            Agregar Columna
          </Button>
        </div>
      </div>

      <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cargar columnas desde dataset</DialogTitle>
            <DialogDescription>
              Selecciona un dataset existente o sube un nuevo CSV para cargar sus columnas como
              configuración.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {databases.length > 0 && (
              <>
                <p className="text-xs font-medium text-muted-foreground">Datasets existentes</p>
                {databases.map((db) => {
                  const alreadyLoaded = columns.some((c) =>
                    db.columns.some((dbc) => dbc.header === c.header),
                  )
                  return (
                    <button
                      key={db.id}
                      type="button"
                      className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors flex items-center justify-between"
                      onClick={() => {
                        const newColumns: ColumnDefinition[] = db.columns.map((dbc) => ({
                          id: crypto.randomUUID(),
                          header: dbc.header,
                          type: dbc.type || "string",
                          kind: "source",
                          sourceColumn: dbc.header,
                        }))
                        onChange(newColumns)
                        setLoadDialogOpen(false)
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Database className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{db.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {db.columns?.length || 0} columnas ·{db.rowCount?.toLocaleString() || 0}{" "}
                            filas
                          </p>
                        </div>
                      </div>
                      {alreadyLoaded && (
                        <Badge variant="secondary" className="text-xs">
                          Cargado
                        </Badge>
                      )}
                    </button>
                  )
                })}
              </>
            )}
            {databases.length === 0 && (
              <div className="text-center py-6 text-muted-foreground border rounded-lg">
                <Database className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No hay datasets disponibles</p>
                <p className="text-xs mt-1">Sube un CSV para comenzar</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {previewOpen && (
        <div className="border rounded-lg p-3 space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Resumen de Validación</p>
          {columnHealth.map((h) => (
            <div key={h.col.id} className="flex items-center gap-2 text-xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  h.status === "valid"
                    ? "bg-green-500"
                    : h.status === "warning"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
              />
              <span className="font-medium">{h.col.header}</span>
              <span className="text-muted-foreground">— {h.message}</span>
            </div>
          ))}
        </div>
      )}

      {columns.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center border rounded-lg">
          No hay columnas definidas. Agrega columnas para comenzar.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8"></TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Origen</TableHead>
              <TableHead>Label</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Validaciones</TableHead>
              <TableHead>Transformadores</TableHead>
              <TableHead>Calculada</TableHead>
              <TableHead>Formato</TableHead>
              <TableHead>Alineación</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {columns.map((col) => {
              const health = getColumnHealth(col)
              return (
                <TableRow key={col.id}>
                  <TableCell>
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        health.status === "valid"
                          ? "bg-green-500"
                          : health.status === "warning"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      title={health.message}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{col.header}</TableCell>
                  <TableCell>
                    <Badge
                      variant={col.kind === "virtual" ? "secondary" : "default"}
                      className="text-[10px]"
                    >
                      {col.kind === "virtual" ? "Virtual" : "Source"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{col.tooltip || "—"}</TableCell>
                  <TableCell>
                    {inlineEditingId === col.id ? (
                      <Select
                        value={col.type}
                        onValueChange={(v) => {
                          onChange(
                            columns.map((c) =>
                              c.id === col.id ? { ...c, type: v as ColumnType } : c,
                            ),
                          )
                          setInlineEditingId(null)
                        }}
                      >
                        <SelectTrigger className="h-7 text-xs w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {COLUMN_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-accent"
                        onClick={() => setInlineEditingId(col.id)}
                      >
                        {col.type}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {(col.validations?.length ?? 0) > 0 ? (
                      <div className="flex gap-1 flex-wrap">
                        {col.validations!.map((v, i) => (
                          <Badge key={i} variant="secondary" className="text-[10px] px-1 py-0">
                            <ShieldCheck className="h-2.5 w-2.5 mr-0.5" />
                            {v.type}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {(col.transformers?.length ?? 0) > 0 ? (
                      <div className="flex gap-1 flex-wrap">
                        {col.transformers!.map((t, i) => (
                          <Badge key={i} variant="secondary" className="text-[10px] px-1 py-0">
                            <Wand2 className="h-2.5 w-2.5 mr-0.5" />
                            {t.type}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {col.calculate ? (
                      <Badge variant="default" className="bg-purple-500 hover:bg-purple-500">
                        <FunctionSquare className="h-2.5 w-2.5 mr-0.5" />
                        Sí
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{col.format || "—"}</TableCell>
                  <TableCell>{col.alignment || "left"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(col)}>
                        Editar
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => remove(col.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Columna" : "Nueva Columna"}</DialogTitle>
            <DialogDescription>Define las propiedades de la columna.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="col-name">Nombre / Header</Label>
              <Input id="col-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="col-label">Label (opcional)</Label>
              <Input
                id="col-label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Nombre visible para el usuario"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="col-type">Tipo</Label>
              <Select value={type} onValueChange={(v) => setType(v as ColumnType)}>
                <SelectTrigger id="col-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COLUMN_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="col-kind">Tipo de columna</Label>
              <Select value={kind} onValueChange={(v) => setKind(v as ColumnKind)}>
                <SelectTrigger id="col-kind">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="source">Source (dataset)</SelectItem>
                  <SelectItem value="virtual">Virtual (calculada)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {kind === "source" && databases.length > 0 && (
              <div className="grid gap-2">
                <Label htmlFor="col-source">Columna del dataset</Label>
                <Select value={sourceColumn} onValueChange={setSourceColumn}>
                  <SelectTrigger id="col-source">
                    <SelectValue placeholder="Seleccionar columna..." />
                  </SelectTrigger>
                  <SelectContent>
                    {databases.flatMap((db) =>
                      (db.columns || []).map((dbc) => (
                        <SelectItem key={`${db.id}-${dbc.header}`} value={dbc.header}>
                          {dbc.header} ({db.name})
                        </SelectItem>
                      )),
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="col-format">Formato (opcional)</Label>
              <Input
                id="col-format"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                placeholder="e.g. #,##0.00"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="col-align">Alineación</Label>
              <Select
                value={alignment}
                onValueChange={(v) => setAlignment(v as "left" | "center" | "right")}
              >
                <SelectTrigger id="col-align">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Izquierda</SelectItem>
                  <SelectItem value="center">Centro</SelectItem>
                  <SelectItem value="right">Derecha</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <ValidatorsEditor validations={validations} onChange={setValidations} />

            <TransformersEditor transformers={transformers} onChange={setTransformers} />

            {kind === "virtual" && (
              <VirtualColumnsEditor
                columns={columns}
                calculate={calculate}
                onChange={setCalculate}
              />
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false)
                resetForm()
              }}
            >
              Cancelar
            </Button>
            <Button onClick={save}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
