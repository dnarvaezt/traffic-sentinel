## ADDED Requirements

### Requirement: User can view imported data in a table
The system SHALL display imported data in a scrollable table with columns matching the project's schema definition.

#### Scenario: Display imported data
- **WHEN** a dataset has been imported and the user views it in the project
- **THEN** the data is rendered in a table with column headers from the schema definition and cells showing the imported values

#### Scenario: Empty dataset shows empty state
- **WHEN** a project has no imported data
- **THEN** the viewer shows a message indicating no data has been imported with an upload prompt

### Requirement: User can apply runtime filters to the displayed data
The system SHALL render filter controls based on the project's filter definitions and apply them to the displayed data in real time.

#### Scenario: Filter data by text
- **WHEN** user types "john" in a text filter on the "name" column
- **THEN** the table updates to show only rows where name contains "john" (case-insensitive)

#### Scenario: Filter data by number range
- **WHEN** user sets a number filter on "salary" with min=30000 and max=100000
- **THEN** the table shows only rows where salary is between 30000 and 100000 inclusive

#### Scenario: Multiple filters combine
- **WHEN** user sets a text filter on "name" and a number filter on "salary"
- **THEN** only rows matching ALL active filters are displayed

### Requirement: User can view data grouped by configured groupings
The system SHALL organize the table rows into grouped sections based on the project's grouping definitions.

#### Scenario: View grouped data
- **WHEN** a project has grouping defined on "department"
- **THEN** the table shows group headers with the department name and row count, followed by the rows in that group

#### Scenario: Nested groups display hierarchically
- **WHEN** groupings are defined on "department" then "status"
- **THEN** each department group contains sub-groups for each status value, displayed with indentation

#### Scenario: Toggle grouping on/off
- **WHEN** user toggles grouping off
- **THEN** data is displayed as a flat table without group headers

### Requirement: User can see validation errors in the table
The system SHALL highlight cells and rows that have validation errors, and show error details on hover.

#### Scenario: Cell with error shows red styling
- **WHEN** a cell failed validation (e.g., required field empty)
- **THEN** the cell text is displayed in red/destructive color

#### Scenario: Row with error shows background highlight
- **WHEN** a row has a row-level validation error
- **THEN** the entire row has a red/destructive background tint

#### Scenario: Hover over error shows tooltip
- **WHEN** user hovers over a highlighted cell
- **THEN** a tooltip appears with the validation error message

### Requirement: User can export processed data as CSV
The system SHALL allow users to download the currently displayed (filtered, calculated) data as a CSV file.

#### Scenario: Export filtered data
- **WHEN** user has filters active and clicks "Export"
- **THEN** the downloaded CSV contains only the filtered rows with all calculated columns included

### Requirement: User can upload a replacement CSV
The system SHALL allow users to replace the current dataset with a new CSV file.

#### Scenario: Replace CSV
- **WHEN** user clicks "Replace File" and selects a new CSV
- **THEN** the existing data in IndexedDB is replaced with the newly processed data
