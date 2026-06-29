## 1. Data Model Changes

- [x] 1.1 Add `ColumnTransformer` interface to `column.ts` with fields: `type`, `params?`
- [x] 1.2 Add `transformers?: ColumnTransformer[]` to `ColumnDefinition`
- [x] 1.3 Add `calculate?: string` to `ColumnDefinition`
- [x] 1.4 Remove `transformers` field from `SchemaDefinition`
- [x] 1.5 Remove `Transformer` import from `schema.ts`

## 2. Domain Model Cleanup

- [x] 2.1 Remove `transformation.ts` domain model file (replaced by `ColumnTransformer`)
- [x] 2.2 Remove `transform-data.service.ts` (logic moves into import-engine with column-level factory)

## 3. Import Pipeline Updates

- [x] 3.1 Add `collectTransformers()` factory in `import-engine.ts` that converts per-column `ColumnTransformer[]` to transform functions (trim, uppercase, lowercase, parse-number, custom regex)
- [x] 3.2 Add `evaluateCalculatedColumns()` in `import-engine.ts` that evaluates `calculate` expressions per row using `new Function("row", expr)`
- [x] 3.3 Wire both into the import pipeline: apply column transformers first, then evaluate calculated columns

## 4. UI Component Changes

- [x] 4.1 Update `columns-editor.tsx`: add transformer editing to the column dialog (type selector, add/remove controls, pattern input for custom)
- [x] 4.2 Update `columns-editor.tsx`: add calculated column expression editor with column reference picker
- [x] 4.3 Update `columns-editor.tsx`: display transformer badges in the column table rows
- [x] 4.4 Update `columns-editor.tsx`: display calculated column indicator in the table
- [x] 4.5 Remove `transformers-editor.tsx` file
- [x] 4.6 Update `ConfigEditor.tsx`: remove Transformers tab and its import

## 5. Store & Migration Updates

- [x] 5.1 Update `use-project-store.ts` `migrateProject()`: migrate global `transformers` into per-column definitions
- [x] 5.2 Update `createProject()`: remove `transformers` from the initial config
- [x] 5.3 Verify no store actions reference the removed schema fields

## 6. Cleanup & Verification

- [x] 6.1 Run `npx tsc --noEmit` and fix any type errors
- [x] 6.2 Remove stale `.next/` cache if needed
- [x] 6.3 Remove unused constants from `config-editor/constants.ts` if `TRANSFORMER_TYPES` is no longer needed externally
- [x] 6.4 Verify `ColumnTransformer` data model is serializable (no function references)
