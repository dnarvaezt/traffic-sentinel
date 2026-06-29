## ADDED Requirements

### Requirement: Domain folder structure
The system SHALL organize all domain concepts under `src/core/domain/`. Each domain concept SHALL be a single file named after the business concept (e.g., `project.ts`, `dataset.ts`, `dashboard.ts`). Shared domain value objects SHALL also live in `domain/` (e.g., `column.ts`, `filter.ts`).

#### Scenario: File list
- **WHEN** looking at `src/core/domain/`
- **THEN** all files are directly in that directory — no subdirectories

### Requirement: Entity + factory per domain
Each domain file SHALL export both the entity interface and its factory function.

#### Scenario: Project domain
- **WHEN** opening `src/core/domain/project.ts`
- **THEN** it exports `Project` interface and `createProject()` factory function

### Requirement: Repository per domain
Each main domain (project, dataset, dashboard) SHALL have a corresponding repository file named `<domain>.repository.ts` inside `domain/`. The repository SHALL be a class with IndexedDB persistence — no port interface, no abstraction.

#### Scenario: Project repository
- **WHEN** opening `src/core/domain/project.repository.ts`
- **THEN** it exports `ProjectStore` class with `create`, `read`, `update`, `delete`, `list` methods

### Requirement: Shared infrastructure at root
The IndexedDB client (`db.ts`) SHALL stay at `src/core/` root, NOT inside `domain/`.

#### Scenario: Infrastructure location
- **WHEN** looking for the database client
- **THEN** it is at `src/core/db.ts`, not inside `domain/`
