## 1. Shared Files — column, filter, db

- [x] 1.1 Create `src/core/column.ts` from `shared/domain/column.entity.ts` (content unchanged)
- [x] 1.2 Create `src/core/filter.ts` from `shared/domain/filter.entity.ts` (content unchanged)
- [x] 1.3 Create `src/core/db.ts` merging `indexeddb-client.ts` + `store-config.ts` into one file

## 2. Schema

- [x] 2.1 Create `src/core/schema.ts` from `schema/domain/schema.entity.ts` + `schema-config.ts` (update import of ColumnDefinition to `./column`)
- [x] 2.2 Remove `src/core/schema/` directory tree

## 3. Project

- [x] 3.1 Create `src/core/project.ts` from `project/domain/project.entity.ts` (update imports to use flat paths `./dashboard`, `./dataset`, `./schema`)
- [x] 3.2 Create `src/core/project.store.ts` from `project/infrastructure/project-repository.indexeddb.ts` — inline the repository interface, no port abstraction, update import paths
- [x] 3.3 Remove `src/core/project/` directory tree (including `project-repository.in-memory.ts`)
- [x] 3.4 Remove `src/core/project/domain/ports/project-repository.ts` port interface

## 4. Dataset

- [x] 4.1 Create `src/core/dataset.ts` from `dataset/domain/dataset.entity.ts` (update import of ColumnDefinition to `./column`)
- [x] 4.2 Create `src/core/dataset.store.ts` from `dataset/infrastructure/dataset-repository.indexeddb.ts` — inline the repository interface, no port abstraction, update import paths
- [x] 4.3 Remove `src/core/dataset/` directory tree
- [x] 4.4 Remove `src/core/dataset/domain/ports/dataset-repository.ts` port interface

## 5. Dashboard

- [x] 5.1 Create `src/core/dashboard.ts` from `dashboard/domain/dashboard.entity.ts` (update import of FilterDefinition to `./filter`)
- [x] 5.2 Create `src/core/dashboard.store.ts` from `dashboard/infrastructure/dashboard-repository.indexeddb.ts` — inline the repository interface, no port abstraction, update import paths
- [x] 5.3 Remove `src/core/dashboard/` directory tree
- [x] 5.4 Remove `src/core/dashboard/domain/ports/dashboard-repository.ts` port interface

## 6. Barrel Export

- [x] 6.1 Rewrite `src/core/index.ts` to re-export everything from the new flat files (same public API)

## 7. Verification

- [x] 7.1 Run `tsc --noEmit` and fix any errors
- [x] 7.2 Run `biome check src/core/` and fix any issues
