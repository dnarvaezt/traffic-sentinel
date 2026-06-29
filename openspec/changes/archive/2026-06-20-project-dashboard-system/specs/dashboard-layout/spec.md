## ADDED Requirements

### Requirement: Grid layout with drag & drop
The dashboard SHALL support a grid-based layout system using react-grid-layout. Widgets SHALL be draggable and resizable within a configurable column grid.

#### Scenario: Move widget by drag & drop
- **WHEN** user drags a widget to a new position on the grid
- **THEN** the widget snaps to the nearest grid position and other widgets reflow around it

#### Scenario: Resize widget
- **WHEN** user drags the resize handle of a widget
- **THEN** the widget width and height change proportionally to the grid cells

### Requirement: Add widget to dashboard
The system SHALL provide an "Add Widget" button that opens a panel to select a widget type and configure its initial settings before placement.

#### Scenario: Add new widget
- **WHEN** user clicks "Add Widget" and selects Chart type
- **THEN** system places a default Chart widget in the first available grid position

### Requirement: Remove widget from dashboard
Each widget SHALL have a remove/delete action accessible from its header.

#### Scenario: Remove widget
- **WHEN** user clicks the delete icon on a widget header
- **THEN** system removes the widget from the dashboard and reflows remaining widgets

### Requirement: Persistent layout
The layout configuration (widget positions, sizes, and types) SHALL be persisted to the project store (Zustand + localStorage) and restored when revisiting the dashboard.

#### Scenario: Layout persists across sessions
- **WHEN** user arranges widgets, leaves the dashboard, and returns
- **THEN** the widgets appear in the same positions and sizes as configured
