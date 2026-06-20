"use client"

import { useState, useCallback, useMemo } from "react"
import type { SchemaDefinition } from "../../domain/models/schema"
import type { ValidationError } from "../../domain/models/validation"
import type { GroupedData } from "../../domain/models/group"
import { importEngine } from "../../application/import-engine"
import { exportDataService } from "../../application/export-data/export-data.service"

export function useDataImport(schema: SchemaDefinition) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [rawData, setRawData] = useState<Record<string, any>[]>([])
  const [processedData, setProcessedData] = useState<Record<string, any>[]>([])
  const [groupedData, setGroupedData] = useState<GroupedData[] | Record<string, any>[]>([])
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [runtimeFilters, setRuntimeFilters] = useState<Record<string, any>>({})

  const runPipeline = useCallback(
    async (targetFile: File, filters: Record<string, any> = {}) => {
      setLoading(true)
      try {
        const result = await importEngine.run(targetFile, schema, filters)
        setRawData(result.rawData)
        setProcessedData(result.filteredData)
        setGroupedData(result.groupedData)
        setErrors(result.errors)
      } catch (error) {
        console.error("Import failed", error)
      } finally {
        setLoading(false)
      }
    },
    [schema],
  )

  const handleFileUpload = useCallback(
    (uploadedFile: File) => {
      setFile(uploadedFile)
      runPipeline(uploadedFile, runtimeFilters)
    },
    [runPipeline, runtimeFilters],
  )

  const handleFilterChange = useCallback(
    (filterId: string, value: any) => {
      const newFilters = { ...runtimeFilters, [filterId]: value }
      setRuntimeFilters(newFilters)
      if (file) {
        runPipeline(file, newFilters)
      }
    },
    [file, runtimeFilters, runPipeline],
  )

  const handleExport = useCallback(() => {
    exportDataService.execute(processedData)
  }, [processedData])

  const handleReplaceFile = useCallback(() => {
    setFile(null)
    setRawData([])
    setProcessedData([])
    setGroupedData([])
    setErrors([])
    setRuntimeFilters({})
  }, [])

  return {
    file,
    loading,
    rawData,
    processedData,
    groupedData,
    errors,
    runtimeFilters,
    handleFileUpload,
    handleFilterChange,
    handleExport,
    handleReplaceFile,
  }
}
