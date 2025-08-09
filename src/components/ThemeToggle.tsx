'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative inline-flex items-center justify-center w-12 h-6 rounded-full transition-all duration-300 ease-in-out
        ${isDark 
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/25' 
          : 'bg-gradient-to-r from-orange-400 to-yellow-500 shadow-lg shadow-orange-400/25'
        }
        hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 
        ${isDark ? 'focus:ring-blue-500' : 'focus:ring-orange-400'}
      `}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Toggle Circle */}
      <div
        className={`
          absolute w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ease-in-out
          flex items-center justify-center
          ${isDark ? 'transform translate-x-3' : 'transform -translate-x-3'}
        `}
      >
        {isDark ? (
          <Moon className="w-3 h-3 text-blue-600" />
        ) : (
          <Sun className="w-3 h-3 text-orange-500" />
        )}
      </div>
      
      {/* Background Icons */}
      <div className="absolute inset-0 flex items-center justify-between px-1">
        <Sun className={`w-3 h-3 transition-opacity duration-300 ${isDark ? 'opacity-30' : 'opacity-70'} text-white`} />
        <Moon className={`w-3 h-3 transition-opacity duration-300 ${isDark ? 'opacity-70' : 'opacity-30'} text-white`} />
      </div>
    </button>
  )
}