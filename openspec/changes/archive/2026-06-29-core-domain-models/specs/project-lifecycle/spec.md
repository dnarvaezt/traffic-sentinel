## ADDED Requirements

### Requirement: Project entity
The system SHALL define a `Project` entity with the following fields: `id` (string), `name` (string), `description` (optional string), `createdAt` (Date), `updatedAt` (Date).

### Requirement: Create project
The system SHALL allow creating a new project with a unique ID, name, and optional description. A new project SHALL have an empty schema and no datasets.

#### Scenario: Create a basic project
- **WHEN** a user creates a project with name "Sales Data" and no description
- **THEN** a new project is created with `id`, `name: "Sales Data"`, `description: undefined`, `createdAt` set to current time, `schema.columns` empty, `datasets` empty, `dashboards` empty

#### Scenario: Create project with description
- **WHEN** a user creates a project with name "Sales Data" and description "Monthly sales reports"
- **THEN** the project has `description: "Monthly sales reports"`

### Requirement: Read project
The system SHALL allow retrieving a project by its ID.

#### Scenario: Get existing project
- **WHEN** a user retrieves a project by its existing ID
- **THEN** the system returns the full project entity

#### Scenario: Get non-existent project
- **WHEN** a user retrieves a project by a non-existing ID
- **THEN** the system returns `undefined`

### Requirement: Update project
The system SHALL allow updating a project's name and description. The `updatedAt` field SHALL be set to the current time on update.

#### Scenario: Update project name
- **WHEN** a user updates a project's name from "Old" to "New"
- **THEN** the project name changes, and `updatedAt` is refreshed

### Requirement: Delete project
The system SHALL allow deleting a project by its ID. Deleting a project SHALL cascade to all its datasets and dashboards.

#### Scenario: Delete existing project
- **WHEN** a user deletes a project by its ID
- **THEN** the project and all its datasets and dashboards are removed

### Requirement: List projects with pagination
The system SHALL support listing projects with pagination: `page` (1-indexed) and `pageSize` parameters. The system SHALL return the total count and the requested page of results.

#### Scenario: List first page
- **WHEN** a user lists projects with `page: 1`, `pageSize: 10` and there are 25 projects
- **THEN** the system returns 10 projects and `total: 25`

#### Scenario: List empty page
- **WHEN** a user lists projects with `page: 5`, `pageSize: 10` and there are 25 projects
- **THEN** the system returns an empty array and `total: 25`

### Requirement: Search projects
The system SHALL support searching projects by name (case-insensitive substring match).

#### Scenario: Search by name
- **WHEN** a user searches projects with query "sales"
- **THEN** the system returns projects whose name contains "sales" (case-insensitive)

### Requirement: Filter projects
The system SHALL support filtering projects by `createdAt` range and by whether they have datasets.

#### Scenario: Filter by date range
- **WHEN** a user filters projects with `createdAfter: "2026-01-01"` and `createdBefore: "2026-06-30"`
- **THEN** the system returns projects created within that date range

#### Scenario: Filter by has datasets
- **WHEN** a user filters projects with `hasDatasets: true`
- **THEN** the system returns only projects that have at least one dataset

### Requirement: Sort projects
The system SHALL support sorting projects by `name`, `createdAt`, `updatedAt`, or `datasetCount` in ascending or descending order.

#### Scenario: Sort by name ascending
- **WHEN** a user lists projects with `sortBy: "name"`, `sortOrder: "asc"`
- **THEN** the system returns projects ordered alphabetically by name

### Requirement: ProjectRepository interface
The system SHALL define a `ProjectRepository` interface with methods for all CRUD, list, search, filter, and pagination operations.

#### Scenario: Interface contract
- **WHEN** a repository implements `ProjectRepository`
- **THEN** it MUST provide `create`, `read`, `update`, `delete`, `list`, `search`, `filter` methods matching the defined signatures
