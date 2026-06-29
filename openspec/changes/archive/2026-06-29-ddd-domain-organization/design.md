## Context

`src/core/` currently has 11 flat files: `project.ts`, `project.store.ts`, `dataset.ts`, `dataset.store.ts`, `dashboard.ts`, `dashboard.store.ts`, `schema.ts`, `column.ts`, `filter.ts`, `db.ts`, `index.ts`. Everything is at the same directory level — no structure screams the business domain.

## Goals / Non-Goals

**Goals:**
- Create `src/core/domain/` as the single home for all domain concepts
- Each domain gets two files: `project.ts` (entity + factory) and `project.repository.ts` (IndexedDB persistence)
- Shared value objects (`column.ts`, `filter.ts`) live inside `domain/` since they are domain concepts
- `db.ts` (IndexedDB client) stays at `src/core/` root as shared infrastructure
- Naming screams the business: `domain/project.ts`, `domain/dataset.ts`, `domain/dashboard.ts`, `domain/schema.ts`
- Barrel `index.ts` re-exports from `domain/` so existing `@/core` imports still work

**Non-Goals:**
- Do NOT create subdirectories inside `domain/` — one file per concept only
- Do NOT add port interfaces, adapter abstractions, or hexagonal layers
- Do NOT change any entity definitions, factory logic, or persistence behavior

## Decisions

1. **Flat files inside `domain/`** — Every domain concept is a single file directly in `src/core/domain/`. No subfolders per domain. Rationale: screaming architecture means the file list itself tells you what the system does.

2. **Entity + factory in one file** — `project.ts` exports both the `Project` interface and `createProject()` factory. Rationale: they change together, keeping them separate adds ceremony without benefit.

3. **Repository as a class, not an interface** — `project.repository.ts` exports `ProjectStore` directly. No `ProjectRepository` port interface. Rationale: single persistence strategy (IndexedDB), interface adds zero value.

4. **Value objects in `domain/`** — `column.ts` and `filter.ts` live inside `domain/` because they are domain value objects (`ColumnDefinition`, `FilterDefinition`), not infrastructure. Rationale: everything domain-related is in one place.

5. **`db.ts` stays at root** — The IndexedDB client is shared infrastructure, not domain. It stays at `src/core/db.ts`. Rationale: infrastructure doesn't belong in the domain folder.

## Risks / Trade-offs

- **[Breaking] Deep import paths change** — `@/core/project` → `@/core/domain/project`. Mitigation: barrel `index.ts` covers all exports. Only direct file imports break.
- **[Module coupling] Entity and repository in separate files** — If entity shape changes, the repository must update in sync. Mitigation: they're in the same directory, changes are visible together.
