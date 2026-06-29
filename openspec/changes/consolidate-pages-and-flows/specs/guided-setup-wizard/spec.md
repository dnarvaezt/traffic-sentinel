## ADDED Requirements

### Requirement: New projects show guided setup wizard
When a project has no datasets and no configuration, the system SHALL display a step-by-step setup wizard instead of an empty dataset list. The wizard SHALL guide the user through: 1) Configure columns (Schema), 2) Upload a CSV dataset, 3) Create a dashboard widget.

#### Scenario: New project shows wizard
- **WHEN** user creates a new project
- **THEN** the project page shows a 3-step setup wizard card
- **WHEN** user completes all 3 steps
- **THEN** the wizard is dismissed and the normal dataset list is shown

#### Scenario: Wizard step 1 — Configure
- **WHEN** user clicks "Configurar columnas" in step 1
- **THEN** navigation switches to the Configuración tab

#### Scenario: Wizard step 2 — Upload
- **WHEN** user clicks "Subir CSV" in step 2
- **THEN** the file upload dialog opens

#### Scenario: Wizard step 3 — Dashboard
- **WHEN** user clicks "Crear dashboard" in step 3
- **THEN** navigation switches to the Dashboard tab

### Requirement: Wizard can be dismissed
The user SHALL be able to dismiss the wizard at any time and use the normal interface.

#### Scenario: Dismiss wizard
- **WHEN** user clicks "Omitir" on the wizard
- **THEN** the wizard is dismissed permanently for that project
