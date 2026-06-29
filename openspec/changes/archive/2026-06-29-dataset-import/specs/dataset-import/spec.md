## ADDED Requirements

### Requirement: Dataset management page
The system SHALL provide a page at `/projects/[id]/datasets` to upload and manage CSV datasets.

### Requirement: Upload CSV
The system SHALL allow uploading a CSV file via a file input. The file SHALL be parsed client-side with PapaParse and stored as a Dataset in IndexedDB via `DatasetStore.create`.

#### Scenario: Upload CSV
- **WHEN** a user selects a CSV file
- **THEN** the file is parsed, a Dataset is created with the parsed rows, and it appears in the list

### Requirement: List datasets
The system SHALL display all datasets for the project in a table showing name, row count, and upload date.

#### Scenario: View datasets
- **WHEN** a user navigates to `/projects/<id>/datasets`
- **THEN** all datasets for that project are listed with their metadata

### Requirement: Delete dataset
The system SHALL allow deleting a dataset with a confirmation step.

#### Scenario: Delete dataset
- **WHEN** a user clicks delete on a dataset
- **THEN** the dataset is removed from IndexedDB
