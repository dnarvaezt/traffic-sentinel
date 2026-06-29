## 1. Directory Structure

- [x] 1.1 Create vertical slice folders: `project/domain/ports/`, `project/infrastructure/`, `dataset/domain/ports/`, `dataset/infrastructure/`, `dashboard/domain/ports/`, `dashboard/infrastructure/`, `schema/domain/`, `shared/domain/`, `shared/infrastructure/indexeddb/`

## 2. Shared Domain Entities

- [x] 2.1 Move `column.entity.ts` to `shared/domain/column.entity.ts` (ColumnDefinition, ColumnType, ColumnValidation, ColumnTransformer)
- [x] 2.2 Move `filter.entity.ts` to `shared/domain/filter.entity.ts` (FilterDefinition, FilterOperator, FilterCondition)

## 3. Shared Infrastructure — IndexedDB Client

- [x] 3.1 Create `shared/infrastructure/indexeddb/indexeddb-client.ts` with `IndexedDbClient` class managing connection lifecycle, schema migration, and typed transactions
- [x] 3.2 Create `shared/infrastructure/indexeddb/store-config.ts` with object store configurations for projects, datasets, and dashboards

## 4. Schema Vertical Slice

- [x] 4.1 Create `schema/domain/schema.entity.ts` with `Schema` interface and `createSchema` factory (imports ColumnDefinition from shared)
- [x] 4.2 Create `schema/domain/schema-config.ts` with `SchemaConfig` if needed for project-scoped config

## 5. Project Vertical Slice

- [x] 5.1 Create `project/domain/project.entity.ts` with `Project` interface and `createProject` factory
- [x] 5.2 Create `project/domain/ports/project-repository.ts` with async `ProjectRepository` interface (create, read, update, delete, list)
- [x] 5.3 Create `project/infrastructure/project-repository.indexeddb.ts` with `IndexedDbProjectRepository` implementing the port
- [x] 5.4 Move and deprecate `project/infrastructure/project-repository.in-memory.ts` (mark `@deprecated`, keep for tests)

## 6. Dataset Vertical Slice

- [x] 6.1 Create `dataset/domain/dataset.entity.ts` with `Dataset` interface and `createDataset` factory
- [x] 6.2 Create `dataset/domain/ports/dataset-repository.ts` with async `DatasetRepository` interface (create, read, update, delete, listByProject)
- [x] 6.3 Create `dataset/infrastructure/dataset-repository.indexeddb.ts` with `IndexedDbDatasetRepository` implementing the port

## 7. Dashboard Vertical Slice

- [x] 7.1 Create `dashboard/domain/dashboard.entity.ts` with `Dashboard`, `Widget`, `WidgetConfig`, `WidgetType`, `WidgetPosition` interfaces and factory functions
- [x] 7.2 Create `dashboard/domain/ports/dashboard-repository.ts` with async `DashboardRepository` interface (create, read, update, delete, listByProject)
- [x] 7.3 Create `dashboard/infrastructure/dashboard-repository.indexeddb.ts` with `IndexedDbDashboardRepository` implementing the port

## 8. Cleanup

- [x] 8.1 Delete old flat files: `column.entity.ts`, `filter.entity.ts`, `schema.entity.ts`, `project.entity.ts`, `dataset.entity.ts`, `dashboard.entity.ts`, `ports/` directory, old `index.ts`

## 9. Barrel Export

- [x] 9.1 Create `src/core/index.ts` re-exporting all types and factories from the new vertical slices (same public API as before)

## 10. Verification

- [x] 10.1 Run `tsc --noEmit` and fix any errors
- [x] 10.2 Run `biome check src/core/` and fix any issues
