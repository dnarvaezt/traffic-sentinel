## Context

The codebase has two parallel systems: a generic **data-import engine** (`src/data-import/`) with a powerful declarative pipeline (parse → map → transform → validate → calculate → filter → group) but no persistence — it runs in-memory on the demo page. And a **project system** (`src/core/project/`, `src/modules/project/`) with full CRUD, IndexedDB persistence, and a Zustand store — but its CSV import path uses a simple Danfo.js parser with no schema-driven pipeline.

The data-import engine's `SchemaDefinition` and the project entity's `Schema` share similar concepts but are separate types. No mechanism exists to persist processed data or project configurations. Users must hardcode configs to test the pipeline.

## Goals / Non-Goals

**Goals:**
- Extend the project entity/store to hold a full `SchemaDefinition` (columns, validators, filters, groups, calculations, transformers)
- Replace the project's basic CSV import with the generic data-import `ImportEngine`
- Add persistence for both raw and processed data using the existing IndexedDB repository
- Build a schema configuration UI as part of the project detail page
- Build an interactive data viewer within the project context that supports live filtering, grouping, virtual columns, and validation errors
- Keep the existing `/data-import-demo` page working

**Non-Goals:**
- Migrate the project's existing Danfo.js query engine or chart widgets — they remain for post-import analysis
- Real-time collaboration or multi-user support
- Export to formats other than CSV
- Formula expression parser for virtual columns — calculations remain JavaScript functions stored in config

## Decisions

1. **Adopt `SchemaDefinition` from data-import as the canonical type** — Instead of creating a bridge between the project `Schema` and data-import `SchemaDefinition`, extend the project to use `SchemaDefinition` directly. This unifies the model and eliminates duplication.

2. **Store schema config in the Zustand project store** — The existing Zustand store with `persist` middleware already handles project CRUD and survives reloads via localStorage. Schema config (columns, validators, filters, groups, calculations, transformers) is small enough for localStorage. Only raw/processed data rows go into IndexedDB.

3. **New IndexedDB store for pipeline results** — The existing `dataset.repository.ts` stores raw data. Create a separate `pipeline.repository.ts` that stores processed results (transformed, validated, calculated data + errors) keyed by project+database ID. This separates concerns and avoids schema migration complexity.

4. **Run pipeline on upload, store all stages** — When a user uploads a CSV, run the full pipeline once. Store `rawData`, `transformedData`, `calculatedData`, and `errors` in IndexedDB. Runtime filter/group changes re-apply those steps client-side from the stored `calculatedData` — no need to re-parse.

5. **New route tabs within project detail** — Add "Configuration" and "Data" tabs to the project detail layout. Config tab hosts the schema editor. Data tab shows dataset selector + interactive viewer. Reuse/extend existing `ProjectDetail` navigation.

6. **Schema editor mirrors data-import config shape** — The UI lets users define columns (name, type, format), add virtual columns (with `calculate` function stored as serialized string), configure validators (type, column, parameters), set up filters, and define groupings. Output is a `SchemaDefinition` stored on the project.

7. **Use the existing `FilterPanel`, `GroupPanel`, `DataTable` components** — These already render from `SchemaDefinition`. The interactive viewer reuses them with data from IndexedDB instead of from the hook's in-memory state.

## Risks / Trade-offs

- **Risk:** LocalStorage 5MB limit for schema config. **Mitigation:** Schema config is textual and small (<50KB even for complex projects). Move to IndexedDB if needed.
- **Risk:** Storing `calculate` functions as serialized strings is eval-like. **Mitigation:** Use `new Function()` with a restricted scope (only row access). The user owns their data — this is a dev tool, not a SaaS product.
- **Risk:** Large CSVs (100k+ rows) in IndexedDB may be slow. **Mitigation:** Process in chunks during initial import; use virtual scrolling in the data viewer; consider Web Workers later.
- **Risk:** The project detail page already has tabs (Datasets, Filters, Schema). Adding Configuration and Data tabs may make navigation crowded. **Mitigation:** Consolidate: Schema tab becomes the config editor; Datasets tab becomes the data viewer with dataset selector.
