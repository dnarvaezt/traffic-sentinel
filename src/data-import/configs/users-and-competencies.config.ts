import { createSchema } from "../domain/models/schema"

export const usersImportSchema = createSchema({
  columns: [
    { id: "username", header: "Usuario", type: "string" },
    { id: "role", header: "Rol", type: "string" },
    { id: "lastLogin", header: "Último Acceso", type: "date" },
    { id: "active", header: "Activo", type: "boolean" },
  ],
  filters: [
    { id: "active-filter", columnId: "active", type: "boolean", label: "Solo activos" },
    { id: "role-filter", columnId: "role", type: "text", label: "Filtrar por rol" },
  ],
})

export const competenciesImportSchema = createSchema({
  columns: [
    { id: "competency", header: "Competencia", type: "string" },
    { id: "level", header: "Nivel Requerido", type: "number" },
    { id: "department", header: "Departamento", type: "string" },
  ],
  validators: [
    {
      id: "unique-competency",
      level: "column",
      column: "competency",
      code: "UNIQUE",
      message: "Las competencias deben ser únicas",
      validate: (values: string[]) => new Set(values).size === values.length,
    },
  ],
  groups: [{ columnId: "department" }],
})
