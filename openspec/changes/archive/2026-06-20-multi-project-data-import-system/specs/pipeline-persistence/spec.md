## ADDED Requirements

### Requirement: User can upload a CSV file to a project
The system SHALL allow users to upload a CSV file from within a project's data view, which triggers the full import pipeline.

#### Scenario: Upload CSV file
- **WHEN** user selects a CSV file in the project's data upload area
- **THEN** the file is read and processed through the ImportEngine pipeline (parse → map → transform → validate → calculate → filter → group)

#### Scenario: Upload replaces existing data
- **WHEN** user uploads a new CSV file and a dataset already exists for that project
- **THEN** the user is prompted to confirm replacement before processing

### Requirement: Pipeline results are persisted to IndexedDB
The system SHALL store the results of each pipeline stage (raw data, transformed data, calculated data, validation errors) in IndexedDB, associated with the project and dataset.

#### Scenario: Successful import persists data
- **WHEN** the import pipeline completes successfully for a CSV with 100 rows
- **THEN** the raw data, transformed data, calculated data, and errors are all stored in IndexedDB under the project+database ID key

#### Scenario: Data loads on return visit
- **WHEN** user navigates back to a project that previously had a CSV imported
- **THEN** the data is loaded from IndexedDB and displayed without requiring re-upload

### Requirement: Validation errors are stored with the dataset
The system SHALL store validation errors alongside the processed data so they can be displayed in the data viewer without re-running validation.

#### Scenario: Errors persist across page loads
- **WHEN** a CSV with invalid data is imported and the page is reloaded
- **THEN** validation errors are still visible in the data viewer

### Requirement: Runtime filters can be applied without re-importing
The system SHALL apply runtime filters client-side against the stored calculated data, without re-running the full pipeline.

#### Scenario: Apply runtime filter
- **WHEN** user changes a filter value in the data viewer
- **THEN** the filter is applied to the stored calculated data in-memory and the display updates immediately

#### Scenario: Filter resets on dataset change
- **WHEN** user switches to a different dataset within the same project
- **THEN** runtime filters are cleared and the new dataset is displayed unfiltered

### Requirement: User can delete a dataset from a project
The system SHALL allow users to delete an imported dataset and its associated data from IndexedDB.

#### Scenario: Delete dataset
- **WHEN** user clicks delete on a dataset in the project
- **THEN** the dataset's data is removed from IndexedDB and the dataset entry is removed from the project
