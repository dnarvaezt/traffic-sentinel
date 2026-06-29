## Why

`src/core/` currently has flat entity files with an in-memory repository — no vertical separation, no real persistence, no dependency inversion. The app needs a scalable architecture where each bounded context (Project, Dataset, Dashboard, Schema) is independently understandable and persistence can be swapped without touching domain logic.

## What Changes

- **BREAKING**: Replace flat `src/core/*.entity.ts` files with vertical slice folders per bounded context
- Each context gets `domain/`, `application/`, `infrastructure/` layers (hexagonal/DDD)
- IndexedDB repository implementations replace in-memory for all entities
- `InMemoryProjectRepository` — keep as test-only, mark deprecated for production
- `ProjectRepository` interface moves into its respective domain layer (`project/domain/ports/`)
- New `IndexedDbClient` as a shared infrastructure concern (connection management, schema upgrade)
- Dependency inversion: domain defines ports, infrastructure provides adapters, application orchestrates

## Capabilities

### New Capabilities
- `indexeddb-persistence`: IndexedDB client, schema setup, connection lifecycle, and typed repository base
- `project-repository`: Project CRUD with IndexedDB implementation behind domain port
- `dataset-repository`: Dataset CRUD with IndexedDB implementation behind domain port
- `dashboard-repository`: Dashboard CRUD with IndexedDB implementation behind domain port

### Modified Capabilities
- `project-lifecycle`: (from `core-domain-models`) — repository is now IndexedDB-backed; search/filter/sort/pagination are delegated to database queries for performance

## Impact

- Entire `src/core/` is restructured — all existing flat files (`column.entity.ts`, `project.entity.ts`, `dataset.entity.ts`, `dashboard.entity.ts`, `schema.entity.ts`, `filter.entity.ts`, `index.ts`, `ports/`) are removed
- Barrel at `src/core/index.ts` must maintain the same public API to not break downstream modules
- UI modules (`src/modules/`) that import from `@/core/` will still work if barrel is preserved
- InMemoryProjectRepository kept but deprecated (for test use only)
