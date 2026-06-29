## ADDED Requirements

### Requirement: User can define columns for a project
The system SHALL allow users to add, edit, reorder, and delete column definitions within a project's import configuration.

#### Scenario: Add a column
- **WHEN** user clicks "Add Column" in the configuration editor
- **THEN** a new column definition appears with editable fields: name, type (string/number/boolean/date/currency/percentage/email/url/custom), format, alignment, and visibility

#### Scenario: Edit a column type
- **WHEN** user changes a column's type from "string" to "number"
- **THEN** the column definition updates and the change is persisted to the project store

#### Scenario: Delete a column
- **WHEN** user clicks delete on a column definition
- **THEN** the column is removed from the project's schema and a confirmation dialog is shown first

### Requirement: User can define virtual (calculated) columns
The system SHALL allow users to add virtual columns whose values are computed by a JavaScript expression referencing other columns.

#### Scenario: Add a virtual column with a formula
- **WHEN** user creates a virtual column named "Total" with expression `row.price * row.quantity`
- **THEN** the virtual column appears in the column list with a calculated indicator and the formula is stored in the project config

#### Scenario: Virtual column references non-existent column
- **WHEN** the expression references a column that was deleted
- **THEN** the system shows a validation warning on the virtual column but does not block saving

### Requirement: User can configure validators for columns
The system SHALL allow users to add validators (required, min/max, regex, unique, date-range, email, custom) for any column.

#### Scenario: Add a required validator
- **WHEN** user adds a "required" validator to the "email" column
- **THEN** the validator is added to the project config and subsequent data imports will flag empty email cells

#### Scenario: Add a min/max range validator
- **WHEN** user adds a range validator to "salary" with min=0 and max=1000000
- **THEN** values outside this range are flagged as validation errors during import

### Requirement: User can configure static filters for a project
The system SHALL allow users to define filter definitions (column, operator, default value) that are applied during import.

#### Scenario: Add a static filter
- **WHEN** user adds a filter on "status" column with operator "equals" and value "active"
- **THEN** the filter definition is stored in the project config and applied during data import

### Requirement: User can configure groupings for a project
The system SHALL allow users to define one or more grouping levels by column.

#### Scenario: Add a grouping level
- **WHEN** user adds a group-by on "department" column
- **THEN** the grouping definition is stored and imported data will be organized by department

#### Scenario: Add nested grouping
- **WHEN** user adds a second group-by on "status" column after "department"
- **THEN** data is grouped first by department, then by status within each department group

### Requirement: User can configure transformers for columns
The system SHALL allow users to apply value transformations (trim, uppercase, lowercase, parse-number, custom regex) to columns during import.

#### Scenario: Add a trim transformer
- **WHEN** user adds a trim transformer to "name" column
- **THEN** leading and trailing whitespace is stripped from all name values during import

### Requirement: Configuration persists across sessions
The system SHALL persist all project import configuration (columns, validators, filters, groups, calculations, transformers) so it survives page reloads.

#### Scenario: Reload page retains configuration
- **WHEN** user configures columns and validators, then reloads the page
- **THEN** all configuration is restored and visible in the editor

#### Scenario: Switch projects retains configurations per project
- **WHEN** user navigates between two projects
- **THEN** each project shows its own independent configuration
