## ADDED Requirements

### Requirement: Schema entity
The system SHALL define a `Schema` entity that belongs to a project. A project SHALL have exactly one schema. The schema SHALL contain an ordered list of column definitions.

#### Scenario: Schema creation
- **WHEN** a project is created
- **THEN** the project SHALL have a schema with an empty columns array

### Requirement: ColumnDefinition
The system SHALL define a `ColumnDefinition` type with the following fields: `id` (unique string), `header` (display name), `type` (ColumnType), `kind` (optional: "source" | "virtual"), `sourceColumn` (optional string for CSV header mapping), `format` (optional string), `alignment` (optional "left" | "center" | "right"), `width` (optional number or string), `visibility` (optional boolean), `sortable` (optional boolean), `filterable` (optional boolean), `validations` (optional ColumnValidation[]), `transformers` (optional ColumnTransformer[]), `calculate` (optional formula string).

#### Scenario: Basic column
- **WHEN** a column is added to a schema with `id: "col_1"`, `header: "Name"`, `type: "string"`
- **THEN** the column is stored with those values and defaults for optional fields

### Requirement: Column types
The system SHALL support the following `ColumnType` values: `"string"`, `"number"`, `"boolean"`, `"date"`, `"currency"`, `"percentage"`, `"email"`, `"url"`, `"custom"`.

#### Scenario: Available types
- **WHEN** adding a new column
- **THEN** the user can select any of the nine supported ColumnType values

### Requirement: Column ordering
The system SHALL preserve the order of columns in the schema. Columns SHALL be reorderable by changing their position in the array.

#### Scenario: Reorder columns
- **WHEN** a user moves column A from index 0 to index 2
- **THEN** the schema's columns array reflects the new order

### Requirement: Column validators
The system SHALL support per-column validators. Each validator has a `type` (string), `message` (string), and optional `params`. Supported validators: `"required"`, `"unique"`, `"min"`, `"max"`, `"regex"`, `"email"`, `"custom"` (with function code).

#### Scenario: Required validator
- **WHEN** a column has a `required` validator
- **THEN** rows with empty/null values in that column produce a validation error

#### Scenario: Custom validator
- **WHEN** a column has a `custom` validator with `params.code: "return value > 0"`
- **THEN** values <= 0 produce a validation error

### Requirement: Column transformers
The system SHALL support per-column transformers. Each transformer has a `type` (string) and optional `params`. Supported transformers: `"trim"`, `"uppercase"`, `"lowercase"`, `"slug"`, `"parseInt"`, `"parseFloat"`, `"dateParse"`, `"stripHtml"`, `"custom"` (with function code). Transformers SHALL be applied in array order.

#### Scenario: Trim and uppercase
- **WHEN** a column has transformers `["trim", "uppercase"]` and value `" hello "`
- **THEN** the result is `"HELLO"`

### Requirement: Calculated columns
The system SHALL support virtual columns whose value is computed from a formula string referencing other columns. The `calculate` field SHALL contain a JavaScript expression using the `row` variable. If calculation fails, the cell SHALL be `null` and an error SHALL be recorded.

#### Scenario: Simple formula
- **WHEN** a virtual column has `calculate: "row.price * row.quantity"`
- **THEN** each row's value is computed as the product of `price` and `quantity` columns

#### Scenario: Formula error handling
- **WHEN** a formula throws an error (e.g., referencing a non-existent column)
- **THEN** the cell value is `null` and a calculation error is recorded with `code: "calc_error"`
