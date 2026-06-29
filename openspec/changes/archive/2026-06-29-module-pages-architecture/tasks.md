## 1. Move page component to modules

- [x] 1.1 Create `src/modules/project/pages/` directory
- [x] 1.2 Move page UI logic from `src/app/page.tsx` to `src/modules/project/pages/home-page.tsx`
- [x] 1.3 Create `src/modules/project/index.ts` barrel exporting `HomePage`
- [x] 1.4 Rewrite `src/app/page.tsx` to import `HomePage` from `@/modules/project` and render it

## 2. Verification

- [x] 2.1 Run `tsc --noEmit` — zero errors
- [x] 2.2 Run `biome check src/` — zero issues
