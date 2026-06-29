## ADDED Requirements

### Requirement: Dataset repository port
The system SHALL define a `DatasetRepository` interface in the dataset domain layer. The interface SHALL include `create`, `read`, `update`, `delete`, and `listByProject` methods.

#### Scenario: Repository contract
- **WHEN** a class implements `DatasetRepository`
- **THEN** it MUST provide all methods with the correct signatures

### Requirement: IndexedDB dataset adapter
The system SHALL provide an `IndexedDbDatasetRepository` class in the infrastructure layer that implements `DatasetRepository` using IndexedDB.

#### Scenario: Create dataset in IndexedDB
- **WHEN** `create(projectId, name, rawData, columns)` is called
- **THEN** a new dataset is stored in the "datasets" object store

#### Scenario: Read dataset
- **WHEN** `read(id)` is called with an existing dataset ID
- **THEN** the full dataset (including `rawData`) is returned

#### Scenario: Update dataset metadata
- **WHEN** `update(id, { name, description, favorite })` is called
- **THEN** only the metadata fields are updated; `rawData` is never modified

#### Scenario: Delete dataset
- **WHEN** `delete(id)` is called
- **THEN** the dataset is removed from the "datasets" store

#### Scenario: List datasets by project
- **WHEN** `listByProject(projectId)` is called
- **THEN** all datasets belonging to that project ID are returned

### Requirement: Dataset list by project with index
The "datasets" object store SHALL have an index on `projectId` to support efficient querying by project.

#### Scenario: Index lookup
- **WHEN** `listByProject(projectId)` is called
- **THEN** the adapter uses the `projectId` index instead of scanning all records
