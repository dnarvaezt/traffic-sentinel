## ADDED Requirements

### Requirement: Column has validations
Each `ColumnDefinition` SHALL support an optional `validations` array of `ColumnValidation` objects. Each validation SHALL specify a `type`, `message`, and optional `params`.

#### Scenario: Column with no validations
- **WHEN** a `ColumnDefinition` is created without a `validations` field
- **THEN** the column SHALL have no validation rules applied

#### Scenario: Column with required validation
- **WHEN** a `ColumnDefinition` has `validations: [{ type: "required", message: "Field is required" }]`
- **THEN** the import pipeline SHALL reject rows where this column's value is null, undefined, or empty string

#### Scenario: Column with min/max validation
- **WHEN** a `ColumnDefinition` has `validations: [{ type: "min", params: { value: 0 }, message: "Must be positive" }, { type: "max", params: { value: 100 }, message: "Must be at most 100" }]`
- **THEN** the import pipeline SHALL reject rows where this column's value is outside the specified range

#### Scenario: Column with regex validation
- **WHEN** a `ColumnDefinition` has `validations: [{ type: "regex", params: { pattern: "^[a-z]+$" }, message: "Only lowercase letters" }]`
- **THEN** the import pipeline SHALL reject rows where this column's value does not match the pattern

#### Scenario: Column with unique validation
- **WHEN** a `ColumnDefinition` has `validations: [{ type: "unique", message: "Value must be unique" }]`
- **THEN** the import pipeline SHALL reject rows where this column's value duplicates a previously seen value

### Requirement: Validation types
The system SHALL support these `ColumnValidation` types: `required`, `min`, `max`, `regex`, `unique`, `email`, `date-range`, `custom`.

#### Scenario: Custom validation with code
- **WHEN** a `ColumnDefinition` has `validations: [{ type: "custom", params: { code: "return value > 0;" }, message: "Custom check failed" }]`
- **THEN** the import pipeline SHALL evaluate the custom code against the cell value and reject if it returns false

### Requirement: ConfigEditor shows column validations
The ColumnsEditor SHALL display validation rules inline for each column in the table, and provide a dialog to add/edit/remove validations.

#### Scenario: Viewing column validations
- **WHEN** a user edits a column in the ColumnsEditor
- **THEN** the column editor dialog SHALL show a "Validaciones" section with a list of current validation rules and controls to add/edit/remove them

#### Scenario: Adding a validation
- **WHEN** a user clicks "Agregar Validación" in the column editor dialog
- **THEN** a new validation rule entry SHALL appear allowing type selection, message input, and optional parameter configuration

#### Scenario: Removing a validation
- **WHEN** a user clicks the remove button on a validation rule
- **THEN** that validation SHALL be removed from the column's `validations` array

### Requirement: Runtime conversion
The import pipeline SHALL convert `ColumnValidation` objects to runtime `Validator` instances before execution.

#### Scenario: Validation conversion
- **WHEN** a dataset import starts
- **THEN** each column's `validations` array SHALL be converted to `Validator` instances using a `validationFactory`
- **THEN** the factory SHALL produce the same behavior as the current `ValidatorsEditor` does for each validation type
