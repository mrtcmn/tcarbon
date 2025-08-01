export type CellType = 'text' | 'number' | 'currency' | 'percentage' | 'date'

export interface TableCell {
  id: string
  value: string | number
  type: CellType
  format?: {
    currency?: string
    decimals?: number
    dateFormat?: string
  }
}

export interface TableRow {
  id: string
  cells: TableCell[]
}

export interface TableData {
  id: string
  name: string
  rows: TableRow[]
  columnCount: number
  theme: TableTheme
}

export interface TableTheme {
  id: string
  name: string
  background: string
  headerBackground: string
  borderColor: string
  textColor: string
  headerTextColor: string
  alternateRowBackground?: string
  cellPadding: string
  borderRadius: string
  fontFamily: string
  fontSize: string
  shadows: boolean
  gradients: boolean
}

export interface CellPosition {
  rowIndex: number
  columnIndex: number
}

export interface TableConfig {
  showHeader: boolean
  showRowNumbers: boolean
  allowEditing: boolean
  theme: TableTheme
}