## Context

`src/core/domain/` currently holds 10 flat files: 5 entity files, 3 repository files, and 2 value object files — all mixed alphabetically. There's no folder-level grouping per domain. Each domain's pieces are scattered across the file list.

## Goals / Non-Goals

**Goals:**
- Each domain gets its own folder: `project/`, `dataset/`, `dashboard/`, `schema/`, `column/`, `filter/`
- Each folder contains: `interface.ts`, `repository.ts` (if persistence needed), `provider.ts` (factory), `index.ts` (barrel)
- `provider.ts` is a factory function that creates and returns the repository instance
- Shared infrastructure (`db.ts`) stays at `src/core/` root
- Root `index.ts` re-exports all domains so `@/core` imports still work

**Non-Goals:**
- Do NOT change entity definitions, factory logic, or persistence behavior
- Do NOT add React Context providers or any UI coupling

## Decisions

1. **Per-domain folders** — Each domain is a folder. The folder name screams the business concept. Inside, files follow a consistent pattern: `interface.ts` (what it is), `repository.ts` (how it's stored), `provider.ts` (how to get it), `index.ts` (exports).

2. **Provider as factory** — `provider.ts` exports a function like `createProjectRepository(): ProjectStore` that instantiates the repository with the shared IndexedDB client. Rationale: the caller doesn't need to know how to wire dependencies. Simple, explicit, testable.

3. **Value objects don't need repository/provider** — `column/` and `filter/` only have `interface.ts` + `index.ts` since they are pure value objects with no persistence. `schema/` also only has `interface.ts` + `index.ts` since it's embedded in Project.

4. **Consistent file naming** — Every domain uses the same file names: `interface.ts`, `repository.ts`, `provider.ts`, `index.ts`. Rationale: predictable navigation — open any domain folder and you know exactly what each file does.

## Risks / Trade-offs

- **[Breaking] Deep import paths** — `@/core/domain/project` → `@/core/project/interface` or `@/core/project`. Mitigation: barrel exports at both domain level and root level.
- **[Noise] Value object folders** — Simple types like `ColumnDefinition` get their own folder with only 2 files. Mitigation: consistency across all domains is worth the minimal overhead.
