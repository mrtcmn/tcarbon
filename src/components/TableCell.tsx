import React, { useState, useRef, useEffect } from 'react'
import type { TableCell as TableCellType, CellType } from '../types/table.ts'
import { formatCurrency, formatNumber, parseNumber, cn } from '../lib/utils.ts'

interface TableCellProps {
  cell: TableCellType
  isSelected: boolean
  isEditing: boolean
  editingStartedWithChar?: string | null
  onCellClick: () => void
  onCellDoubleClick: () => void
  onCellChange: (value: string | number) => void
  style?: React.CSSProperties
}

export const TableCell: React.FC<TableCellProps> = ({
  cell,
  isSelected,
  isEditing,
  editingStartedWithChar,
  onCellClick,
  onCellDoubleClick,
  onCellChange,
  style
}) => {
  const [editValue, setEditValue] = useState(cell.value.toString())
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  // When editing starts, check if we should start with a typed character
  useEffect(() => {
    if (isEditing) {
      if (editingStartedWithChar) {
        // Start editing with the typed character
        setEditValue(editingStartedWithChar)
      } else {
        // Start editing with the current cell value
        setEditValue(cell.value.toString())
      }
    }
  }, [isEditing, editingStartedWithChar, cell.value])

  useEffect(() => {
    setEditValue(cell.value.toString())
  }, [cell.value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value)
  }

  const handleInputBlur = () => {
    let newValue: string | number = editValue

    if (cell.type === 'number' || cell.type === 'currency' || cell.type === 'percentage') {
      const parsed = parseNumber(editValue)
      if (parsed !== null) {
        newValue = parsed
      }
    }

    onCellChange(newValue)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault()
      handleInputBlur()
    }
    // Prevent event bubbling to parent to avoid triggering table navigation
    e.stopPropagation()
  }

  const formatCellValue = (value: string | number, type: CellType): string => {
    if (typeof value === 'string') return value

    switch (type) {
      case 'currency':
        return formatCurrency(value, cell.format?.currency)
      case 'number':
        return formatNumber(value, cell.format?.decimals)
      case 'percentage':
        return `${formatNumber(value * 100, cell.format?.decimals ?? 2)}%`
      default:
        return value.toString()
    }
  }

  const getCellAlignment = (type: CellType): string => {
    switch (type) {
      case 'number':
      case 'currency':
      case 'percentage':
        return 'text-right'
      default:
        return 'text-left'
    }
  }

  if (isEditing) {
    return (
      <td
        className={cn(
          'relative border border-gray-300',
          isSelected && 'ring-2 ring-blue-500'
        )}
        style={style}
      >
        <input
          ref={inputRef}
          value={editValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          className="size-full border-none bg-transparent px-2 py-1 outline-none"
          style={{ 
            fontFamily: 'inherit',
            fontSize: 'inherit',
            color: 'inherit'
          }}
        />
      </td>
    )
  }

  return (
    <td
      className={cn(
        'relative cursor-cell border border-gray-300 transition-all duration-150',
        isSelected && 'ring-2 ring-inset ring-blue-500',
        getCellAlignment(cell.type),
        'hover:bg-black/5'
      )}
      style={style}
      onClick={onCellClick}
      onDoubleClick={onCellDoubleClick}
    >
      <div className="flex min-h-[1.5rem] items-center px-2 py-1">
        {formatCellValue(cell.value, cell.type)}
      </div>
    </td>
  )
}