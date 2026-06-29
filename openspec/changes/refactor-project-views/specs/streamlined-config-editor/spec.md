## ADDED Requirements

### Requirement: Config editor shows tabbed interface
The system SHALL display a tabbed config editor with tabs: Columnas, Virtuales, Validaciones, Filtros, Agrupaciones, Transformaciones. Non-Columnas tabs SHALL be disabled when no columns exist.

#### Scenario: No columns defined
- **WHEN** user opens Configuración and no columns exist
- **THEN** only the Columnas tab is active; all other tabs are disabled with hint text

#### Scenario: Columns exist
- **WHEN** user defines at least one column
- **THEN** all tabs become active

### Requirement: Column editor supports CRUD
The system SHALL allow creating, editing, and deleting columns with fields: name, label, type, format, and alignment.

#### Scenario: Create column
- **WHEN** user clicks "Agregar Columna" and fills the dialog
- **THEN** a new column is added to the list

#### Scenario: Edit column
- **WHEN** user clicks "Editar" on a column row
- **THEN** the dialog opens with pre-filled values; saving updates the column

#### Scenario: Delete column
- **WHEN** user clicks the trash icon on a column row
- **THEN** the column is removed from the list

### Requirement: Load columns from existing dataset
The system SHALL provide a "Cargar desde dataset" button that opens a dialog listing available datasets. Selecting one loads its column definitions into the config.

#### Scenario: Load from dataset
- **WHEN** user clicks "Cargar desde dataset" and selects a dataset
- **THEN** the columns are populated from the dataset's inferred schema
