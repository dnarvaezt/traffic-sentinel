"use client"

import { useParams } from "next/navigation"
import { useState } from "react"
import type { ColumnType } from "@/core"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { useSchemaConfig } from "../hooks/use-schema-config"

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

export function SchemaConfigPage() {
  const params = useParams()
  const projectId = params.id as string
  const {
    project,
    columns,
    loading,
    saving,
    addColumn,
    removeColumn,
    moveUp,
    moveDown,
    updateColumn,
    save,
  } = useSchemaConfig(projectId)

  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  function toggleExpanded(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen p-8 max-w-4xl mx-auto">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen p-8 max-w-4xl mx-auto">
        <a
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; Volver
        </a>
        <p className="mt-8 text-center text-muted-foreground">Proyecto no encontrado.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <a
            href={`/projects/${project.id}`}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            &larr; {project.name}
          </a>
          <h1 className="text-2xl font-bold mt-1">Configurar Schema</h1>
        </div>
        <Button onClick={save} disabled={saving}>
          {saving ? "Guardando..." : "Guardar"}
        </Button>
      </div>

      <div className="space-y-3">
        {columns.length === 0 ? (
          <div className="text-center py-12 border rounded-lg text-muted-foreground">
            <p className="font-medium text-foreground">Sin columnas</p>
            <p className="text-sm mt-1">Agrega tu primera columna para definir el schema.</p>
          </div>
        ) : (
          columns.map((col, i) => (
            <div key={col.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-6 shrink-0">{i + 1}</span>
                <Input
                  className="h-8 text-sm flex-1"
                  value={col.header}
                  onChange={(e) => updateColumn(col.id, { header: e.target.value })}
                />
                <Select
                  value={col.type}
                  onValueChange={(v) => updateColumn(col.id, { type: v as ColumnType })}
                >
                  <SelectTrigger className="w-32 h-8">
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
                <Button variant="ghost" size="sm" disabled={i === 0} onClick={() => moveUp(i)}>
                  ↑
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={i === columns.length - 1}
                  onClick={() => moveDown(i)}
                >
                  ↓
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() => removeColumn(col.id)}
                >
                  ✕
                </Button>
                <Button variant="ghost" size="sm" onClick={() => toggleExpanded(col.id)}>
                  {expanded.has(col.id) ? "▲" : "▼"}
                </Button>
              </div>

              {expanded.has(col.id) && (
                <div className="grid grid-cols-2 gap-3 pt-3 border-t text-sm">
                  <div>
                    <label htmlFor={`kind-${col.id}`} className="text-xs text-muted-foreground">
                      Tipo
                    </label>
                    <Select
                      value={col.kind ?? "source"}
                      onValueChange={(v) =>
                        updateColumn(col.id, { kind: v as "source" | "virtual" | undefined })
                      }
                    >
                      <SelectTrigger id={`kind-${col.id}`} className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="source">Source</SelectItem>
                        <SelectItem value="virtual">Virtual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label htmlFor={`source-${col.id}`} className="text-xs text-muted-foreground">
                      Columna origen (CSV)
                    </label>
                    <Input
                      id={`source-${col.id}`}
                      className="h-8"
                      value={col.sourceColumn ?? ""}
                      onChange={(e) =>
                        updateColumn(col.id, { sourceColumn: e.target.value || undefined })
                      }
                      placeholder="Igual al header por defecto"
                    />
                  </div>
                  <div>
                    <label htmlFor={`tooltip-${col.id}`} className="text-xs text-muted-foreground">
                      Tooltip
                    </label>
                    <Input
                      id={`tooltip-${col.id}`}
                      className="h-8"
                      value={col.tooltip ?? ""}
                      onChange={(e) =>
                        updateColumn(col.id, { tooltip: e.target.value || undefined })
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor={`align-${col.id}`} className="text-xs text-muted-foreground">
                      Alineación
                    </label>
                    <Select
                      value={col.alignment ?? "none"}
                      onValueChange={(v) =>
                        updateColumn(col.id, {
                          alignment: v === "none" ? undefined : (v as "left" | "center" | "right"),
                        })
                      }
                    >
                      <SelectTrigger id={`align-${col.id}`} className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Por defecto</SelectItem>
                        <SelectItem value="left">Izquierda</SelectItem>
                        <SelectItem value="center">Centro</SelectItem>
                        <SelectItem value="right">Derecha</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={col.sortable !== false}
                        onChange={(e) =>
                          updateColumn(col.id, { sortable: e.target.checked || undefined })
                        }
                      />
                      Ordenable
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={col.filterable !== false}
                        onChange={(e) =>
                          updateColumn(col.id, { filterable: e.target.checked || undefined })
                        }
                      />
                      Filtrable
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={col.visibility !== false}
                        onChange={(e) =>
                          updateColumn(col.id, { visibility: e.target.checked !== false })
                        }
                      />
                      Visible
                    </label>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <Button variant="outline" onClick={addColumn} className="w-full">
        + Agregar columna
      </Button>
    </div>
  )
}
