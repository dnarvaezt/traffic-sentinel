## Context

The project detail page currently has three tabs (Datasets, Datos, Configuración) sharing the same URL `/projects/[id]`. This prevents deep-linking, breaks browser back/forward navigation, and makes it impossible to bookmark specific views. The sidebar's `setActiveTab` call was only implemented for "datasets" and "filters", leaving the new "data" and "config" tabs non-functional. Additionally, each project sub-page (ProjectDetail, FiltersView, SchemaView) renders its own independent sidebar with different nav items, creating an inconsistent user experience.

## Goals / Non-Goals

**Goals:**
- Give each main view (Datasets, Data, Config) its own unique URL
- Fix sidebar tab clicks so "Datos" and "Configuración" properly activate
- Create a shared `ProjectLayout` component with consistent sidebar used by all project sub-pages
- Fix active tab highlighting across all project pages using the URL path
- Fix the missing React `key` prop on fragment in DataTable.tsx
- Remove unused `Switch` import in ConfigEditor.tsx
- Remove dead `replacePipeline` export

**Non-Goals:**
- Full redesign of the sidebar or navigation UX
- Adding a global app-level navigation bar (out of scope)
- Refactoring the filter/schema editor pages beyond adopting the shared layout

## Decisions

1. **Use URL search params for tab state** — Instead of adding three separate route files, use Next.js search params (`/projects/[id]?tab=datasets`, `?tab=data`, `?tab=config`). This gives each view a unique, shareable URL without creating new page files or duplicating layout code. The existing `/projects/[id]/filters` and `/projects/[id]/schema` routes continue to work as dedicated pages.

2. **Extract shared `ProjectLayout` component** — Move the sidebar and surrounding layout from `ProjectDetail.tsx` into a reusable `ProjectLayout.tsx`. Both `FiltersView` and `SchemaView` wrap their content with this layout for consistent navigation. Sidebar nav items highlight based on the current pathname + search params.

3. **Centralize tab state via URL** — Read `activeTab` from `useSearchParams()` instead of local `useState`. When user clicks a nav item, update the search params. This makes tabs bookmarkable and fixes the browser back-button behavior.

4. **Fix `key` prop via `React.Fragment`** — Replace `<>...</>` with `<React.Fragment key={group.key}>` in DataTable.tsx.

## Risks / Trade-offs

- **Risk:** Moving to URL-based tabs changes the routing behavior. **Mitigation:** Search params approach is minimal diff — no page file restructuring needed.
- **Risk:** FiltersView and SchemaView already have their own layouts. **Mitigation:** Wrap them in the shared layout but keep their existing content areas intact.
- **Risk:** The `useSearchParams()` hook requires `Suspense` in Next.js App Router. **Mitigation:** Wrap the component using search params in a boundary or use `useParams` with the tab key.
