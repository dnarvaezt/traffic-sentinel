## Why

Datasets are uploaded as CSV files and stored in IndexedDB, but there is no way to view the actual data. Users need a page to see the raw CSV data in a table format, with pagination to handle large datasets.

## What Changes

- Create dataset viewer page at `/projects/[id]/datasets/[datasetId]`
- Display raw CSV data in a table with headers from dataset columns
- Paginate rows (100 per page)
- Navigate from dataset list page
- Link to project detail/dataset list

## Capabilities

### New Capabilities
- `dataset-viewer-page`: View raw CSV data in a paginated table

## Impact

- `src/app/projects/[id]/datasets/[datasetId]/page.tsx` — new router
- `src/modules/project/pages/dataset-viewer-page.tsx` — new page component
- `src/modules/project/hooks/use-dataset-viewer.ts` — new hook
- `src/modules/project/pages/dataset-import-page.tsx` — add link to each dataset
