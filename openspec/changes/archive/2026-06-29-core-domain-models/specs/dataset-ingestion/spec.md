## ADDED Requirements

### Requirement: Dataset entity
The system SHALL define a `Dataset` entity with the following fields: `id` (string), `projectId` (string), `name` (string), `description` (optional string), `rawData` (Record<string, unknown>[]), `rowCount` (number), `columns` (ColumnDefinition[] — snapshot of schema columns at upload time), `uploadedAt` (Date), `favorite` (optional boolean).

#### Scenario: Dataset creation
- **WHEN** a CSV file is uploaded for a project
- **THEN** a Dataset is created with the parsed raw data, a snapshot of the current schema columns, and `uploadedAt` set to the current time

### Requirement: Raw data storage
Datasets SHALL store raw CSV data as-is in `rawData`. The schema's transformations, validators, and calculations are applied at read time, not stored.

#### Scenario: Raw data preservation
- **WHEN** a user uploads a CSV and later modifies the schema
- **THEN** the dataset's rawData retains the original parsed CSV values

### Requirement: Dataset CRUD
The system SHALL support creating, reading, updating (name, description, favorite), and deleting datasets. Deleting a dataset SHALL cascade from the project.

#### Scenario: Rename dataset
- **WHEN** a user renames a dataset from "Q1" to "Q1 2026"
- **THEN** the dataset name is updated

#### Scenario: Delete dataset
- **WHEN** a user deletes a dataset
- **THEN** the dataset is removed from the project

### Requirement: Map CSV headers to schema columns
When raw data is read through the schema, CSV headers SHALL be mapped to schema columns using the `sourceColumn` or `header` field of each ColumnDefinition.

#### Scenario: Header mapping
- **WHEN** CSV has header "Full Name" and schema column has `sourceColumn: "Full Name"`
- **THEN** the raw data maps to that column

#### Scenario: Fallback to header
- **WHEN** CSV has header "Email" and schema column has `header: "Email"` with no `sourceColumn`
- **THEN** the raw data maps to that column

### Requirement: Multiple datasets per project
A project SHALL support having multiple datasets. Each dataset SHALL be independently uploaded and managed.

#### Scenario: Add second dataset
- **WHEN** a user uploads a second CSV to a project that already has one dataset
- **THEN** both datasets coexist under the same project
