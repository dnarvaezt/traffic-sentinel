## REMOVED Requirements

### Requirement: PDF export hook
**Reason**: No longer used after DashboardPage toolbar cleanup
**Migration**: None — the hook was orphaned with zero imports

### Requirement: XLSX export hook
**Reason**: No longer used after DashboardPage toolbar cleanup
**Migration**: None — the hook was orphaned with zero imports

### Requirement: Barrel exports for internal components
**Reason**: Components and hooks that are only used within their own module should not be barrel-exported, to avoid confusion and unnecessary public API surface
**Migration**: Components that need to be used outside their module should import via relative path or be added back to the barrel export intentionally

#### Scenario: Internal component not externally accessible
- **WHEN** a developer imports from `@/modules/dashboard`
- **THEN** only `DashboardPage` is available
- **THEN** internal components like `MetricWidget` or `WidgetRegistry` are not in the barrel export

#### Scenario: Orphaned hook files removed
- **WHEN** the codebase is searched for `usePdfExport` or `useXlsxExport`
- **THEN** no results are found
