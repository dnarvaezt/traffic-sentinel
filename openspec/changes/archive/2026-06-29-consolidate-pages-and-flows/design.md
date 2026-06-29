## Context

The app currently has 6 sidebar navigation items: Datasets, Datos, Dashboard, Configuración, Filtros, Schema. Schema and Configuración both manage column definitions but use different data models (`project.schema.columns` vs `project.importConfig.columns`). The Data tab (`?tab=data`) and dataset detail page (`/datasets/[datasetId]`) both display tabular data with different UIs. There is also a developer demo page at `/data-import-demo` with no user-facing link. Three components/hooks are exported but never used.

This design consolidates these into a cleaner architecture: unified config, single data viewer, removed dead code, simplified navigation.

## Goals / Non-Goals

**Goals:**
- Merge Schema + Configuración into a single unified configuration page
- Consolidate DataViewer + DatasetView into one data exploration experience
- Remove `/data-import-demo` dev-only route
- Remove dead code (FilterBuilder, WidgetWrapper barrel export, useDashboardData)
- Reduce sidebar from 6 to 4 items (Datasets, Dashboard, Configuración, Filtros)
- Add barrel export for `data-import/presentation`
- Add guided setup wizard for new projects (config → upload → dashboard)

**Non-Goals:**
- Changing the Zustand store API signatures (only merging/adding fields)
- Changing the IndexedDB storage layer
- Rewriting chart or grid components
- Adding user authentication
- Internationalization

## Decisions

1. **Unify `project.schema` and `project.importConfig` under a single `project.config` model**: The `SchemaDefinition` from `@/data-import/domain/models/schema` is richer (includes validators, filters, groups, transformers, calculations). Use it as the single source of truth. The `project.schema` field becomes read-only/deprecated, backed by `project.config.columns`. Migration: existing localStorage data gets a one-time migration function.
   - Alternative considered: Keep both models and sync them. Too complex and error-prone.
   - Alternative considered: Use `project.schema` only, enhance it. Would lose import pipeline features.

2. **Consolidate under one route**: The unified config page lives at `/projects/[id]?tab=config` (the existing Config tab). The Schema sub-route `/projects/[id]/schema` redirects to `?tab=config`. The Schema sidebar item is removed.
   - Alternative considered: Make config a sub-route page. Would need to move all dialog-based editing there; not worth the route overhead.

3. **Remove `?tab=data` and redirect to dataset detail**: The Data tab in ProjectDetail is removed. `?tab=data` redirects to the dataset list (which is the existing `?tab=datasets` view). The rich data exploration is done via the dedicated dataset detail pages.
   - Alternative considered: Keep `?tab=data` but enhance it. Would duplicate effort with DatasetView.

4. **Remove `/data-import-demo` route**: Delete the page and its route directory. The import engine components remain importable via `@/data-import/`. No functional loss since the functionality is available through the project's config and data views.
   - Alternative considered: Gate behind feature flag. Unnecessary complexity for a demo page.

5. **Sidebar order**: Datasets (primary), Dashboard (visualization), Configuración (setup), Filtros (filtering). This reflects a logical left-to-right workflow: upload data → visualize → configure → filter.

## Risks / Trade-offs

- **Risk: Existing persisted projects have old data model** → Mitigation: Add a one-time migration in `useProjectStore` that reads `project.schema` + `project.importConfig` and merges into `project.config` on first load.
- **Risk: Removing `?tab=data` breaks existing bookmarks** → Mitigation: Add a redirect in ProjectDetail that catches `tab=data` and redirects to `tab=datasets`.
- **Risk: Users accustomed to the Schema page** → Mitigation: The Schema sub-route gets a redirect middleware or a page component that immediately redirects to `?tab=config`.
- **Risk: Unifying column models breaks existing import configs** → Mitigation: The migration merges `importConfig.columns` into `config.columns` with a flag to preserve the original import-specific settings.
