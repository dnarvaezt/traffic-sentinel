## Context

Raw dataset viewer exists at `/projects/[id]/datasets/[datasetId]`. The project has a `schema` with `ColumnDefinition[]` that defines how CSV data should be interpreted. The schema includes `sourceColumn` (mapping to CSV headers), `kind` (source/virtual), `transformers`, and `calculate` (formulas for virtual columns).

## Goals / Non-Goals

**Goals:**
- Page at `/projects/[id]/data` with dataset selector dropdown
- Load project schema and selected dataset
- Map raw CSV rows to schema columns (sourceColumn/header matching)
- Filter out virtual columns from raw mapping (they're computed)
- Apply transformers in order: trim, uppercase, lowercase, slug, parseInt, etc.
- Evaluate `calculate` expressions for virtual columns
- Display paginated table with schema-defined column headers and order
- Navigate from project detail page

**Non-Goals:**
- Do NOT persist processed data — compute on each view
- Do NOT add validators/validation display (future)
- Do NOT add export functionality

## Decisions

1. **Schema mapping** — For each schema column, find the value from raw row by matching `sourceColumn` or `header`. Virtual columns skip this step. Rationale: standard ETL pattern.

2. **Transformer pipeline** — Apply each transformer in array order using the same logic from the original `import-engine.ts`. Rationale: consistent behavior.

3. **Calculated columns** — Use `new Function("row", calculate)` to evaluate formulas. If it fails, show `null`. Rationale: same approach as existing import engine.

4. **Selector + table** — Dataset selector at top, paginated data table below. Rationale: clean separation, works with many datasets.

## Risks / Trade-offs

- **[Security] new Function()** — Formulas execute arbitrary JS. Mitigation: runs client-side only, same risk as existing import engine.
