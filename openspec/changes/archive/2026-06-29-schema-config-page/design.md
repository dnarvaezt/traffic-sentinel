## Context

Project schema stores columns as `ColumnDefinition[]` with types, validators, transformers, and calculate formulas. The `ProjectStore.update` only accepts name/description. No UI exists to edit columns.

## Goals / Non-Goals

**Goals:**
- Schema config page at `/projects/[id]/config`
- List columns with their header, type, and controls
- Add new columns (header + type required)
- Remove columns
- Reorder columns (move up/down buttons)
- Inline editing of column header, type, kind, sourceColumn
- Expand `ProjectStore.update` to accept `schema` changes
- Navigate from project detail page

**Non-Goals:**
- Do NOT implement drag-and-drop reordering (move up/down is simpler)
- Do NOT implement validators/transformers/calculate editors in this first pass — just the basic column configuration
- Do NOT add CSV preview or dataset integration

## Decisions

1. **Move up/down reordering** — Simple buttons to shift column position. Rationale: works on all devices, no drag library dependency.

2. **Inline editing** — Column header and type are editable directly in the list via dropdowns and inputs. Rationale: fast, intuitive.

3. **Expand update signature** — `ProjectStore.update` accepts `Partial<Pick<Project, "name" | "description" | "schema">>`. Rationale: minimal change to existing API.

4. **useSchemaConfig hook** — Manages columns state locally, persists on save. Rationale: batch all changes before saving rather than auto-saving per edit.

## Risks / Trade-offs

- None — straightforward CRUD UI on existing data model.
