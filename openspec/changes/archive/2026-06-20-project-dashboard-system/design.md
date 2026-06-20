## Context

Actualmente Traffic Sentinel tiene el modelo de datos para dashboards (`Dashboard`, `Widget`, `WidgetConfig`, `WidgetType`) definido en `project.entity.ts` y operaciones CRUD en `use-project-store.ts`. También existe `ChartWidget` (Chart.js) en `src/modules/charts/` pero no está integrado en ninguna página. Un enlace a dashboard en `DatasetView.tsx` apunta a una ruta que no existe.

Los datos de proyecto viven en Zustand (localStorage) y los datos de fila en IndexedDB. El motor de agregación (`dataset.service.ts` con Danfo.js) ya puede agrupar, filtrar y ordenar dataframes.

## Goals / Non-Goals

**Goals:**
- Página de dashboard funcional en `/projects/[id]/dashboard` con selector de dataset
- Catálogo de widgets: chart (line/bar/pie/area), metric (KPI numérico), table (resumen), filter (filtro rápido)
- Layout drag & drop con react-grid-layout
- Configuración persistente por proyecto en Zustand (localStorage)
- Exportar dashboard a PDF (con gráficos) y XLSX (datos)
- El dashboard se carga según el dataset seleccionado

**Non-Goals:**
- Dashboard multi-página o multi-tab (un solo dashboard por proyecto)
- Alarmas o notificaciones sobre datos
- Drill-down interactivo desde gráficos (clic en barra → detalle)
- Tiempo real / streaming — los datos se cargan al seleccionar dataset
- Reportes programados o por email

## Decisions

### 1. Layout: react-grid-layout vs CSS Grid manual
**Decisión:** `react-grid-layout` (react-resizable + react-draggable).
- Ya es compatible con React, soporta drag & drop y redimensionamiento libre
- Los widgets existentes (`Dashboard`, `WidgetPosition`) ya tienen x, y, width, height — modelo alineado
- Alternativa: CSS Grid manual — requeriría implementar drag & drop desde cero

### 2. Reportes PDF: jspdf + html2canvas vs puppeteer/server-side
**Decisión:** `jspdf` + `html2canvas` (client-side).
- No requiere servidor; todo el dashboard es client-side
- `html2canvas` captura los gráficos Chart.js renderizados en el DOM
- Datos tabulares se incluyen como tabla HTML en el PDF
- Alternativa: Puppeteer — sobreingeniería para este alcance

### 3. Reportes XLSX: `xlsx` (SheetJS)
**Decisión:** Usar la librería `xlsx` ya instalada en `package.json`.
- Lee datos directamente del store (filtrados según el widget)
- Sin dependencias nuevas

### 4. Estado del dashboard: Zustand vs React Context
**Decisión:** Extender `use-project-store.ts` existente (Zustand + localStorage).
- El modelo `Dashboard` ya existe en el entity — solo falta conectarlo a la UI
- Consistencia con el resto del proyecto (proyectos, schemas, filtros)
- Los widgets se persisten como parte del dashboard dentro del proyecto

### 5. Data source: dataset selector por proyecto
**Decisión:** El dashboard muestra un selector de datasets (los `Database` del proyecto). Al seleccionar uno, se cargan sus datos desde IndexedDB y se pasan a cada widget.
- Cada widget aplica sus propios filtros/agrupaciones sobre los datos crudos
- `dataset.service.ts` (Danfo.js) se reutiliza para las agregaciones

### 6. Catálogo de widgets: plugin registry vs switch
**Decisión:** Registry simple con switch. Cada tipo de widget es un componente separado (`ChartWidget`, `MetricWidget`, `TableWidget`, `FilterWidget`) registrado en un mapa `WidgetType -> Component`.
- Suficiente para 4 tipos — si crece, se migra a plugin registry

## Risks / Trade-offs

- **[Rendimiento]** Dashboard con muchos widgets y datasets grandes → Danfo.js se ejecuta en cliente. Mitigación: limitar filas procesadas a 10,000 por widget, mostrar indicador de carga.
- **[html2canvas]** Puede no capturar correctamente gráficos Chart.js en todos los casos (canvas cross-origin). Mitigación: probar con datasets reales; fallback a exportar solo tabla de datos.
- **[react-grid-layout]** Puede tener fricción con el layout responsivo de shadcn/ui. Mitigación: contener el grid en un div con dimensiones fijas (min-height).
- **[Persistencia]** localStorage tiene límite de ~5MB. La config del dashboard es JSON pequeño, no hay riesgo.
