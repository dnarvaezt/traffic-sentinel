## ADDED Requirements

### Requirement: IndexedDB client
The system SHALL provide a shared `IndexedDbClient` class that manages the database connection lifecycle, schema versioning, and object store creation.

#### Scenario: Open connection
- **WHEN** `IndexedDbClient` is instantiated with a database name and version
- **THEN** it opens (or creates) the IndexedDB database and runs schema migration if needed

#### Scenario: Schema migration
- **WHEN** the database version is incremented
- **THEN** `onUpgradeNeeded` creates or deletes object stores to match the new schema

### Requirement: Object store configuration
The `IndexedDbClient` SHALL accept a configuration of object stores (name, key path, optional indexes) and create them during schema upgrade.

#### Scenario: Create object store
- **WHEN** the client configuration includes a store named "projects" with keyPath "id"
- **THEN** the database has a "projects" object store keyed by "id"

#### Scenario: Create index
- **WHEN** the store configuration includes an index `{ name: "by_name", keyPath: "name" }`
- **THEN** the store has a non-unique index named "by_name" on the "name" field

### Requirement: Transaction helper
The `IndexedDbClient` SHALL provide a typed `transaction<R>(storeName, mode, callback)` method that wraps IndexedDB transaction boilerplate.

#### Scenario: Read transaction
- **WHEN** a read transaction is requested on "projects"
- **THEN** the callback receives the object store and the method returns the result

#### Scenario: Write transaction
- **WHEN** a write transaction is requested on "projects"
- **THEN** changes are committed on success and rolled back on error

### Requirement: Singleton pattern
The `IndexedDbClient` SHALL be instantiated once and reused across all repository adapters.

#### Scenario: Single connection
- **WHEN** multiple repository adapters request the client
- **THEN** they all share the same IndexedDB connection
