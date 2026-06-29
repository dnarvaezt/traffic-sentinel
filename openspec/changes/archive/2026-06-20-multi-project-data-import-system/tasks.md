## 1. Extend Project Model for SchemaDefinition

- [x] 1.1 Add `importConfig: SchemaDefinition` field to the `Project` interface in `src/core/project/project.entity.ts`
- [x] 1.2 Add store actions in `use-project-store.ts` for managing `importConfig` (updateImportConfig)
- [x] 1.3 Add store actions for managing datasets (imported data references) on the project

## 2. Create Pipeline Persistence Layer

- [x] 2.1 Create `src/core/dataset/pipeline.repository.ts` with IndexedDB CRUD for pipeline results (raw, transformed, calculated data + errors) keyed by projectId+databaseId
- [x] 2.2 Create `src/core/dataset/pipeline.service.ts` that wraps ImportEngine.run() and persists all stages to the repository
- [x] 2.3 Add a method to load stored pipeline results by project+database ID

## 3. Build Schema Configuration Editor (Config tab)

- [x] 3.1 Create `src/modules/project/components/ConfigEditor.tsx` — main configuration page component
- [x] 3.2 Create column editor sub-component (add/edit/delete/reorder columns, set types, format, alignment)
- [x] 3.3 Create virtual column editor sub-component (name, expression input, with parsing from string to `calculate` function)
- [x] 3.4 Create validator editor sub-component (add/configure validators: required, range, regex, unique, etc.)
- [x] 3.5 Create filter definition editor sub-component (configure static filters: column, operator, default value)
- [x] 3.6 Create grouping editor sub-component (add/order grouping levels by column)
- [x] 3.7 Create transformer editor sub-component (add transformers: trim, uppercase, lowercase, custom)
- [x] 3.8 Integrate all editors into a tabbed or sectioned layout inside ConfigEditor
- [x] 3.9 Wire ConfigEditor to the project store's importConfig actions

## 4. Build Project-Scoped Data Import

- [x] 4.1 Create `src/modules/project/hooks/use-project-import.ts` — hook that wraps `pipeline.service.ts` and manages upload state per project
- [x] 4.2 Replace the existing `handleFileSelect` in `useProjectDetail` with the new pipeline-backed import flow
- [x] 4.3 Store dataset metadata (name, row count, column count, timestamp) in the project's databases array after successful import
- [x] 4.4 Show upload progress/status during pipeline execution

## 5. Build Interactive Data Viewer (Data tab)

- [x] 5.1 Create `src/modules/project/components/DataViewer.tsx` — main data viewing page
- [x] 5.2 Add dataset selector (dropdown or sidebar) to switch between imported datasets within the project
- [x] 5.3 Integrate existing `FilterPanel` component, feeding it the project's importConfig filters and wiring filter changes to client-side re-filtering
- [x] 5.4 Integrate existing `GroupPanel` component, showing configured groupings with toggle
- [x] 5.5 Integrate existing `DataTable` component, passing stored calculated data, schema, and validation errors
- [x] 5.6 Add upload/replace button within the DataViewer for importing new CSV data
- [x] 5.7 Add export button using the existing export service
- [x] 5.8 Handle loading state, empty state, and error state

## 6. Update Navigation and Routing

- [x] 6.1 Add "Configuración" and "Datos" navigation items to the sidebar in `ProjectDetail.tsx`
- [x] 6.2 Conditionally render ConfigEditor and DataViewer based on activeTab state
- [x] 6.3 Ensure the existing Schema and Filters tabs remain functional alongside the new tabs
- [x] 6.4 Verify `/data-import-demo` page still works unchanged

## 7. Cleanup and Verification

- [x] 7.1 Verify build succeeds with `npm run build`
- [x] 7.2 Verify TypeScript type checking passes
- [ ] 7.3 Verify data import → persistence → reload → display cycle works end-to-end
- [ ] 7.4 Verify multiple projects each maintain independent config and data
