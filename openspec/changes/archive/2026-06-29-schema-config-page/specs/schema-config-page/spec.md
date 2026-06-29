## ADDED Requirements

### Requirement: Schema config page
The system SHALL provide a page at `/projects/[id]/config` to view and edit the project schema columns.

#### Scenario: Page loads
- **WHEN** a user navigates to `/projects/<id>/config`
- **THEN** the page displays all columns of the project's schema in order

### Requirement: Add column
The system SHALL allow adding a new column with a header name and type.

#### Scenario: Add column
- **WHEN** a user clicks "Add column" and enters a header and selects a type
- **THEN** the new column appears at the bottom of the list

### Requirement: Remove column
The system SHALL allow removing a column from the schema.

#### Scenario: Remove column
- **WHEN** a user clicks the remove button on a column
- **THEN** the column is removed from the list

### Requirement: Reorder columns
The system SHALL allow moving columns up and down in the list.

#### Scenario: Move up
- **WHEN** a user clicks "Move up" on the second column
- **THEN** it swaps position with the first column

### Requirement: Edit column header and type
The system SHALL allow inline editing of column header and type.

#### Scenario: Change type
- **WHEN** a user changes a column's type from "string" to "number"
- **THEN** the column type is updated in the local state

### Requirement: Persist schema
The system SHALL provide a save button that persists all column changes to IndexedDB via `ProjectStore.update`.

#### Scenario: Save changes
- **WHEN** a user clicks "Save" after editing columns
- **THEN** the project's schema is updated in IndexedDB

## MODIFIED Requirements

### Requirement: Update project schema
The `ProjectStore.update` method SHALL accept a `schema` field in addition to `name` and `description`.

#### Scenario: Update schema
- **WHEN** `update(id, { schema })` is called
- **THEN** the project's schema is replaced with the new value and `updatedAt` is refreshed
