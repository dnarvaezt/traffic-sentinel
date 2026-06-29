"use client"

import { Settings, X } from "lucide-react"
import { Button } from "@/shared/components/ui/button"

interface WidgetWrapperProps {
  title: string
  onRemove?: () => void
  onSettings?: () => void
  children: React.ReactNode
}

export function WidgetWrapper({ title, onRemove, onSettings, children }: WidgetWrapperProps) {
  return (
    <div className="flex flex-col h-full border rounded-lg bg-card overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/20">
        <span className="text-sm font-medium truncate">{title}</span>
        <div className="flex items-center gap-1">
          {onSettings && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
              onClick={onSettings}
            >
              <Settings className="h-3.5 w-3.5" />
            </Button>
          )}
          {onRemove && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive"
              onClick={onRemove}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
      <div className="flex-1 p-3 overflow-auto">{children}</div>
    </div>
  )
}
