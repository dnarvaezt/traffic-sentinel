## ADDED Requirements

### Requirement: Columna con tipo definido
Cada columna SHALL tener un campo `kind` que indica si es `"source"` (mapea a una columna del dataset) o `"virtual"` (calculada mediante expresión).
Cuando `kind` no está presente, el sistema SHALL tratarlo como `"source"` para backward compatibility.

#### Scenario: Crear columna source
- **WHEN** usuario crea una columna con `kind: "source"`
- **THEN** la columna se mapea a una columna del dataset según `sourceColumn`
- **THEN** la columna aparece con badge "Source" en la UI

#### Scenario: Crear columna virtual
- **WHEN** usuario crea una columna con `kind: "virtual"`
- **THEN** la columna NO se mapea a ninguna columna del dataset
- **THEN** la columna se calcula mediante la expresión en `calculate`
- **THEN** la columna aparece con badge "Virtual" en la UI

#### Scenario: Columna existente sin kind
- **WHEN** una columna existente no tiene campo `kind`
- **THEN** el sistema la trata como `"source"`
- **THEN** el mapeo funciona con el comportamiento anterior (usa `header` como fallback)

### Requirement: Source column para mapeo
Las columnas source SHALL tener un campo `sourceColumn` que indica qué columna del CSV/dataset provee los datos.
Cuando `sourceColumn` no está presente, el sistema SHALL usar `header` como fallback (comportamiento actual).
El `mapDataService` SHALL usar `sourceColumn` para buscar el valor en los datos del CSV cuando esté presente.

#### Scenario: Source column especificada
- **WHEN** una columna source tiene `sourceColumn: "precio_unitario"`
- **THEN** el sistema busca el valor en `row["precio_unitario"]` del CSV
- **THEN** el `header` visual puede ser distinto (ej. "Precio Unitario")

#### Scenario: Source column no especificada
- **WHEN** una columna source no tiene `sourceColumn`
- **THEN** el sistema usa `header` como fallback para buscar en el CSV

### Requirement: UI de selección de tipo
El editor de columnas SHALL mostrar un selector para elegir entre "Source" (dataset) y "Virtual" (calculada).
Cuando se selecciona "Source", SHALL mostrar un dropdown con las columnas reales del dataset activo para elegir `sourceColumn`.
Cuando se selecciona "Virtual", SHALL ocultar el selector de columnas del dataset y mostrar el campo de expresión `calculate`.

#### Scenario: Seleccionar tipo source
- **WHEN** usuario selecciona "Source" en el tipo de columna
- **THEN** se muestra un dropdown "Columna del dataset" con las columnas del dataset activo
- **THEN** se oculta el campo de expresión `calculate`

#### Scenario: Seleccionar tipo virtual
- **WHEN** usuario selecciona "Virtual" en el tipo de columna
- **THEN** se oculta el dropdown de columnas del dataset
- **THEN** se muestra el campo de expresión `calculate`

### Requirement: Pipeline ignora virtuales en mapeo
El `mapDataService` SHALL ignorar columnas con `kind: "virtual"` durante el paso de mapeo.
Las columnas virtuales SHALL ser creadas únicamente en el paso de `evaluateCalculatedColumns` del pipeline.

#### Scenario: Virtual column no se mapea
- **WHEN** el pipeline ejecuta `mapDataService`
- **THEN** las columnas virtuales no aparecen en el resultado del mapeo
- **THEN** las columnas virtuales se crean en el paso de evaluación de calculadas
