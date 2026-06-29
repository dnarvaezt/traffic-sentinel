## Why

El código base acumula archivos huérfanos (hooks de export PDF/XLSX que ya no se usan) y exports redundantes en barrel files que exponen componentes internos nunca importados desde fuera del módulo. Esto genera confusión, aumenta el mantenimiento y dificulta la navegación del proyecto.

## What Changes

- Eliminar `use-pdf-export.ts` y `use-xlsx-export.ts` (hooks huérfanos, sin imports)
- Limpiar barrel exports redundantes en `dashboard/index.ts`: dejar solo `DashboardPage`, remover `DashboardChartWidget`, `DashboardFilterWidget`, `DashboardGrid`, `DashboardTableWidget`, `MetricWidget`, `WIDGET_REGISTRY`, `WIDGET_TYPES`
- Limpiar barrel exports redundantes en `dataset/index.ts`: dejar solo `DatasetView`, remover `useDatasetView`
- Limpiar barrel exports redundantes en `filters/index.ts`: dejar solo `FiltersView`, remover `FILTER_OPERATORS`, `useFilters`
- Limpiar barrel exports redundantes en `config-editor/index.ts`: dejar solo `ColumnsEditor`, remover `TransformersEditor`, `ValidatorsEditor`, `VirtualColumnsEditor`

## Capabilities

### New Capabilities


### Modified Capabilities


## Impact

- **Eliminación**: `src/modules/dashboard/hooks/use-pdf-export.ts` (57 líneas)
- **Eliminación**: `src/modules/dashboard/hooks/use-xlsx-export.ts` (41 líneas)
- **Modificación**: `src/modules/dashboard/index.ts` — reducir exports a solo `DashboardPage`
- **Modificación**: `src/modules/dataset/index.ts` — reducir exports a solo `DatasetView`
- **Modificación**: `src/modules/filters/index.ts` — reducir exports a solo `FiltersView`
- **Modificación**: `src/modules/config-editor/index.ts` — reducir exports a solo `ColumnsEditor`
