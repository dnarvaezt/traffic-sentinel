export interface Transformer {
  column: string
  transform: (value: any) => any
}
