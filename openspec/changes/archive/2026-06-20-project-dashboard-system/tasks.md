## 1. Setup & Dependencies

- [x] 1.1 Install `react-grid-layout`, `@types/react-grid-layout`, `jspdf`, `html2canvas`
- [x] 1.2 Create `src/modules/dashboard/` module structure (components, hooks, index.ts)
- [x] 1.3 Add dashboard route `/projects/[id]/dashboard/page.tsx`
- [x] 1.4 Add "Dashboard" link to ProjectLayout sidebar

## 2. Data Source & Widget Infrastructure

- [x] 2.1 Create `use-dashboard-store.ts` — Zustand slice for dashboard state (selected dataset, widget configs, filters)
- [x] 2.2 Create `use-dashboard-data.ts` hook — loads dataset rows from IndexedDB, applies filters/aggregations
- [x] 2.3 Create dataset selector dropdown component for dashboard header
- [x] 2.4 Wire dashboard store to project store (persist widget config per project)

## 3. ChartWidget Enhancements

- [x] 3.1 Add "area" chart type support to `ChartWidget.tsx`
- [x] 3.2 Add explicit `labelColumn`, `valueColumn`, `groupByColumn` props
- [x] 3.3 Accept external data source (`data` prop) instead of inline only
- [x] 3.4 Implement grouped bar/line chart rendering when groupByColumn is set

## 4. Widget Components

- [x] 4.1 Create `MetricWidget.tsx` — single KPI value with label, format, color
- [x] 4.2 Create `DashboardTableWidget.tsx` — paginated data table with column selection
- [x] 4.3 Create `DashboardFilterWidget.tsx` — inline filter controls that update shared filter state
- [x] 4.4 Create `WidgetRegistry.tsx` — maps WidgetType to component + config schema
- [x] 4.5 Create `WidgetWrapper.tsx` — common widget chrome (header, delete button, resize handles)

## 5. Dashboard Layout

- [x] 5.1 Create `DashboardGrid.tsx` — react-grid-layout wrapper that renders widgets from store
- [x] 5.2 Create "Add Widget" panel/modal with type selection and initial config
- [x] 5.3 Implement widget add/remove/reorder in dashboard store
- [x] 5.4 Implement per-widget config panel (edit columns, chart type, aggregation)

## 6. Dashboard Page

- [x] 6.1 Create `DashboardPage.tsx` — main dashboard component (dataset selector + grid)
- [x] 6.2 Integrate data flow: select dataset → load from IndexedDB → aggregate per widget → render
- [x] 6.3 Implement shared filter state across widgets
- [x] 6.4 Add empty state when no dataset selected or no widgets configured

## 7. Report Generation

- [x] 7.1 Create `use-pdf-export.ts` hook — captures dashboard via html2canvas, generates PDF via jspdf
- [x] 7.2 Create `use-xlsx-export.ts` hook — exports widget data to XLSX via SheetJS
- [x] 7.3 Add "Exportar PDF" and "Exportar XLSX" buttons to dashboard toolbar
- [x] 7.4 Add loading state during export generation

## 8. Polish & Integration

- [x] 8.1 Wire DatasetView dashboard link to actual dashboard page
- [x] 8.4 Verify build (`npm run build`) and lint (`npm run lint`) pass ✓
