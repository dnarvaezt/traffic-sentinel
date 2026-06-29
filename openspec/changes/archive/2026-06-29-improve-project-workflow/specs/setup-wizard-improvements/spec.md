## ADDED Requirements

### Requirement: Wizard persists until fully completed
The setup wizard SHALL re-appear on the datasets tab until the user has both defined at least one config column AND uploaded at least one dataset. The wizard SHALL track completion via a `wizardCompleted` flag in the project entity.

#### Scenario: Dismissed wizard reappears
- **WHEN** user dismisses the wizard without defining columns or uploading data
- **THEN** the wizard reappears on next visit to the datasets tab

#### Scenario: Wizard hides after full completion
- **WHEN** user has defined columns AND uploaded a dataset
- **THEN** the wizard no longer appears

### Requirement: CSV column import creates first dataset
When the user loads columns from a CSV dataset in Configuración and the project has no databases yet, the system SHALL create a `Database` entry for that CSV in addition to loading its columns into the schema.

#### Scenario: First dataset from column load
- **WHEN** user clicks "Cargar desde dataset" in Configuración and confirms
- **THEN** the columns are loaded into the config AND a new database entry is created in the project

#### Scenario: Subsequent dataset imports
- **WHEN** user loads columns from a CSV and a database entry already exists
- **THEN** only the columns are updated, no duplicate database entry is created

### Requirement: Dashboard shows phased empty states
The dashboard SHALL display three distinct empty states depending on project state: (1) no columns defined — link to Configuración; (2) columns defined but no dataset — link to upload; (3) dataset exists but no widgets — create widget buttons.

#### Scenario: No columns defined
- **WHEN** user opens dashboard and `config.columns` is empty
- **THEN** dashboard shows "Define columnas en Configuración" with a link to the config tab

#### Scenario: Columns defined but no data
- **WHEN** user has columns but no datasets
- **THEN** dashboard shows "Sube un dataset para ver tus datos" with an upload button

#### Scenario: Ready for widgets
- **WHEN** user has columns and datasets but no dashboard widgets
- **THEN** dashboard shows "Crea tu primer widget" with widget type buttons
