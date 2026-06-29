## 1. App Layout

- [x] 1.1 Create `src/app/layout.tsx` with basic HTML, metadata, and body wrapper

## 2. useProjects Hook

- [x] 2.1 Create `src/modules/project/hooks/use-projects.ts` with state for projects, search, page, pageSize, sortField, sortOrder, loading
- [x] 2.2 Implement loadProjects: fetch from ProjectStore.list() with current options
- [x] 2.3 Implement debounced search (300ms)
- [x] 2.4 Implement createProject, handlePageChange, handleSortChange

## 3. Main Page

- [x] 3.1 Create `src/app/page.tsx` ("use client") using useProjects hook
- [x] 3.2 Render project table with name, description, createdAt columns
- [x] 3.3 Render search input, sort controls, pagination controls
- [x] 3.4 Render create project dialog with name + description fields

## 4. Verification

- [x] 4.1 Run `tsc --noEmit` — zero errors
- [x] 4.2 Run `biome check src/` — zero issues
