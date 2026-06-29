## Context

`src/core/` has 17 files across 4 directory levels: `project/domain/`, `project/infrastructure/`, `dataset/domain/ports/`, `shared/infrastructure/indexeddb/`, etc. Each bounded context is split into entity, port interface, and adapter class — unnecessary indirection for a client-only app with one persistence strategy (IndexedDB).

## Goals / Non-Goals

**Goals:**
- Flatten to a single directory level: all files directly in `src/core/`
- Merge entity + factory into flat files like `project.ts`, `dataset.ts`, `dashboard.ts`
- Merge persistence into flat `*.store.ts` files that directly export the class (no port interface)
- Remove `project/`, `dataset/`, `dashboard/`, `schema/`, `shared/` directory trees
- Merge `indexeddb-client.ts` and `store-config.ts` into a single `db.ts`
- Barrel `index.ts` preserves the same public API for downstream modules

**Non-Goals:**
- Do NOT change any entity definitions, factory logic, or persistence behavior
- Do NOT modify downstream modules (`src/modules/`) — they import through `@/core` barrel

## Decisions

1. **Flat files over nested folders** — Every file lives directly in `src/core/`. The name screams the domain: `project.ts`, `dataset.ts`, `dashboard.ts`, `schema.ts`, `column.ts`, `filter.ts`, `db.ts`. Rationale: maximum navigability, minimum ceremony.

2. **No port interfaces** — `ProjectRepository`, `DatasetRepository`, `DashboardRepository` interfaces are removed. Each `.store.ts` class IS the API. Rationale: only one implementation exists (IndexedDB), so the interface adds zero value.

3. **Persistence in `*.store.ts` files** — `project.store.ts`, `dataset.store.ts`, `dashboard.store.ts` contain the full IndexedDB persistence logic. Rationale: keeps entity files clean while clearly separating read/write concerns by file name.

4. **Single `db.ts`** — Combines `IndexedDbClient` class, singleton getter, and store configs into one file. Rationale: 30 lines total, no need for two files.

5. **In-memory removed** — `InMemoryProjectRepository` is deleted. Rationale: testing can use IndexedDB in-memory via fake-indexeddb npm package if needed. The deprecated in-memory class is dead code.

## Risks / Trade-offs

- **[Breaking] Deep import paths break** — Code importing `@/core/project/domain/project.entity` will fail. Mitigation: barrel `index.ts` covers all common imports; announce the change. Only internal `openspec/` docs reference deep paths.
- **[Module coupling] Entity and persistence in separate files** — If entity shape changes, the store file must be updated in sync. Mitigation: they're in the same directory, visible together. Minimal risk.
