## ADDED Requirements

### Requirement: All project sub-pages share a consistent sidebar layout
The system SHALL provide a shared layout component used by the project detail, filters, and schema pages that renders a consistent sidebar with navigation items.

#### Scenario: Sidebar appears on all project pages
- **WHEN** user navigates to any `/projects/[id]` page (including sub-pages like filters and schema)
- **THEN** the same sidebar is displayed with items: Datasets, Datos, Configuración, Filtros, Schema

#### Scenario: Active nav item highlights based on current URL
- **WHEN** user is on `/projects/[id]/filters`
- **THEN** the "Filtros" nav item is highlighted as active

#### Scenario: Active tab highlights based on search params
- **WHEN** user is on `/projects/[id]?tab=data`
- **THEN** the "Datos" nav item is highlighted as active

### Requirement: Datasets, Datos, and Configuración tabs use URL search params
The system SHALL use URL search parameters (`?tab=datasets|data|config`) to represent the active tab state, enabling deep-linking and browser navigation.

#### Scenario: Tab state is reflected in URL
- **WHEN** user clicks "Datos" in the sidebar
- **THEN** the URL changes to `/projects/[id]?tab=data`

#### Scenario: URL with tab param opens correct view on page load
- **WHEN** user navigates directly to `/projects/[id]?tab=data`
- **THEN** the Data view is displayed immediately

#### Scenario: Browser back button restores previous tab
- **WHEN** user clicks "Datos" then "Configuración" then presses browser back
- **THEN** the Datos view is restored

### Requirement: Sidebar navigation works for all tabs
The system SHALL ensure all sidebar nav items properly update the active view when clicked.

#### Scenario: Clicking Configuración activates config view
- **WHEN** user clicks "Configuración" in the sidebar
- **THEN** the config editor is displayed and the URL updates to `?tab=config`

#### Scenario: Clicking Datos activates data view
- **WHEN** user clicks "Datos" in the sidebar
- **THEN** the data viewer is displayed and the URL updates to `?tab=data`
