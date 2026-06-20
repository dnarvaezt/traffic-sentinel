import { createSchema } from "../domain/models/schema"

export const employeeSchema = createSchema({
  columns: [
    { id: "employeeId", header: "ID Empleado", type: "string", sortable: true },
    { id: "name", header: "Nombre", type: "string", sortable: true, filterable: true },
    { id: "email", header: "Correo", type: "email", sortable: true, filterable: true },
    { id: "country", header: "País", type: "string", sortable: true, filterable: true },
    { id: "salary", header: "Salario", type: "currency", alignment: "right" },
    { id: "total", header: "Total", type: "number", visibility: false },
    { id: "completed", header: "Completado", type: "number", visibility: false },
    {
      id: "completion",
      header: "% Avance",
      type: "percentage",
      alignment: "center",
      calculate: (row) => {
        if (!row.total) return 0
        return (row.completed / row.total) * 100
      },
    },
  ],
  transformers: [
    {
      column: "email",
      transform: (value: string) => value?.trim().toLowerCase(),
    },
  ],
  validators: [
    {
      id: "req-email",
      level: "cell",
      column: "email",
      code: "REQUIRED",
      message: "El correo es obligatorio",
      validate: (v) => !!v,
    },
    {
      id: "min-salary",
      level: "cell",
      column: "salary",
      code: "MIN_VALUE",
      message: "El salario debe ser mayor a 0",
      validate: (v) => Number(v) > 0,
    },
  ],
  filters: [
    { id: "f-name", columnId: "name", type: "text", label: "Filtrar por nombre" },
    { id: "f-country", columnId: "country", type: "text", label: "País" },
  ],
  groups: [{ columnId: "country" }],
})
