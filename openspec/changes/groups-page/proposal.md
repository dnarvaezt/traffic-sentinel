## Why

El sistema de agrupaciones actual está relegado a un tab dentro de ConfigEditor y tiene una UX minimalista (selector de columnas + botones subir/bajar). No hay una vista previa de cómo quedan los datos agrupados, ni interacción visual. Un sistema tipo Notion —drag & drop, feedback visual inmediato, vista previa en vivo— facilitaría enormemente la exploración y organización de datos.

## What Changes

- Nueva página dedicada `/projects/[id]/groups` para la configuración de agrupaciones
- Nuevo ítem en el sidebar "Agrupaciones" con icono `Layers` (entre Datasets y Dashboard)
- Sistema de drag & drop: las columnas se arrastran desde un listado a una "zona de agrupación"
- Vista previa en vivo de los datos agrupados (árbol colapsable) usando el dataset activo
- Reordenamiento drag & drop de los niveles de agrupación (no solo botones arriba/abajo)
- Eliminar niveles con un click (icono X sobre la badge de nivel)
- El tab "Agrupaciones" desaparece de ConfigEditor (se reemplaza por la página dedicada)
- Mejora del modelo `GroupDefinition` para soportar `label?: string` (nombre visible del grupo)
- **BREAKING**: Se elimina `GroupsEditor` de `config-editor/` y el tab de Agrupaciones de `ConfigEditor.tsx`

## Capabilities

### New Capabilities
- `groups-page`: Página dedicada con UI tipo Notion para configurar agrupaciones por arrastre, con vista previa en vivo de datos agrupados
- `groups-preview`: Vista previa en vivo que muestra los datos del dataset activo organizados según las agrupaciones configuradas, con árbol colapsable

### Modified Capabilities
*(none — no existing spec files to modify)*

## Impact

- **Nuevo archivo**: `src/app/projects/[id]/groups/page.tsx`
- **Nuevo componente**: `GroupsPage` en `src/modules/groups/`
- **Modificación**: `ProjectLayout.tsx` — agregar nav item "Agrupaciones"
- **Modificación**: `ConfigEditor.tsx` — eliminar tab "Agrupaciones"
- **Eliminación**: `groups-editor.tsx` de `config-editor/`
- **Modificación**: `GroupDefinition` en `group.ts` — agregar campo `label?`
- **Modificación**: `group-data.service.ts` — usar `label` si está presente
- **Dependencias**: `@dnd-kit/core` y `@dnd-kit/sortable` para drag & drop
