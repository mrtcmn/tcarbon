import React, { useState, useCallback, useRef } from 'react'
import type { TableData, CellPosition, TableTheme } from '../types/table.ts'
import { TableCell } from './TableCell.tsx'
import { cn } from '../lib/utils.ts'

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
  const [selectedCell, setSelectedCell] = useState<CellPosition | null>({ rowIndex: 0, columnIndex: 0 })
  const [editingCell, setEditingCell] = useState<CellPosition | null>(null)
  const [editingStartedWithChar, setEditingStartedWithChar] = useState<string | null>(null)
  const tableRef = useRef<HTMLTableElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleCellClick = useCallback((rowIndex: number, columnIndex: number) => {
    setSelectedCell({ rowIndex, columnIndex })
    setEditingCell(null)
    setEditingStartedWithChar(null)
    // Ensure the container gets focus for keyboard navigation
    if (containerRef.current) {
      containerRef.current.focus()
    }
  }, [])

  const handleCellDoubleClick = useCallback((rowIndex: number, columnIndex: number) => {
    setSelectedCell({ rowIndex, columnIndex })
    setEditingCell({ rowIndex, columnIndex })
    setEditingStartedWithChar(null)
  }, [])

  const handleCellChange = useCallback((rowIndex: number, columnIndex: number, value: string | number) => {
    const newData = { ...data }
    if (newData.rows[rowIndex] && newData.rows[rowIndex].cells[columnIndex]) {
      newData.rows[rowIndex].cells[columnIndex].value = value
      onDataChange(newData)
    }
    setEditingCell(null)
    setEditingStartedWithChar(null)
  }, [data, onDataChange])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!selectedCell) return

    const { rowIndex, columnIndex } = selectedCell
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
        if (editingCell && editingCell.rowIndex === rowIndex && editingCell.columnIndex === columnIndex) {
          setEditingCell(null)
          setEditingStartedWithChar(null)
        } else {
          setEditingCell({ rowIndex, columnIndex })
          setEditingStartedWithChar(null)
        }
        return
      case 'Escape':
        e.preventDefault()
        setEditingCell(null)
        setEditingStartedWithChar(null)
        return
      case 'Delete':
      case 'Backspace':
        e.preventDefault()
        if (!editingCell || (editingCell.rowIndex !== rowIndex || editingCell.columnIndex !== columnIndex)) {
          handleCellChange(rowIndex, columnIndex, '')
        }
        return
      default:
        if (!editingCell && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault()
          setEditingCell({ rowIndex, columnIndex })
          setEditingStartedWithChar(e.key)
        }
        return
    }

    setSelectedCell({ rowIndex: newRowIndex, columnIndex: newColumnIndex })
    setEditingCell(null) // Stop editing when navigating
    setEditingStartedWithChar(null)
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
      ref={containerRef}
      className={cn("inline-block", className)}
      style={getTableStyles(data.theme)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      onClick={() => {
        // Ensure the container gets focus when clicked
        if (containerRef.current) {
          containerRef.current.focus()
        }
      }}
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
                  editingStartedWithChar={
                    editingCell?.rowIndex === rowIndex && 
                    editingCell?.columnIndex === columnIndex 
                      ? editingStartedWithChar 
                      : null
                  }
                  onCellClick={() => handleCellClick(rowIndex, columnIndex)}
                  onCellDoubleClick={() => handleCellDoubleClick(rowIndex, columnIndex)}
                  onCellChange={(value) => handleCellChange(rowIndex, columnIndex, value)}
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