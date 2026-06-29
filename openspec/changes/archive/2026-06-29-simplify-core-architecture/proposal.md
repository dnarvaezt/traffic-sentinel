## Why

`src/core/` has 17 files across 4 directory levels with `domain/`, `infrastructure/`, `ports/` subfolders, port interfaces, and adapter classes — over-engineered for a client-only app. Entities, persistence, and shared utilities are scattered across deep folder hierarchies, making navigation slow.

## What Changes

- **BREAKING**: Flatten `src/core/` — remove all `domain/`, `infrastructure/`, `ports/` subdirectories
- Merge each bounded context into 1-2 flat files: `project.ts` + `project.store.ts`, `dataset.ts` + `dataset.store.ts`, `dashboard.ts` + `dashboard.store.ts`
- Remove port interfaces (`ProjectRepository`, `DatasetRepository`, `DashboardRepository`) — each `.store.ts` file directly exports its class
- Inline IndexedDB client into a single flat `db.ts`
- Move `column.ts` and `filter.ts` from `shared/domain/` to root `src/core/`
- Keep the same barrel exports in `index.ts` so downstream modules still work

## Capabilities

### New Capabilities

None — this is purely a restructuring of existing code.

### Modified Capabilities

All capabilities from `core-vertical-architecture` are structurally simplified. No requirement changes — only file layout changes.

## Impact

- All modules importing from `@/core` continue to work via `index.ts` barrel
- Deep imports like `@/core/shared/domain/column` break and must be updated to `@/core/column`
- Port interfaces (`ProjectRepository`, `DatasetRepository`, `DashboardRepository`) are removed — code importing these types breaks
- Folder depth goes from 4 levels to 1 level
