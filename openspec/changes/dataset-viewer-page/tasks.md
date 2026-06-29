## 1. Dataset viewer hook

- [x] 1.1 Create `src/modules/project/hooks/use-dataset-viewer.ts`

## 2. Dataset viewer page

- [x] 2.1 Create `src/modules/project/pages/dataset-viewer-page.tsx`
- [x] 2.2 Export `DatasetViewerPage` from module barrel

## 3. Router + navigation

- [x] 3.1 Create `src/app/projects/[id]/datasets/[datasetId]/page.tsx`
- [x] 3.2 Update `dataset-import-page.tsx` to link dataset names to viewer

## 4. Verification

- [x] 4.1 `tsc --noEmit` — zero errors
- [x] 4.2 `biome check src/` — zero issues
