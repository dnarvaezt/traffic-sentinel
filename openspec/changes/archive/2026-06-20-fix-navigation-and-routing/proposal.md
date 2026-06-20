## Why

The recently added "Datos" (Data) and "Configuración" (Config) tabs in the project detail page are non-functional — clicking them does nothing because `setActiveTab` is never called for these items. All three main tabs (Datasets, Datos, Configuración) share the same URL `/projects/[id]`, preventing deep-linking and browser history navigation. Additionally, the sidebar navigation is inconsistent across pages, active tab highlighting breaks when navigating to sub-pages, and there are minor code quality issues (missing React keys, unused imports, dead code) introduced during the last implementation.

## What Changes

- **Fix sidebar tab navigation**: Ensure "Datos" and "Configuración" properly call `setActiveTab` when clicked
- **Add unique URLs for each tab**: Give "Datos" and "Configuración" their own routes (`/projects/[id]/data`, `/projects/[id]/config`) so they can be deep-linked, bookmarked, and navigated with browser history
- **Fix active tab highlighting**: Properly highlight the active nav item across all project sub-pages
- **Unify sidebar layout**: Extract a shared sidebar/layout component used by ProjectDetail, FiltersView, and SchemaView so navigation is consistent
- **Fix missing React `key` prop**: Add `key` to the fragment in DataTable.tsx inside `.map()`
- **Remove unused code**: Remove unused `Switch` import in ConfigEditor.tsx and dead `replacePipeline` export in pipeline.service.ts

## Capabilities

### New Capabilities
- `project-layout`: Shared sidebar layout component for all project sub-pages with consistent navigation and active tab highlighting

### Modified Capabilities
- *(none — no existing specs to modify)*

## Impact

- `src/modules/project/components/ProjectDetail.tsx` — Fix `setActiveTab` for data/config tabs, extract sidebar into layout
- `src/modules/project/components/` — New `ProjectLayout.tsx` shared layout component
- `src/modules/filters/components/FiltersView.tsx` — Adopt shared project layout
- `src/modules/schema/components/SchemaView.tsx` — Adopt shared project layout
- `src/data-import/presentation/components/DataTable.tsx` — Add `key` to fragment inside `.map()`
- `src/modules/project/components/ConfigEditor.tsx` — Remove unused `Switch` import
- `src/core/dataset/pipeline.service.ts` — Remove dead `replacePipeline` export
- `src/app/projects/[id]/` — New routes for `/data` and `/config` pages
