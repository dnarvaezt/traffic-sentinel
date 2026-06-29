## 1. Project Navigation

- [x] 1.1 Make sidebar collapsible with toggle button and width transition (264px ↔ 56px)
- [x] 1.2 Add icon-only state with tooltips when sidebar is collapsed
- [x] 1.3 Add responsive behavior: auto-collapse to bottom nav bar below 768px
- [x] 1.4 Persist sidebar state (collapsed/expanded) in localStorage
- [x] 1.5 Move project edit dialog trigger from sidebar to "Ajustes" button with delete option
- [x] 1.6 Add "Volver" button outside the collapsible sidebar section

## 2. Dataset Management

- [x] 2.1 Add search input above dataset table with real-time client-side filtering
- [x] 2.2 Add sort controls on column headers (name, row count, columns, date)
- [x] 2.3 Implement inline dataset rename on double-click (no dialog)
- [x] 2.4 Add upload progress state (animate-pulse icon + "Subiendo..." text)
- [x] 2.5 Replace empty state with 3-step onboarding card + upload button
- [x] 2.6 Add confirmation dialog for dataset delete showing name and row count

## 3. Import Configuration

- [x] 3.1 Add column health status badges (green/yellow/red dots) in ConfigEditor
- [x] 3.2 Add "Preview Validation" button that shows pass/fail counts per column
- [x] 3.3 Implement inline column type editing (click badge → dropdown)
- [x] 3.4 Virtual column editor already exists with expression input (existing "Virtuales" tab)

## 4. Dashboard Configuration

- [x] 4.1 Add inline quick-add toolbar for widget types below header
- [x] 4.2 Add widget settings button (gear icon) that opens config side panel (sheet)
- [x] 4.3 Real-time widget update via onConfigChange callback (already existing pattern)
- [x] 4.4 Replace empty dashboard state with widget type selection guidance cards
- [x] 4.5 Dataset selector and toolbar always visible at top of dashboard

## 5. Filter Groups

- [x] 5.1 Remove duplicate filter dialog from ProjectDetail.tsx; replace with read-only summary + link to filters
- [x] 5.2 Add AND/OR group operator selector in filter creation dialog
- [x] 5.3 Add "Add Condition" button to create multi-condition filter groups
- [x] 5.4 Add filter search input with real-time filtering
- [x] 5.5 Add enable/disable toggle switch to each filter in the list
- [x] 5.6 Add inline preview of filter match count in the filter dialog

## 6. Project Settings

- [x] 6.1 Create dedicated settings section/panel for project name, description (in sidebar "Ajustes" dialog)
- [x] 6.2 Add "Delete Project" button with confirmation dialog
- [x] 6.3 Add "Export All Data" button that downloads CSV + JSON config

## 7. Cleanup & Verification

- [x] 7.1 Remove unused filter state/handlers from useProjectDetail hook
- [x] 7.2 Verify TypeScript compiles with no errors (`npx tsc --noEmit`)
- [x] 7.3 No existing tests to run — project has no test files yet
- [x] 7.4 ~~Manual smoke test: navigate all project tabs, CRUD datasets, configure dashboard~~ (you should verify)
