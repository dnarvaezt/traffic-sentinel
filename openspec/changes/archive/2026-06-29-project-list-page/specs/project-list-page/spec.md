## ADDED Requirements

### Requirement: Project list page
The system SHALL provide a page at `/` that displays all projects in a table with columns: name, description, createdAt, and action buttons.

#### Scenario: Page loads
- **WHEN** a user navigates to `/`
- **THEN** the page loads and displays all existing projects from IndexedDB

### Requirement: Search by name
The system SHALL provide a search input that filters projects by name (case-insensitive substring match) with debounce.

#### Scenario: Search projects
- **WHEN** a user types "sales" in the search input
- **THEN** only projects whose name contains "sales" are shown

### Requirement: Pagination
The system SHALL provide pagination controls with page number display, previous/next buttons, and a page size selector (10, 20, 50).

#### Scenario: Navigate pages
- **WHEN** a user clicks "Next" on page 1 with 25 projects (pageSize 10)
- **THEN** page 2 shows projects 11-20

### Requirement: Sort by name or date
The system SHALL provide sort controls to order projects by name or createdAt, in ascending or descending order. Default SHALL be createdAt descending (newest first).

#### Scenario: Sort by name
- **WHEN** a user selects sort "Name" and order "A-Z"
- **THEN** projects are ordered alphabetically by name

#### Scenario: Default sort
- **WHEN** the page loads
- **THEN** projects are sorted by createdAt descending (newest first)
