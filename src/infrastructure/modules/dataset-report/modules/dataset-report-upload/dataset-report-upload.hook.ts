import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useToast } from "@/infrastructure/components/ui"
import { useDatasetStore } from "@/infrastructure/modules/dataset-report/store"

export const useDatasetReportUpload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const { showToast } = useToast()
  const router = useRouter()

  const {
    uploadCsv,
    isLoading,
    error,
    errorType,
    uploadedFileName,
    clearError,
    clearUploadedFileName,
  } = useDatasetStore()

  useEffect(() => {
    if (uploadedFileName && !error && !isLoading) {
      const fileName = uploadedFileName
      showToast({
        title: "Archivo cargado exitosamente",
        description: `El archivo ${fileName} se cargó correctamente`,
        variant: "success",
      })
      clearUploadedFileName()
      setTimeout(() => {
        router.push("/dataset-report")
      }, 1000)
    }
  }, [uploadedFileName, error, isLoading, showToast, clearUploadedFileName, router])

  const handleFileSelect = async (file: File | null) => {
    if (!file) return
    await uploadCsv(file)
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files[0]
    handleFileSelect(file)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    handleFileSelect(file)
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleRetry = () => {
    clearError()
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return {
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
    clearError,
  }
}
