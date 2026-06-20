## ADDED Requirements

### Requirement: Configuración sub-tabs are disabled without columns
The Configuración sub-tabs (Virtuales, Validaciones, Filtros de importación, Agrupaciones, Transformaciones) SHALL appear disabled when `config.columns` is empty. A tooltip or inline message SHALL explain: "Define al menos una columna para activar esta sección".

#### Scenario: No columns defined
- **WHEN** user opens Configuración and no columns exist
- **THEN** the Columnas tab is active and all other sub-tabs show as disabled with a hint message

#### Scenario: Columns exist
- **WHEN** user adds at least one column
- **THEN** all sub-tabs become active and interactive

### Requirement: Filter creation blocked without schema columns
When no schema columns are defined, the system SHALL show a primary action button in the filters tab that navigates to Configuración with the message "Define columnas primero".

#### Scenario: No columns, filter tab
- **WHEN** user navigates to the filters tab and `config.columns` is empty
- **THEN** the tab shows a centered message "Define columnas en Configuración" with a button linking to `?tab=config`

#### Scenario: Columns exist, filter tab
- **WHEN** user navigates to the filters tab and columns are defined
- **THEN** the normal filter management UI is shown

### Requirement: Sidebar shows count badges
The sidebar SHALL show count badges for Datasets (number of databases), Filtros (number of project filters), and Dashboard (number of widgets across all dashboards).

#### Scenario: Sidebar badge visibility
- **WHEN** user opens a project
- **THEN** the Datasets item shows the count of databases, Filtros shows the count of filters, Dashboard shows the total widget count
