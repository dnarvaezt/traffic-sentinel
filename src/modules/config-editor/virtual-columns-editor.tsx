"use client"

import type { ColumnDefinition } from "@/core/data-import/domain/models/column"
import { Badge } from "@/shared/components/ui/badge"
import { Label } from "@/shared/components/ui/label"

export function VirtualColumnsEditor({
  columns,
  calculate,
  onChange,
}: {
  columns: ColumnDefinition[]
  calculate: string
  onChange: (calculate: string) => void
}) {
  return (
    <div className="grid gap-2 border-t pt-4">
      <div className="flex items-center justify-between">
        <Label>Columna calculada (expresión)</Label>
      </div>
      <p className="text-xs text-muted-foreground">
        Define una expresión JavaScript que se evaluará por fila. Usa{" "}
        <code className="text-xs bg-muted px-1 rounded">row["nombre_columna"]</code> para
        referenciar otras columnas.
      </p>
      <div className="flex gap-2 flex-wrap">
        {columns.map((c) => (
          <Badge
            key={c.id}
            variant="outline"
            className="cursor-pointer hover:bg-accent text-[10px]"
            onClick={() => onChange(`${calculate} row["${c.header}"] `.trim())}
          >
            {c.header}
          </Badge>
        ))}
      </div>
      <textarea
        className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono"
        rows={3}
        placeholder='e.g. Number(row["precio"]) * Number(row["cantidad"])'
        value={calculate}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
