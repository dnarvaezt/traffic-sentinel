import { useEffect } from "react"
import { useDatasetStore } from "@/infrastructure/modules/dataset-report/store"

export const useDatasetReportList = () => {
  const { datasetsMetadata, isLoading, error, loadDatasetsMetadata, deleteDataset, clearError } =
    useDatasetStore()

  useEffect(() => {
    loadDatasetsMetadata()
  }, [loadDatasetsMetadata])

  const handleDelete = async (id: string) => {
    await deleteDataset(id)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return {
    datasetsMetadata,
    isLoading,
    error,
    handleDelete,
    formatDate,
    clearError,
  }
}
