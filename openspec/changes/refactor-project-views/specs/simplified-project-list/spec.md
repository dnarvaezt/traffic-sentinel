## ADDED Requirements

### Requirement: Project list shows all projects in a table
The system SHALL display all projects in a table with columns: name, description, dataset count, last updated, and actions.

#### Scenario: View project list
- **WHEN** user navigates to `/projects`
- **THEN** the system shows a table of all projects sorted by last updated descending

#### Scenario: Empty project list
- **WHEN** user navigates to `/projects` and no projects exist
- **THEN** the system shows a centered empty state with "Crea tu primer proyecto" button

### Requirement: Create project inline
The system SHALL allow creating a new project via an inline dialog without navigating away.

#### Scenario: Create project from list
- **WHEN** user clicks "Crear proyecto" button
- **THEN** a dialog opens with name and description fields
- **WHEN** user fills name and clicks "Crear"
- **THEN** a new project is created and user is redirected to `/projects/[id]`

### Requirement: Delete project from list
The system SHALL allow deleting a project from the list with a confirmation dialog.

#### Scenario: Delete project
- **WHEN** user clicks delete icon on a project row
- **THEN** a confirmation dialog appears
- **WHEN** user confirms
- **THEN** the project is removed and the list updates
