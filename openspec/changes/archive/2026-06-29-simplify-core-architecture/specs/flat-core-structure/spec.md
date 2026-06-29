## REMOVED Requirements

### Requirement: Vertical slice folder structure
**Reason**: Replaced by flat file structure for simpler navigation.
**Migration**: All types are now re-exported from `src/core/index.ts`. Use `@/core/<name>` instead of deep paths.

## ADDED Requirements

### Requirement: Flat file layout
The system SHALL organize `src/core/` as a flat list of files directly in the root directory. Each domain concept SHALL be a single file or a pair of files (`*.ts` + `*.store.ts`).

#### Scenario: File list
- **WHEN** looking at `src/core/`
- **THEN** all files are at the root level with no subdirectories

### Requirement: File naming convention
Domain entity files SHALL be named after the domain concept (e.g., `project.ts`, `dataset.ts`, `dashboard.ts`). Persistence files SHALL use the `.store.ts` suffix (e.g., `project.store.ts`). The shared IndexedDB client SHALL be `db.ts`.

#### Scenario: Entity files
- **WHEN** a developer needs to work with projects
- **THEN** they open `src/core/project.ts`

#### Scenario: Store files
- **WHEN** a developer needs to read/write projects from IndexedDB
- **THEN** they open `src/core/project.store.ts`

### Requirement: Barrel export compatibility
The `src/core/index.ts` SHALL re-export all public types, factories, and store classes using the same names as before for backward compatibility.

#### Scenario: Existing imports work
- **WHEN** a module imports `{ Project, createProject }` from `@/core`
- **THEN** the imports resolve correctly from the new flat structure
