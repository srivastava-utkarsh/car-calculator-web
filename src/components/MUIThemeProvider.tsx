'use client'

import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline, StyledEngineProvider } from '@mui/material'

interface MUIThemeProviderProps {
  children: React.ReactNode
}

export default function MUIThemeProvider({ children }: MUIThemeProviderProps) {
  // Material Design 3 light theme
  const theme = createTheme({
    palette: {
      mode: 'light', // Light mode for Material Design 3
      primary: {
        main: '#1976d2', // Material Design 3 light primary
        light: '#42a5f5', 
        dark: '#1565c0',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#7c4dff', // Material Design 3 light secondary
        light: '#b39ddb',
        dark: '#512da8',
        contrastText: '#ffffff',
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
        contrastText: '#ffffff',
      },
      error: {
        main: '#d32f2f', // Material red light
        light: '#ef5350',
        dark: '#b71c1c',
        contrastText: '#ffffff',
      },
      info: {
        main: '#0288d1', // Material cyan
        light: '#4dd0e1',
        dark: '#01579b',
        contrastText: '#ffffff',
      },
      background: {
        default: '#fafafa', // Material Design 3 light background
        paper: '#ffffff', // Material Design 3 light surface
      },
      text: {
        primary: '#212121', // Material Design 3 light on-surface
        secondary: '#757575', // Material Design 3 light on-surface-variant
      },
      divider: '#e0e0e0',
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
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  )
}