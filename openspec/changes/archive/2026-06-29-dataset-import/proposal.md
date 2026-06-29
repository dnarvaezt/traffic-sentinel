## Why

Projects can have multiple datasets (CSV files), but there is no UI to upload or manage them. Users need an interface to import CSV files, see imported datasets, and delete them.

## What Changes

- Create dataset management page at `/projects/[id]/datasets`
- CSV file upload with PapaParse parsing in the browser
- Store parsed data as `Dataset` entities in IndexedDB via `DatasetStore`
- List imported datasets with name, row count, upload date
- Delete datasets
- Add navigation from project detail page

## Capabilities

### New Capabilities
- `dataset-import`: CSV upload and dataset management page

## Impact

- `src/app/projects/[id]/datasets/page.tsx` — new router
- `src/modules/project/pages/dataset-import-page.tsx` — new page component with file upload, list, delete
- `src/modules/project/hooks/use-dataset-import.ts` — new hook for state management
- `src/modules/project/pages/project-detail-page.tsx` — add link to datasets
