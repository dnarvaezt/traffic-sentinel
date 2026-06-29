## ADDED Requirements

### Requirement: User manages columns in a single configuration page
The system SHALL provide a single "Configuración" page that merges the previous Schema and Configuración tabs. It SHALL display sub-tabs: Columnas, Validaciones, Filtros de importación, Agrupaciones, Transformaciones, Virtuales.

#### Scenario: Navigate to unified config
- **WHEN** user clicks "Configuración" in the sidebar
- **THEN** the unified configuration page is shown with the Columnas sub-tab active

#### Scenario: Old schema route redirects
- **WHEN** user navigates to `/projects/[id]/schema`
- **THEN** the user is redirected to `/projects/[id]?tab=config`

### Requirement: Unified column model
The system SHALL use a single column definition model across the entire app, based on `SchemaDefinition` from `@/data-import/domain/models/schema`. The old `project.schema.columns` SHALL be derived from `project.config.columns`.

#### Scenario: Column defined in config
- **WHEN** user adds a column in the unified config page
- **THEN** the column is available in both the schema (for dataset views) and the import pipeline

#### Scenario: Existing projects migrate
- **WHEN** a project created before this change is loaded
- **THEN** the `project.schema` and `project.importConfig` fields are merged into `project.config`

### Requirement: Sidebar shows simplified navigation
The sidebar SHALL display 4 navigation items: Datasets, Dashboard, Configuración, Filtros. The Schema and Datos items SHALL be removed.

#### Scenario: Sidebar items
- **WHEN** user opens any project page
- **THEN** the sidebar shows exactly: Datasets, Dashboard, Configuración, Filtros

### Requirement: Data tab redirects to datasets
The `?tab=data` query parameter SHALL redirect to `?tab=datasets`. The DataViewer component SHALL be removed.

#### Scenario: Old data bookmark
- **WHEN** user navigates to `/projects/[id]?tab=data`
- **THEN** the user is redirected to `/projects/[id]?tab=datasets`
