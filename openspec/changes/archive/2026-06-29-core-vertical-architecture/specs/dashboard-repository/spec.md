## ADDED Requirements

### Requirement: Dashboard repository port
The system SHALL define a `DashboardRepository` interface in the dashboard domain layer. The interface SHALL include `create`, `read`, `update`, `delete`, and `listByProject` methods.

#### Scenario: Repository contract
- **WHEN** a class implements `DashboardRepository`
- **THEN** it MUST provide all methods with the correct signatures

### Requirement: IndexedDB dashboard adapter
The system SHALL provide an `IndexedDbDashboardRepository` class in the infrastructure layer that implements `DashboardRepository` using IndexedDB.

#### Scenario: Create dashboard in IndexedDB
- **WHEN** `create(projectId, name)` is called
- **THEN** a new dashboard is stored in the "dashboards" object store with an empty widgets array

#### Scenario: Read dashboard
- **WHEN** `read(id)` is called with an existing dashboard ID
- **THEN** the dashboard (including all widgets) is returned

#### Scenario: Update dashboard widgets
- **WHEN** `update(id, { widgets })` is called
- **THEN** the dashboard's widgets array is replaced with the new value

#### Scenario: Delete dashboard
- **WHEN** `delete(id)` is called
- **THEN** the dashboard is removed from the "dashboards" store

#### Scenario: List dashboards by project
- **WHEN** `listByProject(projectId)` is called
- **THEN** all dashboards belonging to that project ID are returned

### Requirement: Dashboard list by project with index
The "dashboards" object store SHALL have an index on `projectId` to support efficient querying by project.

#### Scenario: Index lookup
- **WHEN** `listByProject(projectId)` is called
- **THEN** the adapter uses the `projectId` index instead of scanning all records
