import { useEffect, useMemo, useRef, useState } from "react"
import {
  type Dataset,
  type DatasetRow,
  DatasetService,
  downloadDatasetAsCsv,
} from "@/application/domain"
import { useDatasetStore } from "@/infrastructure/modules/dataset-report/store"
import { reportActions4505, reportActions4505Filters } from "./report-actions"

export const useDatasetReportDetail = (datasetId: string) => {
  const isLoading = useDatasetStore((state) => state.isLoading)
  const error = useDatasetStore((state) => state.error)
  const dataset = useDatasetStore((state) => (state.datasets.length > 0 ? state.datasets[0] : null))
  const datasetsMetadata = useDatasetStore((state) => state.datasetsMetadata)

  const [includeFirstRow, setIncludeFirstRow] = useState<boolean>(false)
  const [showParsedData, setShowParsedData] = useState<boolean>(false)
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set())
  const [filterModes, setFilterModes] = useState<Record<string, "include" | "exclude">>({})

  const datasetService = useMemo(() => {
    if (!dataset) return null
    return new DatasetService({
      dataset,
      cellsPerRow: 0,
      cellActions: reportActions4505,
      includeFirstRow,
    })
  }, [dataset, includeFirstRow])

  const loadDatasetById = useDatasetStore((state) => state.loadDatasetById)
  const loadDatasetsMetadata = useDatasetStore((state) => state.loadDatasetsMetadata)
  const clearError = useDatasetStore((state) => state.clearError)

  const loadedRef = useRef<string | null>(null)

  useEffect(() => {
    if (datasetId && loadedRef.current !== datasetId) {
      loadDatasetById(datasetId)
      loadDatasetsMetadata()
      loadedRef.current = datasetId
    }
  }, [datasetId, loadDatasetById, loadDatasetsMetadata])

  const handleValidateDataset = () => {
    if (!datasetService) return false
    return datasetService.validateDataset()
  }

  const handleParseDataset = () => {
    if (!datasetService) return null
    return datasetService.parseDataset()
  }

  const handleToggleIncludeFirstRow = (checked: boolean) => {
    setIncludeFirstRow(checked)
  }

  const handleToggleParsedData = (pressed: boolean) => {
    setShowParsedData(pressed)
  }

  const getDatasetFilename = (): string => {
    const metadata = datasetsMetadata.find((m) => m.id === datasetId)
    return metadata?.filename || "dataset"
  }

  const handleToggleFilter = (filterName: string) => {
    setSelectedFilters((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(filterName)) {
        newSet.delete(filterName)
        setFilterModes((modes) => {
          const newModes = { ...modes }
          delete newModes[filterName]
          return newModes
        })
      } else {
        newSet.add(filterName)
        setFilterModes((modes) => ({
          ...modes,
          [filterName]: "include" as const,
        }))
      }
      return newSet
    })
  }

  const handleToggleFilterMode = (filterName: string) => {
    setFilterModes((prev) => {
      const currentMode = prev[filterName] || "include"
      return {
        ...prev,
        [filterName]: currentMode === "include" ? "exclude" : "include",
      }
    })
  }

  const getFilteredDataset = useMemo(() => {
    if (!datasetService) return null

    const baseDataset = showParsedData ? datasetService.parseDataset() : datasetService.dataset

    let workingDataset = [...baseDataset]
    let firstRow: DatasetRow | null = null

    if (!includeFirstRow && workingDataset.length > 0) {
      firstRow = workingDataset[0]
      workingDataset = workingDataset.slice(1)
    }

    if (selectedFilters.size === 0) {
      return firstRow ? [firstRow, ...workingDataset] : workingDataset
    }

    let filteredDataset = [...workingDataset]
    const availableFilters = reportActions4505Filters

    selectedFilters.forEach((filterName) => {
      const filterDef = availableFilters.find((f) => f.name === filterName)
      if (!filterDef?.filter) return

      const mode = filterModes[filterName] || "include"

      if (mode === "include") {
        filteredDataset = datasetService.filterRows({
          dataset: filteredDataset,
          filter: filterDef.filter,
        })
      } else {
        filteredDataset = datasetService.excludeRows({
          dataset: filteredDataset,
          filter: filterDef.filter,
        })
      }
    })

    return firstRow ? [firstRow, ...filteredDataset] : filteredDataset
  }, [datasetService, showParsedData, includeFirstRow, selectedFilters, filterModes])

  const applyFilters = (dataset: Dataset): Dataset => {
    if (!datasetService) {
      return dataset
    }

    let workingDataset = [...dataset]
    let firstRow: DatasetRow | null = null

    if (!includeFirstRow && workingDataset.length > 0) {
      firstRow = workingDataset[0]
      workingDataset = workingDataset.slice(1)
    }

    if (selectedFilters.size === 0) {
      return firstRow ? [firstRow, ...workingDataset] : workingDataset
    }

    let filteredDataset = [...workingDataset]
    const availableFilters = reportActions4505Filters

    selectedFilters.forEach((filterName) => {
      const filterDef = availableFilters.find((f) => f.name === filterName)
      if (!filterDef?.filter) return

      const mode = filterModes[filterName] || "include"

      if (mode === "include") {
        filteredDataset = datasetService.filterRows({
          dataset: filteredDataset,
          filter: filterDef.filter,
        })
      } else {
        filteredDataset = datasetService.excludeRows({
          dataset: filteredDataset,
          filter: filterDef.filter,
        })
      }
    })

    return firstRow ? [firstRow, ...filteredDataset] : filteredDataset
  }

  const handleDownloadDataset = (separator: string, useParsedData: boolean) => {
    if (!datasetService) return

    const baseDataset = useParsedData ? datasetService.parseDataset() : datasetService.dataset
    const datasetToDownload = applyFilters(baseDataset)
    const filename = getDatasetFilename()
    const suffix = useParsedData ? "transform" : "original"

    downloadDatasetAsCsv(datasetToDownload, filename, separator, suffix)
  }

  return {
    datasetService,
    isLoading,
    error,
    clearError,
    handleValidateDataset,
    handleParseDataset,
    handleToggleIncludeFirstRow,
    showParsedData,
    handleToggleParsedData,
    handleDownloadDataset,
    availableFilters: reportActions4505Filters,
    selectedFilters,
    filterModes,
    handleToggleFilter,
    handleToggleFilterMode,
    getFilteredDataset,
  }
}
