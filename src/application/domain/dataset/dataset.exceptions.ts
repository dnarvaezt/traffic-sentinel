/**
 * Excepción lanzada cuando se intenta acceder a una fila que no existe
 */
export class RowIndexOutOfBoundsError extends Error {
  constructor(index: number, datasetLength: number) {
    super(`Índice de fila ${index} fuera de rango. El dataset tiene ${datasetLength} filas.`)
    this.name = "RowIndexOutOfBoundsError"
  }
}

/**
 * Excepción lanzada cuando se intenta acceder a una columna que no existe
 */
export class ColumnIndexOutOfBoundsError extends Error {
  constructor(columnIndex: number, rowLength: number, rowIndex: number) {
    super(
      `Índice de columna ${columnIndex} fuera de rango en la fila ${rowIndex}. La fila tiene ${rowLength} columnas.`,
    )
    this.name = "ColumnIndexOutOfBoundsError"
  }
}
