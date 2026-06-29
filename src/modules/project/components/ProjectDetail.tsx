"use client"

import { Filter } from "lucide-react"
import { redirect, useParams, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/shared/components/ui/button"
import { useProjectDetail } from "../hooks/use-project-detail"
import { ConfigEditor } from "./ConfigEditor"
import { DatasetsList } from "./DatasetsList"
import { ProjectLayout } from "./ProjectLayout"

export function ProjectDetail() {
  const params = useParams()
  const searchParams = useSearchParams()
  const projectId = params.id as string
  const activeTabParam = (searchParams.get("tab") as string) || "datasets"
  if (activeTabParam === "data") {
    redirect(`/projects/${projectId}?tab=datasets`)
  }
  const activeTab = activeTabParam

  const {
    projectData,
    mounted,
    uploading,
    fileInputRef,
    searchQuery,
    setSearchQuery,
    sortField,
    toggleSort,
    filteredDatasets,
    handleFileSelect,
    handleDeleteDataset,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    deletingDataset,
    confirmDelete,
    datasetEditOpen,
    setDatasetEditOpen,
    datasetName,
    setDatasetName,
    datasetDescription,
    setDatasetDescription,
    openDatasetEdit,
    handleDatasetSave,
    handleToggleFavorite,
    renamingId,
    renamingValue,
    setRenamingValue,
    startRename,
    commitRename,
    cancelRename,
    updateConfig,
    setWizardCompleted,
    router,
  } = useProjectDetail()

  useEffect(() => {
    if (!mounted || !projectData) return
    const hasColumns = (projectData.config?.columns?.length ?? 0) > 0
    const hasDatasets = (projectData.databases?.length ?? 0) > 0
    if (hasColumns && hasDatasets && !projectData.wizardCompleted) {
      setWizardCompleted(projectData.id, true)
    }
  }, [mounted, projectData, setWizardCompleted])

  function handleDismissWizard() {
    if (projectData) {
      setWizardCompleted(projectData.id, true)
    }
  }

  if (!mounted) return null
  if (!projectData) return null

  const schemaColumns = projectData.config?.columns || []
  const allDatasets = projectData.databases || []
  const showWizard =
    !projectData.wizardCompleted && (allDatasets.length === 0 || schemaColumns.length === 0)

  return (
    <ProjectLayout>
      {activeTab === "config" && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Configuración</h2>
          <ConfigEditor
            config={projectData.config || { columns: [] }}
            onConfigChange={(config) => updateConfig(projectId, config)}
            databases={projectData.databases}
          />
        </div>
      )}

      {activeTab === "datasets" && (
        <DatasetsList
          projectId={projectId}
          filteredDatasets={filteredDatasets}
          allDatasets={allDatasets}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          uploading={uploading}
          fileInputRef={fileInputRef}
          handleFileSelect={handleFileSelect}
          sortField={sortField}
          toggleSort={toggleSort}
          handleToggleFavorite={handleToggleFavorite}
          renamingId={renamingId}
          renamingValue={renamingValue}
          setRenamingValue={setRenamingValue}
          startRename={startRename}
          commitRename={commitRename}
          cancelRename={cancelRename}
          handleDeleteDataset={handleDeleteDataset}
          deleteConfirmOpen={deleteConfirmOpen}
          setDeleteConfirmOpen={setDeleteConfirmOpen}
          deletingDataset={deletingDataset}
          confirmDelete={confirmDelete}
          datasetEditOpen={datasetEditOpen}
          setDatasetEditOpen={setDatasetEditOpen}
          datasetName={datasetName}
          setDatasetName={setDatasetName}
          datasetDescription={datasetDescription}
          setDatasetDescription={setDatasetDescription}
          openDatasetEdit={openDatasetEdit}
          handleDatasetSave={handleDatasetSave}
          showWizard={showWizard}
          handleDismissWizard={handleDismissWizard}
          router={router}
        />
      )}

      {activeTab === "filters" &&
        (schemaColumns.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg text-muted-foreground text-sm gap-4">
            <Filter className="h-12 w-12 opacity-20" />
            <div className="text-center">
              <p className="font-medium text-foreground">Define columnas en Configuración</p>
              <p className="text-xs mt-1">
                Necesitas definir al menos una columna antes de crear filtros.
              </p>
            </div>
            <Button variant="default" size="sm" asChild>
              <a href={`/projects/${projectId}?tab=config`}>Ir a Configuración</a>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Filtros del Proyecto</h2>
              <Button size="sm" onClick={() => router.push(`/projects/${projectId}/filters`)}>
                <Filter className="mr-2 h-4 w-4" />
                Gestionar Filtros
              </Button>
            </div>

            {projectData.filters && projectData.filters.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {projectData.filters.length} filtro(s) configurado(s)
                </p>
                <div className="flex flex-wrap gap-2">
                  {projectData.filters.map((f) => (
                    <span
                      key={f.id}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary text-xs"
                    >
                      <Filter className="h-3 w-3" />
                      {f.name}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground border rounded-lg">
                <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No hay filtros configurados</p>
                <p className="text-xs">Crea filtros desde la sección de Filtros</p>
              </div>
            )}
          </>
        ))}
    </ProjectLayout>
  )
}
