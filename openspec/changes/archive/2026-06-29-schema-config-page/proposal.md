## Why

Projects have a schema that defines columns, types, validators, transformers, and calculated formulas. There is no UI to configure it — schemas are created empty and cannot be modified. Users need a visual editor to define and manage their project schema.

## What Changes

- Create schema config page at `/projects/[id]/config`
- Add `schema` field to `ProjectStore.update` so the schema can be persisted
- Schema editor: list columns in order, add new columns, remove columns, reorder via drag or move up/down
- Column editor: set header, type, kind (source/virtual), sourceColumn, tooltip, format, alignment, visibility, validators, transformers, calculate formula
- Add navigation from project detail page to schema config

## Capabilities

### New Capabilities
- `schema-config-page`: Schema configuration page at `/projects/[id]/config`

### Modified Capabilities
- `project-lifecycle`: `ProjectStore.update` now also accepts `schema` updates

## Impact

- `src/core/project/repository.ts` — update method expanded to accept schema
- `src/app/projects/[id]/config/page.tsx` — new router
- `src/modules/project/pages/schema-config-page.tsx` — new page component
- `src/modules/project/hooks/use-schema-config.ts` — new hook
- `src/modules/project/pages/project-detail-page.tsx` — add link to config
