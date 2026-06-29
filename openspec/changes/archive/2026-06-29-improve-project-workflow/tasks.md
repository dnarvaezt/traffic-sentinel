## 1. Wizard Persistence

- [x] 1.1 Add `wizardCompleted: boolean` field to `Project` entity (default: false)
- [x] 1.2 Update `SetupWizard` to use `project.wizardCompleted` instead of localStorage flag
- [x] 1.3 Update `ProjectDetail` to set `wizardCompleted = true` when columns + dataset exist
- [x] 1.4 Update `useProjectStore` with `setWizardCompleted` action
- [x] 1.5 Remove old localStorage-based wizard dismiss logic from ProjectDetail

## 2. CSV Column Import Creates Dataset

- [x] 2.1 In `ConfigEditor`'s "Cargar desde dataset" flow, check if a `Database` entry exists for the selected dataset
- [x] 2.2 If no database entry exists, create one using the selected dataset's metadata and store it via `addDatabase`
- [x] 2.3 Show toast notification when database entry is auto-created
- [x] 2.4 Prevent duplicate database entries on subsequent column loads

## 3. Dashboard Phased Empty States

- [x] 3.1 Update `DashboardPage` to detect three states: no-columns / columns-no-data / data-no-widgets
- [x] 3.2 Add "Define columnas en Configuración" empty state with link button (when no columns)
- [x] 3.3 Add "Sube un dataset" empty state with upload button (when columns but no datasets)
- [x] 3.4 Ensure existing "Crea tu primer widget" state (data + no widgets) is retained

## 4. Configuración Progressive Unlock

- [x] 4.1 In `ConfigEditor`, check `columns.length === 0` and disable non-Columnas tabs
- [x] 4.2 Add inline hint text on disabled tabs: "Define al menos una columna para activar esta sección"
- [x] 4.3 Re-enable tabs when at least one column exists

## 5. Filter & Tab Empty States

- [x] 5.1 Update filters tab in `ProjectDetail` to show "Define columnas en Configuración" CTA when no columns
- [x] 5.2 Ensure the existing filter management UI shows only when columns exist

## 6. Sidebar Count Badges

- [x] 6.1 Add dataset count badge to sidebar Datasets item
- [x] 6.2 Add dashboard widget count badge to sidebar Dashboard item
- [x] 6.3 Ensure filter count badge already works (verify existing implementation)

## 7. Cleanup & Verification

- [x] 7.1 Verify TypeScript compiles with no errors (`npx tsc --noEmit`)
- [x] 7.2 Run lint (`npx biome check src/`)
- [x] 7.3 Manual smoke test: create project, verify wizard flow, column import, dashboard states
