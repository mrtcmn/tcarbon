import * as XLSX from 'xlsx'
import Papa from 'papaparse'
import type { TableData, TableRow, TableCell, CellType } from '../types/table.ts'
import { generateId } from './utils.ts'
import { defaultThemes } from './themes.ts'

export const parseCSV = (csvText: string): string[][] => {
  const result = Papa.parse(csvText, {
    skipEmptyLines: true,
  })
  return result.data as string[][]
}

export const parseExcel = async (file: File): Promise<string[][]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        resolve(jsonData)
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

export const detectCellType = (value: string): CellType => {
  if (!value || value.trim() === '') return 'text'
  
  // Check for currency
  if (/^\$[\d,]+(\.\d{2})?$/.test(value.trim())) return 'currency'
  
  // Check for percentage
  if (/^\d+(\.\d+)?%$/.test(value.trim())) return 'percentage'
  
  // Check for number
  if (/^-?\d+(\.\d+)?$/.test(value.trim())) return 'number'
  
  // Check for date
  if (!isNaN(Date.parse(value))) return 'date'
  
  return 'text'
}

export const convertValueByType = (value: string, type: CellType): string | number => {
  switch (type) {
    case 'number':
      const num = parseFloat(value.replace(/[^\d.-]/g, ''))
      return isNaN(num) ? value : num
    case 'currency':
      const currency = parseFloat(value.replace(/[^\d.-]/g, ''))
      return isNaN(currency) ? value : currency
    case 'percentage':
      const percent = parseFloat(value.replace(/[^\d.-]/g, ''))
      return isNaN(percent) ? value : percent / 100
    default:
      return value
  }
}

export const arrayToTableData = (
  data: string[][],
  name: string = 'Imported Table'
): TableData => {
  if (!data || data.length === 0) {
    return createEmptyTable(name)
  }

  const maxColumns = Math.max(...data.map(row => row.length))
  
  const rows: TableRow[] = data.map((rowData, rowIndex) => {
    const cells: TableCell[] = []
    
    for (let colIndex = 0; colIndex < maxColumns; colIndex++) {
      const cellValue = rowData[colIndex] || ''
      const cellType = detectCellType(cellValue)
      const convertedValue = convertValueByType(cellValue, cellType)
      
      cells.push({
        id: generateId(),
        value: convertedValue,
        type: cellType,
        format: cellType === 'currency' ? { currency: 'USD', decimals: 2 } : undefined
      })
    }
    
    return {
      id: generateId(),
      cells
    }
  })

  return {
    id: generateId(),
    name,
    rows,
    columnCount: maxColumns,
    theme: defaultThemes[0]
  }
}

export const createEmptyTable = (name: string = 'New Table'): TableData => {
  const rows: TableRow[] = []
  
  for (let i = 0; i < 10; i++) {
    const cells: TableCell[] = []
    for (let j = 0; j < 8; j++) {
      cells.push({
        id: generateId(),
        value: '',
        type: 'text'
      })
    }
    rows.push({
      id: generateId(),
      cells
    })
  }

  return {
    id: generateId(),
    name,
    rows,
    columnCount: 8,
    theme: defaultThemes[0]
  }
}

export const tableDataToCSV = (data: TableData): string => {
  const csvData = data.rows.map(row => 
    row.cells.map(cell => {
      if (typeof cell.value === 'number') {
        if (cell.type === 'currency') {
          return `$${cell.value.toFixed(2)}`
        } else if (cell.type === 'percentage') {
          return `${(cell.value * 100).toFixed(2)}%`
        }
        return cell.value.toString()
      }
      return cell.value
    })
  )
  
  return Papa.unparse(csvData)
}

export const tableDataToExcel = (data: TableData): ArrayBuffer => {
  const worksheet = XLSX.utils.aoa_to_sheet(
    data.rows.map(row => 
      row.cells.map(cell => {
        if (typeof cell.value === 'number') {
          return cell.value
        }
        return cell.value
      })
    )
  )
  
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, data.name)
  
  return XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
}