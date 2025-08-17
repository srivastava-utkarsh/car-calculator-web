'use client'

import React from 'react'
import { CarData } from '@/app/page'
import {
  Box,
  Typography,
  Chip,
  Slider,
  FormControl,
  OutlinedInput,
  InputAdornment,
  Alert,
  Stack,
  Grid
} from '@mui/material'

interface CarDetailsFormV2Props {
  carData: CarData
  updateCarData: (updates: Partial<CarData>) => void
  monthlyIncomeInputRef?: React.RefObject<HTMLInputElement | null>
}

export default function CarDetailsFormV2({ carData, updateCarData, monthlyIncomeInputRef }: CarDetailsFormV2Props) {
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

  // Helper function to format number with commas
  const formatWithCommas = (num: number): string => {
    return num.toLocaleString('en-IN')
  }

  // Helper function to remove commas and convert to number
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

  const handleDownPaymentChange = (value: string | number) => {
    const numericValue = typeof value === 'string' 
      ? removeCommas(value).replace(/[^0-9]/g, '') 
      : value.toString()
    let payment = parseInt(numericValue) || 0
    
    if (payment > carData.carPrice) {
      payment = carData.carPrice
    }
    
    updateCarData({ downPayment: payment })
  }

  const downPaymentPercentage = carData.carPrice > 0 ? (carData.downPayment / carData.carPrice) * 100 : 0

  return (
    <Stack spacing={4}>
      <Typography variant="h6" fontWeight={600}>
        Car Cost Details
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Car Price */}
        <Box sx={{ flex: 1 }}>
          <Stack spacing={2}>
            <Typography variant="subtitle2" fontWeight={500}>
              Car Price
            </Typography>
            
            <FormControl fullWidth variant="outlined">
              <OutlinedInput
                type="text"
                value={carData.carPrice ? formatWithCommas(carData.carPrice) : ''}
                onChange={(e) => handleCarPriceChange(e.target.value)}
                startAdornment={<InputAdornment position="start">₹</InputAdornment>}
                placeholder="Enter car price"
                onKeyPress={(e) => {
                  if (!/[0-9,]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                    e.preventDefault()
                  }
                }}
              />
            </FormControl>
            
            {/* Preset Buttons */}
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {carPresets.map((preset) => (
                <Chip
                  key={preset.value}
                  label={`₹${preset.label}`}
                  onClick={() => handleCarPriceChange(preset.value.toString())}
                  color={carData.carPrice === preset.value ? "primary" : "default"}
                  variant={carData.carPrice === preset.value ? "filled" : "outlined"}
                  size="small"
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Stack>
          </Stack>
        </Box>

        {/* Down Payment */}
        <Box sx={{ flex: 1 }}>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2" fontWeight={500}>
                Down Payment
              </Typography>
              {downPaymentPercentage > 0 && (
                <Typography variant="body2" color="primary" fontWeight={600}>
                  {downPaymentPercentage.toFixed(1)}%
                </Typography>
              )}
            </Box>
            
            <FormControl fullWidth variant="outlined">
              <OutlinedInput
                type="text"
                value={carData.downPayment ? formatWithCommas(carData.downPayment) : ''}
                onChange={(e) => handleDownPaymentChange(e.target.value)}
                startAdornment={<InputAdornment position="start">₹</InputAdornment>}
                placeholder="Enter down payment"
                onKeyPress={(e) => {
                  if (!/[0-9,]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                    e.preventDefault()
                  }
                }}
              />
            </FormControl>
            
            {/* Down Payment Slider */}
            <Box sx={{ px: 1 }}>
              <Slider
                value={carData.downPayment}
                min={0}
                max={carData.carPrice || 1000000}
                step={1000}
                onChange={(_, value) => handleDownPaymentChange(value as number)}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `₹${(value / 100000).toFixed(1)}L`}
                color={downPaymentPercentage >= 20 ? "primary" : "warning"}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="caption" color="text.secondary">₹0</Typography>
                <Typography variant="caption" color="text.secondary">
                  ₹{(carData.carPrice / 100000).toFixed(0)}L
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Box>
      </Box>

      <Typography variant="h6" fontWeight={600}>
        Loan Details
      </Typography>

      <Grid container spacing={3}>
        {/* Loan Tenure */}
        <Box sx={{ flex: 1 }}>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2" fontWeight={500}>
                Loan Tenure
              </Typography>
              {carData.tenure > 0 && (
                <Typography variant="body2" color="primary" fontWeight={600}>
                  {Math.round(carData.tenure || 0)} years
                </Typography>
              )}
            </Box>
            
            <Box sx={{ px: 1 }}>
              <Slider
                value={carData.tenure || 1}
                min={1}
                max={7}
                step={1}
                onChange={(_, value) => updateCarData({ tenure: value as number })}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value} years`}
                color={carData.tenure <= 4 ? "primary" : "error"}
                marks={[
                  { value: 1, label: '1yr' },
                  { value: 3, label: '3yr' },
                  { value: 5, label: '5yr' },
                  { value: 7, label: '7yr' }
                ]}
              />
            </Box>
            
            {carData.tenure > 4 && (
              <Alert severity="warning" sx={{ mt: 1 }}>
                Consider reducing tenure for better financial health
              </Alert>
            )}
          </Stack>
        </Box>

        {/* Interest Rate */}
        <Box sx={{ flex: 1 }}>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2" fontWeight={500}>
                Interest Rate
              </Typography>
              <Typography variant="body2" color="primary" fontWeight={600}>
                {carData.interestRate}% per annum
              </Typography>
            </Box>
            
            <Box sx={{ px: 1 }}>
              <Slider
                value={carData.interestRate}
                min={5}
                max={15}
                step={0.1}
                onChange={(_, value) => updateCarData({ interestRate: value as number })}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}%`}
                color="primary"
                marks={[
                  { value: 5, label: '5%' },
                  { value: 10, label: '10%' },
                  { value: 15, label: '15%' }
                ]}
              />
            </Box>
          </Stack>
        </Box>
      </Grid>
    </Stack>
  )
}