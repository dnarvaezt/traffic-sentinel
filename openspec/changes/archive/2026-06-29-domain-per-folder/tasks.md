## 1. Value Object Domains — column, filter, schema

- [x] 1.1 Create `src/core/column/interface.ts` + `column/index.ts`
- [x] 1.2 Create `src/core/filter/interface.ts` + `filter/index.ts`
- [x] 1.3 Create `src/core/schema/interface.ts` + `schema/index.ts`

## 2. Project Domain

- [x] 2.1 Create `src/core/project/interface.ts`
- [x] 2.2 Create `src/core/project/repository.ts`
- [x] 2.3 Create `src/core/project/provider.ts`
- [x] 2.4 Create `src/core/project/index.ts`

## 3. Dataset Domain

- [x] 3.1 Create `src/core/dataset/interface.ts`
- [x] 3.2 Create `src/core/dataset/repository.ts`
- [x] 3.3 Create `src/core/dataset/provider.ts`
- [x] 3.4 Create `src/core/dataset/index.ts`

## 4. Dashboard Domain

- [x] 4.1 Create `src/core/dashboard/interface.ts`
- [x] 4.2 Create `src/core/dashboard/repository.ts`
- [x] 4.3 Create `src/core/dashboard/provider.ts`
- [x] 4.4 Create `src/core/dashboard/index.ts`

## 5. Root Barrel

- [x] 5.1 Rewrite `src/core/index.ts` to re-export from each domain folder
- [x] 5.2 Remove `src/core/domain/` directory
- [x] 5.3 `tsc --noEmit` — zero errors
- [x] 5.4 `biome check src/core/` — zero issues
