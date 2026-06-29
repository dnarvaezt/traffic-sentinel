export interface GroupDefinition {
  columnId: string
  label?: string
}

export interface GroupedData {
  key: string
  rows: any[]
  subGroups?: GroupedData[]
}
