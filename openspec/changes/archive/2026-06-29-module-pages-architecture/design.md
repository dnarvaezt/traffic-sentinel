## Context

`src/app/page.tsx` was created with all UI logic inline (~200 lines). The `src/app/` directory should only contain routing — thin page files that delegate to modules. `src/modules/project/` exists but has no `pages/` directory or barrel yet.

## Goals / Non-Goals

**Goals:**
- Move page component to `src/modules/project/pages/home-page.tsx`
- `src/app/page.tsx` becomes a thin server component that renders the module page
- Create `src/modules/project/index.ts` barrel re-exporting pages and hooks
- Establish pattern: `app/` is routing, `modules/<name>/pages/` is page components

**Non-Goals:**
- Do NOT change any functionality, styling, or behavior
- Do NOT create other module pages — just establish the pattern

## Decisions

1. **Thin app/page.tsx** — Uses `import { HomePage } from "@/modules/project"`. No logic, no imports from shared UI components. Rationale: pure routing concern.

2. **pages/ directory per module** — `src/modules/project/pages/home-page.tsx` holds the full page component (client component with all UI logic). Rationale: consistent location for all page-level components, easy to find.

3. **Module barrel** — `src/modules/project/index.ts` re-exports the page and any hooks. Rationale: clean imports from app router files.

## Risks / Trade-offs

- None — pure file relocation, no logic changes.
