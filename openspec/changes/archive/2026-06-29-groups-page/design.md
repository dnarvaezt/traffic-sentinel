## Context

El sistema de agrupaciones actual (GroupDefinition, group-data.service.ts, groups-editor.tsx) está embebido en ConfigEditor con una UX básica. Las agrupaciones se definen como un array de `{ columnId: string }` en `SchemaDefinition.groups`. Se ejecutan en el pipeline de importación (último paso) pero el resultado (GroupedData[]) no se persiste ni se muestra al usuario. Los datos agrupados son efímeros. Dashboard y DatasetView usan su propio concepto de agrupación (widget-level `GroupByDefinition`).

Existe un layout de proyecto con sidebar que navega entre páginas dedicadas (datasets, dashboard, filters) y un tab de configuración (?tab=config). Se usará el mismo patrón de ruta dedicada para la nueva página de agrupaciones.

La UI actual de GroupsEditor:
- Lista de niveles (cada uno = una columna)
- Botones up/down para reordenar
- Botón + para agregar nivel (abre un dialog con dropdown de columnas)
- Botón de eliminar en cada nivel
- Sin vista previa, sin drag & drop

## Goals / Non-Goals

**Goals:**
- Página dedicada `/projects/[id]/groups` con UI tipo Notion para configurar agrupaciones
- Drag & drop: arrastrar columnas a zona de agrupación, reordenar niveles por arrastre
- Vista previa en vivo de datos agrupados usando el dataset activo
- Sidebar nav item "Agrupaciones" con icono `Layers`
- Eliminar tab "Agrupaciones" de ConfigEditor y su componente GroupsEditor
- Agregar campo `label` a `GroupDefinition` para nombre visible del grupo

**Non-Goals:**
- No modificar el widget-level `GroupByDefinition` del dashboard
- No persistir `GroupedData` en el pipeline (sigue siendo calculado bajo demanda)
- No implementar grouping en DatasetView (solo preview en la página de grupos)
- No implementar arrastre desde fuera del navegador (solo drag & drop interno)

## Decisions

### 1. Ruta dedicada vs. modal/tab
- **Decisión**: Ruta dedicada `/projects/[id]/groups`
- **Razón**: El usuario lo pidió explícitamente ("debe estar en una pagina a parte no en el tab de configuracion"). Sigue el patrón de dashboard y filters.
- **Alternativa**: Modal flotante — se descarta porque no cumple el requisito.

### 2. Librería de drag & drop: `@dnd-kit`
- **Decisión**: Usar `@dnd-kit/core` + `@dnd-kit/sortable`
- **Razón**: Ya está disponible en el ecosistema Next.js/React, es moderna, accesible, y soporta sortable lists verticales y horizontal drop zones. Más ligera que `react-beautiful-dnd` (deprecada) y `react-dnd` (API verbosa).

### 3. Vista previa en vivo
- **Decisión**: La vista previa se renderiza con datos de `useDatasetData` (hook existente) y `groupDataService.execute()` aplicado en el cliente, NO en el servidor ni en el pipeline de importación.
- **Razón**: Los datos ya están en el store (calculatedData). Aplicar grouping es puramente computacional (array map/reduce) y no requiere backend. Esto da feedback instantáneo. Los grupos de esquema siempre se calcularon en el pipeline de importación, pero al no persistirse, tiene más sentido calcularlos bajo demanda en la UI.
- **Riesgo**: Para datasets muy grandes (>100k filas), grouping en cliente puede causar lag. Mitigación: limitar preview a primeros 1000 filas + indicador de "mostrando preview parcial".

### 4. Modelo `GroupDefinition`
- **Decisión**: Agregar `label?: string` opcional
- **Razón**: Permite al usuario dar un nombre semántico al grupo (ej. "Por Región" en vez de mostrar solo "Región" que es el nombre de columna). Si no hay label, se usa `column.header` como fallback.
- **Riesgo**: Bajo — es un campo opcional, no rompe serialización existente.

### 5. Layout de la página Groups
- **Decisión**: Dos zonas principales:
  - **Zona izquierda (configuración)**: Lista de columnas disponibles (origen drag) + zona de drop (niveles de agrupación)
  - **Zona derecha (preview)**: Árbol colapsable de datos agrupados
- **Razón**: Sigue el patrón Notion — columna de herramientas a la izquierda, contenido a la derecha. En mobile se apila verticalmente.
- **Alternativa**: Preview embebido debajo de la configuración — se descarta porque no escala verticalmente con muchos niveles.

### 6. Ciclo de edición (optimistic updates)
- **Decisión**: Los cambios a grupos se guardan automáticamente (sin botón "Guardar") mediante `updateConfig` del store cada vez que se modifica el array de grupos.
- **Razón**: La vista previa necesita el estado actualizado. Autosave elimina fricción. Sigue el patrón existente en ConfigEditor (los cambios se guardan inmediatamente).
- **Riesgo**: Sin confirmación, un drag accidental modifica la configuración. Mitigación: es fácil reordenar de vuelta, y los grupos no afectan datos persistidos (solo la vista previa y futuras importaciones).

## Risks / Trade-offs

- **[Performance] Preview con datasets grandes** → Limitar preview a 1000 filas + indicador "Preview parcial". En el futuro se puede paginar o virtualizar.
- **[UX] Autosave sin confirmación** → Los cambios en grupos son de bajo riesgo (no destruyen datos). El costo de equivocarse es mínimo (reordenar tiene efecto inmediato reversible).
- **[Dependency] @dnd-kit** → Librería madura y estable, pero agrega ~15KB al bundle. Compensado por la mejora UX significativa.
- **[Breaking] Eliminar tab de ConfigEditor** → Proyectos existentes perderán acceso al editor de grupos desde ConfigEditor. Mitigación: la nueva página es accesible desde el sidebar y la URL es permanente.
