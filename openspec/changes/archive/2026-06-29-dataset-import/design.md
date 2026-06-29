## Context

`DatasetStore` exists with full CRUD and `listByProject`. PapaParse is available as a dependency. The project detail page shows dataset count but has no action to upload or manage them.

## Goals / Non-Goals

**Goals:**
- Upload CSV files via file input
- Parse CSV in the browser using PapaParse
- Save parsed data as `Dataset` via `DatasetStore.create`
- List datasets: name, row count, upload date
- Delete datasets
- Link from project detail page

**Non-Goals:**
- Do NOT process data through the schema pipeline (future)
- Do NOT preview dataset contents (future)

## Decisions

1. **PapaParse in the browser** — Files are parsed client-side using papaparse with `header: true` and `dynamicTyping: true`. Rationale: no server needed, instant feedback.

2. **useDatasetImport hook** — Manages project loading, dataset list, upload handler, delete handler. Rationale: clean separation from UI.

3. **File input trigger** — A styled "Upload CSV" button triggers a hidden `<input type="file">`. Rationale: standard pattern, works everywhere.

## Risks / Trade-offs

- **[Memory] Large CSV files** — Parsing happens entirely in browser memory. Mitigation: reasonable for typical CSV sizes (<50MB). Future: streaming parser.
