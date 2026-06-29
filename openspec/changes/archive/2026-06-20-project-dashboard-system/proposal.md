## Why

Los proyectos de Traffic Sentinel actualmente solo permiten ver datos tabulares y configurar esquemas de importación. No existe una forma de visualizar métricas ni generar informes a partir de los datos cargados, lo que limita el análisis y la toma de decisiones. Cada proyecto necesita un dashboard configurable con gráficos, tablas resumen y reportes exportables.

## What Changes

- **Dashboard por proyecto**: Nueva página `/projects/[id]/dashboard` con un dashboard personalizable por proyecto.
- **Catálogo de widgets**: Cada dashboard está compuesto por widgets seleccionables: gráficos (línea, barra, pie, área), tabla de métricas, indicadores numéricos (KPIs), filtros rápidos.
- **Configuración del dashboard**: Interfaz drag & drop para posicionar widgets, seleccionar columnas fuente y tipo de gráfico, aplicar agrupaciones y filtros.
- **Vista previa de dataset**: Al seleccionar una base de datos del proyecto se carga el dashboard con los datos correspondientes.
- **Reportes exportables**: Generación de informes en PDF (con chart snapshots + tabla de datos) y XLSX (datos completos).
- **Persistencia**: La configuración de cada dashboard se guarda en localStorage (Zustand) junto con el proyecto. Los reportes generados son descargables, no persistidos.

## Capabilities

### New Capabilities
- `dashboard-widget-catalog`: Catálogo de tipos de widget (chart, metric, table, filter) con sus configuraciones respectivas.
- `dashboard-layout`: Sistema de layout drag & drop para posicionar y redimensionar widgets en el dashboard.
- `dashboard-data-source`: Conexión entre dashboard y dataset seleccionado, con filtros y agrupaciones.
- `report-generation`: Generación de reportes PDF (con gráficos embebidos) y XLSX (datos tabulares).
- `chart-types`: Extensión del `ChartWidget` para soportar tipo "area", selección de columnas label/value, y dataset como fuente.

### Modified Capabilities
- *(Ninguna — primera vez que se crean specs en el proyecto)*

## Impact

- **Nuevos archivos** en `src/modules/dashboard/` (componentes, hooks, store)
- **Nuevo route**: `src/app/projects/[id]/dashboard/page.tsx`
- **Modificaciones** a `ProjectLayout.tsx` (agregar enlace Dashboard al sidebar)
- **Modificaciones** a `ChartWidget.tsx` (soporte area chart, data-source via props)
- **Modificaciones** a `DatasetView.tsx` (conectar al dashboard)
- **Dependencias nuevas**: `jspdf` + `html2canvas` (para PDF), `xlsx` ya está en package.json
- **Sin cambios** en la API de datos existente — el dashboard consume los mismos stores/servicios
