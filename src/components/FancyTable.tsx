import React, { useState, useCallback, useRef } from 'react'
import type { TableData, TableCell as TableCellType, CellPosition, TableTheme } from '../types/table.ts'
import { TableCell } from './TableCell.tsx'
import { generateId, cn } from '../lib/utils.ts'

interface FancyTableProps {
  data: TableData
  onDataChange: (data: TableData) => void
  className?: string
}

export const FancyTable: React.FC<FancyTableProps> = ({
  data,
  onDataChange,
  className
}) => {
  const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null)
  const [editingCell, setEditingCell] = useState<CellPosition | null>(null)
  const tableRef = useRef<HTMLTableElement>(null)

  const handleCellClick = useCallback((rowIndex: number, columnIndex: number) => {
    setSelectedCell({ rowIndex, columnIndex })
    setEditingCell(null)
  }, [])

  const handleCellDoubleClick = useCallback((rowIndex: number, columnIndex: number) => {
    setSelectedCell({ rowIndex, columnIndex })
    setEditingCell({ rowIndex, columnIndex })
  }, [])

  const handleCellChange = useCallback((rowIndex: number, columnIndex: number, value: string | number) => {
    const newData = { ...data }
    if (newData.rows[rowIndex] && newData.rows[rowIndex].cells[columnIndex]) {
      newData.rows[rowIndex].cells[columnIndex].value = value
      onDataChange(newData)
    }
    setEditingCell(null)
  }, [data, onDataChange])

  const handleKeyDown = useCallback((e: React.KeyboardEvent, rowIndex: number, columnIndex: number) => {
    if (!selectedCell) return

    let newRowIndex = rowIndex
    let newColumnIndex = columnIndex

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        newRowIndex = Math.max(0, rowIndex - 1)
        break
      case 'ArrowDown':
        e.preventDefault()
        newRowIndex = Math.min(data.rows.length - 1, rowIndex + 1)
        break
      case 'ArrowLeft':
        e.preventDefault()
        newColumnIndex = Math.max(0, columnIndex - 1)
        break
      case 'ArrowRight':
        e.preventDefault()
        newColumnIndex = Math.min(data.columnCount - 1, columnIndex + 1)
        break
      case 'Enter':
        e.preventDefault()
        if (editingCell) {
          setEditingCell(null)
        } else {
          setEditingCell({ rowIndex, columnIndex })
        }
        return
      case 'Escape':
        e.preventDefault()
        setEditingCell(null)
        return
      case 'Delete':
      case 'Backspace':
        e.preventDefault()
        if (!editingCell) {
          handleCellChange(rowIndex, columnIndex, '')
        }
        return
      default:
        if (!editingCell && e.key.length === 1) {
          setEditingCell({ rowIndex, columnIndex })
        }
        return
    }

    setSelectedCell({ rowIndex: newRowIndex, columnIndex: newColumnIndex })
  }, [selectedCell, editingCell, data.rows.length, data.columnCount, handleCellChange])

  const getTableStyles = (theme: TableTheme): React.CSSProperties => {
    return {
      background: theme.background,
      borderRadius: theme.borderRadius,
      overflow: 'hidden',
      fontFamily: theme.fontFamily,
      fontSize: theme.fontSize,
      color: theme.textColor,
      // Remove shadow from here as it's now handled by BackgroundWrapper
      border: `1px solid ${theme.borderColor}`
    }
  }

  const getHeaderStyles = (theme: TableTheme): React.CSSProperties => {
    return {
      background: theme.headerBackground,
      color: theme.headerTextColor,
      padding: theme.cellPadding,
      borderColor: theme.borderColor
    }
  }

  const getCellStyles = (theme: TableTheme, isAlternate: boolean): React.CSSProperties => {
    return {
      padding: theme.cellPadding,
      borderColor: theme.borderColor,
      backgroundColor: isAlternate && theme.alternateRowBackground ? theme.alternateRowBackground : 'transparent'
    }
  }

  const renderHeaders = () => {
    const headers = []
    for (let i = 0; i < data.columnCount; i++) {
      headers.push(
        <th
          key={i}
          style={getHeaderStyles(data.theme)}
          className="border border-gray-300 font-semibold"
        >
          {String.fromCharCode(65 + i)}
        </th>
      )
    }
    return headers
  }

  return (
    <div 
      className={cn("inline-block", className)}
      style={getTableStyles(data.theme)}
    >
      <table 
        ref={tableRef}
        className="border-collapse"
        style={{ borderColor: data.theme.borderColor }}
      >
        <thead>
          <tr>
            {renderHeaders()}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, rowIndex) => (
            <tr key={row.id}>
              {row.cells.map((cell, columnIndex) => (
                <TableCell
                  key={cell.id}
                  cell={cell}
                  isSelected={
                    selectedCell?.rowIndex === rowIndex && 
                    selectedCell?.columnIndex === columnIndex
                  }
                  isEditing={
                    editingCell?.rowIndex === rowIndex && 
                    editingCell?.columnIndex === columnIndex
                  }
                  onCellClick={() => handleCellClick(rowIndex, columnIndex)}
                  onCellDoubleClick={() => handleCellDoubleClick(rowIndex, columnIndex)}
                  onCellChange={(value) => handleCellChange(rowIndex, columnIndex, value)}
                  onKeyDown={(e) => handleKeyDown(e, rowIndex, columnIndex)}
                  style={getCellStyles(data.theme, rowIndex % 2 === 1)}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}