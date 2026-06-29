"use client"

import { Plus, Trash2 } from "lucide-react"
import type { ColumnTransformer } from "@/core/data-import/domain/models/column"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"

const TRANSFORMER_TYPES = [
  { id: "lowercase", label: "Minúsculas" },
  { id: "uppercase", label: "Mayúsculas" },
  { id: "trim", label: "Recortar espacios" },
  { id: "slug", label: "Slug (URL-friendly)" },
  { id: "parseInt", label: "Convertir a entero" },
  { id: "parseFloat", label: "Convertir a decimal" },
  { id: "dateParse", label: "Parsear fecha" },
  { id: "stripHtml", label: "Eliminar HTML" },
  { id: "custom", label: "Personalizado" },
]

export function TransformersEditor({
  transformers,
  onChange,
}: {
  transformers: ColumnTransformer[]
  onChange: (transformers: ColumnTransformer[]) => void
}) {
  function add() {
    onChange([...transformers, { type: "lowercase" }])
  }

  function update(index: number, patch: Partial<ColumnTransformer>) {
    onChange(transformers.map((t, i) => (i === index ? { ...t, ...patch } : t)))
  }

  function remove(index: number) {
    onChange(transformers.filter((_, i) => i !== index))
  }

  return (
    <div className="grid gap-2 border-t pt-4">
      <div className="flex items-center justify-between">
        <Label>Transformadores</Label>
        <Button type="button" variant="outline" size="sm" onClick={add}>
          <Plus className="h-3 w-3 mr-1" />
          Agregar
        </Button>
      </div>
      {transformers.length === 0 ? (
        <p className="text-xs text-muted-foreground">Sin transformadores configurados.</p>
      ) : (
        <div className="space-y-2">
          {transformers.map((t, i) => (
            <div key={i} className="border rounded-lg p-2 space-y-2">
              <div className="flex items-center justify-between">
                <Select value={t.type} onValueChange={(val) => update(i, { type: val })}>
                  <SelectTrigger className="h-7 text-xs w-44">
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
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7"
                  onClick={() => remove(i)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              {t.type === "custom" && (
                <Input
                  placeholder="Código JS: return value.toLowerCase();"
                  value={String((t.params as any)?.code ?? "")}
                  onChange={(e) =>
                    update(i, {
                      params: { ...t.params, code: e.target.value },
                    })
                  }
                  className="h-7 text-xs font-mono"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
