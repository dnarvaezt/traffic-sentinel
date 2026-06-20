"use client"

import { Download, FileSpreadsheet, Upload } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import type { StoredPipelineResult } from "@/core/dataset/pipeline.service"
import { exportDataService } from "@/data-import/application/export-data/export-data.service"
import { filterDataService } from "@/data-import/application/filter-data/filter-data.service"
import { groupDataService } from "@/data-import/application/group-data/group-data.service"
import type { GroupedData } from "@/data-import/domain/models/group"
import type { SchemaDefinition } from "@/data-import/domain/models/schema"
import type { ValidationError } from "@/data-import/domain/models/validation"
import { DataTable } from "@/data-import/presentation/components/DataTable"
import { FilterPanel } from "@/data-import/presentation/components/FilterPanel"
import { GroupPanel } from "@/data-import/presentation/components/GroupPanel"
import { Button } from "@/shared/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import type { useProjectImport } from "../hooks/use-project-import"

interface DatasetInfo {
  id: string
  name: string
  rowCount: number
}

interface DataViewerProps {
  datasets: DatasetInfo[]
  schema: SchemaDefinition
  importHook: ReturnType<typeof useProjectImport>
  onImportCSV: (file: File) => Promise<void>
}

export function DataViewer({ datasets, schema, importHook, onImportCSV }: DataViewerProps) {
  const [selectedDataset, setSelectedDataset] = useState<string>("")
  const [storedResult, setStoredResult] = useState<StoredPipelineResult | null>(null)
  const [runtimeFilters, setRuntimeFilters] = useState<Record<string, any>>({})
  const [groupingEnabled, setGroupingEnabled] = useState(true)
  const [filteredData, setFilteredData] = useState<Record<string, any>[]>([])
  const [groupedData, setGroupedData] = useState<GroupedData[] | Record<string, any>[]>([])
  const [errors, setErrors] = useState<ValidationError[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (datasets.length > 0 && !selectedDataset) {
      setSelectedDataset(datasets[0].id)
    }
  }, [datasets, selectedDataset])

  useEffect(() => {
    if (!selectedDataset) return
    importHook.loadFromStore(selectedDataset).then((result) => {
      if (result) {
        setStoredResult(result)
        setErrors(result.errors)
        setRuntimeFilters({})
      }
    })
  }, [selectedDataset, importHook])

  useEffect(() => {
    if (!storedResult) return
    const filtered = filterDataService.execute(
      storedResult.calculatedData,
      schema.filters || [],
      runtimeFilters,
    )
    setFilteredData(filtered)
    if (groupingEnabled) {
      setGroupedData(groupDataService.execute(filtered, schema.groups || []))
    } else {
      setGroupedData(filtered)
    }
  }, [storedResult, runtimeFilters, groupingEnabled, schema])

  function handleFilterChange(filterId: string, value: any) {
    setRuntimeFilters((prev) => ({ ...prev, [filterId]: value }))
  }

  function handleExport() {
    exportDataService.execute(filteredData)
  }

  async function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    await onImportCSV(file)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Datos</h2>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Subir CSV
          </Button>
          {filteredData.length > 0 && (
            <Button size="sm" variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          )}
        </div>
      </div>

      {datasets.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border rounded-lg">
          <FileSpreadsheet className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No hay datos importados</p>
          <p className="text-xs">Sube un archivo CSV para visualizar los datos</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4">
            <div className="w-64">
              <Select value={selectedDataset} onValueChange={setSelectedDataset}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona dataset" />
                </SelectTrigger>
                <SelectContent>
                  {datasets.map((ds) => (
                    <SelectItem key={ds.id} value={ds.id}>
                      {ds.name} ({ds.rowCount.toLocaleString()} rows)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {importHook.loading && (
              <span className="text-sm text-muted-foreground">Procesando...</span>
            )}
          </div>

          {storedResult ? (
            <>
              {(schema.filters?.length ?? 0) > 0 && (
                <FilterPanel
                  filters={schema.filters || []}
                  values={runtimeFilters}
                  onChange={handleFilterChange}
                />
              )}

              {(schema.groups?.length ?? 0) > 0 && (
                <div className="flex items-center gap-2">
                  <GroupPanel groups={schema.groups || []} columns={schema.columns} />
                  <Button variant="outline" size="sm" onClick={() => setGroupingEnabled((g) => !g)}>
                    {groupingEnabled ? "Desagrupar" : "Agrupar"}
                  </Button>
                </div>
              )}

              <DataTable
                schema={schema}
                data={groupingEnabled ? groupedData : filteredData}
                errors={errors}
              />
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground border rounded-lg">
              <p className="text-sm">Cargando datos...</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
