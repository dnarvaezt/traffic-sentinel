## Context

The ConfigEditor currently exposes 6 tabs (Columns, Virtual, Validators, Filters, Groups, Transformers). The Virtual Columns tab duplicates core functionality (users can already create as many columns as they want). Validations live as a separate global list disconnected from the columns they apply to. Filters are an import-time concern that clutters the schema editor. These tabs add cognitive overhead without proportional value.

The schema model (`SchemaDefinition`) currently carries `validators`, `filters`, and `calculations` as top-level arrays. `ColumnDefinition` has a `calculate` field for virtual columns but no validation field.

## Goals / Non-Goals

**Goals:**
- Reduce ConfigEditor tabs from 6 to 3 (Columns, Groups, Transformers)
- Move validation rules onto each `ColumnDefinition` as an optional `validations` array
- Remove the `calculations` and `filters` fields from `SchemaDefinition`
- Remove the `VirtualColumnsEditor`, `FiltersEditor`, and `ValidatorsEditor` components
- Remove the `calculate` field from `ColumnDefinition` (no longer needed since columns are first-class; calculated values can use transformers)
- Add a `ColumnValidation` interface representing a per-column validation rule

**Non-Goals:**
- Changing the Groups or Transformers editors
- Adding new validation rule types beyond what currently exists
- Changing the runtime validation engine behavior
- Changing the import pipeline beyond removing references to removed fields

## Decisions

1. **Per-column validation over global validators** — Instead of a flat `validators: Validator[]` list on `SchemaDefinition`, each column gets its own `validations: ColumnValidation[]`. This makes validation co-located with the column it applies to, which is more intuitive. The `Validator` interface with `validate` function stay for the runtime engine; `ColumnValidation` is a serializable config object that the engine converts to `Validator` at runtime.
2. **Remove `calculate` from ColumnDefinition** — Virtual columns were a concept from when users couldn't freely add columns. Now that column creation is unrestricted, calculated values can be achieved through the Transformers tab. Removing `calculate` simplifies the data model.
3. **Remove `calculations` from SchemaDefinition** — The `Calculator` interface (with a `calculate: (row) => any` function) is non-serializable and was only used by the VirtualColumnsEditor. Since that tab is removed, the field goes too.
4. **Remove `filters` from SchemaDefinition** — Import-time filters (`FilterDefinition`) don't belong in the schema config. They were never used by the import pipeline in practice. Removing them simplifies the model.
5. **Keep `ColumnValidation` serializable** — Unlike the runtime `Validator` which carries a `validate` function, `ColumnValidation` stores only data (type, message, params) so it can be serialized to JSON and persisted.

## Risks / Trade-offs

- **Migration**: Existing projects with `calculations`, `filters`, or `validators` in their `SchemaDefinition` will lose those configurations after migration. The `migrateProject` function in the store handles legacy data — it will need updating to read old fields and discard them.
- **Runtime validation engine**: The existing `Validator` interface with `validate` function is kept. The new `ColumnValidation` is a config object that the engine must convert to `Validator` at runtime. This conversion is straightforward but must be implemented.
- **Backward compat**: The `FiltersEditor`, `VirtualColumnsEditor`, and `ValidatorsEditor` components are being removed. Any code importing them will break — must verify no external references exist.
