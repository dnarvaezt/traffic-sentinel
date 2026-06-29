## 1. Create domain/ directory and move value objects

- [x] 1.1 Create `src/core/domain/` directory
- [x] 1.2 Move `column.ts` to `src/core/domain/column.ts`
- [x] 1.3 Move `filter.ts` to `src/core/domain/filter.ts`

## 2. Move domain entities

- [x] 2.1 Move `project.ts` to `src/core/domain/project.ts`
- [x] 2.2 Move `project.store.ts` to `src/core/domain/project.repository.ts`
- [x] 2.3 Move `dataset.ts` to `src/core/domain/dataset.ts`
- [x] 2.4 Move `dataset.store.ts` to `src/core/domain/dataset.repository.ts`
- [x] 2.5 Move `dashboard.ts` to `src/core/domain/dashboard.ts`
- [x] 2.6 Move `dashboard.store.ts` to `src/core/domain/dashboard.repository.ts`
- [x] 2.7 Move `schema.ts` to `src/core/domain/schema.ts`

## 3. Update barrel and cleanup

- [x] 3.1 Rewrite `src/core/index.ts` to re-export everything from `src/core/domain/`
- [x] 3.2 Remove old flat files from `src/core/` root

## 4. Verification

- [x] 4.1 Run `tsc --noEmit` — zero errors
- [x] 4.2 Run `biome check src/core/` — zero issues
