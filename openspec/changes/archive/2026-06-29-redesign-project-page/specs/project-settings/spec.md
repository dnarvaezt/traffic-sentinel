## ADDED Requirements

### Requirement: User can access project settings from a dedicated section
The system SHALL provide a project settings section accessible from a gear icon in the page header or from the sidebar. The settings section SHALL show options for editing project name, description, and deleting the project.

#### Scenario: Open settings section
- **WHEN** user clicks the gear icon in the page header
- **THEN** the settings section opens with editable name and description fields

### Requirement: User can edit project name and description
The settings section SHALL allow editing the project name and description with save/cancel controls.

#### Scenario: Save project name
- **WHEN** user edits the project name and clicks "Save"
- **THEN** the project name is updated in the Zustand store
- **THEN** the sidebar header reflects the new name

#### Scenario: Cancel project edit
- **WHEN** user edits the project name and clicks "Cancel"
- **THEN** the name reverts to its previous value

### Requirement: User can delete a project with confirmation
The settings section SHALL include a "Delete Project" button that shows a confirmation dialog. The dialog SHALL show the project name and number of datasets to be deleted.

#### Scenario: Delete project
- **WHEN** user clicks "Delete Project" in settings
- **THEN** a confirmation dialog shows: "¿Estás seguro? Se eliminarán X datasets."
- **WHEN** user confirms deletion
- **THEN** the project and all its datasets are deleted
- **THEN** the user is redirected to the projects list page

### Requirement: User can export all project data
The settings section SHALL provide an "Export All Data" option that downloads a ZIP with all CSV files and configuration as JSON.

#### Scenario: Export project data
- **WHEN** user clicks "Export All Data"
- **THEN** a ZIP file is downloaded containing all datasets as CSV files and project configuration as JSON
