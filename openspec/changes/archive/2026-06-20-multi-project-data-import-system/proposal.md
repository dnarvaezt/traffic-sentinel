## Why

The current data-import system has a powerful generic pipeline (parse → map → transform → validate → calculate → filter → group) but only exists as a disposable demo on `/data-import-demo` with hardcoded configs. The project system has full CRUD and IndexedDB persistence but uses a separate, simpler import path. Users need to create projects, configure their import schema (columns, filters, validations, groupings, virtual columns), load CSVs, process data through the full pipeline, persist everything to IndexedDB, and interactively explore validated results — all within a project context.

## What Changes

- **Unify the two import paths**: Replace the project module's basic CSV import with the generic data-import engine
- **Project-scoped configuration**: Each project stores its full schema config (columns, filters, validators, transformations, groupings, virtual columns) and can be edited before/after data load
- **Persistent data loading**: CSV data is processed through the pipeline and persisted in IndexedDB per project/dataset
- **Interactive data view**: Within a project, users view data with live filtering, grouping, virtual column evaluation, and validation error highlighting
- **Multiple datasets per project**: A project can have multiple loaded CSVs, each processed independently under the same schema
- **Configuration persistence**: Schema, filters, validations, groupings, and transformations survive page reloads via IndexedDB
- **Schema editor UI**: Users can define columns, set types, add virtual columns with formulas, configure validators, and set up groupings through the project UI (replacing hardcoded configs)

## Capabilities

### New Capabilities
- `project-import-config`: Configuration UI for defining columns, filters, validations, groupings, and virtual column formulas per project
- `pipeline-persistence`: Process CSV data through the generic import engine and persist results to IndexedDB
- `interactive-data-viewer`: Live data table with runtime filtering, grouping, virtual columns, and validation error display within a project

### Modified Capabilities
- *(none — no existing specs to modify)*

## Impact

- `src/data-import/` — Add persistence services; the pipeline is already complete
- `src/core/project/` — Extend project entity/store to hold import schema config; replace dataset CSV import with the generic pipeline
- `src/core/dataset/` — Reuse IndexedDB repository for storing processed data-import results
- `src/modules/project/` — Add schema config editor and data viewer components
- `src/app/projects/[id]/` — New routes/tabs for schema configuration and data viewing
- Dependencies — No new external deps required
