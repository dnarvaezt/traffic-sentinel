export interface GroupDefinition {
  columnId: string
}

export interface GroupedData {
  key: string
  rows: any[]
  subGroups?: GroupedData[]
}
