"use client"

import type { GroupDefinition } from "../../domain/models/group"
import type { ColumnDefinition } from "../../domain/models/column"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Layers, X } from "lucide-react"

interface GroupPanelProps {
  groups: GroupDefinition[]
  columns: ColumnDefinition[]
  // In a real implementation, we might allow the user to toggle groups
  // For now, this component will show active groups defined in the schema
}

export function GroupPanel({ groups, columns }: GroupPanelProps) {
  if (!groups || groups.length === 0) return null

  return (
    <div className="flex items-center gap-2 p-4 border rounded-lg bg-muted/20">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mr-2">
        <Layers className="h-4 w-4" />
        <span>Agrupado por:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {groups.map((group) => {
          const column = columns.find((c) => c.id === group.columnId || c.header === group.columnId)
          return (
            <Badge key={group.columnId} variant="secondary" className="px-3 py-1 gap-1">
              {column?.header || group.columnId}
            </Badge>
          )
        })}
      </div>
    </div>
  )
}
