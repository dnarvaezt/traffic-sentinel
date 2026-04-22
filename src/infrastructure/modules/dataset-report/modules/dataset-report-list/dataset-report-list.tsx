"use client"

import { FileSpreadsheet, PlusCircle, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/infrastructure/components/ui/alert"
import { Button } from "@/infrastructure/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/infrastructure/components/ui/card"
import { useDatasetReportList } from "./dataset-report-list.hook"
import "./dataset-report-list.scss"

export const DatasetReportList = () => {
  const { datasetsMetadata, isLoading, error, handleDelete, formatDate, clearError } =
    useDatasetReportList()
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="dataset-report">
        <Card>
          <CardContent>
            <CardDescription className="dataset-report-list__loading">
              Cargando datasets...
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dataset-report">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="dataset-report-list__error-content">
            {error}
            <Button variant="ghost" size="sm" onClick={clearError}>
              Cerrar
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (datasetsMetadata.length === 0) {
    return (
      <div className="dataset-report">
        <Card>
          <CardHeader>
            <CardTitle>Datasets</CardTitle>
            <CardDescription>Gestiona tus datasets de IndexedDB</CardDescription>
          </CardHeader>
          <CardContent>
            <CardDescription className="dataset-report-list__empty">
              No hay datasets disponibles
            </CardDescription>
            <Button className="mt-4" onClick={() => router.push("/dataset-report/upload")}>
              <PlusCircle className="mr-2" size={16} />
              Subir nuevo dataset
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="dataset-report-list">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Datasets</CardTitle>
              <CardDescription>
                {datasetsMetadata.length}{" "}
                {datasetsMetadata.length === 1 ? "dataset cargado" : "datasets cargados"}
              </CardDescription>
            </div>
            <Button onClick={() => router.push("/dataset-report/upload")}>
              <PlusCircle className="mr-2" size={16} />
              Subir nuevo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="dataset-report-list__items">
            {datasetsMetadata.map((dataset) => (
              <div
                key={dataset.id}
                className="dataset-report-list__item"
                onClick={() => router.push(`/dataset-report/${dataset.id}`)}
              >
                <FileSpreadsheet className="dataset-report-list__item-icon" size={24} />
                <div className="dataset-report-list__item-info">
                  <p className="dataset-report-list__item-name">
                    {dataset.filename || `Dataset ${dataset.id.slice(0, 8)}`}
                  </p>
                  <div className="dataset-report-list__item-meta">
                    <span className="dataset-report-list__item-rows">
                      {dataset.rowCount} {dataset.rowCount === 1 ? "fila" : "filas"}
                    </span>
                    <span className="dataset-report-list__item-date">
                      {formatDate(dataset.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="dataset-report-list__item-actions">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(dataset.id)
                    }}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
