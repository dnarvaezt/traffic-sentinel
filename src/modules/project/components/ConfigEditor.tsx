"use client"

import { GripVertical, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import type { Calculator } from "@/data-import/domain/models/calculation"
import type { ColumnDefinition } from "@/data-import/domain/models/column"
import type { FilterDefinition } from "@/data-import/domain/models/filter"
import type { GroupDefinition } from "@/data-import/domain/models/group"
import type { SchemaDefinition } from "@/data-import/domain/models/schema"
import type { Transformer } from "@/data-import/domain/models/transformation"
import type { Validator } from "@/data-import/domain/models/validation"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"

type ColumnType = ColumnDefinition["type"]

const COLUMN_TYPES: ColumnType[] = [
  "string",
  "number",
  "boolean",
  "date",
  "currency",
  "percentage",
  "email",
  "url",
  "custom",
]

const VALIDATOR_TYPES = [
  { id: "required", label: "Required" },
  { id: "min", label: "Min Value" },
  { id: "max", label: "Max Value" },
  { id: "regex", label: "Regex Pattern" },
  { id: "unique", label: "Unique" },
  { id: "email", label: "Email Format" },
  { id: "date-range", label: "Date Range" },
  { id: "custom", label: "Custom Function" },
] as const

const FILTER_TYPES = [
  { id: "text", label: "Text" },
  { id: "number", label: "Number" },
  { id: "select", label: "Select" },
  { id: "date-range", label: "Date Range" },
  { id: "boolean", label: "Boolean" },
] as const

const TRANSFORMER_TYPES = [
  { id: "trim", label: "Trim" },
  { id: "uppercase", label: "Uppercase" },
  { id: "lowercase", label: "Lowercase" },
  { id: "parse-number", label: "Parse Number" },
  { id: "custom", label: "Custom Regex" },
] as const

interface ConfigEditorProps {
  config: SchemaDefinition
  onConfigChange: (config: SchemaDefinition) => void
}

function emptyConfig(): SchemaDefinition {
  return {
    columns: [],
    validators: [],
    filters: [],
    groups: [],
    calculations: [],
    transformers: [],
  }
}

export function ConfigEditor({ config, onConfigChange }: ConfigEditorProps) {
  const current = { ...emptyConfig(), ...config }

  const update = (patch: Partial<SchemaDefinition>) => {
    onConfigChange({ ...current, ...patch })
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Define la configuración de importación: columnas, validaciones, filtros, agrupaciones y más.
      </p>

      <Tabs defaultValue="columns">
        <TabsList className="flex-wrap">
          <TabsTrigger value="columns">Columnas</TabsTrigger>
          <TabsTrigger value="virtual">Virtuales</TabsTrigger>
          <TabsTrigger value="validators">Validaciones</TabsTrigger>
          <TabsTrigger value="filters">Filtros</TabsTrigger>
          <TabsTrigger value="groups">Agrupaciones</TabsTrigger>
          <TabsTrigger value="transformers">Transformaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="columns" className="space-y-4 pt-4">
          <ColumnsEditor columns={current.columns} onChange={(columns) => update({ columns })} />
        </TabsContent>

        <TabsContent value="virtual" className="space-y-4 pt-4">
          <VirtualColumnsEditor
            calculations={current.calculations || []}
            onChange={(calculations) => update({ calculations })}
          />
        </TabsContent>

        <TabsContent value="validators" className="space-y-4 pt-4">
          <ValidatorsEditor
            validators={current.validators || []}
            columns={current.columns}
            onChange={(validators) => update({ validators })}
          />
        </TabsContent>

        <TabsContent value="filters" className="space-y-4 pt-4">
          <FiltersEditor
            filters={current.filters || []}
            columns={current.columns}
            onChange={(filters) => update({ filters })}
          />
        </TabsContent>

        <TabsContent value="groups" className="space-y-4 pt-4">
          <GroupsEditor
            groups={current.groups || []}
            columns={current.columns}
            onChange={(groups) => update({ groups })}
          />
        </TabsContent>

        <TabsContent value="transformers" className="space-y-4 pt-4">
          <TransformersEditor
            transformers={current.transformers || []}
            columns={current.columns}
            onChange={(transformers) => update({ transformers })}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ColumnsEditor({
  columns,
  onChange,
}: {
  columns: ColumnDefinition[]
  onChange: (columns: ColumnDefinition[]) => void
}) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<ColumnDefinition | null>(null)
  const [name, setName] = useState("")
  const [type, setType] = useState<ColumnType>("string")
  const [format, setFormat] = useState("")
  const [alignment, setAlignment] = useState<"left" | "center" | "right">("left")

  function resetForm() {
    setName("")
    setType("string")
    setFormat("")
    setAlignment("left")
    setEditing(null)
  }

  function openNew() {
    resetForm()
    setDialogOpen(true)
  }

  function openEdit(col: ColumnDefinition) {
    setEditing(col)
    setName(col.header)
    setType(col.type)
    setFormat(col.format || "")
    setAlignment(col.alignment || "left")
    setDialogOpen(true)
  }

  function save() {
    if (!name.trim()) return
    if (editing) {
      onChange(
        columns.map((c) =>
          c.id === editing.id
            ? { ...c, header: name.trim(), type, format: format || undefined, alignment }
            : c,
        ),
      )
    } else {
      onChange([
        ...columns,
        {
          id: crypto.randomUUID(),
          header: name.trim(),
          type,
          format: format || undefined,
          alignment,
        },
      ])
    }
    setDialogOpen(false)
    resetForm()
  }

  function remove(id: string) {
    onChange(columns.filter((c) => c.id !== id))
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Columnas</h3>
        <Button size="sm" onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Columna
        </Button>
      </div>

      {columns.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center border rounded-lg">
          No hay columnas definidas. Agrega columnas para comenzar.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Formato</TableHead>
              <TableHead>Alineación</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {columns.map((col) => (
              <TableRow key={col.id}>
                <TableCell className="font-medium">{col.header}</TableCell>
                <TableCell>
                  <Badge variant="outline">{col.type}</Badge>
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
            ))}
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

function VirtualColumnsEditor({
  calculations,
  onChange,
}: {
  calculations: Calculator[]
  onChange: (calculations: Calculator[]) => void
}) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Calculator | null>(null)
  const [header, setHeader] = useState("")
  const [expression, setExpression] = useState("")

  function resetForm() {
    setHeader("")
    setExpression("")
    setEditing(null)
  }

  function openNew() {
    resetForm()
    setDialogOpen(true)
  }

  function openEdit(calc: Calculator) {
    setEditing(calc)
    setHeader(calc.header)
    const fnStr = calc.calculate.toString()
    const match = fnStr.match(/\{[\s\S]*\}/)
    setExpression(match ? match[0].replace(/[{}]/g, "").trim() : fnStr)
    setDialogOpen(true)
  }

  function save() {
    if (!header.trim() || !expression.trim()) return
    const fn = new Function("row", `return ${expression.trim()}`) as (row: any) => any
    const calc: Calculator = {
      id: editing?.id || crypto.randomUUID(),
      header: header.trim(),
      calculate: fn,
    }
    if (editing) {
      onChange(calculations.map((c) => (c.id === editing.id ? calc : c)))
    } else {
      onChange([...calculations, calc])
    }
    setDialogOpen(false)
    resetForm()
  }

  function remove(id: string) {
    onChange(calculations.filter((c) => c.id !== id))
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Columnas Virtuales</h3>
        <Button size="sm" onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Virtual
        </Button>
      </div>

      {calculations.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center border rounded-lg">
          No hay columnas virtuales. Crea una con expresiones JavaScript.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Expresión</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {calculations.map((calc) => (
              <TableRow key={calc.id}>
                <TableCell className="font-medium">{calc.header}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {calc.calculate.toString().slice(0, 80)}...
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(calc)}>
                      Editar
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => remove(calc.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Virtual" : "Nueva Columna Virtual"}</DialogTitle>
            <DialogDescription>
              Define una columna calculada usando una expresión JavaScript. Usa{" "}
              <code>row.columnaId</code> para referenciar otras columnas.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="vc-name">Nombre</Label>
              <Input id="vc-name" value={header} onChange={(e) => setHeader(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="vc-expr">Expresión</Label>
              <textarea
                id="vc-expr"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-mono"
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                placeholder="e.g. row.price * row.quantity"
                rows={3}
              />
            </div>
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

function ValidatorsEditor({
  validators,
  columns,
  onChange,
}: {
  validators: Validator[]
  columns: ColumnDefinition[]
  onChange: (validators: Validator[]) => void
}) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Validator | null>(null)
  const [vType, setVType] = useState("required")
  const [vColumn, setVColumn] = useState("")
  const [vMessage, setVMessage] = useState("")
  const [vCode, setVCode] = useState("")

  function resetForm() {
    setVType("required")
    setVColumn("")
    setVMessage("")
    setVCode("")
    setEditing(null)
  }

  function openNew() {
    resetForm()
    setVColumn(columns[0]?.id || "")
    setDialogOpen(true)
  }

  function openEdit(v: Validator) {
    setEditing(v)
    setVColumn(v.column || "")
    setVMessage(v.message)
    setVCode(v.code)
    setVType(v.code === "required" ? "required" : v.code === "unique" ? "unique" : "custom")
    setDialogOpen(true)
  }

  function save() {
    if (!vMessage.trim()) return
    let validate: (data: any) => boolean
    switch (vType) {
      case "required":
        validate = (val: any) => val !== null && val !== undefined && val !== ""
        break
      case "unique":
        validate = (() => {
          const seen = new Set()
          return (val: any) => {
            if (seen.has(val)) return false
            seen.add(val)
            return true
          }
        })()
        break
      default:
        validate = () => true
    }
    const validator: Validator = {
      id: editing?.id || crypto.randomUUID(),
      level: "cell",
      column: vColumn || undefined,
      validate,
      message: vMessage.trim(),
      code: vCode || vType,
    }
    if (editing) {
      onChange(validators.map((v) => (v.id === editing.id ? validator : v)))
    } else {
      onChange([...validators, validator])
    }
    setDialogOpen(false)
    resetForm()
  }

  function remove(id: string) {
    onChange(validators.filter((v) => v.id !== id))
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Validaciones</h3>
        <Button size="sm" onClick={openNew} disabled={columns.length === 0}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Validación
        </Button>
      </div>

      {validators.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center border rounded-lg">
          No hay validaciones configuradas.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Columna</TableHead>
              <TableHead>Mensaje</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {validators.map((v) => (
              <TableRow key={v.id}>
                <TableCell>
                  <Badge variant="outline">{v.code}</Badge>
                </TableCell>
                <TableCell>{v.column || "Todas"}</TableCell>
                <TableCell className="text-muted-foreground">{v.message}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(v)}>
                      Editar
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => remove(v.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Validación" : "Nueva Validación"}</DialogTitle>
            <DialogDescription>
              Configura una regla de validación para los datos importados.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="v-type">Tipo</Label>
              <Select value={vType} onValueChange={setVType}>
                <SelectTrigger id="v-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VALIDATOR_TYPES.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="v-column">Columna</Label>
              <Select value={vColumn} onValueChange={setVColumn}>
                <SelectTrigger id="v-column">
                  <SelectValue placeholder="Selecciona columna" />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.header}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="v-msg">Mensaje de error</Label>
              <Input id="v-msg" value={vMessage} onChange={(e) => setVMessage(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="v-code">Código (opcional)</Label>
              <Input
                id="v-code"
                value={vCode}
                onChange={(e) => setVCode(e.target.value)}
                placeholder="e.g. invalid_email"
              />
            </div>
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

function FiltersEditor({
  filters,
  columns,
  onChange,
}: {
  filters: FilterDefinition[]
  columns: ColumnDefinition[]
  onChange: (filters: FilterDefinition[]) => void
}) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<FilterDefinition | null>(null)
  const [fColumn, setFColumn] = useState("")
  const [fType, setFType] = useState("text")
  const [fLabel, setFLabel] = useState("")

  function resetForm() {
    setFColumn("")
    setFType("text")
    setFLabel("")
    setEditing(null)
  }

  function openNew() {
    resetForm()
    setFColumn(columns[0]?.id || "")
    setDialogOpen(true)
  }

  function openEdit(f: FilterDefinition) {
    setEditing(f)
    setFColumn(f.columnId)
    setFType(f.type)
    setFLabel(f.label || "")
    setDialogOpen(true)
  }

  function save() {
    if (!fColumn) return
    const filter: FilterDefinition = {
      id: editing?.id || crypto.randomUUID(),
      columnId: fColumn,
      type: fType as FilterDefinition["type"],
      label: fLabel.trim() || undefined,
    }
    if (editing) {
      onChange(filters.map((f) => (f.id === editing.id ? filter : f)))
    } else {
      onChange([...filters, filter])
    }
    setDialogOpen(false)
    resetForm()
  }

  function remove(id: string) {
    onChange(filters.filter((f) => f.id !== id))
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Filtros de Importación</h3>
        <Button size="sm" onClick={openNew} disabled={columns.length === 0}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Filtro
        </Button>
      </div>

      {filters.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center border rounded-lg">
          No hay filtros de importación configurados.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Columna</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Etiqueta</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filters.map((f) => (
              <TableRow key={f.id}>
                <TableCell className="font-medium">
                  {columns.find((c) => c.id === f.columnId)?.header || f.columnId}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{f.type}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{f.label || "—"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(f)}>
                      Editar
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => remove(f.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Filtro" : "Nuevo Filtro"}</DialogTitle>
            <DialogDescription>
              Define un filtro para aplicar durante la importación.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="f-column">Columna</Label>
              <Select value={fColumn} onValueChange={setFColumn}>
                <SelectTrigger id="f-column">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.header}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="f-type">Tipo de filtro</Label>
              <Select value={fType} onValueChange={setFType}>
                <SelectTrigger id="f-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FILTER_TYPES.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="f-label">Etiqueta (opcional)</Label>
              <Input
                id="f-label"
                value={fLabel}
                onChange={(e) => setFLabel(e.target.value)}
                placeholder="e.g. Filtro por departamento"
              />
            </div>
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

function GroupsEditor({
  groups,
  columns,
  onChange,
}: {
  groups: GroupDefinition[]
  columns: ColumnDefinition[]
  onChange: (groups: GroupDefinition[]) => void
}) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [gColumn, setGColumn] = useState("")

  function openNew() {
    setGColumn(columns[0]?.id || "")
    setDialogOpen(true)
  }

  function add() {
    if (!gColumn || groups.some((g) => g.columnId === gColumn)) return
    onChange([...groups, { columnId: gColumn }])
    setDialogOpen(false)
  }

  function moveUp(index: number) {
    if (index === 0) return
    const next = [...groups]
    ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
    onChange(next)
  }

  function moveDown(index: number) {
    if (index === groups.length - 1) return
    const next = [...groups]
    ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
    onChange(next)
  }

  function remove(columnId: string) {
    onChange(groups.filter((g) => g.columnId !== columnId))
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Agrupaciones</h3>
        <Button size="sm" onClick={openNew} disabled={columns.length === 0}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Nivel
        </Button>
      </div>

      {groups.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center border rounded-lg">
          No hay agrupaciones. Agrega niveles para organizar los datos.
        </p>
      ) : (
        <div className="space-y-2">
          {groups.map((g, i) => (
            <div key={g.columnId} className="flex items-center gap-2 p-2 border rounded-lg">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 font-medium">
                {columns.find((c) => c.id === g.columnId)?.header || g.columnId}
              </span>
              <Badge variant="secondary">Nivel {i + 1}</Badge>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => moveUp(i)} disabled={i === 0}>
                  ↑
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveDown(i)}
                  disabled={i === groups.length - 1}
                >
                  ↓
                </Button>
                <Button variant="ghost" size="sm" onClick={() => remove(g.columnId)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nivel de Agrupación</DialogTitle>
            <DialogDescription>Selecciona la columna para agrupar los datos.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="g-column">Columna</Label>
              <Select value={gColumn} onValueChange={setGColumn}>
                <SelectTrigger id="g-column">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.header}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={add}>Agregar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function TransformersEditor({
  transformers,
  columns,
  onChange,
}: {
  transformers: Transformer[]
  columns: ColumnDefinition[]
  onChange: (transformers: Transformer[]) => void
}) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Transformer | null>(null)
  const [tColumn, setTColumn] = useState("")
  const [tType, setTType] = useState("trim")
  const [tPattern, setTPattern] = useState("")

  function resetForm() {
    setTColumn("")
    setTType("trim")
    setTPattern("")
    setEditing(null)
  }

  function openNew() {
    resetForm()
    setTColumn(columns[0]?.id || "")
    setDialogOpen(true)
  }

  function save() {
    if (!tColumn) return
    let transform: (value: any) => any
    switch (tType) {
      case "trim":
        transform = (v: any) => (typeof v === "string" ? v.trim() : v)
        break
      case "uppercase":
        transform = (v: any) => (typeof v === "string" ? v.toUpperCase() : v)
        break
      case "lowercase":
        transform = (v: any) => (typeof v === "string" ? v.toLowerCase() : v)
        break
      case "parse-number":
        transform = (v: any) => {
          const n = Number(v)
          return Number.isNaN(n) ? v : n
        }
        break
      default:
        transform = (v: any) => v
    }
    const transformer: Transformer = {
      column: tColumn,
      transform,
    }
    if (editing) {
      onChange(transformers.map((t) => (t.column === editing.column ? transformer : t)))
    } else {
      onChange([...transformers, transformer])
    }
    setDialogOpen(false)
    resetForm()
  }

  function remove(column: string) {
    onChange(transformers.filter((t) => t.column !== column))
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Transformaciones</h3>
        <Button size="sm" onClick={openNew} disabled={columns.length === 0}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Transformación
        </Button>
      </div>

      {transformers.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center border rounded-lg">
          No hay transformaciones configuradas.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Columna</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transformers.map((t) => (
              <TableRow key={t.column}>
                <TableCell className="font-medium">
                  {columns.find((c) => c.id === t.column)?.header || t.column}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{t.transform.name || "custom"}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => remove(t.column)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Transformación" : "Nueva Transformación"}</DialogTitle>
            <DialogDescription>
              Define una transformación para aplicar a los valores de la columna.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="t-column">Columna</Label>
              <Select value={tColumn} onValueChange={setTColumn}>
                <SelectTrigger id="t-column">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.header}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="t-type">Tipo</Label>
              <Select value={tType} onValueChange={setTType}>
                <SelectTrigger id="t-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TRANSFORMER_TYPES.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {tType === "custom" && (
              <div className="grid gap-2">
                <Label htmlFor="t-pattern">Patrón Regex</Label>
                <Input
                  id="t-pattern"
                  value={tPattern}
                  onChange={(e) => setTPattern(e.target.value)}
                  placeholder="e.g. s/foo/bar/"
                />
              </div>
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
