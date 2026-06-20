## Why

The current project views have grown organically through multiple iterations (consolidate-pages-and-flows, improve-project-workflow), resulting in fragmented component boundaries, redundant code paths, deprecated entity fields, and dead code that slows development and creates confusion. A ground-up refactor of the five core views — projects list, project detail, project configuration, dataset detail, and dataset dashboard — will eliminate technical debt, simplify the component tree, and produce a maintainable foundation.

## What Changes

- **BREAKING**: Rewrite `ProjectsView` (`src/modules/project/components/ProjectsView.tsx`) — simplify layout, remove expanding-card pattern, use consistent table-only design
- **BREAKING**: Rewrite `ProjectDetail` (`src/modules/project/components/ProjectDetail.tsx`) — extract inline datasets sub-view into its own component, remove wizard integration (already completed in improve-project-workflow), eliminate localStorage usage
- **BREAKING**: Rewrite `ConfigEditor` (`src/modules/project/components/ConfigEditor.tsx`) — flatten tabs, remove deprecated schema vs config split, simplify column editor
- **BREAKING**: Rewrite `DatasetView` (`src/modules/dataset/`) — modernize data table, streamline filter sidebar, remove unused filter builder components
- **BREAKING**: Rewrite `DashboardPage` (`src/modules/dashboard/components/DashboardPage.tsx`) — consolidate toolbar, remove PDF/XLSX export (low usage), simplify widget management
- Remove dead code: `src/app/projects/[id]/schema/page.tsx`, `src/data-import/presentation/` (entire module), `src/data-import/configs/` (entire directory), `src/modules/filters/components/FilterBuilder.tsx`, `src/shared/utils/cn.ts`
- Clean up deprecated `Project` entity fields: remove `schema`, `importConfig`, `metrics`, `groupBys`, `sorts`; keep only `config` and `databases`/`filters`/`dashboards`
- Clean up unused `useProjectStore` actions: remove `updateSchema`, `addColumn`, `updateColumn`, `deleteColumn`, `addMapping`, `deleteMapping`, `updateImportConfig`, `setActiveProject`, `setActiveDatabase`
- Consolidate duplicate types: unify `ColumnDefinition` (domain model) with `DatabaseColumn` (core entity)
- Collapse `src/modules/project/` and `src/modules/dashboard/` into fewer, flatter files

## Capabilities

### New Capabilities
- `simplified-project-list`: Clean project listing with minimal design, inline create dialog, focus on readability
- `unified-project-detail`: Single project detail view with well-separated sub-views (datasets, config, filters)
- `streamlined-config-editor`: Flattened configuration editor without deprecated schema split, cleaner column management
- `modernized-dataset-view`: Updated dataset viewer with paginated data table, filter sidebar, direct dashboard link
- `simplified-dashboard`: Leaner dashboard without PDF/XLSX export, consolidated widget management

### Modified Capabilities
- (none — all views are being rewritten, not modified incrementally)

## Impact

- Removes ~15 files totaling ~800 lines of dead code
- Rewrites ~2,500 lines across 5 main view components
- Alters `Project` entity type — breaking change for persisted projects (requires migration in `useProjectStore`)
- Removes 9 deprecated store actions — any external callers must be updated
- Eliminates export feature (PDF/XLSX) from dashboard — low-usage features removed for simplicity
