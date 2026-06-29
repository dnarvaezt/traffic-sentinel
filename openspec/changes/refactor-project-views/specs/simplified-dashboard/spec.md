## ADDED Requirements

### Requirement: Dashboard shows phased empty states
The system SHALL display three distinct empty states: no columns (link to config), columns but no datasets (link to upload), data but no widgets (create widget buttons).

#### Scenario: No columns defined
- **WHEN** user opens dashboard and config columns are empty
- **THEN** the system shows "Define columnas en Configuración" with a link button

#### Scenario: Columns defined but no data
- **WHEN** user has columns but no datasets
- **THEN** the system shows "Sube un dataset" with a link to datasets tab

#### Scenario: Ready for widgets
- **WHEN** user has columns and datasets but no dashboard widgets
- **THEN** the system shows widget type selector buttons

### Requirement: Dashboard displays widget grid
The system SHALL display dashboard widgets in a draggable, resizable grid layout.

#### Scenario: Add widget
- **WHEN** user clicks a widget type button
- **THEN** a new widget is added to the grid with default configuration

#### Scenario: Remove widget
- **WHEN** user clicks remove on a widget
- **THEN** the widget is removed from the grid

#### Scenario: Resize widget
- **WHEN** user drags a widget's resize handle
- **THEN** the widget dimensions update

### Requirement: Dashboard allows dataset selection
The system SHALL provide a dataset selector dropdown that determines which dataset's data feeds the widgets.

#### Scenario: Select dataset
- **WHEN** user selects a dataset from the dropdown
- **THEN** dashboard widgets re-render with the selected dataset's data
