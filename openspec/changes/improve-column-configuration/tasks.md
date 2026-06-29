## 1. Modelo de datos

- [x] 1.1 Agregar campo `kind?: "source" | "virtual"` a `ColumnDefinition` en `src/data-import/domain/models/column.ts`
- [x] 1.2 Agregar campo `sourceColumn?: string` a `ColumnDefinition` en `src/data-import/domain/models/column.ts`

## 2. Pipeline de importación

- [x] 2.1 Actualizar `mapDataService.execute()` para usar `sourceColumn` cuando esté presente, con fallback a `header`
- [x] 2.2 Actualizar `mapDataService.execute()` para ignorar columnas con `kind: "virtual"`
- [x] 2.3 Verificar que `import-engine.ts` maneja correctamente columnas virtuales (solo se crean en `evaluateCalculatedColumns`)

## 3. Editor de columnas (UI)

- [x] 3.1 Agregar selector de tipo "Source" / "Virtual" en el diálogo de nueva/editar columna (`columns-editor.tsx`)
- [x] 3.2 Cuando kind="source": mostrar dropdown "Columna del dataset" con columnas reales del dataset activo para elegir `sourceColumn`
- [x] 3.3 Cuando kind="virtual": ocultar dropdown de dataset y mostrar campo `calculate` (expresión)
- [x] 3.4 Agregar badge visual "Source" o "Virtual" en la tabla de columnas
- [x] 3.5 Al cargar columnas desde dataset, todas se crean como kind="source" con `sourceColumn` mapeado al header correspondiente

## 4. Integración y verificación

- [x] 4.1 Verificar que TypeScript compila sin errores (`npx tsc --noEmit`)
- [x] 4.2 Verificar que el build de producción funciona (`npm run build`)
- [x] 4.3 Verificar que columnas existentes sin `kind` se renderizan correctamente como "source"
- [x] 4.4 Verificar que el mapeo de datos funciona con columnas que tienen `sourceColumn` distinto a `header`
