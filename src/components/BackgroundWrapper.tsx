import React from 'react'
import type { TableTheme } from '../types/table.ts'
import { cn } from '../lib/utils.ts'

interface BackgroundWrapperProps {
  theme: TableTheme
  backgroundImage?: string
  backgroundColor?: string
  children: React.ReactNode
  className?: string
}

export const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({
  theme,
  backgroundImage,
  backgroundColor,
  children,
  className
}) => {
  const getBackgroundStyle = (): React.CSSProperties => {
    const style: React.CSSProperties = {}
    
    if (backgroundImage) {
      style.backgroundImage = `url(${backgroundImage})`
      style.backgroundSize = 'cover'
      style.backgroundPosition = 'center'
      style.backgroundRepeat = 'no-repeat'
    } else if (backgroundColor) {
      // Use 'background' instead of 'backgroundColor' to support gradients
      style.background = backgroundColor
    } else if (theme.wrapperBackground) {
      style.background = theme.wrapperBackground
    } else {
      // Default macOS-style background
      style.background = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }
    
    return style
  }

  const getTableContainerStyle = (): React.CSSProperties => {
    return {
      padding: theme.wrapperPadding ?? '60px',
      minHeight: '600px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }

  const getTableWrapperStyle = (): React.CSSProperties => {
    return {
      // macOS-style elevation and shadow
      borderRadius: '12px',
      overflow: 'hidden',
      // Subtle backdrop blur effect for glass-like appearance
      backdropFilter: 'blur(10px)',
      // Semi-transparent background for glass effect when over images
      backgroundColor: backgroundImage ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
      border: backgroundImage ? '1px solid rgba(255, 255, 255, 0.2)' : 'none'
    }
  }

  return (
    <div 
      className={cn("relative overflow-hidden rounded-xl", className)}
      style={getBackgroundStyle()}
    >
      {/* Optional overlay for better contrast when using background images */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-black opacity-20"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
        />
      )}
      
      <div style={getTableContainerStyle()}>
        <div style={getTableWrapperStyle()}>
          {children}
        </div>
      </div>
    </div>
  )
}