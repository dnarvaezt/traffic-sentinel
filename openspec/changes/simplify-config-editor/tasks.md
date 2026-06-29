## 1. Data Model Changes

- [x] 1.1 Add `ColumnValidation` interface to `column.ts` with fields: `type`, `message`, `params?`
- [x] 1.2 Add `validations?: ColumnValidation[]` to `ColumnDefinition` interface
- [x] 1.3 Remove `calculate` field from `ColumnDefinition`
- [x] 1.4 Remove `filters` and `calculations` fields from `SchemaDefinition`
- [x] 1.5 Remove unused imports (`Calculator`, `FilterDefinition`) from `schema.ts`
- [x] 1.6 Update `createSchema()` helper to only handle remaining fields

## 2. Schema Domain Cleanup

- [x] 2.1 Remove `calculation.ts` domain model file (only contained `Calculator`)
- [x] 2.2 Remove `filter.ts` domain model file — `FilterOperator` is defined in `project.entity.ts` and used from there
- [x] 2.3 `FilterOperator` already available from `@/core/project` (via `project.entity.ts`), no extraction needed

## 3. UI Component Changes

- [x] 3.1 Update `columns-editor.tsx`: add validation editing to the column creation/edit dialog (type selector, message input, add/remove controls)
- [x] 3.2 Update `columns-editor.tsx`: display validation badges in the column table rows
- [x] 3.3 Remove `virtual-columns-editor.tsx` file
- [x] 3.4 Remove `filters-editor.tsx` file
- [x] 3.5 Remove `validators-editor.tsx` file
- [x] 3.6 Update `ConfigEditor.tsx`: remove Virtual, Validators, Filters tabs and their imports
- [x] 3.7 Update `ConfigEditor.tsx`: simplify the description text (remove references to validations/filtros)

## 4. Store & Migration Updates

- [x] 4.1 Update `use-project-store.ts` `migrateProject()`: keep reading old `schema?.columns` for backward compat but discard `calculations`, `filters` from legacy data
- [x] 4.2 Verify no store actions reference the removed schema fields
- [x] 4.3 No `Validator` type re-export from `@/core/project` barrel exists — nothing to remove

## 5. Import Pipeline Updates

- [x] 5.1 `pipeline.service.ts` had no direct references; `import-engine.ts` updated to remove `calculateColumnsService`, `filterDataService` and their pipeline steps
- [x] 5.2 Add `collectValidators()` in `import-engine.ts` — converts `ColumnValidation[]` to runtime `Validator[]` (supports: required, unique, min, max, regex, email, custom)
- [x] 5.3 Wire per-column validations into the import pipeline — `validateDataService.execute()` now receives validators derived from column definitions

## 6. Cleanup & Verification

- [x] 6.1 Run `npx tsc --noEmit` — passes with zero errors
- [x] 6.2 Remove stale `.next/` cache if needed
- [x] 6.3 Remove unused `VALIDATOR_TYPES`, `FILTER_TYPES` from `config-editor/constants.ts`
- [x] 6.4 `ColumnValidation` has only serializable fields (`type: string`, `message: string`, `params?: Record<string, unknown>`) — no function references
