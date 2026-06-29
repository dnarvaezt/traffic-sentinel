## Context

The ConfigEditor currently has a Transformers tab that holds transformations (trim, uppercase, lowercase, parse-number) keyed by column. This tab is disconnected from the column configuration — users must jump between tabs to understand what transformations apply to each column. Calculated columns were removed in the `simplify-config-editor` change but there's a genuine need: users want to derive new data from existing columns using JavaScript expressions.

The data model currently has `SchemaDefinition.transformers: Transformer[]` and `ColumnDefinition` has no transformer or expression fields.

## Goals / Non-Goals

**Goals:**
- Embed transformations into `ColumnDefinition` as `transformers?: ColumnTransformer[]`
- Add `calculate?: string` (JS expression) to `ColumnDefinition` for virtual/calculated columns
- Remove `transformers` from `SchemaDefinition`
- Remove the Transformers tab from ConfigEditor
- Add a column reference picker in the expression editor
- Update the import pipeline to evaluate per-column transformers and calculated expressions
- Keep `ColumnTransformer` and the expression string serializable (no function references)

**Non-Goals:**
- Changing the Groups tab
- Adding new transformer types beyond what currently exists
- Creating a full spreadsheet-like formula language (JavaScript expressions are sufficient)
- Runtime evaluation of expressions outside import (expressions run once during import)

## Decisions

1. **Serializable `ColumnTransformer` over function references** — The current `Transformer` interface stores a `transform: (value: any) => any` function which is not serializable. `ColumnTransformer` stores `{ type: string, params?: Record<string, unknown> }` — the function is created at import time by a factory, same approach as `ColumnValidation`.
2. **Expression as string over AST** — Store the calculated column expression as a raw JavaScript string (`calculate?: string`). At import time, wrap it in `new Function("row", ...)` to evaluate per row. This is simpler than building an AST and more flexible for users.
3. **Column reference syntax** — Use `row["Header Name"]` syntax for referencing columns in expressions. The column picker UI will insert this format when a column is clicked. This is intuitive and matches how row data is accessed.
4. **Inline transformers UI** — Add a "Transformaciones" section to the column edit dialog (same pattern as validations). Each has a type selector and optional params. The current types (trim, uppercase, lowercase, parse-number, custom/regex) are preserved.
5. **Remove global Transformers tab** — With per-column transformers and a separate Groups tab, the ConfigEditor goes from 3 tabs to 2 (Columnas, Agrupaciones).

## Risks / Trade-offs

- **Security**: `new Function()` evaluates arbitrary JS. Mitigation: expressions run only during import with user-provided data. No network access. Sandboxed in the import pipeline.
- **Error handling**: Invalid expressions or runtime errors in `calculate` could break imports. Mitigation: errors are caught and reported as validation errors, skipping that row's calculated value.
- **Migration**: Existing projects with `transformers` in their `SchemaDefinition` will lose transformer configs. The `migrateProject` function needs to merge global transformers into per-column definitions.
