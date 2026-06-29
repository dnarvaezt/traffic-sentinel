## ADDED Requirements

### Requirement: Catalog of widget types
The system SHALL provide a catalog of widget types that can be added to a dashboard. Each widget type SHALL have a unique identifier, display name, icon, and configuration schema.

#### Scenario: Display available widget types
- **WHEN** user opens the "Add Widget" panel
- **THEN** system displays the catalog with Chart, Metric, Table, and Filter widget types, including their names and descriptions

### Requirement: Chart widget
The Chart widget SHALL render a chart using Chart.js (via ChartWidget component). The user SHALL be able to select chart type (line, bar, pie, area), label column, value column, and aggregation function (sum, avg, count, min, max).

#### Scenario: Configure chart widget
- **WHEN** user adds a Chart widget and selects "line" type, label column "date", value column "revenue"
- **THEN** the widget renders a line chart with dates on X axis and revenue on Y axis

### Requirement: Metric widget
The Metric widget SHALL display a single numeric KPI value (aggregated from data) with an optional label, format prefix/suffix, and color.

#### Scenario: Add metric widget
- **WHEN** user adds a Metric widget, selects column "amount", aggregation "sum", and label "Total Revenue"
- **THEN** the widget displays the sum of all "amount" values with the label "Total Revenue"

### Requirement: Table widget
The Table widget SHALL render a paginated data table showing selected columns from the dataset.

#### Scenario: Configure table widget columns
- **WHEN** user adds a Table widget and selects columns "name", "email", "amount"
- **THEN** the widget renders a table with those three columns and pagination

### Requirement: Filter widget
The Filter widget SHALL render inline filter controls that affect other widgets on the dashboard. Filters SHALL be column-based (text search, numeric range, select from unique values).

#### Scenario: Apply filter across dashboard
- **WHEN** user sets a Filter widget to filter by column "status" with value "active"
- **THEN** all other widgets on the dashboard update to show only data where status is "active"
