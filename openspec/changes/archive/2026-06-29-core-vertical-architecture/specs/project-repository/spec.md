## ADDED Requirements

### Requirement: Project repository port
The system SHALL define a `ProjectRepository` interface in the project domain layer. The interface SHALL include `create`, `read`, `update`, `delete`, and `list` methods.

#### Scenario: Repository contract
- **WHEN** a class implements `ProjectRepository`
- **THEN** it MUST provide all five methods with the correct signatures

### Requirement: IndexedDB project adapter
The system SHALL provide an `IndexedDbProjectRepository` class in the infrastructure layer that implements `ProjectRepository` using IndexedDB.

#### Scenario: Create project in IndexedDB
- **WHEN** `create(name, description)` is called
- **THEN** a new project is stored in the "projects" object store and returned

#### Scenario: Read project from IndexedDB
- **WHEN** `read(id)` is called with an existing ID
- **THEN** the project is retrieved from the "projects" store

#### Scenario: Read non-existent project
- **WHEN** `read(id)` is called with a non-existing ID
- **THEN** `undefined` is returned

#### Scenario: Update project in IndexedDB
- **WHEN** `update(id, { name })` is called
- **THEN** the project in the "projects" store is updated with the new name and `updatedAt` refreshed

#### Scenario: Delete project from IndexedDB
- **WHEN** `delete(id)` is called
- **THEN** the project is removed from the "projects" store and `true` is returned

#### Scenario: Delete non-existent project
- **WHEN** `delete(id)` is called with a non-existing ID
- **THEN** `false` is returned

### Requirement: List with pagination and filtering
The `list` method SHALL support `page`, `pageSize`, `search` (by name), `filter` (by date range, hasDatasets), `sortBy`, and `sortOrder` parameters. Since IndexedDB lacks advanced query support, the adapter SHALL load all projects and apply search/filter/sort in memory.

#### Scenario: List first page
- **WHEN** `list({ page: 1, pageSize: 10 })` is called with 25 projects
- **THEN** 10 projects are returned with `total: 25`

#### Scenario: Search by name
- **WHEN** `list({ search: "sales" })` is called
- **THEN** only projects whose name contains "sales" (case-insensitive) are returned

#### Scenario: Sort by name ascending
- **WHEN** `list({ sortBy: "name", sortOrder: "asc" })` is called
- **THEN** projects are returned in alphabetical order

#### Scenario: Filter by date range
- **WHEN** `list({ filter: { createdAfter: Date("2026-01-01"), createdBefore: Date("2026-06-30") } })` is called
- **THEN** only projects created within that range are returned
