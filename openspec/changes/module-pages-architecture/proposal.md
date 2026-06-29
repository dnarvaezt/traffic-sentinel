## Why

`src/app/page.tsx` currently contains all the UI logic inline — search input, sort controls, pagination, create dialog, table rendering. `src/app/` should only hold thin Next.js router wrappers. All page components, logic, hooks, and UI must live in `src/modules/` where they can be reused and organized per module.

## What Changes

- Move the project listing page component from `src/app/page.tsx` to `src/modules/project/pages/home-page.tsx`
- Make `src/app/page.tsx` a thin router wrapper that imports and renders `HomePage` from `@/modules/project`
- Create `src/modules/project/pages/` directory for housing page-level components
- Create `src/modules/project/index.ts` barrel that re-exports pages and hooks
- This establishes the pattern for all future pages: `app/` is router only, `modules/` is logic

## Capabilities

### New Capabilities
- `module-pages-pattern`: Page components live in `modules/<name>/pages/`, router wrappers in `app/`

## Impact

- `src/app/page.tsx` shrinks from 200+ lines to ~5 lines
- `src/modules/project/` gets a `pages/` directory and a barrel `index.ts`
- All existing functionality (search, sort, pagination, create) is preserved — just relocated
