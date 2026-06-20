## ADDED Requirements

### Requirement: Area chart support
The ChartWidget SHALL support rendering an "area" chart type (filled line chart) using Chart.js.

#### Scenario: Render area chart
- **WHEN** user selects chart type "area" for a Chart widget
- **THEN** the widget renders a filled line chart where the area below the line is filled with a semi-transparent color

### Requirement: Configurable label and value columns
The ChartWidget SHALL allow explicit selection of label column (X axis) and value column (Y axis) instead of auto-detection. For grouped charts, the group-by column SHALL be configurable separately.

#### Scenario: Select label and value columns
- **WHEN** user configures a Chart widget with label column "fecha" and value column "ventas"
- **THEN** the chart renders with fecha on X axis and ventas on Y axis

#### Scenario: Grouped bar chart
- **WHEN** user configures a Bar chart with label column "region", value column "sales", and group-by column "product"
- **THEN** the chart renders grouped bars per region, with one bar per product

### Requirement: Dataset as data source
The ChartWidget SHALL accept a data source parameter (array of records) instead of requiring inline data, enabling it to receive filtered/aggregated data from the dashboard data source.

#### Scenario: Chart renders from external data
- **WHEN** a Chart widget receives data from the dashboard data source (filtered dataset)
- **THEN** the chart renders using the provided data array
