## Context

`src/app/` and `src/modules/` are empty. The core domain (`src/core/`) is fully set up with `Project`, `ProjectStore`, `createProjectRepository()`. No UI exists yet to interact with it.

## Goals / Non-Goals

**Goals:**
- Create a main page at `/` that lists projects from IndexedDB via `ProjectStore`
- Support search by name (debounced input)
- Support pagination (page buttons, page size selector)
- Support sort by name (asc/desc) and by createdAt (asc/desc, newest first by default)
- Provide a way to create new projects (dialog/form)
- All state managed via a custom hook (`useProjects`)
- Basic layout with shadcn/ui components

**Non-Goals:**
- Do NOT add project editing or deletion from this page (future)
- Do NOT add routing to project detail page (future, uses existing routes)
- Do NOT add authentication or user management

## Decisions

1. **Client component** — `page.tsx` is `"use client"` because IndexedDB access and interactive state require the browser. Rationale: no server-side rendering needed for this page.

2. **Custom hook** — `useProjects` hook encapsulates all state: projects list, search query, page/pageSize, sort field/order, loading state. Rationale: clean separation, easy to test, reusable.

3. **useEffect + ProjectStore** — The hook loads projects on mount and after mutations (create). Uses `ProjectStore` directly via `createProjectRepository()`. Rationale: no extra state management library needed for this simple case.

4. **shadcn/ui components** — Use existing shadcn `Input`, `Button`, `Select`, `Dialog`, `Table` components from `@/shared/components/ui/`. Rationale: consistency with the rest of the app.

5. **Debounced search** — Input changes trigger search after 300ms debounce. Rationale: avoid filtering on every keystroke.

## Risks / Trade-offs

- **[Performance] IndexedDB on mount** — Loading all projects on mount is fast for typical dataset sizes (<10K projects). Acceptable.
- **[UX] No empty state for first visit** — The page shows an empty table with a "Create your first project" prompt. Rationale: clear call to action.
