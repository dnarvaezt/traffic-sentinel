"use client"

import { ArrowLeft, BarChart3, ChevronRight, List, SlidersHorizontal } from "lucide-react"
import Link from "next/link"
import { DataTable } from "@/modules/table"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { useDatasetView } from "../hooks/use-dataset-view"
import { SessionFilterPanel } from "./SessionFilterPanel"

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

  if (!mounted) return null
  if (!project) return <p className="p-8 text-muted-foreground">Proyecto no encontrado</p>
  if (!dataset) return <p className="p-8 text-muted-foreground">Dataset no encontrado</p>

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
            href={`/projects/${projectId}/dashboard?dataset=${dataset.id}`}
            className="flex items-center gap-1.5 px-3 h-7 rounded-md text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Ver en Dashboard
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
        <SessionFilterPanel
          sessionFilters={sessionFilters}
          columns={columns}
          quickFilters={quickFilters}
          setQuickFilters={setQuickFilters}
          panelOpen={panelOpen}
          setPanelOpen={setPanelOpen}
          activeFilterCount={activeFilterCount}
          savingId={savingId}
          saveName={saveName}
          setSaveName={setSaveName}
          NO_VALUE_OPS={NO_VALUE_OPS}
          addSessionFilter={addSessionFilter}
          updateSessionFilter={updateSessionFilter}
          removeSessionFilter={removeSessionFilter}
          startSave={startSave}
          confirmSave={confirmSave}
          cancelSave={cancelSave}
        />

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
