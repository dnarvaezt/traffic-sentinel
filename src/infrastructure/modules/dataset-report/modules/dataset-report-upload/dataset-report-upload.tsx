"use client"

import { ArrowLeft, Upload } from "lucide-react"
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
import { Input } from "@/infrastructure/components/ui/input"
import { useDatasetReportUpload } from "./dataset-report-upload.hook"
import "./dataset-report-upload.scss"

export const DatasetReportUpload = () => {
  const {
    fileInputRef,
    dragActive,
    isLoading,
    error,
    errorType,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleInputChange,
    handleButtonClick,
    handleRetry,
  } = useDatasetReportUpload()
  const router = useRouter()

  return (
    <div className="dataset-report-upload">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dataset-report")}>
              <ArrowLeft size={20} />
            </Button>
            <div>
              <CardTitle>Subir Dataset CSV</CardTitle>
              <CardDescription>
                Arrastra y suelta tu archivo CSV o selecciónalo desde tu dispositivo
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Card className={dragActive ? "dataset-report-upload__dropzone--active" : ""}>
            <CardContent>
              <div
                className="dataset-report-upload__dropzone"
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  className="dataset-report-upload__input"
                  onChange={handleInputChange}
                  disabled={isLoading}
                />

                <div className="dataset-report-upload__content">
                  <Upload className="dataset-report-upload__icon" size={48} />
                  <CardDescription className="dataset-report-upload__text">
                    {dragActive ? "Suelta el archivo aquí" : "Arrastra y suelta tu archivo CSV"}
                  </CardDescription>
                  <CardDescription className="dataset-report-upload__subtext">o</CardDescription>
                  <Button onClick={handleButtonClick} disabled={isLoading}>
                    {isLoading ? "Subiendo..." : "Seleccionar archivo"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive" className="dataset-report-upload__error">
              <AlertTitle>
                {errorType === "invalid_file" ? "Archivo no válido" : "Error al cargar"}
              </AlertTitle>
              <AlertDescription className="dataset-report-upload__error-content">
                <div className="dataset-report-upload__error-message">{error}</div>
                {errorType === "upload_error" && (
                  <Button variant="outline" size="sm" onClick={handleRetry} disabled={isLoading}>
                    Reintentar
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
