## Context

The project views have accumulated technical debt across three prior changes (consolidate-pages-and-flows, improve-project-workflow). The current implementation has:

- `ProjectDetail.tsx` (432 lines) — monolithic, mixes datasets sub-view, config, filters, wizard
- `ConfigEditor.tsx` (1,438 lines) — 6 inline sub-editors in a single file, hard to navigate
- `DashboardPage.tsx` (361 lines) — toolbar + 4 empty states + grid + settings sheet, no separation of concerns
- `DatasetView` — custom data table implementation duplicating existing `modules/table/DataTable`
- Dead code: 15+ files totaling ~800 lines with no imports
- Deprecated entity fields (`schema`, `importConfig`, `metrics`, `groupBys`, `sorts`) and store actions still in the codebase

This design describes a complete rewrite of the five main view components, removal of dead code, and cleanup of the data layer.

## Goals / Non-Goals

**Goals:**
- Reduce `ProjectDetail.tsx` from 432 to under 250 lines by extracting sub-views
- Reduce `ConfigEditor.tsx` from 1,438 to under 500 lines by extracting sub-editors into separate files
- Eliminate all dead code files (15 files, ~800 lines)
- Remove all deprecated `Project` entity fields and store actions
- Unify duplicate column types (`ColumnDefinition` vs `DatabaseColumn`)
- Simplify navigation by removing redundant/misleading empty states
- Maintain full existing functionality (create project, upload CSV, define config, filter data, view dashboard)

**Non-Goals:**
- Adding new features — the dashboard, config, and dataset views keep their current capabilities
- Changing the data import engine (`data-import/domain/`, `data-import/application/`)
- Changing the routing structure — routes remain the same
- Changing the zustand persistence layer
- Rewriting widget types (chart, metric, table, filter widgets stay as-is)

## Decisions

### D1: Extract each sub-editor from ConfigEditor into its own file
- **Rationale**: 1,438-line file is unmaintainable. Each editor (Columns, VirtualColumns, Validators, Filters, Groups, Transformers) is a self-contained component with its own state and dialog.
- **New structure**: `src/modules/config-editor/` with `index.ts`, `columns-editor.tsx`, `virtual-columns-editor.tsx`, `validators-editor.tsx`, `filters-editor.tsx`, `groups-editor.tsx`, `transformers-editor.tsx`
- **Alternative considered**: Keeping inline — rejected because of file size and poor DX

### D2: Extract datasets sub-view from ProjectDetail into `DatasetsList` component
- **Rationale**: ProjectDetail has too many responsibilities. The datasets tab contains search, sort, upload, rename, edit, delete, favorite — all inline with the parent.
- **New structure**: `src/modules/project/components/DatasetsList.tsx` — receives `databases`, `onUpload`, `onDelete`, etc. as props
- **Alternative considered**: Keeping inline — rejected because it adds ~200 lines of JSX/state to ProjectDetail

### D3: Remove PDF/XLSX export from dashboard
- **Rationale**: `usePdfExport` and `useXlsxExport` require jsPDF, html2canvas, and SheetJS dependencies. Feature has low usage based on workflow analysis. Removing simplifies the toolbar and reduces bundle size.
- **Alternative considered**: Keeping as optional imports — but the button UI complexity remains

### D4: Reuse existing `modules/table/DataTable` in DatasetView
- **Rationale**: The dataset view currently has its own data table rendering. The existing `DataTable` component in `modules/table/` already supports pagination, column resize, sort — exactly the features needed.
- **Alternative considered**: Keeping custom rendering — but it duplicates functionality

### D5: Remove deprecated entity fields and store actions in a single migration
- **Rationale**: Deprecated fields (`schema`, `importConfig`) and actions (`updateSchema`, `addColumn`, etc.) confuse developers and create subtle bugs. Since all views are being rewritten simultaneously, this is the right moment to clean up.
- **Migration strategy**: `migrateProject()` will strip deprecated fields on load. Store actions that operate on old paths will be removed; any remaining callers will be updated to use `updateConfig` equivalents.

### D6: Keep existing route structure
- **Rationale**: Routes `/projects/[id]`, `/projects/[id]/dashboard`, `/projects/[id]/filters`, `/projects/[id]/datasets/[datasetId]` are well-established and linked from sidebar. Changing them would break bookmarks and require migration.
- **Remove**: `/projects/[id]/schema` — only exists as a redirect

### D7: Merge ColumnDefinition and DatabaseColumn
- **Rationale**: `DatabaseColumn` (`name`, `inferredType`) and `ColumnDefinition` (`id`, `header`, `type`, `format`, `alignment`, `tooltip`) overlap significantly. Use `ColumnDefinition` as the canonical type and adapt `Database.columns` to use it.
- **Alternative considered**: Keeping both with a mapping function — adds unnecessary conversion overhead

## Risks / Trade-offs

- **Data loss risk on migration**: Removing deprecated entity fields could cause data loss if any code path still reads them → Mitigation: `migrateProject()` copies any remaining data to `config` before stripping
- **Bundle size impact from ConfigEditor extraction**: Splitting into 7 files increases module count but enables tree-shaking per-tab → Net neutral
- **Removing PDF/XLSX may surprise users**: Some users may rely on export → Mitigation: feature was low-usage; can be re-added as separate change if needed
- **DatasetView relies on DataTable contract**: If DataTable API changes, DatasetView breaks → Mitigation: DataTable is stable and mature
- **24 tasks is a large change**: Risk of merge conflicts or incomplete refactors → Mitigation: tasks are ordered by dependency; each builds on the prior

## Migration Plan

1. Entity cleanup first: remove deprecated fields, update `migrateProject()`, remove dead store actions
2. Dead code removal: delete files, update imports
3. ConfigEditor extraction: extract sub-editors into separate files
4. ProjectDetail extraction: extract DatasetsList
5. ProjectsView rewrite
6. DatasetView refactor (reuse DataTable)
7. DashboardPage simplification
8. Final cleanup: verify tsc, lint, manual smoke test

Rollback: git revert of the merge commit. Data migration is one-way (`migrateProject` runs on load), but old store data still contains deprecated fields — if reverted, `migrateProject` will still map them correctly.

## Open Questions

- Should `FilterBuilder.tsx` be deleted or repurposed? Current analysis says it's unused → Proposed: delete
- Should `use-dashboard-store.ts` be merged into `use-project-store.ts`? Currently separate zustand stores → Proposed: keep separate, stores have distinct concerns
- Should the `use-dashboard-data` hook (already marked as unused) be removed? → Proposed: verify it was removed in consolidate-pages-and-flows; if still present, delete
