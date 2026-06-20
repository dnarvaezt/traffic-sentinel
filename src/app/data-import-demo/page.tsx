"use client"

import { ClipboardList, Database, Download, GraduationCap, Users } from "lucide-react"
import { useState } from "react"
import { employeeSchema } from "@/data-import/configs/employee-import.config"
import { learningPlanSchema } from "@/data-import/configs/learning-plan.config"
import {
  competenciesImportSchema,
  usersImportSchema,
} from "@/data-import/configs/users-and-competencies.config"
import { DataTable } from "@/data-import/presentation/components/DataTable"
import { FilterPanel } from "@/data-import/presentation/components/FilterPanel"
import { GroupPanel } from "@/data-import/presentation/components/GroupPanel"
import { UploadCSV } from "@/data-import/presentation/components/UploadCSV"
import { useDataImport } from "@/data-import/presentation/hooks/use-data-import"
import { Button } from "@/shared/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"

const SCHEMAS = {
  employees: {
    name: "Empleados",
    schema: employeeSchema,
    icon: Users,
    description: "Importación de personal con cálculos de avance y agrupación por país.",
  },
  learning: {
    name: "Planes de Aprendizaje",
    schema: learningPlanSchema,
    icon: GraduationCap,
    description: "Planes con validación de fechas y múltiples niveles de agrupación.",
  },
  users: {
    name: "Usuarios",
    schema: usersImportSchema,
    icon: Database,
    description: "Gestión de usuarios con filtros de estado y rol.",
  },
  competencies: {
    name: "Competencias",
    schema: competenciesImportSchema,
    icon: ClipboardList,
    description: "Competencias con validación de unicidad por columna.",
  },
}

export default function DataImportDemoPage() {
  const [activeSchemaKey, setActiveSchemaKey] = useState<keyof typeof SCHEMAS>("employees")
  const activeSchema = SCHEMAS[activeSchemaKey]

  const {
    file,
    loading,
    processedData,
    groupedData,
    errors,
    runtimeFilters,
    handleFileUpload,
    handleFilterChange,
    handleExport,
    handleReplaceFile,
  } = useDataImport(activeSchema.schema)

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tighter">Motor de Importación Genérico</h1>
        <p className="text-muted-foreground">
          Screaming Architecture + Schema-driven UI. Un solo motor, múltiples configuraciones.
        </p>
      </div>

      <Tabs
        value={activeSchemaKey}
        onValueChange={(v) => {
          setActiveSchemaKey(v as any)
          handleReplaceFile()
        }}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-1">
          {Object.entries(SCHEMAS).map(([key, item]) => (
            <TabsTrigger key={key} value={key} className="py-3 gap-2">
              <item.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{item.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(SCHEMAS).map(([key, item]) => (
          <TabsContent key={key} value={key} className="space-y-6 pt-6">
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>

            <UploadCSV
              file={file}
              onFileUpload={handleFileUpload}
              onReplaceFile={handleReplaceFile}
              loading={loading}
            />

            {file && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Resultados del Pipeline</h2>
                  <Button onClick={handleExport} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Procesados
                  </Button>
                </div>

                <FilterPanel
                  filters={item.schema.filters || []}
                  values={runtimeFilters}
                  onChange={handleFilterChange}
                />

                <GroupPanel groups={item.schema.groups || []} columns={item.schema.columns} />

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Mostrando {processedData.length} filas
                    </span>
                    {errors.length > 0 && (
                      <span className="text-destructive font-medium">
                        {errors.length} errores encontrados
                      </span>
                    )}
                  </div>

                  <DataTable
                    schema={item.schema}
                    data={groupedData.length > 0 ? groupedData : processedData}
                    errors={errors}
                  />
                </div>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
