## Why

Transformations currently live as a separate global tab with its own dialog, disconnected from the columns they transform. Calculated (virtual) columns were removed in a previous pass but users genuinely need them to derive new data from existing columns. Both features should be intuitive: transformations embedded in each column's config, and calculated columns built with a formula editor that lets you reference other columns like Excel.

## What Changes

- **Move transformers into column configuration** — each `ColumnDefinition` gets a `transformers?: ColumnTransformer[]` array (type + optional params), removing the need for the global Transformers tab
- **Add calculated (virtual) columns** — `ColumnDefinition` gains a `calculate?: string` field storing a JavaScript expression. During import, the engine evaluates expressions over each row to produce derived values. These columns are not loaded from CSV but computed at import time.
- **Add column reference picker** — when editing a calculated column expression, show an inline panel listing available columns. Clicking a column inserts its reference (e.g., `row["columnHeader"]`) into the expression
- **BREAKING**: Remove the global `transformers` field from `SchemaDefinition` and the `TransformersEditor` tab
- **BREAKING**: Remove the `Transformer` interface (replaced by `ColumnTransformer` embedded in `ColumnDefinition`)

## Capabilities

### New Capabilities
- `calculated-columns`: Virtual columns computed from JavaScript expressions referencing other columns
- `column-transformers`: Per-column transformations (trim, uppercase, lowercase, parse-number, custom) embedded in column config

### Modified Capabilities
- (none — no existing specs to modify)

## Impact

- **ColumnDefinition** changes: add `transformers?: ColumnTransformer[]` and `calculate?: string`
- **SchemaDefinition** changes: remove `transformers` field
- **Transformer interface** replaced by `ColumnTransformer` (serializable — no function reference)
- **ConfigEditor UI**: Transformers tab removed; column edit dialog gains transformer config section and expression editor for calculated columns
- **TransformersEditor component** deleted
- **Import pipeline**: `transform-data.service.ts` updated to read per-column transformers and evaluate calculated expressions
- **Column reference picker**: new UI component for selecting columns in expression editor
