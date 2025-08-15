'use client'

import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'

interface MUIThemeProviderProps {
  children: React.ReactNode
}

export default function MUIThemeProvider({ children }: MUIThemeProviderProps) {
  // Simple default theme without dependency on theme context to avoid conflicts
  const theme = createTheme({
    palette: {
      mode: 'light', // Default to light mode
      primary: {
        main: '#06b6d4', // cyan-500
        light: '#67e8f9', // cyan-300
        dark: '#0891b2', // cyan-600
      },
      secondary: {
        main: '#8b5cf6', // violet-500
        light: '#a78bfa', // violet-400
        dark: '#7c3aed', // violet-600
      },
      success: {
        main: '#22c55e', // green-500
        light: '#4ade80', // green-400
        dark: '#16a34a', // green-600
      },
      warning: {
        main: '#f59e0b', // amber-500
        light: '#fbbf24', // amber-400
        dark: '#d97706', // amber-600
      },
      error: {
        main: '#ef4444', // red-500
        light: '#f87171', // red-400
        dark: '#dc2626', // red-600
      },
      info: {
        main: '#3b82f6', // blue-500
        light: '#60a5fa', // blue-400
        dark: '#2563eb', // blue-600
      },
      background: {
        default: '#f8fafc', // slate-50
        paper: '#ffffff', // white
      },
      text: {
        primary: '#0f172a', // slate-900
        secondary: '#475569', // slate-600
      },
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 700,
      },
      h3: {
        fontWeight: 600,
      },
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              },
              '&.Mui-focused': {
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(6, 182, 212, 0.2)',
              },
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 500,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          },
        },
      },
      MuiSlider: {
        styleOverrides: {
          root: {
            '& .MuiSlider-thumb': {
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.2)',
              },
            },
            '& .MuiSlider-track': {
              borderRadius: 4,
            },
            '& .MuiSlider-rail': {
              borderRadius: 4,
            },
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            fontSize: '0.875rem',
          },
        },
      },
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}