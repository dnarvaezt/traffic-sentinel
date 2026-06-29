## Context

`src/core/` is empty after cleaning stale files. The app currently relies on:
- Inline types in `src/modules/project/project.entity.ts` (git-deleted)
- Data-import types in `src/core/data-import/` (also git-deleted)
- Ad-hoc Zustand stores that mix domain state with UI state

We need a proper domain layer with clear entity boundaries, relationships, and persistence interfaces — before reconnecting the UI modules.

## Goals / Non-Goals

**Goals:**
- Define `Project`, `Schema`, `ColumnDefinition`, `Dataset`, `Dashboard` as core domain entities in `src/core/`
- Enforce invariants: 1 schema per project, N datasets per project, N dashboards per project
- Support column ordering, types, validators, transformers, and calculated formulas on Schema
- Repository pattern for Project CRUD with list/search/paginate/filter
- Datasets hold raw CSV data + reference a schema; processed view is computed at runtime
- Dashboards have a collected schema reference and contain widgets that render data from any project dataset

**Non-Goals:**
- Do NOT reconnect UI modules — that's a follow-up change
- Do NOT implement actual persistence (IndexedDB, API) — define repository interfaces only
- Do NOT implement the import/pipeline engine — that exists in `src/core/data-import/` (now git-deleted, will be reintegrated later)
- Do NOT implement widget rendering logic — define the widget model only

## Decisions

1. **Flat entity files over hexagonal layers** — `src/core/project.entity.ts`, `src/core/schema.entity.ts`, etc. The existing project convention used flat files (`*.entity.ts`, `*.service.ts`, `*.repository.ts`). We follow this pattern rather than introducing nested `domain/`, `application/`, `infrastructure/` subdirs. Rationale: simpler navigation, matches established patterns.

2. **Repository interfaces for all CRUD** — Define `ProjectRepository` as an interface in `src/core/ports/`. Implementations (IndexedDB, in-memory, API) live outside the domain layer. Rationale: keeps domain pure, enables testing.

3. **Schema columns as an ordered list** — `Schema.columns` is a `ColumnDefinition[]` where array order IS the display order. Each column has an `id`, `header`, `type`, optional `kind` (source/virtual), `sourceColumn` (for mapping from CSV), `validators`, `transformers`, and `calculate` (formula string). Rationale: matches user requirement of fully customizable column ordering and configuration.

4. **Dataset stores raw data + schema ID** — A `Dataset` has `rawData: Record<string, unknown>[]` (as parsed from CSV) plus a reference to the project's schema. The transformed/validated/calculated view is computed on read via the pipeline service. Rationale: separation of concerns — raw data is immutable, schema provides the interpretation.

5. **Dashboards reference a schema, not a dataset** — A `Dashboard` has a `schema` reference (the project schema at the time of creation or a snapshot). Widgets on the dashboard specify which dataset to render from. Rationale: enables cross-dataset dashboards.

6. **TypeScript interfaces over classes** — Domain entities are `interface` + factory functions, not classes. Rationale: aligns with existing codebase conventions, simpler, better tree-shaking.

## Risks / Trade-offs

- **[Performance] Computed view on every read** — Transformed/calculated data is not pre-materialized. Mitigation: pipeline results are cached in IndexedDB (via existing pipeline.repository.ts pattern). Future: materialized views.
- **[Migration] Existing modules import from deleted paths** — `@/core/project` and `@/core/dataset` are already deleted. Mitigation: this change creates new entities; a follow-up change reconnects imports.
- **[Complexity] Validators and transformers are string-encoded** — Formulas in `calculate` use `new Function()`. Mitigation: proven pattern from existing codebase; sandboxed in the import engine.
