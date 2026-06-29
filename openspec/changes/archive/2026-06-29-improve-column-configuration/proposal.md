## Why

Actualmente `ColumnDefinition` mezcla dos conceptos distintos: columnas que toman datos directamente del CSV y columnas virtuales calculadas a partir de otras. El campo `header` se usa tanto para mostrar como para mapear al CSV, lo que causa confusión. No hay forma de elegir explícitamente qué columna del dataset corresponde a cada columna visual, ni una distinción clara en la UI entre columnas de origen y virtuales.

## What Changes

- Agregar `kind: "source" | "virtual"` a `ColumnDefinition` para separar explícitamente columnas de dataset vs. calculadas
- Agregar `sourceColumn?: string` para indicar qué columna del CSV/dataset provee los datos (independiente del `header` visual)
- Actualizar `mapDataService.execute()` para usar `sourceColumn` cuando esté presente, con fallback a `header`
- Mejorar el editor de columnas (`ColumnsEditor`) con:
  - Selector de tipo de columna (source / virtual) al crear/editar
  - Para source columns: dropdown con las columnas reales del dataset
  - Para virtual columns: campo de expresión `calculate` (ocultar el selector de dataset column)
  - Indicador visual del tipo de columna en la tabla
- Actualizar el pipeline de importación para saltar columnas virtuales en el mapeo de datos
- **BREAKING**: `ColumnDefinition` cambia su semántica — proyectos existentes sin `kind` se migran como `"source"`

## Capabilities

### New Capabilities
- `column-kind`: Distinción entre columnas source (mapean a dataset) y virtuales (calculadas)

### Modified Capabilities


## Impact

- **Modificación**: `ColumnDefinition` en `src/data-import/domain/models/column.ts` — nuevos campos `kind` y `sourceColumn`
- **Modificación**: `mapDataService` en `src/data-import/application/map-data/map-data.service.ts` — usar `sourceColumn` para mapeo
- **Modificación**: `import-engine.ts` — no mapear columnas virtuales en paso de mapeo
- **Modificación**: `ColumnsEditor` en `src/modules/project/components/config-editor/columns-editor.tsx` — UI con selector de tipo y source column
- **Migración**: Columnas existentes sin `kind` se tratan como `"source"` (backward compatible)
