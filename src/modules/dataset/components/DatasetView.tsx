"use client"

import {
  ArrowLeft,
  BarChart3,
  BookmarkPlus,
  ChevronRight,
  List,
  Plus,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react"
import Link from "next/link"
import { useRef } from "react"
import type { FilterOperator } from "@/core/project"
import { DataTable } from "@/modules/table"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { useDatasetView } from "../hooks/use-dataset-view"

const OPERATORS: { value: FilterOperator; label: string }[] = [
  { value: "contains", label: "Contiene" },
  { value: "notContains", label: "No contiene" },
  { value: "equals", label: "Igual a" },
  { value: "notEquals", label: "Diferente de" },
  { value: "greaterThan", label: "Mayor que" },
  { value: "lessThan", label: "Menor que" },
  { value: "greaterThanOrEquals", label: "Mayor o igual" },
  { value: "lessThanOrEquals", label: "Menor o igual" },
  { value: "between", label: "Entre" },
  { value: "isNull", label: "Es nulo" },
  { value: "isNotNull", label: "No es nulo" },
]

export function DatasetView() {
  const {
    projectId,
    project,
    dataset,
    mounted,
    loading,
    router,
    rawData,
    processedData,
    columns,
    sessionFilters,
    quickFilters,
    setQuickFilters,
    sorts,
    setSorts,
    panelOpen,
    setPanelOpen,
    activeFilterCount,
    savingId,
    saveName,
    setSaveName,
    NO_VALUE_OPS,
    addSessionFilter,
    updateSessionFilter,
    removeSessionFilter,
    startSave,
    confirmSave,
    cancelSave,
  } = useDatasetView()

  const saveInputRef = useRef<HTMLInputElement>(null)

  if (!mounted) return null
  if (!project) return <p className="p-8 text-muted-foreground">Proyecto no encontrado</p>
  if (!dataset) return <p className="p-8 text-muted-foreground">Dataset no encontrado</p>

  function handleStartSave(id: string) {
    startSave(id)
    setTimeout(() => saveInputRef.current?.focus(), 50)
  }

  return (
    <main className="h-screen flex flex-col overflow-hidden">
      <header className="h-12 border-b px-3 flex items-center gap-1.5 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={() => router.push(`/projects/${projectId}`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1 text-sm min-w-0">
          <span className="text-muted-foreground truncate hidden sm:block max-w-[100px]">
            {project.name}
          </span>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0 hidden sm:block" />
          <span className="font-medium truncate max-w-[160px]">{dataset.name}</span>
        </div>

        <Badge variant="outline" className="text-xs shrink-0 hidden md:flex">
          {processedData.length.toLocaleString()} / {rawData.length.toLocaleString()} filas
        </Badge>

        <nav className="flex items-center bg-muted rounded-lg p-0.5 mx-auto shrink-0">
          <span className="flex items-center gap-1.5 px-3 h-7 rounded-md text-sm bg-background text-foreground shadow-sm">
            <List className="h-3.5 w-3.5" />
            Datos
          </span>
          <Link
            href={`/projects/${projectId}/dashboard`}
            className="flex items-center gap-1.5 px-3 h-7 rounded-md text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Dashboard
          </Link>
        </nav>

        <Button
          variant={panelOpen ? "secondary" : "ghost"}
          size="sm"
          className="h-8 gap-1.5 px-2.5 ml-auto"
          onClick={() => setPanelOpen((o) => !o)}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span className="hidden sm:inline text-sm">Filtros</span>
          {activeFilterCount > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-medium">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {panelOpen && (
          <aside className="w-72 border-r flex flex-col shrink-0 overflow-hidden">
            <div className="flex items-center justify-between px-4 h-10 border-b shrink-0">
              <span className="text-sm font-medium">Filtros de sesión</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setPanelOpen(false)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {sessionFilters.length === 0 && (
                <p className="text-xs text-muted-foreground px-1 py-2">
                  Sin filtros. Los filtros se pierden al salir de la página.
                </p>
              )}

              {sessionFilters.map((filter) => (
                <div key={filter.id} className="border rounded-lg p-2 space-y-2 text-xs">
                  <Select
                    value={filter.columnId}
                    onValueChange={(v) => updateSessionFilter(filter.id, { columnId: v })}
                  >
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="Columna" />
                    </SelectTrigger>
                    <SelectContent>
                      {columns.map((col) => (
                        <SelectItem key={col.name} value={col.name}>
                          {col.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={filter.operator}
                    onValueChange={(v) =>
                      updateSessionFilter(filter.id, { operator: v as FilterOperator, value: "" })
                    }
                  >
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {OPERATORS.map((op) => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {!NO_VALUE_OPS.has(filter.operator) &&
                    (filter.operator === "between" ? (
                      <div className="flex gap-1">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={Array.isArray(filter.value) ? String(filter.value[0] ?? "") : ""}
                          onChange={(e) =>
                            updateSessionFilter(filter.id, {
                              value: [
                                e.target.value,
                                Array.isArray(filter.value) ? filter.value[1] : "",
                              ],
                            })
                          }
                          className="h-7 text-xs"
                        />
                        <Input
                          type="number"
                          placeholder="Max"
                          value={Array.isArray(filter.value) ? String(filter.value[1] ?? "") : ""}
                          onChange={(e) =>
                            updateSessionFilter(filter.id, {
                              value: [
                                Array.isArray(filter.value) ? filter.value[0] : "",
                                e.target.value,
                              ],
                            })
                          }
                          className="h-7 text-xs"
                        />
                      </div>
                    ) : (
                      <Input
                        type={
                          columns.find((c) => c.name === filter.columnId)?.type === "number"
                            ? "number"
                            : "text"
                        }
                        placeholder="Valor"
                        value={String(filter.value ?? "")}
                        onChange={(e) => updateSessionFilter(filter.id, { value: e.target.value })}
                        className="h-7 text-xs"
                      />
                    ))}

                  {savingId === filter.id ? (
                    <div className="flex gap-1">
                      <Input
                        ref={saveInputRef}
                        placeholder="Nombre del filtro"
                        value={saveName}
                        onChange={(e) => setSaveName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") confirmSave(filter)
                          if (e.key === "Escape") cancelSave()
                        }}
                        className="h-7 text-xs flex-1"
                      />
                      <Button
                        size="icon"
                        variant="default"
                        className="h-7 w-7 shrink-0"
                        onClick={() => confirmSave(filter)}
                        disabled={!saveName.trim()}
                      >
                        <BookmarkPlus className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 shrink-0"
                        onClick={cancelSave}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-between">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                        onClick={() => handleStartSave(filter.id)}
                      >
                        <BookmarkPlus className="h-3 w-3 mr-1" />
                        Guardar
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => removeSessionFilter(filter.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-3 border-t shrink-0">
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-1.5"
                onClick={addSessionFilter}
                disabled={columns.length === 0}
              >
                <Plus className="h-3.5 w-3.5" />
                Agregar filtro
              </Button>
            </div>
          </aside>
        )}

        <div className="flex-1 overflow-hidden p-4">
          {loading ? (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
              Cargando...
            </div>
          ) : (
            <DataTable
              data={processedData}
              columns={columns}
              filters={quickFilters}
              sorts={sorts}
              onFiltersChange={setQuickFilters}
              onSortsChange={setSorts}
            />
          )}
        </div>
      </div>
    </main>
  )
}
