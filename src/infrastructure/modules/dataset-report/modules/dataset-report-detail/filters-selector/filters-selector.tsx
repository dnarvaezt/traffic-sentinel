"use client"

import { Filter, X } from "lucide-react"
import type { DatasetFilter } from "@/application/domain"
import { Button } from "@/infrastructure/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/infrastructure/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/infrastructure/components/ui/dialog"
import { Label } from "@/infrastructure/components/ui/label"
import { Switch } from "@/infrastructure/components/ui/switch"

interface FiltersSelectorProps {
  filters: DatasetFilter[]
  selectedFilters: Set<string>
  filterModes: Record<string, "include" | "exclude">
  onToggleFilter: (filterName: string) => void
  onToggleFilterMode: (filterName: string) => void
}

export const FiltersSelector = ({
  filters,
  selectedFilters,
  filterModes,
  onToggleFilter,
  onToggleFilterMode,
}: FiltersSelectorProps) => {
  const hasActiveFilters = selectedFilters.size > 0

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="dataset-report-detail__action-button relative"
        >
          <Filter size={16} className="mr-2" />
          Filtros
          {hasActiveFilters && (
            <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
              {selectedFilters.size}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Filtros de Dataset</DialogTitle>
          <DialogDescription>
            Selecciona los filtros que deseas aplicar. Puedes incluir o excluir múltiples filtros al
            tiempo.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {filters.length === 0 ? (
            <CardDescription>No hay filtros disponibles</CardDescription>
          ) : (
            filters.map((filter) => {
              const isSelected = selectedFilters.has(filter.name)
              const mode = filterModes[filter.name] || "include"

              return (
                <Card key={filter.name} className="border">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base">{filter.name}</CardTitle>
                        <CardDescription className="mt-1">{filter.description}</CardDescription>
                      </div>
                      <Switch
                        checked={isSelected}
                        onCheckedChange={() => onToggleFilter(filter.name)}
                        className="ml-4"
                      />
                    </div>
                  </CardHeader>
                  {isSelected && (
                    <CardContent className="pt-0">
                      <div className="flex items-center gap-4">
                        <Label className="text-sm">Modo:</Label>
                        <div className="flex gap-2">
                          <Button
                            variant={mode === "include" ? "default" : "outline"}
                            size="sm"
                            onClick={() => onToggleFilterMode(filter.name)}
                            className="h-8"
                          >
                            Incluir
                          </Button>
                          <Button
                            variant={mode === "exclude" ? "default" : "outline"}
                            size="sm"
                            onClick={() => onToggleFilterMode(filter.name)}
                            className="h-8"
                          >
                            Excluir
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              )
            })
          )}
        </div>
        {hasActiveFilters && (
          <div className="flex items-center justify-between border-t pt-4">
            <span className="text-sm text-muted-foreground">
              {selectedFilters.size} filtro(s) activo(s)
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                for (const filterName of selectedFilters) {
                  onToggleFilter(filterName)
                }
              }}
              className="text-destructive"
            >
              <X size={16} className="mr-2" />
              Limpiar todos
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
