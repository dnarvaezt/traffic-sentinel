"use client"

import { Plus, Trash2 } from "lucide-react"
import type { ColumnValidation } from "@/core/data-import/domain/models/column"
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

const VALIDATION_TYPES = [
  { id: "required", label: "Requerido" },
  { id: "min", label: "Valor mínimo" },
  { id: "max", label: "Valor máximo" },
  { id: "regex", label: "Patrón Regex" },
  { id: "unique", label: "Único" },
  { id: "email", label: "Formato Email" },
  { id: "custom", label: "Personalizado" },
]

export function ValidatorsEditor({
  validations,
  onChange,
}: {
  validations: ColumnValidation[]
  onChange: (validations: ColumnValidation[]) => void
}) {
  function add() {
    onChange([...validations, { type: "required", message: "" }])
  }

  function update(index: number, patch: Partial<ColumnValidation>) {
    onChange(validations.map((v, i) => (i === index ? { ...v, ...patch } : v)))
  }

  function remove(index: number) {
    onChange(validations.filter((_, i) => i !== index))
  }

  return (
    <div className="grid gap-2 border-t pt-4">
      <div className="flex items-center justify-between">
        <Label>Validaciones</Label>
        <Button type="button" variant="outline" size="sm" onClick={add}>
          <Plus className="h-3 w-3 mr-1" />
          Agregar
        </Button>
      </div>
      {validations.length === 0 ? (
        <p className="text-xs text-muted-foreground">Sin validaciones configuradas.</p>
      ) : (
        <div className="space-y-2">
          {validations.map((v, i) => (
            <div key={i} className="border rounded-lg p-2 space-y-2">
              <div className="flex items-center justify-between">
                <Select value={v.type} onValueChange={(val) => update(i, { type: val })}>
                  <SelectTrigger className="h-7 text-xs w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VALIDATION_TYPES.map((t) => (
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
              <Input
                placeholder="Mensaje de error"
                value={v.message}
                onChange={(e) => update(i, { message: e.target.value })}
                className="h-7 text-xs"
              />
              {(v.type === "min" || v.type === "max") && (
                <Input
                  type="number"
                  placeholder={v.type === "min" ? "Valor mínimo" : "Valor máximo"}
                  value={String(v.params?.value ?? "")}
                  onChange={(e) =>
                    update(i, {
                      params: { ...v.params, value: Number(e.target.value) },
                    })
                  }
                  className="h-7 text-xs"
                />
              )}
              {v.type === "regex" && (
                <Input
                  placeholder="Patrón regex, e.g. ^[a-z]+$"
                  value={String(v.params?.pattern ?? "")}
                  onChange={(e) =>
                    update(i, {
                      params: { ...v.params, pattern: e.target.value },
                    })
                  }
                  className="h-7 text-xs font-mono"
                />
              )}
              {v.type === "custom" && (
                <Input
                  placeholder="Código JS: return value > 0;"
                  value={String(v.params?.code ?? "")}
                  onChange={(e) =>
                    update(i, {
                      params: { ...v.params, code: e.target.value },
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
