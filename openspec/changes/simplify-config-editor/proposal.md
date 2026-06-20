## Why

The ConfigEditor currently has 6 tabs (Columns, Virtual, Validations, Filters, Groups, Transformers) but three of them (Virtual, Validations, Filters) add unnecessary complexity. Virtual columns duplicate the core column creation flow, Filters are only relevant at import-time and clutter the schema editor, and Validations should be per-column rather than a separate global section. This creates a confusing UX that makes it harder to configure projects correctly.

## What Changes

- **Remove the "Virtuales" tab** — column creation already supports creating as many columns as needed; virtual/calculated columns become an optional property of a regular column
- **Remove the "Filtros" tab** — import-time filters don't belong in the schema config; they add noise
- **Move validation into the column editor** — each column gets an inline `validations` array (type, message, rule) so users configure validation where it logically belongs
- **Simplify the ConfigEditor tabs** from 6 to 3 (Columns, Groups, Transformers)
- Remove the `calculations` (Calculator) and `filters` (FilterDefinition) fields from `SchemaDefinition`
- Remove the `VirtualColumnsEditor` and `FiltersEditor` components
- Clean up unused domain model types (`Calculator`, `FilterDefinition` from the import domain) if they become dead code

## Capabilities

### New Capabilities
- `column-validations`: Per-column validation rules stored directly on `ColumnDefinition` instead of a global `validators` array

### Modified Capabilities
- (none — no existing specs to modify)

## Impact

- **SchemaDefinition** changes: remove `filters`, `calculations` fields
- **ColumnDefinition** changes: add optional `validations: ColumnValidation[]` field
- **ConfigEditor UI**: reduced from 6 tabs to 3 tabs
- **Components removed**: `VirtualColumnsEditor`, `FiltersEditor`, `ValidatorsEditor`
- **Components simplified**: `ColumnsEditor` gains inline validation editing
- **Store**: any references to `calculations` or `filters` in `SchemaDefinition` must be cleaned up
- **File import pipeline**: uses `SchemaDefinition` — needs to be resilient to missing `filters`/`calculations` fields
