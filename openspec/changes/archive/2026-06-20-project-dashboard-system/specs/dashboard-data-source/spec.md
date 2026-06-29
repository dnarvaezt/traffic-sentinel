## ADDED Requirements

### Requirement: Dataset selector for dashboard
The dashboard SHALL display a dropdown/selector listing all datasets (databases) available in the current project. The user SHALL select which dataset feeds the dashboard widgets.

#### Scenario: Select dataset
- **WHEN** user opens the dashboard and selects a dataset from the dropdown
- **THEN** system loads the dataset rows from IndexedDB and passes them to all widgets

#### Scenario: Dashboard loads with first dataset by default
- **WHEN** user navigates to the dashboard page and has at least one dataset
- **THEN** the first dataset is auto-selected and its data loaded

### Requirement: Per-widget column and aggregation configuration
Each widget SHALL allow the user to configure which columns from the dataset to use, plus optional aggregation and grouping.

#### Scenario: Configure widget columns
- **WHEN** user opens a Chart widget config and selects column "sales" with aggregation "sum" and group-by column "region"
- **THEN** the widget groups data by region, sums sales per region, and renders the chart

### Requirement: Shared filter state across widgets
When a Filter widget is configured, its filter criteria SHALL apply to all other data-bound widgets on the dashboard.

#### Scenario: Filter propagates to all widgets
- **WHEN** user sets a filter "year = 2024"
- **THEN** Chart, Metric, and Table widgets all show only data matching year 2024

### Requirement: Empty / no-data state
When a dataset has no rows or no matching data after filtering, widgets SHALL show an empty state message.

#### Scenario: No data for widget
- **WHEN** the dataset is empty or all rows are filtered out
- **THEN** the widget displays "No hay datos disponibles"
