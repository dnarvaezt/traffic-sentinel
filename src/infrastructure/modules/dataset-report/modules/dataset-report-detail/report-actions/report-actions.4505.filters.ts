import type { DatasetFilters, DatasetRow } from "@/application/domain"

export const reportActions4505Filters: DatasetFilters = [
  {
    name: "Estructura de Peso y Talla",
    description:
      "Evalúa la consistencia de los datos en las columnas de fechas y valores asociados al peso y la talla, verificando que no contengan valores por defecto o fuera de rango (por ejemplo: '1800-01-01', '1845-01-01', '999' o '0').",
    filter: (row: DatasetRow): boolean => {
      const wildcardDates = ["1800-01-01", "1845-01-01"]
      const wildcardNumbers = ["0", "21", "998", "999", "999.0000"]

      const weightDate = wildcardDates.includes(row[29])
      const weight = wildcardNumbers.includes(row[30])
      const sizeDate = wildcardDates.includes(row[31])
      const size = wildcardNumbers.includes(row[32])

      // Devuelve true si las 4 posiciones son comodines
      return weightDate && weight && sizeDate && size
    },
  },
]
