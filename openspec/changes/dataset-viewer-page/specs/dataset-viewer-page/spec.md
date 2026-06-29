## ADDED Requirements

### Requirement: Dataset viewer page
The system SHALL provide a page at `/projects/[id]/datasets/[datasetId]` that displays the raw CSV data in a paginated table.

#### Scenario: View dataset
- **WHEN** a user navigates to `/projects/<projectId>/datasets/<datasetId>`
- **THEN** the page displays the dataset name and a table with all rows (paginated)

#### Scenario: Dataset not found
- **WHEN** a user navigates to a non-existing dataset ID
- **THEN** a "Dataset not found" message is shown

### Requirement: Pagination
The table SHALL paginate rows with 100 rows per page, with next/previous controls and a page counter.

#### Scenario: Navigate pages
- **WHEN** a dataset has 250 rows and the user clicks "Next"
- **THEN** rows 101-200 are displayed

### Requirement: Navigate from dataset list
The system SHALL allow clicking a dataset name in the list to navigate to its viewer.

#### Scenario: Click dataset
- **WHEN** a user clicks a dataset name in `/projects/<id>/datasets`
- **THEN** the browser navigates to `/projects/<id>/datasets/<datasetId>`
