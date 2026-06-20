## ADDED Requirements

### Requirement: Vista previa en vivo de datos agrupados
The groups page SHALL display a live preview of data grouped according to the current configuration.
The preview SHALL use the active dataset's calculated data (from `useDatasetData`) and apply `groupDataService.execute()` client-side.
The preview SHALL update in real-time when the group configuration changes (add, remove, reorder levels).
The preview SHALL display a tree structure with collapsible group headers at each level.
Each group header SHALL show the group name (or column header if no label) and the count of items in that group.
The preview SHALL be limited to the first 1000 rows to ensure performance.
A notice SHALL be displayed when preview is limited: "Mostrando preview de los primeros 1000 registros."

#### Scenario: Preview shows grouped data
- **WHEN** user configures one or more grouping levels
- **THEN** the preview area shows the data organized in a collapsible tree
- **THEN** each group header shows the group value and item count

#### Scenario: Preview updates on reorder
- **WHEN** user reorders grouping levels
- **THEN** the preview tree re-renders with the new hierarchy

#### Scenario: Preview updates on remove
- **WHEN** user removes a grouping level
- **THEN** the preview tree re-renders one level shallower (or flat if no groups remain)

#### Scenario: Preview with no groups
- **WHEN** no groups are configured
- **THEN** the preview area shows a message "Sin agrupaciones — los datos se muestran sin organización jerárquica"
- **THEN** the raw flat data is displayed in a simple table

#### Scenario: Preview with no active dataset
- **WHEN** no dataset is selected or the project has no datasets
- **THEN** the preview area shows a message "Selecciona un dataset para ver la vista previa"

#### Scenario: Large dataset preview limit
- **WHEN** the active dataset has more than 1000 rows
- **THEN** the preview uses only the first 1000 rows
- **THEN** a notice is displayed: "Mostrando preview de los primeros 1000 registros."

### Requirement: Árbol colapsable de grupos
Each group level SHALL be visually nested under its parent.
Group headers SHALL be clickable to collapse/expand the group contents.
The initial state SHALL have all groups expanded (depth-first, first 3 levels visible).
Groups with a large number of direct children (>50) SHALL show a count instead of rendering all children.

#### Scenario: Collapse and expand group
- **WHEN** user clicks a group header
- **THEN** the group's children toggle between visible and hidden
- **THEN** the collapse state is local (does not affect other groups)

#### Scenario: Large group truncation
- **WHEN** a group has more than 50 direct child items
- **THEN** the group shows "50+ elementos" instead of rendering each item
- **THEN** clicking the group header still expands to show all children
