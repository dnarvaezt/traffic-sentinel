## ADDED Requirements

### Requirement: Project detail shows datasets tab by default
The system SHALL display the project detail with three tabs: Datasets (default), Configuración, and Filtros. Each tab renders its content inline on the same page.

#### Scenario: Navigate to project
- **WHEN** user clicks a project from the list
- **THEN** the system navigates to `/projects/[id]` and shows the Datasets tab

### Requirement: Datasets list shows uploaded CSV files
The system SHALL display all uploaded datasets in a table with search, sort by name/rows/columns/date, inline rename, favorite toggle, edit dialog, and delete.

#### Scenario: Upload CSV
- **WHEN** user clicks "Subir CSV" and selects a `.csv` file
- **THEN** the system uploads and processes the file, creates a Database entry, and refreshes the list

#### Scenario: Search datasets
- **WHEN** user types in the search input
- **THEN** the table filters to matching dataset names

#### Scenario: Open dataset detail
- **WHEN** user clicks a dataset name (or double-clicks)
- **THEN** the system navigates to `/projects/[id]/datasets/[datasetId]`

### Requirement: Empty dataset state guides user
The system SHALL show a guided empty state when no datasets exist, with a "Subir CSV" button and numbered steps.

#### Scenario: First visit with no datasets
- **WHEN** user visits project and no datasets exist
- **THEN** the system shows a centered card with upload button and step-by-step instructions

### Requirement: Filters tab shows CTA when no columns
The system SHALL show a "Define columnas en Configuración" CTA when no columns exist in the project config. When columns exist, it SHALL show the filter summary and "Gestionar Filtros" button.

#### Scenario: No columns defined
- **WHEN** user opens the Filtros tab and config columns are empty
- **THEN** the system shows a CTA linking to the config tab

#### Scenario: Columns exist
- **WHEN** user opens the Filtros tab and config columns exist
- **THEN** the system shows filter count summary and "Gestionar Filtros" button
