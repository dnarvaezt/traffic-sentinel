## Context

Datasets are stored with `rawData: Record<string, unknown>[]` and `columns: ColumnDefinition[]`. The dataset list page exists at `/projects/[id]/datasets` but clicking a dataset does nothing.

## Goals / Non-Goals

**Goals:**
- View dataset rows in a paginated table at `/projects/[id]/datasets/[datasetId]`
- Use dataset `columns` for table headers (fallback to raw data keys)
- Paginate: 100 rows per page
- Navigate from dataset list page (click dataset name)
- Back link to dataset list

**Non-Goals:**
- Do NOT apply schema transformations — show raw data only
- Do NOT add search/filter/sort on the data (future)

## Decisions

1. **DatasetStore.read** — Load dataset by ID, display `rawData` rows. Rationale: existing API.
2. **100 rows per page** — Reasonable default for CSV viewing. Keeps rendering fast.
3. **Column headers from dataset.columns** — Use `header` field if available, otherwise fall back to keys from rawData. Rationale: preserves column naming from import.

## Risks / Trade-offs

- **[Performance] Large datasets** — 100 rows per page limits DOM size. Acceptable for client-side rendering.
