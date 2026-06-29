## 1. Eliminar hooks huérfanos

- [x] 1.1 Eliminar `src/modules/dashboard/hooks/use-pdf-export.ts`
- [x] 1.2 Eliminar `src/modules/dashboard/hooks/use-xlsx-export.ts`

## 2. Limpiar barrel exports

- [x] 2.1 Reducir `src/modules/dashboard/index.ts` — exportar solo `DashboardPage`
- [x] 2.2 Reducir `src/modules/dataset/index.ts` — exportar solo `DatasetView`
- [x] 2.3 Reducir `src/modules/filters/index.ts` — exportar solo `FiltersView`
- [x] 2.4 Reducir `src/modules/config-editor/index.ts` — exportar solo `ColumnsEditor`

## 3. Verificación

- [x] 3.1 Verificar TypeScript compila (`npx tsc --noEmit`)
