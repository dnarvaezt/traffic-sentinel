## ADDED Requirements

### Requirement: User can search datasets by name
The dataset list SHALL include a search input that filters datasets by name in real-time as the user types.

#### Scenario: Search filters dataset list
- **WHEN** user types a search term in the dataset search input
- **THEN** the dataset list filters to show only datasets whose name contains the search term (case-insensitive)

#### Scenario: Search with no results
- **WHEN** user types a search term that matches no dataset names
- **THEN** an empty state message is displayed: "No se encontraron datasets"

### Requirement: User can sort datasets by name, row count, or upload date
The dataset list SHALL support sorting by column headers (Name, Filas, Columnas, Fecha de subida). Clicking a column header SHALL toggle ascending/descending sort.

#### Scenario: Sort by row count
- **WHEN** user clicks the "Filas" column header
- **THEN** datasets are sorted by row count in ascending order
- **WHEN** user clicks "Filas" again
- **THEN** datasets are sorted by row count in descending order

### Requirement: User can upload CSV with progress feedback
The upload button SHALL show a loading spinner and progress indication during CSV parsing and database storage.

#### Scenario: Upload in progress
- **WHEN** user selects a CSV file for upload
- **THEN** the upload button is replaced with a spinner and "Subiendo..." text
- **THEN** the dataset list is disabled during upload

#### Scenario: Upload complete
- **WHEN** CSV upload completes successfully
- **THEN** the new dataset appears in the dataset list
- **THEN** the upload button returns to its ready state

### Requirement: User can rename a dataset inline
Clicking the dataset name SHALL allow inline editing without opening a dialog.

#### Scenario: Inline rename
- **WHEN** user clicks the dataset name in the list
- **THEN** the name becomes an editable text input
- **WHEN** user presses Enter or clicks away
- **THEN** the new name is saved

### Requirement: User can delete datasets with confirmation
The system SHALL show a confirmation dialog before deleting a dataset. The dialog SHALL show the dataset name and number of rows to be deleted.

#### Scenario: Delete with confirmation
- **WHEN** user clicks the delete button on a dataset
- **THEN** a confirmation dialog appears showing dataset name and row count
- **WHEN** user confirms deletion
- **THEN** the dataset is removed from the list and IndexedDB

### Requirement: User can favorite datasets
The system SHALL allow marking datasets as favorites. Favorited datasets SHALL appear at the top of the list when sorted by favorites.

#### Scenario: Toggle favorite
- **WHEN** user clicks the star icon on a dataset
- **THEN** the dataset is toggled as favorite and the star icon changes to filled state

### Requirement: Empty state shows onboarding steps
When a project has no datasets, the system SHALL show a multi-step onboarding guide with clear call-to-action buttons.

#### Scenario: First-time empty state
- **WHEN** the project has no datasets
- **THEN** an onboarding card shows: "Paso 1: Sube un archivo CSV" with an upload button
