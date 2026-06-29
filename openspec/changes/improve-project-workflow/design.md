## Context

The current flow has three pain points: (1) The setup wizard can be dismissed permanently before completing the workflow, leaving users with empty states they may not understand; (2) "Load from dataset" in Configuración's ColumnsEditor loads schema columns but doesn't automatically create a database entry; (3) The dashboard, filters, and configuration pages show generic empty states that don't guide users to the next logical action.

## Goals / Non-Goals

**Goals:**
- Make the setup wizard re-appear if dismissed before both schema + dataset exist
- When users import columns from a CSV, create a database entry automatically
- Dashboard empty states: show "define columns" → "upload data" → "create widgets" progression
- Configuración sub-tabs (virtuals, validators, filters, groups, transformers) disabled/greyed until at least one column exists
- Filters tab: show primary CTA to define columns when schema is empty
- Sidebar: add badge counts for easy glance

**Non-Goals:**
- Changing the store's data model
- Adding new chart types or dashboard widget types
- Authentication or multi-user concerns
- Data export improvements

## Decisions

1. **Wizard persists until fully completed**: Instead of a one-time dismiss boolean, track which steps are complete per project using `project.hasWizardBeenCompleted` (boolean field). The wizard hides permanently only when both schema columns exist AND at least one dataset exists.
   - Alternative considered: localStorage flag per project — loses state on cache clear.

2. **CSV column load creates database**: When `SchemaView`/`ConfigEditor` loads columns from a dataset, the selected dataset's file is already uploaded. We bind the columns to both `project.config.columns` and create a `Database` entry if the dataset doesn't exist yet in `project.databases`. This makes the CSV import a one-step process.
   - Alternative considered: Two-step (load schema, then separately import). Unnecessarily complex.

3. **Progressive sub-tab disabling**: The `ConfigEditor`'s sub-tabs (Virtuales, Validaciones, Filtros, Grupos, Transformadores) show a disabled/grey state when `config.columns.length === 0`, with an inline message pointing to the Columnas tab.
   - Alternative considered: Hide tabs entirely. Confusing — users won't know what's available.

4. **Dashboard phased empty states**: Three states: (a) no schema — "Define columnas en Configuración"; (b) schema exists but no dataset — "Sube un CSV para ver datos"; (c) dataset exists but no widgets — "Agrega widgets al dashboard". Each state has an action button linking to the relevant section.
   - Alternative considered: Single generic empty state. Less helpful.

5. **Sidebar counts**: Add a `count` property to sidebar nav items for datasets and filters (datasets already has implicit count via list length). Dashboard gets a widget count.
   - Alternative considered: No counts. Less informative.

## Risks / Trade-offs

- **[Risk] Auto-creating datasets on column load may surprise users** → Mitigation: Show a brief toast/notification when the database entry is created.
- **[Risk] Users who deliberately dismissed the wizard may be annoyed by re-appearance** → Mitigation: The wizard re-appears only in the "datasets" tab and is compact, not a full-screen overlay.
- **[Risk] Disabled tabs may be confusing** → Mitigation: Show tooltip on hover explaining "Define al menos una columna para activar esta sección".
- **[Risk] Sidebar counts add visual noise** → Mitigation: Keep counts small and muted, only showing them when > 0.
