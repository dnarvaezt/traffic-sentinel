## Why

The raw dataset viewer shows CSV data as-is, but users need to see data transformed through the project's schema — with column mappings, source/virtual columns, transformers, and calculated formulas applied. This is the core value of the schema system.

## What Changes

- Create schema-powered data viewer page at `/projects/[id]/data`
- Dataset selector dropdown to choose which dataset to view
- Load the project's schema and selected dataset
- Map raw CSV columns to schema columns via `sourceColumn` / `header`
- Apply column transformers (trim, uppercase, etc.)
- Evaluate calculated columns (virtual columns with formulas)
- Display processed data in a paginated table
- Show columns in schema order with schema-defined headers

## Capabilities

### New Capabilities
- `schema-data-viewer`: View dataset data processed through the project schema, with dataset selector

## Impact

- `src/app/projects/[id]/data/page.tsx` — new router
- `src/modules/project/pages/schema-data-viewer-page.tsx` — new page
- `src/modules/project/hooks/use-schema-data-viewer.ts` — new hook with mapping/transform logic
- `src/modules/project/pages/project-detail-page.tsx` — add link
