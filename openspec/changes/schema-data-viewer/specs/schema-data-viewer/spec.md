## ADDED Requirements

### Requirement: Schema data viewer page
The system SHALL provide a page at `/projects/[id]/data` that displays dataset data processed through the project's schema.

#### Scenario: View processed data
- **WHEN** a user navigates to `/projects/<id>/data` and selects a dataset
- **THEN** the page displays the data with schema column mapping, transformers, and calculated columns applied

### Requirement: Dataset selector
The system SHALL provide a dropdown to select which dataset to view.

#### Scenario: Select dataset
- **WHEN** a user selects a dataset from the dropdown
- **THEN** the data is loaded and processed through the schema

### Requirement: Column mapping
Raw data SHALL be mapped to schema columns using `sourceColumn` or `header` matching. Columns SHALL display in schema order.

#### Scenario: Map columns
- **WHEN** a schema column has `sourceColumn: "Full Name"` and the CSV has header "Full Name"
- **THEN** the column shows the value from that CSV field

### Requirement: Transformers
Column transformers SHALL be applied in order (trim, uppercase, lowercase, slug, parseInt, parseFloat, dateParse, stripHtml, custom).

#### Scenario: Apply transformer
- **WHEN** a column has `transformers: ["trim", "uppercase"]`
- **THEN** the displayed value is trimmed and uppercased

### Requirement: Calculated columns
Virtual columns with `calculate` SHALL be evaluated using the row data.

#### Scenario: Calculated value
- **WHEN** a virtual column has `calculate: "row.price * row.quantity"`
- **THEN** the column shows the computed product

### Requirement: Pagination
The table SHALL paginate results with 100 rows per page.

#### Scenario: Navigate pages
- **WHEN** a user clicks "Next"
- **THEN** the next 100 rows are displayed
