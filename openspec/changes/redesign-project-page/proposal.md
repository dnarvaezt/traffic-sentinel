## Why

The current project page has usability issues: the navigation mixes query-param tabs with sub-route pages inconsistently, the sidebar is cluttered with configuration dialogs, dataset management lacks search/filter/bulk operations, and the overall layout is not responsive. Users find it difficult to discover features, manage datasets, and configure dashboards efficiently.

## What Changes

- **Unified navigation**: Replace the mixed query-param + sub-route navigation with a consistent tab-based layout. Sub-pages (dashboard, schema, filters) become tabs within the project page, removing context-switching.
- **Redesigned sidebar**: Simplify sidebar to show only essential navigation and project info. Move project editing (name, description) to a settings tab or inline header. Remove inline configuration dialogs from the sidebar.
- **Enhanced dataset management**: Add search/filter to the dataset list, inline rename, column preview tooltips, bulk delete, drag-to-reorder favorites, and a clearer upload flow with progress feedback.
- **Streamlined import configuration**: Surface the ConfigEditor in a more intuitive wizard-like flow instead of a hidden "config" tab. Show schema health indicators and per-column status badges.
- **Improved dashboard setup**: Surface dashboard configuration inline rather than making it a separate page. Add quick-add widget toolbar, dataset selector in the same view as widgets, and live preview when configuring.
- **Integrated filter & group management**: Merge the duplicate filter dialogs (ProjectDetail vs FiltersView) into one consistent component. Add filter groups (AND/OR nesting), search/filter on the filter list, and inline test preview.
- **Responsive layout**: Make the sidebar collapsible and the main content area responsive for smaller screens.
- **Onboarding guidance**: Add contextual empty states with step-by-step guidance for new projects (e.g., "Step 1: Upload a CSV", "Step 2: Configure schema", "Step 3: Create dashboard").

## Capabilities

### New Capabilities
- `project-navigation`: Unified tab-based navigation system with collapsible sidebar, breadcrumbs, and active-state indicators
- `dataset-management`: Enhanced dataset CRUD with search, sort, bulk actions, inline editing, and progress-aware upload
- `import-configuration`: Streamlined schema/import configuration with column health indicators, validation preview, and guided workflow
- `dashboard-configuration`: Inline dashboard builder with quick-add toolbar, live widget preview, dataset-aware filtering
- `filter-groups`: Filter and group management with AND/OR nesting, inline test preview, searchable filter list
- `project-settings`: Dedicated settings panel for project name, description, delete project, data export

### Modified Capabilities
*(No existing capabilities in `openspec/specs/` are being modified.)*

## Impact

- **Routes**: `/projects/[id]/dashboard`, `/projects/[id]/filters`, `/projects/[id]/schema` may be consolidated into tabs within `/projects/[id]` (with backward-compatible redirects)
- **Components**: ProjectDetail.tsx, ProjectLayout.tsx, DashboardPage.tsx, FiltersView.tsx, SchemaView.tsx all receive significant refactoring
- **State**: Zustand stores (useProjectStore, useDashboardStore) may need minor API changes for the new navigation model
- **CSS/Layout**: Tailwind layout classes updated for responsive sidebar behavior; no new dependencies
