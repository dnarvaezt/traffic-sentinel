import type { FilterDefinition } from "../../domain/models/filter"

export class FilterDataService {
  execute(
    data: Record<string, any>[],
    filters: FilterDefinition[],
    runtimeFilters: Record<string, any> = {},
  ): Record<string, any>[] {
    if (!filters || filters.length === 0) return data

    return data.filter((row) => {
      return filters.every((filter) => {
        const value = row[filter.columnId]
        const filterValue = runtimeFilters[filter.id]

        if (filterValue === undefined || filterValue === null || filterValue === "") {
          return true
        }

        // Simple implementation of operators
        switch (filter.type) {
          case "text":
            return String(value || "")
              .toLowerCase()
              .includes(String(filterValue).toLowerCase())
          case "number":
            return Number(value) === Number(filterValue)
          case "boolean":
            return Boolean(value) === Boolean(filterValue)
          case "select":
            return value === filterValue
          default:
            return true
        }
      })
    })
  }
}

export const filterDataService = new FilterDataService()
