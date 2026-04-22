/**
 * Representa el valor de una celda individual en el dataset
 * @example "John Doe"
 * @example "123"
 * @example "2024-01-15"
 */
export type DatasetCell = string

/**
 * Representa una fila completa del dataset (array de celdas)
 * Cada fila contiene los valores de todas las columnas en orden
 * @example ["John Doe", "30", "Engineer"]
 * @example ["Jane Smith", "25", "Designer"]
 */
export type DatasetRow = DatasetCell[]

/**
 * Representa el dataset completo (array de filas)
 * Estructura bidimensional donde cada fila es un registro del dataset
 * @example [
 *   ["name", "age", "role"],
 *   ["John Doe", "30", "Engineer"],
 *   ["Jane Smith", "25", "Designer"]
 * ]
 */
export type Dataset = DatasetRow[]

/**
 * Argumentos proporcionados a las funciones de callback para validación y parsing de celdas
 * Contiene el valor de la celda y su posición en el dataset
 *
 * @property cell - Valor actual de la celda a procesar
 * @property rowIndex - Índice de la fila (base 0)
 * @property columnIndex - Índice de la columna (base 0)
 *
 * @example
 * ```ts
 * const args: DatasetCellCallbackArgs = {
 *   cell: "John Doe",
 *   rowIndex: 0,
 *   columnIndex: 0
 * }
 * ```
 */
export type DatasetCellCallbackArgs = {
  cell: DatasetCell
  row: DatasetRow
  columnIndex: number
  rowIndex: number
  includeFirstRow: boolean
}

/**
 * Función validadora para verificar si una celda cumple con ciertas condiciones
 * Retorna `true` si la celda es válida, `false` en caso contrario
 *
 * @param args - Argumentos con el valor de la celda y su posición
 * @returns `true` si la celda es válida, `false` si no cumple con la validación
 *
 * @example
 * ```ts
 * const emailValidator: DatasetCellValidator = ({ cell }) => {
 *   return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cell)
 * }
 * ```
 *
 * @example
 * ```ts
 * const requiredValidator: DatasetCellValidator = ({ cell }) => {
 *   return cell.trim().length > 0
 * }
 * ```
 */
export type DatasetCellValidator = (args: DatasetCellCallbackArgs) => boolean

/**
 * Función parser para transformar el valor de una celda antes de usarlo
 * Puede normalizar, formatear o convertir el valor según sea necesario
 *
 * @param args - Argumentos con el valor de la celda y su posición
 * @returns Valor transformado de la celda
 *
 * @example
 * ```ts
 * const trimParser: DatasetCellParser = ({ cell }) => {
 *   return cell.trim()
 * }
 * ```
 *
 * @example
 * ```ts
 * const uppercaseParser: DatasetCellParser = ({ cell }) => {
 *   return cell.toUpperCase()
 * }
 * ```
 *
 * @example
 * ```ts
 * const numberParser: DatasetCellParser = ({ cell }) => {
 *   return parseFloat(cell).toString()
 * }
 * ```
 */
export type DatasetCellParser = (args: DatasetCellCallbackArgs) => DatasetCell

/**
 * Configuración de acciones (validación y parsing) aplicadas a columnas específicas
 * La clave es el índice de la columna (base 0) y el valor contiene las funciones opcionales
 *
 * @property [key: number] - Índice de la columna donde aplicar las acciones
 * @property validator - Función opcional para validar celdas de esta columna
 * @property parser - Función opcional para transformar celdas de esta columna
 *
 * @example
 * ```ts
 * const cellActions: DatasetCellAction = {
 *   0: {
 *     validator: ({ cell }) => cell.trim().length > 0,
 *     parser: ({ cell }) => cell.trim()
 *   },
 *   1: {
 *     validator: ({ cell }) => !isNaN(parseFloat(cell)),
 *     parser: ({ cell }) => parseFloat(cell).toString()
 *   },
 *   2: {
 *     validator: ({ cell }) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cell)
 *   }
 * }
 * ```
 */
export type DatasetCellAction = {
  key: number
  validator?: DatasetCellValidator
  parser?: DatasetCellParser
}

export type DatasetRowFilter = (row: DatasetRow) => boolean

export type DatasetRowFilterArgs = {
  dataset: Dataset
  filter: DatasetRowFilter
}

export type DatasetFilter = {
  name: string
  description: string
  filter?: DatasetRowFilter
}

export type DatasetFilters = DatasetFilter[]
