## ADDED Requirements

### Requirement: User can add widgets via a quick-add toolbar
The dashboard SHALL display a floating or inline toolbar with one-click buttons for each widget type (Chart, Metric, Table, Filter).

#### Scenario: Quick-add widget
- **WHEN** user clicks a widget type button in the quick-add toolbar
- **THEN** a new widget of that type is added to the dashboard grid with default configuration

### Requirement: User can configure widgets inline via side panel
Clicking a widget's settings icon SHALL open a side panel (sheet) with the widget's configuration options, without navigating away from the dashboard.

#### Scenario: Open widget config
- **WHEN** user clicks the settings icon on a dashboard widget
- **THEN** a slide-out side panel appears with the widget's configuration form

#### Scenario: Update widget config
- **WHEN** user modifies configuration in the side panel
- **THEN** the widget updates in real-time on the dashboard

#### Scenario: Close widget config
- **WHEN** user clicks outside the side panel or presses Escape
- **THEN** the side panel closes and configuration is saved

### Requirement: User can remove widgets with one click
Each widget SHALL display a close/remove button in its title bar.

#### Scenario: Remove widget
- **WHEN** user clicks the remove button on a widget
- **THEN** the widget is removed from the dashboard grid
- **THEN** the remaining widgets re-layout automatically

### Requirement: User can select the active dataset for the dashboard
The dashboard SHALL display a dataset selector dropdown in the header bar. Changing the dataset SHALL update all dashboard widgets with data from the new dataset.

#### Scenario: Change dashboard dataset
- **WHEN** user selects a different dataset from the dropdown
- **THEN** all widgets reload with data from the selected dataset

### Requirement: Empty dashboard shows guidance
When a dashboard has no widgets, the system SHALL show a helpful empty state with guidance on creating the first widget.

#### Scenario: Empty dashboard guidance
- **WHEN** the dashboard has no widgets
- **THEN** a centered card shows: "Crea tu primer widget" with options for each widget type
