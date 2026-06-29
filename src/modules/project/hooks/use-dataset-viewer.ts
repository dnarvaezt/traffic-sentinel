import { useCallback, useEffect, useRef, useState } from "react"
import type { Dataset } from "@/core"
import { createDatasetRepository, type DatasetStore } from "@/core"

const PAGE_SIZE = 100

export function useDatasetViewer(datasetId: string) {
  const [dataset, setDataset] = useState<Dataset | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const storeRef = useRef<DatasetStore>(createDatasetRepository())

  useEffect(() => {
    async function load() {
      const ds = await storeRef.current.read(datasetId)
      setDataset(ds ?? null)
      setLoading(false)
    }
    load()
  }, [datasetId])

  const totalPages = dataset ? Math.max(1, Math.ceil(dataset.rawData.length / PAGE_SIZE)) : 0
  const pageData = dataset ? dataset.rawData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) : []
  const headers = dataset
    ? dataset.columns.length > 0
      ? dataset.columns.map((c) => c.header)
      : dataset.rawData.length > 0
        ? Object.keys(dataset.rawData[0])
        : []
    : []

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage)
  }, [])

  return { dataset, loading, page, totalPages, pageData, headers, handlePageChange }
}
