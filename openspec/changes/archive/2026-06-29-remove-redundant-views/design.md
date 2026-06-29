## Context

El código base ha pasado por múltiples refactors (consolidate-pages-and-flows, refactor-project-views, improve-column-configuration) que dejaron archivos huérfanos y barrel exports que exponen componentes internos. Los hooks `usePdfExport` y `useXlsxExport` ya no se importan desde ningún lado tras la limpieza de dashboard. Los barrel files siguen exportando componentes que solo se usan dentro del mismo módulo.

## Goals / Non-Goals

**Goals:**
- Eliminar archivos huérfanos sin imports
- Limpiar barrel exports para exponer solo la API pública de cada módulo
- Reducir ruido y confusión en la navegación del proyecto

**Non-Goals:**
- No cambiar funcionalidad existente
- No mover archivos ni reestructurar módulos
- No tocar componentes que sí se usan externamente

## Decisions

### 1. Eliminar vs. mantener archivos huérfanos
- **Decisión**: Eliminar `use-pdf-export.ts` y `use-xlsx-export.ts` completos
- **Razón**: Sin imports, solo añaden ruido. Si se necesitan en el futuro, Git los recupera.
- **Alternativa**: Mantenerlos comentados — peor porque nadie sabe si están vigentes.

### 2. Barrel exports mínimos
- **Decisión**: Cada barrel exporta solo lo que se consume desde fuera del módulo
- **Razón**: Menos superficie pública = menos mantenimiento. Los componentes internos se importan con rutas relativas.
- **Regla**: Si un export solo es importado dentro del mismo módulo, no debe estar en el barrel.

## Risks / Trade-offs

- **[Bajo] Eliminar hooks huérfanos** → 0 riesgo, no hay imports
- **[Bajo] Reducir barrel exports** → Si alguien importa un export removido, TypeScript falla. Solución: son todos internos, nadie los importa externamente
