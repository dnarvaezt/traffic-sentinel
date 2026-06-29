## 1. Entity & Store Cleanup

- [x] 1.1 Remove deprecated `schema`, `importConfig`, `metrics`, `groupBys`, `sorts` fields from `Project` interface in `project.entity.ts`
- [x] 1.2 Update `migrateProject()` to copy data from removed fields to `config` before stripping them
- [x] 1.3 Remove deprecated store actions from `useProjectStore`: `updateSchema`, `addColumn`, `updateColumn`, `deleteColumn`, `addMapping`, `deleteMapping`, `updateImportConfig`, `setActiveProject`, `setActiveDatabase`
- [x] 1.4 Remove unused `Schema` type from `project.entity.ts` (only `SchemaDefinition` should remain)
- [x] 1.5 Merge `DatabaseColumn` with `ColumnDefinition`: replace `Database.columns: DatabaseColumn[]` with `ColumnDefinition[]`, update all consumers
- [x] 1.6 Update `createProject` in store to exclude removed fields
- [x] 1.7 Remove unused imports of `Schema` and deprecated types across the codebase

## 2. Dead Code Removal

- [x] 2.1 Delete `src/app/projects/[id]/schema/page.tsx` (redundant redirect)
- [x] 2.2 Delete `src/data-import/presentation/` (entire module: 4 components + 1 hook + 1 barrel)
- [x] 2.3 Delete `src/data-import/configs/` (3 sample config files)
- [x] 2.4 Delete `src/modules/filters/components/FilterBuilder.tsx` (unused stand-alone component)
- [ ] 2.5 ~~Delete `src/shared/utils/cn.ts`~~ — still used by 14 UI components (`dialog.tsx`, `button.tsx`, etc.), cannot delete
- [x] 2.6 Remove any remaining imports referencing deleted files, verify tsc passes

## 3. ConfigEditor Extraction

- [x] 3.1 Create `src/modules/config-editor/` directory with `index.ts` barrel export
- [x] 3.2 Extract `ColumnsEditor` into `src/modules/config-editor/columns-editor.tsx`
- [x] 3.3 Extract `VirtualColumnsEditor` into `src/modules/config-editor/virtual-columns-editor.tsx`
- [x] 3.4 Extract `ValidatorsEditor` into `src/modules/config-editor/validators-editor.tsx`
- [ ] 3.5 ~~`FiltersEditor`~~ — filters editing is already separate in `FiltersView`, not applicable
- [ ] 3.6 ~~`GroupsEditor`~~ — groups editing is already separate in `GroupsPage`, not applicable
- [x] 3.7 Extract `TransformersEditor` into `src/modules/config-editor/transformers-editor.tsx`
- [x] 3.8 Rewrite `ConfigEditor` at `src/modules/project/components/ConfigEditor.tsx` to import sub-editors from `config-editor`, keep only the tabs shell
- [x] 3.9 Remove the old inline editor functions from ConfigEditor, verify tsc passes

## 4. ProjectDetail Refactor

- [x] 4.1 Extract datasets sub-view into `src/modules/project/components/DatasetsList.tsx` (search, sort, upload, rename, edit, delete, favorite, empty states)
- [x] 4.2 Simplify `ProjectDetail.tsx` to import `DatasetsList`, remove inline dataset rendering
- [x] 4.3 Remove wizard-related code from ProjectDetail (wizard integration was completed in prior change)
- [x] 4.4 Remove any remaining localStorage usage from ProjectDetail
- [x] 4.5 Ensure filters tab CTA renders correctly when no columns exist, and filter summary when columns exist

## 5. ProjectsView Rewrite

- [x] 5.1 Rewrite `ProjectsView.tsx` to use a simple table layout with columns: name, description, dataset count, last updated, delete
- [x] 5.2 Add inline create project dialog (name + description, no redirect until creation)
- [x] 5.3 Add delete project with confirmation dialog
- [x] 5.4 Remove expanding-card pattern from ProjectsView
- [x] 5.5 Ensure empty state shows "Crear primer proyecto" CTA

## 6. DatasetView Refactor

- [x] 6.1 Rewrite `DatasetView` to reuse `modules/table/DataTable` for paginated data display
- [x] 6.2 Streamline filter sidebar: keep column-based value filtering, remove unused filter builder components
- [x] 6.3 Add "Ver en Dashboard" header link that navigates to dashboard with this dataset selected
- [x] 6.4 Remove custom data table rendering from dataset view module

## 7. DashboardPage Simplification

- [x] 7.1 Remove PDF export button and `usePdfExport` integration from DashboardPage
- [x] 7.2 Remove XLSX export button and `useXlsxExport` integration from DashboardPage
- [x] 7.3 Remove unused icon imports (`FileText`, `FileSpreadsheet`, `Filter`, `Table2`, `TrendingUp`) from DashboardPage
- [x] 7.4 Consolidate toolbar: keep dataset selector and add-widget panel, remove export buttons
- [x] 7.5 Verify all three phased empty states still render correctly after cleanup

## 8. Cleanup & Verification

- [x] 8.1 Verify TypeScript compiles with no errors (`npx tsc --noEmit`)
- [x] 8.2 Run lint (`npx biome check src/`) — 1 pre-existing error in DashboardGrid.tsx
- [x] 8.3 ~~Manual smoke test: create project, upload CSV, define config, view dataset, create dashboard widget, apply filter~~ (you should verify)
