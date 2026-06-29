## Context

The project detail page at `/projects/[id]` uses an inconsistent navigation model: query-param tabs (`?tab=datasets|data|config`) for some sections and sub-routes (`/dashboard`, `/filters`, `/schema`) for others. The sidebar in `ProjectLayout` lists all items but mixes navigation with inline dialogs (project editing). Dataset management lacks search, sort, and bulk operations. Filter management is duplicated between `ProjectDetail.tsx` and `FiltersView.tsx`. The layout is not responsive and offers no onboarding guidance.

The app uses Next.js 16 App Router, Zustand stores (localStorage), and IndexedDB for dataset data.

## Goals / Non-Goals

**Goals:**
- Unified, consistent navigation model where every project section is equally accessible
- Responsive layout with a collapsible sidebar
- Enhanced dataset CRUD (search, sort, bulk delete, inline rename, upload progress)
- Single source of truth for filter management (no duplicate dialogs)
- Inline dashboard widget configuration without leaving the dashboard page
- Contextual empty states with onboarding steps for new projects
- Dedicated settings area for project-level configuration

**Non-Goals:**
- Changing the data storage layer (IndexedDB stays)
- Changing the Zustand store API signatures (only adding new actions)
- Rewriting the dashboard grid or charting libraries
- Adding user authentication or multi-user features
- Internationalization (stays Spanish for now)

## Decisions

1. **Keep sub-routes, add horizontal tab bar**: Rather than eliminating sub-routes (which breaks deep-linking), add a horizontal tab bar below the sidebar header. The sidebar remains as primary navigation but becomes collapsible. Each sub-route renders consistently within `ProjectLayout`.
   - Alternative considered: Consolidate everything into `?tab=` query params. Rejected because dashboard needs full viewport width and deep-linking is cleaner with routes.
   - Alternative considered: Remove sidebar entirely, use only horizontal tabs. Rejected because sidebar provides scale for future sections (6+ items).

2. **Collapsible sidebar**: Sidebar collapses to a 56px icon-only rail on small screens or via toggle. Uses Tailwind width classes and transition. Active tab is highlighted with an icon + tooltip in collapsed mode.
   - Alternative considered: Fixed sidebar always visible. Rejected for responsiveness.
   - Alternative considered: Bottom navigation (mobile pattern). Overkill for current scope.

3. **Remove filter dialog from ProjectDetail.tsx**: The inline filter dialog in ProjectDetail duplicates FiltersView. Replace it with a link/button that navigates to the filters tab. Filters in the "datasets" or "data" tab should use a read-only summary view instead.
   - Alternative considered: Keep both but share state. Too complex; one source of truth is cleaner.

4. **Move project editing out of sidebar**: Move the "Edit project" dialog trigger from the sidebar to a header gear icon accessible from any tab. Add a full "Project Settings" panel as a new tab/section.
   - Alternative considered: Keep in sidebar but remove Dialog wrapper. Still clutters sidebar.

5. **Dataset search + sort client-side**: Filter datasets by name client-side (already in memory via Zustand). Sort by name, date uploaded, row count. Uses local state + derived filtering in the dataset list component.
   - Alternative considered: Server-side search. No server; all data is in-memory/IndexedDB.

6. **Responsive breakpoint at 768px**: Below 768px, sidebar becomes a bottom navigation bar or overlay drawer. Main content uses full width below 768px.
   - Alternative considered: Hamburger menu. Bottom nav is more discoverable for the 6 nav items.

7. **Dashboard inline config**: The `AddWidgetPanel` already opens a dialog. Keep this pattern but add a "quick-configure" mode where clicking an existing widget opens a side panel for its configuration (instead of requiring widget deletion/recreation).
   - Alternative considered: Full-page widget config wizard. Too heavy for a dashboard tool.

## Risks / Trade-offs

- **Risk: Breaking existing bookmarked URLs** → Mitigation: Add redirect middleware from `/projects/[id]/dashboard`, `/projects/[id]/filters`, `/projects/[id]/schema` to `/projects/[id]?tab=<name>` if we consolidate routes. Currently we're keeping sub-routes, so no breakage.
- **Risk: Performance with many datasets** → Mitigation: Client-side search/sort on the dataset list is O(n) on an in-memory array; acceptable for thousands of items. Virtualized scrolling if needed later.
- **Risk: State duplication** → Mitigation: Eliminate the duplicate filter dialog; use `useProjectStore` as the single source of truth for filter state.
- **Risk: Sidebar collapse on key interactions** → Mitigation: Sidebar state (collapsed/expanded) is persisted to Zustand store so user preference survives refresh.
