"use client"

import { Plus } from "lucide-react"
import { useState } from "react"
import type { WidgetType } from "@/core/project"
import { Button } from "@/shared/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog"
import { WIDGET_TYPES } from "./widget-registry"

interface AddWidgetPanelProps {
  onAdd: (type: WidgetType) => void
}

export function AddWidgetPanel({ onAdd }: AddWidgetPanelProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          Agregar Widget
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Widget</DialogTitle>
          <DialogDescription>
            Selecciona el tipo de widget que deseas agregar al dashboard.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 py-4">
          {WIDGET_TYPES.map((wt) => (
            <button
              key={wt.type}
              type="button"
              className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-accent transition-colors"
              onClick={() => {
                onAdd(wt.type)
                setOpen(false)
              }}
            >
              <wt.icon className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm font-medium">{wt.label}</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
