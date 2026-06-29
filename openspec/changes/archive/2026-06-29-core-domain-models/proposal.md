## Why

The current `src/core/` is empty — domain entities are scattered across modules with no cohesive model. Project, schema, column, dataset, and dashboard concepts need a proper domain layer that enforces the invariant: **one schema per project, multiple datasets per project, multiple dashboards per project, each dashboard tied to a schema**.

## What Changes

- Create core domain entities in `src/core/` for Project, Schema, Column, Dataset, Dashboard
- Define clear relationships and invariants between these entities
- Remove leftover `src/core/dataset/`, `src/core/project/`, `src/core/data-import/` stale files (already git-deleted)
- Establish a repository/interface pattern for CRUD operations on Project
- Add sorting, pagination, filtering, and search for Projects
- Define Schema as the source of truth for CSV transformation — columns are user-defined, independent of CSV headers
- Support column ordering, transformations (trim, uppercase, regex, etc.), validators, and calculated columns (formulas referencing other columns)
- Datasets are uploaded CSV files; they hold raw data and reference a Schema for interpretation
- Dashboards are user-created views with widgets that render data from any dataset in the project

## Capabilities

### New Capabilities
- `project-lifecycle`: Create, read, update, delete, list, search, paginate, and filter projects
- `schema-definition`: Define a single schema per project — ordered columns with types, validators, transformers, and calculated formulas
- `dataset-ingestion`: Upload and manage multiple CSV datasets per project; raw data stored alongside schema-defined view
- `dashboard-management`: Create multiple dashboards per project; each dashboard has a schema and widgets that pull from any dataset

### Modified Capabilities

None — these are all new domain capabilities.

## Impact

- `src/core/` will become the authoritative domain layer
- All existing modules (`src/modules/project/`, `src/modules/dataset/`, `src/modules/dashboard/`, etc.) will eventually import from `src/core/` types
- No breaking changes to the app layer — modules currently use inline types or scattered definitions that will be consolidated
- New domain types replace `@/core/project/project.entity.ts` and `@/core/dataset/*` which are already git-deleted
