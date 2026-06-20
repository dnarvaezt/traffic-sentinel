import type { GroupDefinition, GroupedData } from "../../domain/models/group"

export class GroupDataService {
  execute(
    data: Record<string, any>[],
    groups: GroupDefinition[],
  ): GroupedData[] | Record<string, any>[] {
    if (!groups || groups.length === 0) return data

    return this.groupRecursive(data, groups, 0)
  }

  private groupRecursive(
    data: Record<string, any>[],
    groups: GroupDefinition[],
    depth: number,
  ): GroupedData[] {
    const groupDef = groups[depth]
    const grouped = new Map<string, Record<string, any>[]>()

    for (const row of data) {
      const key = String(row[groupDef.columnId] ?? "N/A")
      if (!grouped.has(key)) {
        grouped.set(key, [])
      }
      grouped.get(key)!.push(row)
    }

    const result: GroupedData[] = []
    for (const [key, rows] of grouped) {
      const groupedData: GroupedData = {
        key,
        rows,
      }

      if (depth + 1 < groups.length) {
        groupedData.subGroups = this.groupRecursive(rows, groups, depth + 1)
      }

      result.push(groupedData)
    }

    return result
  }
}

export const groupDataService = new GroupDataService()
