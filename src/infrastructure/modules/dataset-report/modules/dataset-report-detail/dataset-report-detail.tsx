"use client"

import { ArrowLeft, CheckCircle2, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { memo, useCallback, useRef } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/infrastructure/components/ui/alert"
import { Button } from "@/infrastructure/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/infrastructure/components/ui/card"
import { DataGrid, type DataGridRef } from "@/infrastructure/components/ui/data-grid/data-grid"
import { Switch } from "@/infrastructure/components/ui/switch"
import { useToast } from "@/infrastructure/components/ui/toast-provider"
import { Toggle } from "@/infrastructure/components/ui/toggle"
import { useDatasetReportDetail } from "./dataset-report-detail.hook"
import "./dataset-report-detail.scss"
import { DownloadDialog } from "./download-dialog"
import { FiltersSelector } from "./filters-selector"

interface DatasetReportDetailProps {
  datasetId: string
}

export const DatasetReportDetail = memo(({ datasetId }: DatasetReportDetailProps) => {
  const {
    datasetService,
    isLoading,
    error,
    clearError,
    handleValidateDataset,
    handleToggleIncludeFirstRow,
    showParsedData,
    handleToggleParsedData,
    handleDownloadDataset,
    availableFilters,
    selectedFilters,
    filterModes,
    handleToggleFilter,
    handleToggleFilterMode,
    getFilteredDataset,
  } = useDatasetReportDetail(datasetId)
  const router = useRouter()
  const { showToast } = useToast()
  const gridRef = useRef<DataGridRef>(null)

  const handleGoBack = useCallback(() => {
    router.push("/dataset-report")
  }, [router])

  const handleValidate = useCallback(() => {
    if (!datasetService) {
      showToast({
        title: "Error",
        description: "No hay dataset disponible para validar",
        variant: "destructive",
      })
      return
    }

    const isValid = handleValidateDataset()
    showToast({
      title: isValid ? "Validación exitosa" : "Validación fallida",
      description: isValid
        ? "Todos los datos del dataset son válidos"
        : "El dataset contiene datos inválidos",
      variant: isValid ? "default" : "destructive",
    })
  }, [datasetService, handleValidateDataset, showToast])

  if (isLoading) {
    return (
      <div className="dataset-report-detail">
        <Card>
          <CardContent>
            <CardDescription className="dataset-report-detail__loading">
              Cargando dataset...
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dataset-report-detail">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="dataset-report-detail__error-content">
            {error}
            <Button variant="ghost" size="sm" onClick={clearError}>
              Cerrar
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!datasetService || datasetService.dataset.length === 0) {
    return (
      <div className="dataset-report-detail">
        <Card>
          <CardContent>
            <CardDescription>No hay datos para mostrar</CardDescription>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="dataset-report-detail">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={handleGoBack}>
                <ArrowLeft size={20} />
              </Button>
              <div>
                <CardTitle>Dataset</CardTitle>
                <CardDescription>
                  {getFilteredDataset && getFilteredDataset.length !== undefined
                    ? `${getFilteredDataset.length}`
                    : datasetService.dataset.length}{" "}
                  {(getFilteredDataset && getFilteredDataset.length !== undefined
                    ? getFilteredDataset.length
                    : datasetService.dataset.length) === 1
                    ? "fila"
                    : "filas"}
                  {selectedFilters.size > 0 &&
                    getFilteredDataset &&
                    getFilteredDataset.length !== undefined &&
                    getFilteredDataset.length !== datasetService.dataset.length && (
                      <span className="ml-1 text-muted-foreground">
                        (de {datasetService.dataset.length} totales)
                      </span>
                    )}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Incluir primera fila</span>
                <Switch
                  checked={datasetService.includeFirstRow}
                  onCheckedChange={handleToggleIncludeFirstRow}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleValidate}
                  className="dataset-report-detail__action-button"
                >
                  <CheckCircle2 size={16} className="mr-2" />
                  Validar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => gridRef.current?.openColumnSelector()}
                  className="dataset-report-detail__action-button"
                >
                  Columnas
                </Button>
                <FiltersSelector
                  filters={availableFilters}
                  selectedFilters={selectedFilters}
                  filterModes={filterModes}
                  onToggleFilter={handleToggleFilter}
                  onToggleFilterMode={handleToggleFilterMode}
                />
                <Toggle
                  pressed={showParsedData}
                  onPressedChange={handleToggleParsedData}
                  variant="outline"
                  size="sm"
                  className="dataset-report-detail__action-button"
                >
                  <RefreshCw size={16} className="mr-2" />
                  Parsear
                </Toggle>
                <DownloadDialog onDownload={handleDownloadDataset} useParsedData={showParsedData} />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="dataset-report-detail__grid-wrapper">
            {getFilteredDataset && getFilteredDataset.length > 0 ? (
              <DataGrid ref={gridRef} data={getFilteredDataset} />
            ) : getFilteredDataset && getFilteredDataset.length === 0 ? (
              <CardDescription>
                No hay datos que coincidan con los filtros aplicados
              </CardDescription>
            ) : (
              <CardDescription>No hay datos para mostrar en el grid</CardDescription>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
})

DatasetReportDetail.displayName = "DatasetReportDetail"
