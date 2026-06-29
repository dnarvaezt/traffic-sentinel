## Context

`src/core/` currently holds flat entity files (`project.entity.ts`, `dataset.entity.ts`, etc.), a `ports/` folder with a repository interface, and an in-memory implementation. There is no vertical separation — all domain types are mixed at the root, infrastructure is minimal, and persistence (IndexedDB) does not exist.

The app needs IndexedDB for real persistence, screaming architecture where folder names reveal intent, and clean dependency inversion so the database can be swapped without touching domain logic.

## Goals / Non-Goals

**Goals:**
- Vertical slice folders per bounded context: `project/`, `dataset/`, `dashboard/`, `schema/`, `shared/`
- Each slice has `domain/`, `application/`, `infrastructure/` layers
- `domain/` contains entities, value objects, and port interfaces (pure, zero infrastructure imports)
- `application/` contains use cases / services that orchestrate domain + ports
- `infrastructure/` contains IndexedDB adapters that implement the domain ports
- Shared IndexedDB client in `shared/infrastructure/indexeddb/` that handles connection lifecycle, schema migration, and provides a base repository class
- Full dependency inversion: domain → port ← infrastructure adapter
- Bluk delete old flat files; barrel re-exports preserve the public API

**Non-Goals:**
- Do NOT migrate UI modules (`src/modules/`) — those remain unchanged
- Do NOT optimize IndexedDB query performance beyond what's reasonable (simple key-value lookups + in-memory filter/sort)
- Do NOT add offline sync, conflict resolution, or multi-tab support

## Decisions

1. **Vertical slice over flat layers** — Each bounded context (`project`, `dataset`, `dashboard`) gets its own `domain/`, `application/`, `infrastructure/` subdirectories. A shared `schema/` context is created since Schema belongs to a Project but is also a distinct bounded concept (it has its own validation rules). Rationale: cohesive code that's easy to navigate by feature rather than by technical concern.

2. **Ports in domain, adapters in infrastructure** — `ProjectRepository` interface lives in `project/domain/ports/project-repository.ts`. The IndexedDB implementation lives in `project/infrastructure/project-repository.indexeddb.ts`. Rationale: domain never imports from infrastructure; swapping databases means writing a new adapter.

3. **Shared IndexedDB client** — A base `IndexedDbClient` class in `shared/infrastructure/indexeddb/indexeddb-client.ts` manages the database connection, schema versioning, and object store creation. Each repository adapter receives or creates the client. Rationale: single source of truth for schema migrations (add/remove stores across versions).

4. **Barrel compatibility** — `src/core/index.ts` re-exports everything from the new structure using the same names as before. Modules importing from `@/core` continue to work without changes. Rationale: zero migration cost for downstream modules.

5. **InMemory kept for tests** — The `InMemoryProjectRepository` stays under `project/infrastructure/` (or `project/adapters/`) but is marked `@deprecated` for production use. Rationale: useful for unit tests without a browser environment.

6. **No classes for entities** — Domain entities remain TypeScript `interface` + factory functions (established pattern from existing codebase). Application services and infrastructure adapters use classes.

## Risks / Trade-offs

- **[Migration] Bluk file deletion** — All current flat files are deleted in one task. If the barrel re-export has a mistake, all downstream modules break. Mitigation: implement barrel LAST, after all files are in place, and verify with `tsc --noEmit`.
- **[Complexity] IndexedDB async everywhere** — All repository methods become `async`. Callers must handle promises. Mitigation: established pattern in the app (existing `pipeline.repository.ts` already uses async IndexedDB).
- **[Perf] In-memory filter for complex queries** — IndexedDB is used for key-value CRUD; search, filter, and sort are done in memory after loading. Mitigation: acceptable for client-side data volumes (<100K rows per dataset). Future: IndexedDB indexes for common queries.
