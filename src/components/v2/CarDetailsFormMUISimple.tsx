'use client'

import React from 'react'
import { 
  TextField, 
  Slider, 
  Typography, 
  Box, 
  Chip, 
  FormControl,
  FormLabel,
  Alert,
  Paper
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { CarData } from '@/app/page'
// Theme context removed - using Material-UI

interface CarDetailsFormMUIProps {
  carData: CarData
  updateCarData: (updates: Partial<CarData>) => void
  monthlyIncomeInputRef?: React.RefObject<HTMLInputElement | null>
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
}))

const StyledSlider = styled(Slider)(({ theme }) => ({
  '& .MuiSlider-thumb': {
    boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
    '&:focus, &:hover, &.Mui-active': {
      boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
      '@media (hover: none)': {
        boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
      },
    },
  },
}))

export default function CarDetailsFormMUISimple({ carData, updateCarData, monthlyIncomeInputRef }: CarDetailsFormMUIProps) {
  // Using Material-UI theme
  const isLight = true

  // Check if all required fields except Monthly Income are filled
  const allOtherFieldsFilled = carData.carPrice > 0 && carData.downPayment >= 0 && carData.tenure > 0
  const monthlyIncomeEmpty = carData.monthlyIncome === 0
  const shouldHighlightMonthlyIncome = allOtherFieldsFilled && monthlyIncomeEmpty
  
  // Auto-focus Monthly Income when all other required fields are filled
  React.useEffect(() => {
    if (shouldHighlightMonthlyIncome && monthlyIncomeInputRef?.current) {
      const activeElement = document.activeElement;
      
      const isInputFocused = activeElement && (
        activeElement.tagName === 'INPUT' || 
        activeElement.tagName === 'TEXTAREA' ||
        (activeElement as HTMLElement).contentEditable === 'true'
      );
      
      if (!isInputFocused) {
        monthlyIncomeInputRef.current.focus();
      }
    }
  }, [shouldHighlightMonthlyIncome, monthlyIncomeInputRef])

  // Preset car price options
  const carPresets = [
    { label: '5L', value: 500000 },
    { label: '10L', value: 1000000 },
    { label: '20L', value: 2000000 },
    { label: '50L', value: 5000000 }
  ]

  // Helper functions
  const formatWithCommas = (num: number): string => {
    return num.toLocaleString('en-IN')
  }

  const removeCommas = (str: string): string => {
    return str.replace(/,/g, '')
  }

  const handleCarPriceChange = (value: string) => {
    const numericValue = removeCommas(value).replace(/[^0-9.]/g, '')
    let price = parseFloat(numericValue) || 0
    
    if (price > 50000000) {
      price = 50000000
    }
    
    updateCarData({ carPrice: price })
    
    // Auto-calculate 20% down payment
    const downPayment = Math.round(price * 0.2)
    updateCarData({ downPayment })
    
    // Set default loan tenure to 3 years when car price is selected
    if (price > 0 && carData.tenure === 0) {
      updateCarData({ tenure: 3 })
    }
  }

  const handleDownPaymentChange = (value: string) => {
    const numericValue = removeCommas(value).replace(/[^0-9]/g, '')
    let payment = parseInt(numericValue) || 0
    
    if (payment > carData.carPrice) {
      payment = carData.carPrice
    }
    
    updateCarData({ downPayment: payment })
  }

  const downPaymentPercentage = carData.carPrice > 0 ? (carData.downPayment / carData.carPrice) * 100 : 0

  return (
    <Box sx={{ '& .MuiTextField-root': { mb: 2 } }}>
      
      <StyledPaper elevation={2}>
        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
          Car Details
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          {/* Car Price */}
          <Box>
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1, fontWeight: 500 }}>Car Price</FormLabel>
              <TextField
                fullWidth
                variant="outlined"
                value={carData.carPrice ? formatWithCommas(carData.carPrice) : ''}
                onChange={(e) => handleCarPriceChange(e.target.value)}
                placeholder="Enter car price"
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                }}
                onKeyPress={(e) => {
                  if (!/[0-9,.]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                    e.preventDefault()
                  }
                }}
              />
              
              {/* Preset Buttons */}
              <Box sx={{ display: 'flex', gap: 1, mt: 1, justifyContent: 'center' }}>
                {carPresets.map((preset) => (
                  <Chip
                    key={preset.value}
                    label={`₹${preset.label}`}
                    variant={carData.carPrice === preset.value ? "filled" : "outlined"}
                    color={carData.carPrice === preset.value ? "primary" : "default"}
                    onClick={() => handleCarPriceChange(preset.value.toString())}
                    size="small"
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
            </FormControl>
          </Box>

          {/* Down Payment */}
          <Box>
            <FormControl fullWidth>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <FormLabel sx={{ fontWeight: 500 }}>Down Payment</FormLabel>
                {downPaymentPercentage > 0 && (
                  <Chip 
                    label={`${downPaymentPercentage.toFixed(1)}%`} 
                    size="small" 
                    color="info"
                  />
                )}
              </Box>
              
              <TextField
                fullWidth
                variant="outlined"
                value={carData.downPayment ? formatWithCommas(carData.downPayment) : ''}
                onChange={(e) => handleDownPaymentChange(e.target.value)}
                placeholder="Enter down payment"
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                }}
                onKeyPress={(e) => {
                  if (!/[0-9,]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                    e.preventDefault()
                  }
                }}
              />
              
              {/* Down Payment Slider */}
              <Box sx={{ mt: 2, px: 1 }}>
                <StyledSlider
                  value={carData.downPayment}
                  onChange={(_, value) => handleDownPaymentChange((value as number).toString())}
                  min={0}
                  max={carData.carPrice}
                  step={1000}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `₹${formatWithCommas(value)}`}
                  color={downPaymentPercentage >= 20 ? "primary" : "warning"}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'text.secondary', mt: 0.5 }}>
                  <span>₹0</span>
                  <span>₹{(carData.carPrice / 100000).toFixed(0)}L</span>
                </Box>
              </Box>
            </FormControl>
          </Box>
        </Box>
      </StyledPaper>

      <StyledPaper elevation={2}>
        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
          Loan Details
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          {/* Loan Tenure */}
          <Box>
            <FormControl fullWidth>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <FormLabel sx={{ fontWeight: 500 }}>Loan Tenure</FormLabel>
                {carData.tenure > 0 && (
                  <Chip 
                    label={`${Math.round(carData.tenure || 0)} years`} 
                    size="small" 
                    color="info"
                  />
                )}
              </Box>
              
              <Box sx={{ px: 1 }}>
                <StyledSlider
                  value={carData.tenure || 1}
                  onChange={(_, value) => {
                    const roundedYears = Math.round(value as number)
                    updateCarData({ tenure: roundedYears })
                  }}
                  min={1}
                  max={7}
                  step={0.01}
                  marks={[
                    { value: 1, label: '1yr' },
                    { value: 3, label: '3yr' },
                    { value: 5, label: '5yr' },
                    { value: 7, label: '7yr' }
                  ]}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${Math.round(value)} years`}
                  color={(carData.tenure || 1) <= 4 ? "primary" : "error"}
                />
              </Box>
              
              {/* Warning for tenure > 4 years */}
              {carData.tenure > 4 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  ⚠️ Consider reducing tenure for better financial health.
                </Alert>
              )}
            </FormControl>
          </Box>

          {/* Interest Rate */}
          <Box>
            <FormControl fullWidth>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <FormLabel sx={{ fontWeight: 500 }}>Interest Rate</FormLabel>
                <Chip 
                  label={`${carData.interestRate}% per annum`} 
                  size="small" 
                  color="info"
                />
              </Box>
              
              <Box sx={{ px: 1 }}>
                <StyledSlider
                  value={carData.interestRate}
                  onChange={(_, value) => updateCarData({ interestRate: value as number })}
                  min={5}
                  max={15}
                  step={0.1}
                  marks={[
                    { value: 5, label: '5%' },
                    { value: 10, label: '10%' },
                    { value: 15, label: '15%' }
                  ]}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}%`}
                  color="primary"
                />
              </Box>
            </FormControl>
          </Box>
        </Box>
      </StyledPaper>
    </Box>
  )
}