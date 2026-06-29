## ADDED Requirements

### Requirement: Navigate to project detail
The system SHALL allow users to click on a project name in the list and navigate to `/projects/[id]`.

#### Scenario: Click project
- **WHEN** a user clicks a project name in the list
- **THEN** the browser navigates to `/projects/<project-id>`

### Requirement: Project detail page
The system SHALL display the project name, description, and creation date at `/projects/[id]`.

#### Scenario: View project
- **WHEN** a user navigates to `/projects/<existing-id>`
- **THEN** the page shows the project name, description, and creation date

#### Scenario: Project not found
- **WHEN** a user navigates to `/projects/<non-existing-id>`
- **THEN** the page shows a "Project not found" message

### Requirement: Back navigation
The detail page SHALL include a way to navigate back to the project list.

#### Scenario: Back to list
- **WHEN** a user clicks "Back" or "Volver"
- **THEN** the browser navigates to `/`
