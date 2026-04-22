import { ColumnIndexOutOfBoundsError, RowIndexOutOfBoundsError } from "./dataset.exceptions"
import type {
  Dataset,
  DatasetCell,
  DatasetCellAction,
  DatasetCellCallbackArgs,
  DatasetRow,
  DatasetRowFilter,
  DatasetRowFilterArgs,
} from "./dataset.interface"

export class DatasetService {
  public readonly dataset: Dataset = []
  public readonly cellsPerRow: number = 0
  public readonly cellActions: DatasetCellAction[] = []
  public includeFirstRow: boolean = false

  constructor(args: {
    dataset: Dataset
    cellsPerRow: number
    cellActions: DatasetCellAction[]
    includeFirstRow?: boolean
  }) {
    const { dataset, cellsPerRow, cellActions, includeFirstRow } = args
    this.dataset = dataset
    this.cellsPerRow = cellsPerRow
    this.cellActions = cellActions
    this.includeFirstRow = includeFirstRow ?? false
  }

  public getRow(index: number): DatasetRow {
    if (index < 0 || index >= this.dataset.length) {
      throw new RowIndexOutOfBoundsError(index, this.dataset.length)
    }
    return this.dataset[index]
  }

  public getCell(rowIndex: number, columnIndex: number): DatasetCell {
    if (rowIndex < 0 || rowIndex >= this.dataset.length) {
      throw new RowIndexOutOfBoundsError(rowIndex, this.dataset.length)
    }

    const row = this.dataset[rowIndex]
    if (columnIndex < 0 || columnIndex >= row.length) {
      throw new ColumnIndexOutOfBoundsError(columnIndex, row.length, rowIndex)
    }

    return this.dataset[rowIndex][columnIndex]
  }

  private shouldSkipFirstRow(rowIndex: number): boolean {
    return !this.includeFirstRow && rowIndex === 0
  }

  private getCellAction(columnIndex: number): DatasetCellAction | null {
    return this.cellActions.find((action) => action.key === columnIndex) ?? null
  }

  public validateCell(rowIndex: number, columnIndex: number): boolean {
    if (this.shouldSkipFirstRow(rowIndex)) {
      return true
    }
    const cell = this.getCell(rowIndex, columnIndex)
    const row = this.getRow(rowIndex)
    const cellAction = this.getCellAction(columnIndex)
    return (
      cellAction?.validator?.({
        cell,
        row,
        rowIndex,
        columnIndex,
        includeFirstRow: this.includeFirstRow,
      }) ?? true
    )
  }

  public validateRow(rowIndex: number): boolean {
    if (this.shouldSkipFirstRow(rowIndex)) {
      return true
    }
    const row = this.getRow(rowIndex)
    return row.every((_cell, columnIndex) => this.validateCell(rowIndex, columnIndex))
  }

  public validateDataset(): boolean {
    return this.dataset.every((_row, rowIndex) => this.validateRow(rowIndex))
  }

  public parseCell(rowIndex: number, columnIndex: number): DatasetCell {
    if (this.shouldSkipFirstRow(rowIndex)) {
      return this.getCell(rowIndex, columnIndex)
    }
    const cell = this.getCell(rowIndex, columnIndex)
    const row = this.getRow(rowIndex)
    const cellAction = this.getCellAction(columnIndex)
    return (
      cellAction?.parser?.({
        cell,
        row,
        rowIndex,
        columnIndex,
        includeFirstRow: this.includeFirstRow,
      }) ?? cell
    )
  }

  public parseRow(rowIndex: number): DatasetRow {
    if (this.shouldSkipFirstRow(rowIndex)) {
      return this.getRow(rowIndex)
    }

    let originalRow: DatasetRow = this.getRow(rowIndex)
    if (originalRow?.length) originalRow = [...originalRow]

    const parseItems: DatasetCellAction[] = this.cellActions.filter((action) => action.parser)

    parseItems?.forEach((item) => {
      const args: DatasetCellCallbackArgs = {
        cell: originalRow[item.key],
        row: originalRow,
        rowIndex,
        columnIndex: item.key,
        includeFirstRow: this.includeFirstRow,
      }
      originalRow[item.key] = item.parser?.(args) ?? originalRow[item.key]
    })

    return originalRow
  }

  public parseDataset(): Dataset {
    return this.dataset.map((_row, rowIndex) => this.parseRow(rowIndex))
  }

  public filterRows(args: { dataset: Dataset; filter: DatasetRowFilter }): Dataset {
    const { dataset, filter } = args
    return dataset.filter((row) => filter(row))
  }

  public excludeRows(args: DatasetRowFilterArgs): Dataset {
    const { dataset, filter } = args
    return dataset.filter((row) => !filter(row))
  }
}
