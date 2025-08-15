'use client'

import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'

interface MUIThemeProviderProps {
  children: React.ReactNode
}

export default function MUIThemeProvider({ children }: MUIThemeProviderProps) {
  // Material Design 3 dark theme
  const theme = createTheme({
    palette: {
      mode: 'dark', // Dark mode for Material Design 3
      primary: {
        main: '#64b5f6', // Material Design 3 dark primary
        light: '#90caf9', 
        dark: '#1976d2',
        contrastText: '#0a0a0a',
      },
      secondary: {
        main: '#b39ddb', // Material Design 3 dark secondary
        light: '#c5cae9',
        dark: '#512da8',
        contrastText: '#0a0a0a',
      },
      success: {
        main: '#4caf50', // Material green
        light: '#81c784',
        dark: '#388e3c',
        contrastText: '#ffffff',
      },
      warning: {
        main: '#ff9800', // Material orange
        light: '#ffb74d',
        dark: '#f57c00',
        contrastText: '#0a0a0a',
      },
      error: {
        main: '#ef5350', // Material red dark
        light: '#e57373',
        dark: '#c62828',
        contrastText: '#ffffff',
      },
      info: {
        main: '#4dd0e1', // Material cyan
        light: '#80deea',
        dark: '#00838f',
        contrastText: '#0a0a0a',
      },
      background: {
        default: '#121212', // Material Design 3 dark background
        paper: '#1e1e1e', // Material Design 3 dark surface
      },
      text: {
        primary: '#e0e0e0', // Material Design 3 dark on-surface
        secondary: '#a8a8a8', // Material Design 3 dark on-surface-variant
      },
      divider: '#4a4a4a',
    },
    typography: {
      fontFamily: 'Roboto, Inter, system-ui, sans-serif',
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