## 1. Repository — allow schema updates

- [x] 1.1 Update `ProjectStore.update` to accept `schema`

## 2. Schema config hook

- [x] 2.1 Create `src/modules/project/hooks/use-schema-config.ts`

## 3. Schema config page

- [x] 3.1 Create `src/modules/project/pages/schema-config-page.tsx`
- [x] 3.2 Export `SchemaConfigPage` from module barrel

## 4. Router + navigation

- [x] 4.1 Create `src/app/projects/[id]/config/page.tsx`
- [x] 4.2 Add "Configurar Schema" link in project detail page

## 5. Verification

- [x] 5.1 `tsc --noEmit` — zero errors
- [x] 5.2 `biome check src/` — zero issues
