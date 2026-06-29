## ADDED Requirements

### Requirement: Dataset view shows paginated data table
The system SHALL display dataset contents in a paginated table with column headers derived from the dataset's schema.

#### Scenario: View dataset data
- **WHEN** user navigates to `/projects/[id]/datasets/[datasetId]`
- **THEN** the system shows a paginated table of the dataset's rows

#### Scenario: Navigate pages
- **WHEN** user clicks next/prev page buttons
- **THEN** the table shows the corresponding page of data

### Requirement: Dataset view has filter sidebar
The system SHALL provide a toggleable filter sidebar with column-based value filters.

#### Scenario: Add column filter
- **WHEN** user opens filter sidebar, selects a column, and chooses values
- **THEN** the data table filters to matching rows

### Requirement: Dataset view links to dashboard
The system SHALL provide a header link to navigate to the project dashboard with this dataset selected.

#### Scenario: Open in dashboard
- **WHEN** user clicks "Ver en Dashboard"
- **THEN** the system navigates to `/projects/[id]/dashboard` with this dataset selected
