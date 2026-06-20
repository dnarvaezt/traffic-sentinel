## ADDED Requirements

### Requirement: User can see schema health indicators
The import configuration view SHALL show health status for each column definition: valid (green), warning (yellow for nullable mismatches), or error (red for type conflicts).

#### Scenario: Column health displayed
- **WHEN** user opens the import configuration tab
- **THEN** each column row shows a health badge indicating its validation status

### Requirement: User can preview validation results before importing
The system SHALL allow previewing validation rules against a selected dataset before applying the import configuration.

#### Scenario: Preview validation
- **WHEN** user clicks "Preview" in the import configuration
- **THEN** a preview panel shows validation results for each column with pass/fail counts

### Requirement: User can configure columns with inline editing
Column configuration (name, type, validators, transformers) SHALL be editable inline within the column list without opening dialogs.

#### Scenario: Inline column edit
- **WHEN** user clicks a column's type badge
- **THEN** the type becomes a dropdown selector
- **WHEN** user selects a new type
- **THEN** the column type is updated in the schema

### Requirement: User can add virtual/computed columns
The import configuration SHALL support adding virtual columns defined by expressions referencing other columns.

#### Scenario: Add virtual column
- **WHEN** user clicks "Add Virtual Column"
- **THEN** a new column row appears with expression editor input
- **WHEN** user enters the expression and saves
- **THEN** the virtual column is added to the schema with a "virtual" badge
