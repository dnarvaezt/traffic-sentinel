## Context

Project list page exists at `/`. Clicking a project name has no navigation. The core domain has `ProjectStore.read(id)` to fetch a single project.

## Goals / Non-Goals

**Goals:**
- Clickable project names in the list that navigate to `/projects/[id]`
- Thin router at `src/app/projects/[id]/page.tsx`
- Page component at `src/modules/project/pages/project-detail-page.tsx`
- Hook `useProjectDetail` that loads a project by ID and handles loading/error states
- Display project name, description, createdAt, and basic metadata

**Non-Goals:**
- Do NOT add schema editing, dataset management, or dashboard management — those are separate pages
- Do NOT add delete or edit actions — read-only detail for now

## Decisions

1. **useProjectDetail hook** — Uses `ProjectStore.read(id)` to fetch a single project. Handles loading and not-found states separately. Rationale: clean separation, reusable.

2. **Link from list** — Project name becomes a `<Link>` to `/projects/[id]`. Rationale: standard Next.js navigation.

3. **Back navigation** — Detail page has a back button/link to return to `/`. Rationale: standard UX pattern.

## Risks / Trade-offs

- None — simple read-only page built on existing core APIs.
