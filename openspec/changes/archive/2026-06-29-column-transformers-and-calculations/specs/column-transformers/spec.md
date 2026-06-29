## ADDED Requirements

### Requirement: Column has transformers
Each `ColumnDefinition` SHALL support an optional `transformers` array of `ColumnTransformer` objects.

#### Scenario: Column with no transformers
- **WHEN** a `ColumnDefinition` is created without a `transformers` field
- **THEN** the column SHALL have no transformations applied during import

#### Scenario: Column with trim transformer
- **WHEN** a `ColumnDefinition` has `transformers: [{ type: "trim" }]`
- **THEN** during import, each row's value for this column SHALL have leading/trailing whitespace removed

#### Scenario: Column with uppercase transformer
- **WHEN** a `ColumnDefinition` has `transformers: [{ type: "uppercase" }]`
- **THEN** during import, each row's value for this column SHALL be converted to uppercase

#### Scenario: Column with lowercase transformer
- **WHEN** a `ColumnDefinition` has `transformers: [{ type: "lowercase" }]`
- **THEN** during import, each row's value for this column SHALL be converted to lowercase

#### Scenario: Column with parse-number transformer
- **WHEN** a `ColumnDefinition` has `transformers: [{ type: "parse-number" }]`
- **THEN** during import, each row's value for this column SHALL be converted from string to number

#### Scenario: Column with custom regex transformer
- **WHEN** a `ColumnDefinition` has `transformers: [{ type: "custom", params: { pattern: "s/foo/bar/" } }]`
- **THEN** during import, the pattern SHALL be applied to each row's value for this column

### Requirement: ColumnTransformer is serializable
`ColumnTransformer` SHALL only contain serializable fields: `type: string` and optional `params?: Record<string, unknown>`.

#### Scenario: Serialization
- **WHEN** a `ColumnDefinition` with transformers is serialized to JSON
- **THEN** all transformer data SHALL be preserved with no function references

### Requirement: ConfigEditor shows column transformers
The column edit dialog SHALL display transformers inline and provide controls to add/edit/remove them.

#### Scenario: Viewing column transformers
- **WHEN** a user edits a column in the ColumnsEditor
- **THEN** the column editor dialog SHALL show a "Transformaciones" section with a list of current transformers and controls to add, edit, and remove them

#### Scenario: Adding a transformer
- **WHEN** a user clicks "Agregar Transformación" in the column editor dialog
- **THEN** a new transformer entry SHALL appear allowing type selection and optional parameter configuration

#### Scenario: Removing a transformer
- **WHEN** a user clicks the remove button on a transformer
- **THEN** that transformer SHALL be removed from the column's `transformers` array

### Requirement: Runtime conversion
The import pipeline SHALL convert `ColumnTransformer` objects to transform functions before execution.

#### Scenario: Transformer conversion
- **WHEN** a dataset import starts
- **THEN** each column's `transformers` array SHALL be converted to runtime functions using a factory
- **THEN** the factory SHALL produce the same behavior as the current `TransformersEditor` save logic

## REMOVED Requirements

### Requirement: Global transformers list
**Reason**: Transformers are now per-column, embedded in `ColumnDefinition`.
**Migration**: Global `SchemaDefinition.transformers` is removed. Existing transformers in legacy data will be migrated to per-column definitions by `migrateProject()`.
