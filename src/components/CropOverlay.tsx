import React, { useRef, useCallback, useState, useEffect } from 'react'
import type { CropSettings } from './CropControls.tsx'

interface CropOverlayProps {
  cropSettings: CropSettings
  onCropSettingsChange: (settings: CropSettings) => void
  tableRef: React.RefObject<HTMLDivElement | null>
  children: React.ReactNode
}

interface DragState {
  isDragging: boolean
  dragStart: { x: number; y: number }
  initialCrop: { top: number; right: number; bottom: number; left: number }
  resizeHandle: string | null // 'top', 'right', 'bottom', 'left', 'top-left', 'top-right', 'bottom-left', 'bottom-right', null for move
}

export const CropOverlay: React.FC<CropOverlayProps> = ({
  cropSettings,
  onCropSettingsChange,
  tableRef,
  children
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    initialCrop: { top: 0, right: 0, bottom: 0, left: 0 },
    resizeHandle: null
  })

  const startDrag = useCallback((e: React.MouseEvent, handle: string | null) => {
    if (!cropSettings.enabled) return
    
    e.preventDefault()
    e.stopPropagation()
    
    setDragState({
      isDragging: true,
      dragStart: { x: e.clientX, y: e.clientY },
      initialCrop: {
        top: cropSettings.top,
        right: cropSettings.right,
        bottom: cropSettings.bottom,
        left: cropSettings.left
      },
      resizeHandle: handle
    })
  }, [cropSettings])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState.isDragging || !containerRef.current) return

    const deltaX = e.clientX - dragState.dragStart.x
    const deltaY = e.clientY - dragState.dragStart.y
    
    let newCropSettings = { ...dragState.initialCrop, enabled: cropSettings.enabled }

    switch (dragState.resizeHandle) {
      case 'top':
        newCropSettings.top = Math.max(0, dragState.initialCrop.top + deltaY)
        break
      case 'right':
        newCropSettings.right = Math.max(0, dragState.initialCrop.right - deltaX)
        break
      case 'bottom':
        newCropSettings.bottom = Math.max(0, dragState.initialCrop.bottom - deltaY)
        break
      case 'left':
        newCropSettings.left = Math.max(0, dragState.initialCrop.left + deltaX)
        break
      case 'top-left':
        newCropSettings.top = Math.max(0, dragState.initialCrop.top + deltaY)
        newCropSettings.left = Math.max(0, dragState.initialCrop.left + deltaX)
        break
      case 'top-right':
        newCropSettings.top = Math.max(0, dragState.initialCrop.top + deltaY)
        newCropSettings.right = Math.max(0, dragState.initialCrop.right - deltaX)
        break
      case 'bottom-left':
        newCropSettings.bottom = Math.max(0, dragState.initialCrop.bottom - deltaY)
        newCropSettings.left = Math.max(0, dragState.initialCrop.left + deltaX)
        break
      case 'bottom-right':
        newCropSettings.bottom = Math.max(0, dragState.initialCrop.bottom - deltaY)
        newCropSettings.right = Math.max(0, dragState.initialCrop.right - deltaX)
        break
      default: // move entire crop area
        newCropSettings.top = Math.max(0, dragState.initialCrop.top + deltaY)
        newCropSettings.right = Math.max(0, dragState.initialCrop.right - deltaX)
        newCropSettings.bottom = Math.max(0, dragState.initialCrop.bottom - deltaY)
        newCropSettings.left = Math.max(0, dragState.initialCrop.left + deltaX)
        break
    }

    onCropSettingsChange(newCropSettings)
  }, [dragState, cropSettings.enabled, onCropSettingsChange])

  const handleMouseUp = useCallback(() => {
    setDragState(prev => ({ ...prev, isDragging: false, resizeHandle: null }))
  }, [])

  useEffect(() => {
    if (dragState.isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [dragState.isDragging, handleMouseMove, handleMouseUp])

  const getCropStyle = (): React.CSSProperties => {
    if (!cropSettings.enabled) return {}

    return {
      position: 'absolute',
      top: `${cropSettings.top}px`,
      right: `${cropSettings.right}px`,
      bottom: `${cropSettings.bottom}px`,
      left: `${cropSettings.left}px`,
      border: '2px dashed #3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.05)',
      pointerEvents: 'all',
      zIndex: 10,
      borderRadius: '4px'
    }
  }

  const getOverlayStyle = (): React.CSSProperties => {
    if (!cropSettings.enabled) return {}

    return {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      zIndex: 5,
      background: `
        linear-gradient(to right, rgba(0,0,0,0.3) 0, rgba(0,0,0,0.3) ${cropSettings.left}px, transparent ${cropSettings.left}px, transparent calc(100% - ${cropSettings.right}px), rgba(0,0,0,0.3) calc(100% - ${cropSettings.right}px)),
        linear-gradient(to bottom, rgba(0,0,0,0.3) 0, rgba(0,0,0,0.3) ${cropSettings.top}px, transparent ${cropSettings.top}px, transparent calc(100% - ${cropSettings.bottom}px), rgba(0,0,0,0.3) calc(100% - ${cropSettings.bottom}px))
      `
    }
  }

  const getHandleStyle = (position: string): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      backgroundColor: '#3b82f6',
      border: '2px solid white',
      borderRadius: '50%',
      width: '12px',
      height: '12px',
      cursor: 'pointer',
      zIndex: 15
    }

    switch (position) {
      case 'top':
        return { ...baseStyle, top: '-6px', left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize' }
      case 'right':
        return { ...baseStyle, right: '-6px', top: '50%', transform: 'translateY(-50%)', cursor: 'ew-resize' }
      case 'bottom':
        return { ...baseStyle, bottom: '-6px', left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize' }
      case 'left':
        return { ...baseStyle, left: '-6px', top: '50%', transform: 'translateY(-50%)', cursor: 'ew-resize' }
      case 'top-left':
        return { ...baseStyle, top: '-6px', left: '-6px', cursor: 'nw-resize' }
      case 'top-right':
        return { ...baseStyle, top: '-6px', right: '-6px', cursor: 'ne-resize' }
      case 'bottom-left':
        return { ...baseStyle, bottom: '-6px', left: '-6px', cursor: 'sw-resize' }
      case 'bottom-right':
        return { ...baseStyle, bottom: '-6px', right: '-6px', cursor: 'se-resize' }
      default:
        return baseStyle
    }
  }

  return (
    <div ref={containerRef} className="relative">
      {children}
      
      {cropSettings.enabled && (
        <>
          {/* Dark overlay to show non-exported areas */}
          <div style={getOverlayStyle()} />
          
          {/* Crop area with dashed border */}
          <div
            style={getCropStyle()}
            onMouseDown={(e) => startDrag(e, null)}
            className="group"
          >
            {/* Resize handles */}
            {['top', 'right', 'bottom', 'left', 'top-left', 'top-right', 'bottom-left', 'bottom-right'].map((handle) => (
              <div
                key={handle}
                style={getHandleStyle(handle)}
                onMouseDown={(e) => startDrag(e, handle)}
                className="opacity-70 hover:opacity-100 transition-opacity"
              />
            ))}
            
            {/* Move instruction (only show when not dragging) */}
            {!dragState.isDragging && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white rounded px-3 py-1 text-sm opacity-80 pointer-events-none">
                Drag to move • Drag handles to resize
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}