## Why

`src/core/` is completely flat — 11 files mixed together with no domain boundary. Entity definitions, persistence logic, and shared value objects all live at the same level. The code doesn't scream its business intent. A `domain/` folder with vertical DDD organization makes each business concept visible and self-contained.

## What Changes

- **BREAKING**: Create `src/core/domain/` folder containing all domain concepts
- Place each domain in its own file: `project.ts`, `dataset.ts`, `dashboard.ts`, `schema.ts`, plus shared value objects `column.ts`, `filter.ts`
- Each domain file contains its **entity interface + factory** (the domain model)
- Each domain has a matching **repository file**: `project.repository.ts`, `dataset.repository.ts`, `dashboard.repository.ts`
- Repositories are simple classes with IndexedDB persistence directly inside — no port interfaces, no abstractions
- Shared infrastructure (`db.ts`) stays at `src/core/` root alongside `index.ts`
- No subdirectories inside `domain/` — just flat files named by domain concept (screaming architecture)

## Capabilities

### New Capabilities
- `ddd-domain-organization`: Domain folder with entity + repository files, screaming architecture naming, no ports/adapters

### Modified Capabilities

None — purely structural reorganization of existing code.

## Impact

- Flat `src/core/*.ts` files move under `src/core/domain/` (except `db.ts` and `index.ts`)
- Deep imports like `@/core/project` become `@/core/domain/project` — **BREAKING** for any code importing from non-barrel paths
- Barrel `index.ts` preserves the same public API so downstream modules still work via `@/core`
- `InMemoryProjectRepository` is already deleted in previous change — no impact
