## Context

Actualmente `ColumnDefinition` no distingue entre columnas que vienen del dataset y columnas calculadas. El campo `header` sirve tanto para mostrar en pantalla como para mapear al CSV (`mapDataService` busca `row[col.header]`). El campo `calculate` existe pero no hay un indicador explícito de si una columna es "virtual".

En la UI, todas las columnas se crean igual: se pide un nombre/header, tipo, etc. No hay forma de seleccionar qué columna del dataset corresponde a cada columna visual. La única forma de "cargar" columnas del dataset es el botón "Cargar desde dataset" que reemplaza TODAS las columnas.

Esto causa problemas:
- No se puede tener un header visual distinto al nombre de la columna del CSV
- No se puede ordenar columnas de forma distinta a como vienen en el CSV
- Las columnas calculadas aparecen mezcladas con las de dataset

## Goals / Non-Goals

**Goals:**
- Distinguir explícitamente entre columnas source (mapean a dataset) y virtuales (calculadas)
- Permitir elegir qué columna del dataset corresponde a cada columna visual
- Mantener el header visual independiente del nombre de columna del CSV
- Mejorar UI del editor para mostrar la diferencia claramente
- Backward compatibility: columnas existentes funcionan sin cambios

**Non-Goals:**
- No cambiar el pipeline de importación más allá del mapeo de columnas source
- No implementar reordenamiento drag & drop de columnas (eso sería otro cambio)
- No cambiar el modelo de grupos (`GroupDefinition`)

## Decisions

### 1. Campo `kind` en `ColumnDefinition`
- **Decisión**: Agregar `kind: "source" | "virtual"` (opcional, default `"source"`)
- **Razón**: Es la forma más simple y explícita de distinguir. Sin `kind`, se asume `"source"` para backward compat.
- **Alternativa**: Usar la presencia de `calculate` para inferir virtual — se descarta porque una columna source también podría tener transformers sin ser virtual.

### 2. Campo `sourceColumn` para mapeo
- **Decisión**: Agregar `sourceColumn?: string` que indica el nombre de la columna en el CSV/dataset
- **Razón**: Separa el nombre visual (`header`) del nombre de origen. El `mapDataService` usará `sourceColumn` si existe, con fallback a `header`.
- **Alternativa**: Seguir usando `header` para mapeo — no permite tener headers visuales distintos.

### 3. UI: Selector de columnas del dataset
- **Decisión**: Al seleccionar `kind: "source"`, se muestra un dropdown con las columnas reales del dataset (obtenidas de `databases`). El usuario elige qué columna del dataset corresponde.
- **Razón**: UX clara — el usuario ve exactamente qué columna del CSV está usando.
- **Alternativa**: Input libre — propenso a errores de tipeo.

### 4. Pipeline: Skip virtual columns en map step
- **Decisión**: `mapDataService` solo mapea columnas con `kind !== "virtual"`. Las virtuales se crean en el paso `evaluateCalculatedColumns`.
- **Razón**: No tiene sentido buscar en el CSV datos para una columna que no existe en el origen.

### 5. UI: Badge visual del tipo de columna
- **Decisión**: En la tabla de columnas, mostrar un badge "Source" o "Virtual" con colores distintivos.
- **Razón**: Feedback visual inmediato para el usuario.

## Risks / Trade-offs

- **[Breaking] Migración de proyectos existentes** → Columnas sin `kind` se tratan como `"source"`. No hay datos que migrar porque el campo es opcional.
- **[UX] Columnas virtuales sin datos** → Si una expresión calculate referencia una columna que no existe, el pipeline produce error. Ya hay manejo de errores en `evaluateCalculatedColumns`.
- **[Complejidad] Dos campos para el nombre** → `header` (visual) + `sourceColumn` (origen). Podría confundir, pero la UI lo aclara mostrando ambos con etiquetas distintas.
