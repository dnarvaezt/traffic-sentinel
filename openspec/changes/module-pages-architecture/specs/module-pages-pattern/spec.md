## ADDED Requirements

### Requirement: Router-only pages
Files in `src/app/` SHALL only contain routing logic — import a page component from `src/modules/` and render it. No UI logic, no state, no direct imports from shared UI components.

#### Scenario: Home page router
- **WHEN** opening `src/app/page.tsx`
- **THEN** it only imports `HomePage` from `@/modules/project` and renders it

### Requirement: Page components in modules
All page-level UI components SHALL live in `src/modules/<name>/pages/`. Each page component SHALL be a full client component with all its UI logic.

#### Scenario: Home page component
- **WHEN** looking for the home page implementation
- **THEN** it is at `src/modules/project/pages/home-page.tsx`

### Requirement: Module barrel
Each module SHALL have an `index.ts` barrel that re-exports its public page components and hooks.

#### Scenario: Project barrel
- **WHEN** importing from `@/modules/project`
- **THEN** `HomePage` is available
