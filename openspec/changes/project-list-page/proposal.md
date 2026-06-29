## Why

`src/app/` and `src/modules/` are empty — there's no main page to list projects. Users need a homepage that shows all projects with search, filter, pagination, and sorting capabilities to navigate the app.

## What Changes

- Create `src/app/layout.tsx` with basic HTML structure (shadcn-compatible)
- Create `src/app/page.tsx` as the main project listing page (client component)
- Create `src/modules/project/hooks/use-projects.ts` hook that uses `ProjectStore` from core to manage project state, filtering, pagination, and sorting
- Create project creation dialog/flow inline on the main page
- Search by name, filter, paginate (page/pageSize), sort by name or createdAt

## Capabilities

### New Capabilities
- `project-list-page`: Main `/` page showing all projects with search, pagination, and sort controls
- `project-create`: Dialog or inline form to create a new project

## Impact

- `src/app/` gets its first pages (layout.tsx + page.tsx)
- `src/modules/project/` gets its first module hook
- Uses `ProjectStore` from `@/core` for all persistence
