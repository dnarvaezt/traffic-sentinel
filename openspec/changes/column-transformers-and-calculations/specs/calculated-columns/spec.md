## ADDED Requirements

### Requirement: Column has expression
Each `ColumnDefinition` SHALL support an optional `calculate` string field containing a JavaScript expression.

#### Scenario: Column without expression
- **WHEN** a `ColumnDefinition` is created without a `calculate` field
- **THEN** the column SHALL be treated as a regular data column loaded from CSV

#### Scenario: Column with expression
- **WHEN** a `ColumnDefinition` has `calculate: "row['price'] * row['quantity']"`
- **THEN** during import, each row SHALL have a computed value at `row[column.id]` equal to the evaluated expression

### Requirement: Expression evaluation
The import pipeline SHALL evaluate `calculate` expressions using `new Function("row", ...)` with the current row as context.

#### Scenario: Expression with column reference
- **WHEN** a row has `{ "price": 10, "quantity": 3 }` and the column has `calculate: "row['price'] * row['quantity']"`
- **THEN** the computed value SHALL be `30`

#### Scenario: Expression references multiple columns
- **WHEN** a row has `{ "first": "John", "last": "Doe" }` and the column has `calculate: "row['first'] + ' ' + row['last']"`
- **THEN** the computed value SHALL be `"John Doe"`

#### Scenario: Expression error handling
- **WHEN** an expression throws a runtime error for a row
- **THEN** the row's computed value SHALL be `null` and a validation error SHALL be reported

### Requirement: Column reference picker
The column edit dialog SHALL provide a picker for available columns when editing a calculated column expression.

#### Scenario: Opening expression editor
- **WHEN** a user sets a `calculate` expression on a column
- **THEN** the dialog SHALL show a list of available columns with their headers
- **THEN** clicking a column header SHALL insert `row["HeaderName"]` at the cursor position in the expression input

### Requirement: Calculated columns are not loaded from CSV
Columns with a `calculate` expression SHALL be excluded from CSV column mapping and populated entirely from the expression.

#### Scenario: Calculated column in dataset
- **WHEN** a CSV is imported and a column has a `calculate` expression
- **THEN** the column's data SHALL NOT come from the CSV file
- **THEN** the column's data SHALL be computed from the expression for each row
