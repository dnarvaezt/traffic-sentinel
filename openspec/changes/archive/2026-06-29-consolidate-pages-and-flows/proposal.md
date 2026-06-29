## Why

The app has multiple redundant page sections: Schema and Configuración both define columns with different models, Data tab and DatasetDetail page both view data with different UIs, and there is a developer-only demo page accessible at `/data-import-demo`. This confuses users, splits feature effort, and makes the sidebar navigation cluttered (6 items, 2 of which overlap).

## What Changes

- **Merge Schema + Configuración** into a single unified configuration page with sub-tabs (Columnas, Validaciones, Filtros de importación, Agrupaciones, Transformaciones, Virtuales). Unify the two column definition models into one. **BREAKING**: `project.schema` and `project.importConfig` become a single `project.config` model.
- **Consolidate Data tab + DatasetView** into one data exploration page. The `?tab=data` in ProjectDetail redirects to `/projects/[id]/datasets/` (the dataset list) with an enhanced `DatasetView` that includes schema-aware filters, grouping, and export. **BREAKING**: `?tab=data` route removed.
- **Remove `/data-import-demo`** dev-only route. Its functionality was always intended to be integrated; the import engine components remain available via `@/data-import/`.
- **Remove dead code**: `FilterBuilder` component, `WidgetWrapper` export, `useDashboardData` hook (all unused).
- **Simplify sidebar navigation** from 6 items to 4: Datasets, Dashboard, Configuración, Filtros.
- **Create barrel export** for `data-import/presentation` to clean up import paths.
- **Improve flow**: New projects show a guided setup wizard (config → upload → dashboard) instead of an empty dataset list.

## Capabilities

### New Capabilities
- `unified-config`: Single configuration page merging Schema + Config, with unified column model
- `guided-setup-wizard`: New project onboarding flow guiding users through config → upload → dashboard

### Modified Capabilities
*(No existing capabilities in `openspec/specs/` are being modified.)*

## Impact

- **Routes**: `/data-import-demo` removed. `?tab=data` redirects to dataset list. `?tab=schema` and `?tab=config` become tabs within the new unified config page.
- **Data model**: `project.schema` and `project.importConfig` merged into `project.config`. Migration needed for existing persisted projects.
- **Components**: SchemaView.tsx and ConfigEditor.tsx merged into one unified component. DataViewer.tsx removed or adapted. DatasetView.tsx enhanced.
- **Sidebar**: 6 nav items → 4. Nav items reordered: Datasets, Dashboard, Configuración, Filtros.
- **Dead code**: 3 component/hook files removed, 2 barrel exports removed.
