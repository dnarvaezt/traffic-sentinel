import { createSchema } from "../domain/models/schema"

export const learningPlanSchema = createSchema({
  columns: [
    { id: "planName", header: "Plan de Aprendizaje", type: "string" },
    { id: "category", header: "Categoría", type: "string" },
    { id: "startDate", header: "Fecha Inicio", type: "date" },
    { id: "endDate", header: "Fecha Fin", type: "date" },
    { id: "status", header: "Estado", type: "string" },
  ],
  validators: [
    {
      id: "date-range",
      level: "row",
      code: "INVALID_DATES",
      message: "La fecha de inicio debe ser anterior a la de fin",
      validate: (row) => new Date(row.startDate) <= new Date(row.endDate),
    },
  ],
  groups: [{ columnId: "category" }, { columnId: "status" }],
})
