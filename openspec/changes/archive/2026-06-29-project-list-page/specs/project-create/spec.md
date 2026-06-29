## ADDED Requirements

### Requirement: Create project dialog
The system SHALL provide a dialog/button to create a new project. The dialog SHALL have a name field (required) and description field (optional).

#### Scenario: Create project
- **WHEN** a user fills in the name "Sales Q1" and clicks "Create"
- **THEN** a new project is persisted via ProjectStore and appears in the list

#### Scenario: Validation
- **WHEN** a user clicks "Create" with an empty name
- **THEN** the button is disabled or an error message is shown
