"use client"

import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Switch } from "@/shared/components/ui/switch"
import type { FilterDefinition } from "../../domain/models/filter"

interface FilterPanelProps {
  filters: FilterDefinition[]
  values: Record<string, any>
  onChange: (filterId: string, value: any) => void
}

export function FilterPanel({ filters, values, onChange }: FilterPanelProps) {
  if (!filters || filters.length === 0) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/20">
      {filters.map((filter) => (
        <div key={filter.id} className="space-y-2">
          <Label htmlFor={filter.id}>{filter.label || filter.columnId}</Label>
          {filter.type === "text" && (
            <Input
              id={filter.id}
              value={values[filter.id] || ""}
              onChange={(e) => onChange(filter.id, e.target.value)}
              placeholder="Buscar..."
            />
          )}
          {filter.type === "number" && (
            <Input
              id={filter.id}
              type="number"
              value={values[filter.id] || ""}
              onChange={(e) => onChange(filter.id, e.target.value)}
            />
          )}
          {filter.type === "boolean" && (
            <div className="flex items-center h-10">
              <Switch
                id={filter.id}
                checked={!!values[filter.id]}
                onCheckedChange={(checked) => onChange(filter.id, checked)}
              />
            </div>
          )}
          {/* Add more filter types as needed */}
        </div>
      ))}
    </div>
  )
}
