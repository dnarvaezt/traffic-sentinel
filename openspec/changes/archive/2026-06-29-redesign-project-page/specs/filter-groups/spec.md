## ADDED Requirements

### Requirement: User can create filters with AND/OR grouping
The filter creation dialog SHALL support grouping multiple conditions with AND/OR logic. Each filter group SHALL contain one or more conditions joined by the selected logical operator.

#### Scenario: Create filter with AND group
- **WHEN** user creates a new filter
- **THEN** the filter dialog shows an initial condition row
- **WHEN** user clicks "Add Condition"
- **THEN** a new condition row is added within the same group
- **WHEN** user selects "AND" as the group operator
- **THEN** all conditions must match for the filter to pass

#### Scenario: Create filter with OR group
- **WHEN** user has two or more conditions in a filter
- **WHEN** user selects "OR" as the group operator
- **THEN** any condition matching is sufficient for the filter to pass

### Requirement: User can preview filter results inline
The filter dialog SHALL show a preview panel that displays how many rows would match the filter from the selected dataset.

#### Scenario: Preview filter match count
- **WHEN** user configures filter conditions
- **THEN** a preview section shows "X de Y filas coinciden" in real-time

### Requirement: User can search filters by name
The filter list SHALL include a search input that filters the list by filter name in real-time.

#### Scenario: Search filters
- **WHEN** user types in the filter search input
- **THEN** the filter list filters to show only filters whose name contains the search term

### Requirement: User can toggle filters on/off
Each filter in the list SHALL have a toggle switch to enable or disable it without deleting it.

#### Scenario: Toggle filter
- **WHEN** user flips the toggle switch on a filter
- **THEN** the filter is enabled/disabled in the project

### Requirement: Duplicate filter dialog removed from ProjectDetail
The filter CRUD dialog SHALL exist only in the filters section, not in ProjectDetail. The datasets and data tabs SHALL show a read-only summary of active filters with a link to manage them.

#### Scenario: Filter summary in dataset tab
- **WHEN** user is on the Datasets or Data tab
- **THEN** a compact filter summary shows active filter names with counts
- **WHEN** user clicks "Manage Filters"
- **THEN** navigation switches to the Filters tab
