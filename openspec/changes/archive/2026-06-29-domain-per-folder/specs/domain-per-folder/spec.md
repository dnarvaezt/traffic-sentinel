## ADDED Requirements

### Requirement: Per-domain folder structure
The system SHALL organize each domain into its own folder under `src/core/`. Each domain folder SHALL contain files named consistently: `interface.ts`, `repository.ts` (if needed), `provider.ts` (if needed), and `index.ts`.

#### Scenario: Project folder
- **WHEN** looking at `src/core/project/`
- **THEN** it contains `interface.ts`, `repository.ts`, `provider.ts`, and `index.ts`

#### Scenario: Value object folder
- **WHEN** looking at `src/core/column/`
- **THEN** it contains only `interface.ts` and `index.ts`

### Requirement: interface.ts
Each domain's `interface.ts` SHALL export the entity interface and its factory function.

#### Scenario: Project interface
- **WHEN** opening `src/core/project/interface.ts`
- **THEN** it exports `Project` interface and `createProject()` factory

### Requirement: repository.ts
Domains that require persistence SHALL have a `repository.ts` exporting a class that implements IndexedDB CRUD operations.

#### Scenario: Project repository
- **WHEN** opening `src/core/project/repository.ts`
- **THEN** it exports `ProjectStore` class with `create`, `read`, `update`, `delete`, `list` methods

### Requirement: provider.ts
Domains with persistence SHALL have a `provider.ts` exporting a factory function that creates and returns the repository instance.

#### Scenario: Project provider
- **WHEN** opening `src/core/project/provider.ts`
- **THEN** it exports `createProjectRepository()` function that returns a `ProjectStore` instance

### Requirement: Domain barrel
Each domain folder SHALL have an `index.ts` that re-exports all public symbols from that domain.

#### Scenario: Project barrel
- **WHEN** importing from `@/core/project`
- **THEN** all `Project`, `createProject`, `ProjectStore`, `createProjectRepository` are available
