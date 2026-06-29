## Why

The current project workflow is confusing: users can try to create dashboards and filters before setting up a schema, the empty states don't distinguish between "no schema" and "no data", and the wizard only shows once and is easily dismissed. The system needs a clear, guided flow: project → schema → data → dashboard.

## What Changes

- **Wizard rework**: The setup wizard shows until the user has both schema + at least one dataset, with better empty states for each phase
- **Schema-from-CSV creates first dataset**: When users import columns from a CSV in Configuración, that CSV becomes their first dataset automatically
- **Dashboard empty state shows schema status**: Cleanly separates "no dashboard widgets" (can create widgets) from "no dataset" (data won't render) from "no schema" (can't configure metrics/groups/filters)
- **Configuración tab unlocks progressively**: Virtual columns, validators, filters, groups, transformers only become actionable once columns are defined
- **Filter creation blocked without schema**: The filters tab and project filter button show a clear action to define columns first
- **Sidebar count badges**: Show counts for filters, datasets, and dashboard widgets so users see what's available at a glance

## Capabilities

### New Capabilities
- `setup-wizard-improvements`: Enhanced onboarding wizard with better states and persistence
- `progressive-unlock`: Schema-dependent features unlock only when columns are defined

### Modified Capabilities
*(No existing capabilities in `openspec/specs/` are being modified.)*

## Impact

- **SetupWizard.tsx**: Improved step detection, re-opens if dismissed without completing steps
- **ConfigEditor.tsx**: "Load from dataset" flow creates a database entry if one doesn't exist
- **DashboardPage.tsx**: Empty states distinguish no-schema vs no-dataset vs no-widgets
- **ProjectDetail.tsx**: Filter tab shows CTA to define columns when schema is empty
- **use-project-store.ts**: May need a `hasWizardBeenCompleted` flag per project
- **Sidebar**: Add count badges for filters and datasets (dashboard already has implicit count via grid)