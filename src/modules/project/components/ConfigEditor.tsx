"use client"

import type { Database as DbRecord } from "@/core/project"
import type { SchemaDefinition } from "@/data-import/domain/models/schema"
import { ColumnsEditor } from "@/modules/config-editor"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"

interface ConfigEditorProps {
  config: SchemaDefinition
  onConfigChange: (config: SchemaDefinition) => void
  databases?: DbRecord[]
}

function emptyConfig(): SchemaDefinition {
  return {
    columns: [],
    groups: [],
  }
}

export function ConfigEditor({ config, onConfigChange, databases = [] }: ConfigEditorProps) {
  const current = { ...emptyConfig(), ...config }

  const update = (patch: Partial<SchemaDefinition>) => {
    onConfigChange({ ...current, ...patch })
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Define la configuración de las columnas del proyecto.
      </p>

      <Tabs defaultValue="columns">
        <TabsList className="flex-wrap">
          <TabsTrigger value="columns">Columnas</TabsTrigger>
        </TabsList>

        <TabsContent value="columns" className="space-y-4 pt-4">
          <ColumnsEditor
            columns={current.columns}
            onChange={(columns) => update({ columns })}
            databases={databases}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
