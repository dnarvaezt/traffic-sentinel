## 1. Modelo de datos

- [x] 1.1 Agregar campo `label?: string` a `GroupDefinition` en `src/data-import/domain/models/group.ts`
- [x] 1.2 El label se resuelve en el componente de UI, no en el servicio (no requiere cambio en group-data.service.ts)

## 2. Ruta y navegación

- [x] 2.1 Crear `src/app/projects/[id]/groups/page.tsx` que renderiza `GroupsPage` envuelto en `ProjectLayout`
- [x] 2.2 Agregar `TabId` type `"groups"` en `ProjectLayout.tsx`
- [x] 2.3 Agregar nav item "Agrupaciones" con icono `Layers` en el array de navegación de `ProjectLayout.tsx`
- [x] 2.4 Actualizar la detección de tab activo en `ProjectLayout.tsx` para incluir `/groups`
- [x] 2.5 Eliminar tab "Agrupaciones" de `ConfigEditor.tsx` y su `TabsContent`
- [x] 2.6 Eliminar `src/modules/project/components/config-editor/groups-editor.tsx`

## 3. Componente GroupsPage

- [x] 3.1 Crear `src/modules/groups/components/GroupsPage.tsx` con layout de dos paneles (configuración izquierda, preview derecha)
- [x] 3.2 Implementar panel izquierdo: lista de columnas disponibles (origen drag)
- [x] 3.3 Implementar zona de drop donde se colocan las columnas para crear niveles de agrupación
- [x] 3.4 Implementar reordenamiento de niveles por drag & drop (usando `@dnd-kit/sortable`)
- [x] 3.5 Implementar eliminación de niveles con botón X en cada badge
- [x] 3.6 Implementar autosave: cada cambio se persiste inmediatamente via `updateConfig`
- [x] 3.7 Implementar selector de dataset activo (si el proyecto tiene múltiples datasets)
- [x] 3.8 Mostrar estado vacío cuando no hay columnas definidas

## 4. Vista previa en vivo (GroupsPreview)

- [x] 4.1 Crear `src/modules/groups/components/GroupsPreview.tsx`
- [x] 4.2 Integrar `loadDatabaseData` para obtener datos del dataset activo
- [x] 4.3 Aplicar `groupDataService.execute()` con los grupos configurados (cliente, sobre primeros 1000 rows)
- [x] 4.4 Renderizar árbol colapsable de grupos con `GroupedData[]`
- [x] 4.5 Mostrar nombre de grupo (label o header) + cantidad de elementos en cada header
- [x] 4.6 Implementar colapso/expansión de grupos
- [x] 4.7 Mostrar "50+ elementos" para grupos grandes (>50 hijos directos)
- [x] 4.8 Mostrar preview plana (tabla simple) cuando no hay grupos configurados
- [x] 4.9 Mostrar estado "Selecciona un dataset" cuando no hay dataset activo
- [x] 4.10 Mostrar notice "Mostrando preview de los primeros 1000 registros" cuando aplica

## 5. Integración y limpieza

- [x] 5.1 Verificar que el barrel export de `src/modules/groups/index.ts` exporte `GroupsPage`
- [x] 5.2 Verificar que TypeScript compila sin errores (`npx tsc --noEmit`)
- [x] 5.3 Verificar que el build de producción funciona (`npm run build` o similar)
- [x] 5.4 Verificar que proyectos existentes migran correctamente (grupos previos visibles en nueva página)
