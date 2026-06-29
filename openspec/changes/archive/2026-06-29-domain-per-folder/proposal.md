## Why

`src/core/domain/` has all files mixed together at the same level. Each domain concept (project, dataset, dashboard) should scream its existence through its own folder. Adding consistent per-domain files — `interface.ts` for the entity, `repository.ts` for persistence, `provider.ts` as a factory, and `index.ts` for the barrel — makes each domain self-contained and easy to understand at a glance.

## What Changes

- **BREAKING**: Remove `src/core/domain/` flat directory
- Create per-domain folders: `project/`, `dataset/`, `dashboard/`, `schema/`, `column/`, `filter/`
- Each domain folder contains:
  - `interface.ts` — entity interface + factory function
  - `repository.ts` — IndexedDB persistence class (only for domains with persistence: project, dataset, dashboard)
  - `provider.ts` — factory function that creates and returns the repository instance
  - `index.ts` — barrel export for that domain
- `db.ts` stays at `src/core/` root as shared infrastructure
- Root `index.ts` re-exports all domains

## Capabilities

### New Capabilities
- `domain-per-folder`: Each domain has its own folder with interface, repository, provider, and barrel

## Impact

- All modules importing from `@/core` still work via updated barrel
- Deep imports from `@/core/domain/project` break — must use `@/core/project` or domain barrel
- No change to entity definitions, factory logic, or persistence behavior
