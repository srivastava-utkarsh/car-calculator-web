'use client'

import { createContext, useContext, useEffect, ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  isDark: boolean
  isLight: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
}

// The site is light-only. The provider keeps the old ThemeContext API so the many
// `isLight ? ... : ...` branches across components keep compiling, but it always
// reports light and ignores any previously saved theme preference.
export function ThemeProvider({ children }: ThemeProviderProps) {
  useEffect(() => {
    // Clear stale preference from when the site had a dark theme
    localStorage.removeItem('theme')
    // globals.css keys its tokens off this attribute
    document.documentElement.dataset.theme = 'light'
  }, [])

  const contextValue: ThemeContextType = {
    theme: 'light',
    toggleTheme: () => {},
    isDark: false,
    isLight: true,
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
