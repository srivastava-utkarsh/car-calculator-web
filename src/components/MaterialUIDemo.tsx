'use client'

import React from 'react'
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Paper,
  Chip
} from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'

// Simple Material UI theme
const materialTheme = createTheme({
  palette: {
    primary: {
      main: '#06b6d4', // cyan-500
    },
    secondary: {
      main: '#8b5cf6', // violet-500
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
})

interface MaterialUIDemoProps {
  carData: {
    carPrice?: number
    downPayment?: number
    [key: string]: any // eslint-disable-line @typescript-eslint/no-explicit-any
  }
  updateCarData: (updates: Record<string, any>) => void // eslint-disable-line @typescript-eslint/no-explicit-any
}

export default function MaterialUIDemo({ carData, updateCarData }: MaterialUIDemoProps) {
  return (
    <ThemeProvider theme={materialTheme}>
      <Box sx={{ p: 3 }}>
        <Paper elevation={2} sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Material UI Demo
          </Typography>
          
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
            <TextField
              fullWidth
              label="Car Price"
              value={carData.carPrice || ''}
              onChange={(e) => updateCarData({ carPrice: parseFloat(e.target.value) || 0 })}
              placeholder="Enter car price"
            />
            
            <TextField
              fullWidth
              label="Down Payment"
              value={carData.downPayment || ''}
              onChange={(e) => updateCarData({ downPayment: parseFloat(e.target.value) || 0 })}
              placeholder="Enter down payment"
            />
          </Box>
          
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Chip label="5L" onClick={() => updateCarData({ carPrice: 500000 })} />
            <Chip label="10L" onClick={() => updateCarData({ carPrice: 1000000 })} />
            <Chip label="20L" onClick={() => updateCarData({ carPrice: 2000000 })} />
          </Box>
          
          <Button variant="contained" sx={{ mt: 2 }}>
            Calculate EMI
          </Button>
        </Paper>
      </Box>
    </ThemeProvider>
  )
}