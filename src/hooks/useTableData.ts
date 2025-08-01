import { useState, useCallback } from 'react'
import type { TableData, TableTheme } from '../types/table.ts'
import { createEmptyTable } from '../lib/fileUtils.ts'

export const useTableData = (initialData?: TableData) => {
  const [tableData, setTableData] = useState<TableData>(
    initialData || createEmptyTable()
  )

  const updateTableData = useCallback((newData: TableData) => {
    setTableData(newData)
  }, [])

  const updateTheme = useCallback((theme: TableTheme) => {
    setTableData(prev => ({
      ...prev,
      theme
    }))
  }, [])

  const resetTable = useCallback(() => {
    setTableData(createEmptyTable())
  }, [])

  const addRow = useCallback(() => {
    setTableData(prev => {
      const newRow = {
        id: Math.random().toString(36).substr(2, 9),
        cells: Array.from({ length: prev.columnCount }, () => ({
          id: Math.random().toString(36).substr(2, 9),
          value: '',
          type: 'text' as const
        }))
      }
      
      return {
        ...prev,
        rows: [...prev.rows, newRow]
      }
    })
  }, [])

  const addColumn = useCallback(() => {
    setTableData(prev => {
      const newRows = prev.rows.map(row => ({
        ...row,
        cells: [...row.cells, {
          id: Math.random().toString(36).substr(2, 9),
          value: '',
          type: 'text' as const
        }]
      }))

      return {
        ...prev,
        rows: newRows,
        columnCount: prev.columnCount + 1
      }
    })
  }, [])

  const removeRow = useCallback((rowIndex: number) => {
    setTableData(prev => ({
      ...prev,
      rows: prev.rows.filter((_, index) => index !== rowIndex)
    }))
  }, [])

  const removeColumn = useCallback((columnIndex: number) => {
    setTableData(prev => {
      const newRows = prev.rows.map(row => ({
        ...row,
        cells: row.cells.filter((_, index) => index !== columnIndex)
      }))

      return {
        ...prev,
        rows: newRows,
        columnCount: Math.max(1, prev.columnCount - 1)
      }
    })
  }, [])

  return {
    tableData,
    updateTableData,
    updateTheme,
    resetTable,
    addRow,
    addColumn,
    removeRow,
    removeColumn
  }
}