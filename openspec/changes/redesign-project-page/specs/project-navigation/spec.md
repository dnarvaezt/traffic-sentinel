## ADDED Requirements

### Requirement: User can navigate project sections via a collapsible sidebar
The system SHALL provide a sidebar with navigation items for all project sections: Datasets, Data, Dashboard, Configuración, Filtros, Schema. The sidebar SHALL be collapsible to an icon-only rail (56px) on toggle or at screen widths below 768px. Active section SHALL be visually indicated.

#### Scenario: Sidebar collapses on toggle
- **WHEN** user clicks the collapse toggle button in the sidebar
- **THEN** the sidebar shrinks to 56px width showing only icons with tooltips

#### Scenario: Sidebar expands on toggle
- **WHEN** user clicks the expand toggle button in the collapsed sidebar
- **THEN** the sidebar expands to full width showing icons and labels

#### Scenario: Sidebar auto-collapses on small screen
- **WHEN** viewport width is below 768px
- **THEN** the sidebar collapses to a bottom navigation bar with icons

#### Scenario: Active section is highlighted
- **WHEN** user navigates to a project section
- **THEN** the corresponding sidebar item is highlighted with a secondary background

### Requirement: User can see project name and description in the sidebar header
The sidebar SHALL display the project name and truncated description at the top. Clicking the project name SHALL navigate to the Datasets tab (home).

#### Scenario: Project header visible
- **WHEN** any project section is loaded
- **THEN** the project name and description are shown at the top of the sidebar

### Requirement: User can edit project from a header gear icon
The project edit dialog SHALL be triggered from a gear/settings icon in the page header, not from the sidebar.

#### Scenario: Open project settings from header
- **WHEN** user clicks the gear icon in the page header
- **THEN** the project settings dialog opens with name and description fields

### Requirement: Project sections maintain deep-linkable URLs
Each project section SHALL have a unique URL: `/projects/[id]` (datasets), `/projects/[id]?tab=data` (data), `/projects/[id]/dashboard`, `/projects/[id]?tab=config`, `/projects/[id]/filters`, `/projects/[id]/schema`.

#### Scenario: Deep link loads correct tab
- **WHEN** user navigates directly to `/projects/[id]/filters`
- **THEN** the filters section is shown with the sidebar indicating active state
