## ADDED Requirements

### Requirement: Export dashboard to PDF
The system SHALL allow exporting the current dashboard view to a PDF file. The PDF SHALL include rendered chart images (captured via html2canvas) and a data table with the underlying data.

#### Scenario: Export PDF with charts and data
- **WHEN** user clicks "Exportar PDF"
- **THEN** system captures each chart widget as an image, builds a PDF with chart images and a summary data table, and triggers a download

#### Scenario: Empty dashboard export
- **WHEN** user clicks "Exportar PDF" on a dashboard with no widgets
- **THEN** system downloads a PDF with only a title and "No hay widgets configurados" message

### Requirement: Export dataset to XLSX
The system SHALL allow exporting the full filtered dataset (or per-widget data) to an XLSX file using the `xlsx` library.

#### Scenario: Export data to XLSX
- **WHEN** user clicks "Exportar XLSX" from a Table widget
- **THEN** system downloads an XLSX file containing the widget's data including headers

#### Scenario: Export all dashboard data
- **WHEN** user clicks "Exportar XLSX (Todo)" from the dashboard toolbar
- **THEN** system downloads an XLSX file with one sheet per widget, containing each widget's data

### Requirement: Loading state during export
While generating an export, the system SHALL show a loading indicator and prevent duplicate exports.

#### Scenario: Loading indicator during PDF generation
- **WHEN** user clicks "Exportar PDF" and generation is in progress
- **THEN** the button shows a spinner and is disabled until the download starts
