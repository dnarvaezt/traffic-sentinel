## 1. Domain Types — Column & Schema

- [x] 1.1 Create `src/core/column.entity.ts` with `ColumnType`, `Alignment`, `ColumnKind`, `ColumnValidation`, `ColumnTransformer`, and `ColumnDefinition` interfaces
- [x] 1.2 Create `src/core/schema.entity.ts` with `Schema` interface (has `columns: ColumnDefinition[]`) and `createSchema` factory function

## 2. Domain Types — Project

- [x] 2.1 Create `src/core/project.entity.ts` with `Project` interface (id, name, description, schema, datasets, dashboards, createdAt, updatedAt)
- [x] 2.2 Create `createProject` factory function that initializes with empty schema, empty datasets, empty dashboards

## 3. Domain Types — Dataset

- [x] 3.1 Create `src/core/dataset.entity.ts` with `Dataset` interface (id, projectId, name, description, rawData, rowCount, columns snapshot, uploadedAt, favorite)
- [x] 3.2 Create `createDataset` factory function

## 4. Domain Types — Dashboard & Widget

- [x] 4.1 Create `src/core/dashboard.entity.ts` with `Dashboard` interface (id, projectId, name, widgets, createdAt, updatedAt)
- [x] 4.2 Create `Widget`, `WidgetConfig`, `WidgetType`, `WidgetPosition` types
- [x] 4.3 Create `createDashboard` and `createWidget` factory functions

## 5. Repository Interface

- [x] 5.1 Create `src/core/ports/project-repository.ts` with `ProjectRepository` interface: `create`, `read`, `update`, `delete`, `list`, `search`, `filter` methods with pagination and sorting support

## 6. In-Memory Repository Implementation

- [x] 6.1 Create `src/core/ports/project-repository.in-memory.ts` implementing `ProjectRepository` with in-memory Map storage
- [x] 6.2 Implement search (case-insensitive name match), filter (date range, hasDatasets), sort (name, createdAt, updatedAt, datasetCount), and pagination

## 7. Barrel Exports

- [x] 7.1 Create `src/core/index.ts` re-exporting all entity types, factory functions, and repository interfaces
- [x] 7.2 Verify `tsc --noEmit` passes with no errors in `src/core/` (pre-existing module import errors unrelated)
