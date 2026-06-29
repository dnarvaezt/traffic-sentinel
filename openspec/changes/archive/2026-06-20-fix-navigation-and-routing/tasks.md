## 1. Create Shared Project Layout

- [x] 1.1 Create `src/modules/project/components/ProjectLayout.tsx` — shared sidebar + content layout extracted from ProjectDetail
- [x] 1.2 Make nav items highlight based on URL pathname + search params instead of local state
- [x] 1.3 Wrap FiltersView content with ProjectLayout
- [x] 1.4 Wrap SchemaView content with ProjectLayout

## 2. Fix Tab Navigation with URL Search Params

- [x] 2.1 Convert `activeTab` state in `useProjectDetail` from local `useState` to URL search params via `useSearchParams`/`useRouter`
- [x] 2.2 Update sidebar nav item `onClick` in ProjectLayout to call `setActiveTab` for ALL tabs (datasets, data, config, filters, schema)
- [x] 2.3 Ensure the correct view is rendered based on `?tab=` param on page load

## 3. Fix Code Quality Issues

- [x] 3.1 Add missing `key` prop to React fragment in DataTable.tsx (use `<React.Fragment key={group.key}>`)
- [x] 3.2 Remove unused `Switch` import from ConfigEditor.tsx
- [x] 3.3 Remove dead `replacePipeline` export from pipeline.service.ts

## 4. Verify and Build

- [x] 4.1 Verify all project pages render correctly with shared layout
- [ ] 4.2 Verify browser back/forward navigation between tabs works
- [x] 4.3 Run `npm run build` to confirm no TypeScript or build errors
