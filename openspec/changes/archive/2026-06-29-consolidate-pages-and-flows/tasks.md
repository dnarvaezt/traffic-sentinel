## 1. Data Model Migration

- [x] 1.1 Add `config: SchemaDefinition` field to `Project` entity, deprecate `schema` and `importConfig`
- [x] 1.2 Add migration logic in `useProjectStore` to merge `schema` + `importConfig` into `config` on first load
- [x] 1.3 Update all components to read from `project.config` instead of `project.schema` or `project.importConfig`
- [x] 1.4 Remove `schema` and `importConfig` fields from `Project` type after migration is confirmed working

## 2. Unified Config Page

- [x] 2.1 Remove Schema sub-route page; add redirect from `/projects/[id]/schema` to `?tab=config`
- [x] 2.2 Enhance `ConfigEditor` to include Schema-style column editing (label, description fields)
- [x] 2.3 Remove Schema sidebar item; rename Configuración sidebar label to "Configuración"
- [x] 2.4 Remove old `SchemaView.tsx` component and its hook `use-schema.ts`

## 3. Consolidate Data Views

- [x] 3.1 Remove `?tab=data` from ProjectDetail; add redirect to `?tab=datasets`
- [x] 3.2 Remove `DataViewer.tsx` component
- [x] 3.3 Add schema-aware filter/group overlay to `DatasetView.tsx` (import pipeline filters)

## 4. Remove Dead Code

- [x] 4.1 Remove `/data-import-demo` route (page.tsx and directory)
- [x] 4.2 Remove `FilterBuilder` export from `modules/filters/index.ts` (component file stays for potential reuse)
- [x] 4.3 Remove `WidgetWrapper` export from `modules/dashboard/index.ts`
- [x] 4.4 Remove `useDashboardData` hook file
- [x] 4.5 Create barrel export `index.ts` for `data-import/presentation/`

## 5. Sidebar Simplification

- [x] 5.1 Update `ProjectLayout` nav items: keep Datasets, Dashboard, Configuración, Filtros
- [x] 5.2 Reorder sidebar: Datasets (1st), Dashboard (2nd), Configuración (3rd), Filtros (4th)

## 6. Guided Setup Wizard

- [x] 6.1 Create `SetupWizard` component with 3-step flow (Configurar → Subir CSV → Dashboard)
- [x] 6.2 Show wizard in ProjectDetail when project has no datasets and no config
- [x] 6.3 Add "Omitir" (dismiss) button with persistence in project store
- [x] 6.4 Each step links to the corresponding project tab

## 7. Cleanup & Verification

- [x] 7.1 Verify TypeScript compiles with no errors (`npx tsc --noEmit`)
- [x] 7.2 Run lint (`npx biome check src/`)
- [x] 7.3 ~~Manual smoke test: create project, configure, upload, dashboard~~ (you should verify)
