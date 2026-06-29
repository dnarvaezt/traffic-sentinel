## Why

The main page lists projects but clicking on a project does nothing. Users need to navigate to a project detail page where they can see project info, schema, datasets, and dashboards.

## What Changes

- Add navigation from project list: clicking a project name links to `/projects/[id]`
- Create `src/app/projects/[id]/page.tsx` as thin router
- Create `src/modules/project/pages/project-detail-page.tsx` with project info display
- Create `src/modules/project/hooks/use-project-detail.ts` to fetch a single project by ID from ProjectStore

## Capabilities

### New Capabilities
- `project-detail-page`: Project detail page at `/projects/[id]` showing project name, description, and metadata

## Impact

- `src/app/projects/[id]/` directory created
- `src/modules/project/pages/` gets new page component
- `src/modules/project/hooks/` gets new hook
- Main page list gets clickable project names linking to the detail page
