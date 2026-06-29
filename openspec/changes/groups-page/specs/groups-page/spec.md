## ADDED Requirements

### Requirement: Página dedicada de agrupaciones
The system SHALL provide a dedicated page at `/projects/[id]/groups` for configuring data groupings.
The page SHALL be accessible from the sidebar navigation under "Agrupaciones" with a `Layers` icon.
The page SHALL use the project layout (`ProjectLayout`) consistent with other project pages.

#### Scenario: Navigate to groups page
- **WHEN** user clicks "Agrupaciones" in the sidebar
- **THEN** the browser navigates to `/projects/[id]/groups`
- **THEN** the sidebar highlights "Agrupaciones" as active

#### Scenario: Direct URL access
- **WHEN** user navigates directly to `/projects/[id]/groups`
- **THEN** the groups page renders with the project layout
- **THEN** "Agrupaciones" is highlighted in the sidebar

### Requirement: Gestión de grupos por drag & drop
The groups page SHALL display a list of available columns on the left side.
The groups page SHALL display a "drop zone" area where columns can be dropped to create grouping levels.
Users SHALL be able to drag columns from the available columns list into the drop zone.
Users SHALL be able to reorder grouping levels within the drop zone by dragging.
Users SHALL be able to remove a grouping level by clicking an X icon on its badge.
The system SHALL prevent duplicate grouping levels (same column cannot be grouped twice).
When no groups are configured, the drop zone SHALL show a placeholder message "Arrastra columnas aquí para agrupar".

#### Scenario: Add group level by drag
- **WHEN** user drags a column from the available list into the drop zone
- **THEN** a new grouping level is created for that column
- **THEN** the column is visually marked as "in use" in the available list

#### Scenario: Reorder group levels
- **WHEN** user drags a grouping level badge to a different position in the drop zone
- **THEN** the level order updates immediately
- **THEN** the preview updates to reflect the new order

#### Scenario: Remove group level
- **WHEN** user clicks X on a grouping level badge
- **THEN** the level is removed from the group configuration
- **THEN** the column returns to the available list
- **THEN** the preview updates immediately

#### Scenario: Prevent duplicate grouping
- **WHEN** user tries to add a column that is already a grouping level
- **THEN** the system prevents the duplicate (drop zone ignores it)
- **THEN** no change is made to the group configuration

### Requirement: Eliminación del tab Agrupaciones en ConfigEditor
The ConfigEditor component SHALL remove the "Agrupaciones" tab.
The `GroupsEditor` component SHALL be deleted from `src/modules/project/components/config-editor/groups-editor.tsx`.

#### Scenario: Groups tab no longer appears
- **WHEN** user opens ConfigEditor in the project
- **THEN** only "Columnas" tab is shown
- **THEN** "Agrupaciones" tab is not present

### Requirement: Modelo GroupDefinition extendido
`GroupDefinition` SHALL include an optional `label` field of type `string`.
When `label` is not provided, the system SHALL fall back to the column's `header` as display name.

#### Scenario: Group with custom label
- **WHEN** a group has a `label` value
- **THEN** the preview and UI display the label instead of the column header

#### Scenario: Group without label
- **WHEN** a group has no `label` value
- **THEN** the preview and UI display the column's `header` as the group name
