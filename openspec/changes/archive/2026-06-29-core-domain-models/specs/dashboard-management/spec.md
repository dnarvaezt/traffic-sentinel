## ADDED Requirements

### Requirement: Dashboard entity
The system SHALL define a `Dashboard` entity with the following fields: `id` (string), `projectId` (string), `name` (string), `widgets` (Widget[]), `createdAt` (Date), `updatedAt` (Date).

#### Scenario: Dashboard creation
- **WHEN** a user creates a dashboard with name "Executive View"
- **THEN** a Dashboard is created with that name, an empty widgets array, and timestamps set

### Requirement: Multiple dashboards per project
A project SHALL support multiple dashboards. Each dashboard is independently created, named, and configured.

#### Scenario: Second dashboard
- **WHEN** a user creates a second dashboard in the same project
- **THEN** both dashboards exist under the same project

### Requirement: Widget definition
The system SHALL define a `Widget` type with fields: `id` (string), `type` (WidgetType), `config` (WidgetConfig), `position` (WidgetPosition). Supported WidgetTypes: `"chart"`, `"table"`, `"metric"`, `"filter"`.

#### Scenario: Add chart widget
- **WHEN** a user adds a chart widget to a dashboard
- **THEN** the widget is created with type "chart" and a default config

### Requirement: Widget references a dataset
Each widget SHALL reference a dataset ID in its config, indicating which dataset to render data from.

#### Scenario: Widget dataset selection
- **WHEN** a user configures a widget to render from dataset "ds_1"
- **THEN** the widget's config includes `datasetId: "ds_1"`

### Requirement: Widget position and layout
Widgets SHALL have a position object with `x`, `y`, `width`, `height` (all numbers) for grid layout.

#### Scenario: Widget positioning
- **WHEN** a user places a widget at position `{ x: 0, y: 0, width: 6, height: 4 }`
- **THEN** the widget occupies that grid space

### Requirement: Dashboard CRUD
The system SHALL support creating, reading, updating (name, widgets), and deleting dashboards. Deleting a dashboard SHALL cascade from the project.

#### Scenario: Update dashboard name
- **WHEN** a user renames a dashboard from "View 1" to "Sales Overview"
- **THEN** the dashboard name is updated and `updatedAt` is refreshed

#### Scenario: Delete dashboard
- **WHEN** a user deletes a dashboard
- **THEN** the dashboard and all its widgets are removed
