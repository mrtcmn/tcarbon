import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext.tsx'
import { Button } from './ui/button.tsx'

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="relative transition-all duration-200 hover:scale-105"
    >
      <div className="relative size-5">
        <Sun 
          className={`absolute size-5 transition-all duration-300 ${
            theme === 'light' 
              ? 'rotate-0 scale-100 opacity-100' 
              : 'rotate-90 scale-0 opacity-0'
          }`}
        />
        <Moon 
          className={`absolute size-5 transition-all duration-300 ${
            theme === 'dark' 
              ? 'rotate-0 scale-100 opacity-100' 
              : '-rotate-90 scale-0 opacity-0'
          }`}
        />
      </div>
      <span className="ml-2 hidden sm:inline">
        {theme === 'light' ? 'Dark' : 'Light'}
      </span>
    </Button>
  )
}