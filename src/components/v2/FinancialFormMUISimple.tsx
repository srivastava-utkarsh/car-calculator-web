'use client'

import React, { useEffect } from 'react'
import { 
  TextField, 
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

interface FinancialFormMUIProps {
  carData: CarData
  updateCarData: (updates: Partial<CarData>) => void
  monthlyIncomeInputRef?: React.RefObject<HTMLInputElement | null>
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
}))

const HighlightedPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  border: `2px solid ${theme.palette.success.main}`,
  backgroundColor: theme.palette.success.light + '10',
  transition: 'all 0.3s ease',
}))

export default function FinancialFormMUISimple({ carData, updateCarData, monthlyIncomeInputRef }: FinancialFormMUIProps) {
  
  // Helper functions
  const formatWithCommas = (num: number): string => {
    return num.toLocaleString('en-IN')
  }

  const removeCommas = (str: string): string => {
    return str.replace(/,/g, '')
  }
  
  const calculateEMI = (principal: number, rate: number, years: number) => {
    if (principal <= 0 || rate <= 0 || years <= 0) return 0
    const monthlyRate = rate / (12 * 100)
    const months = years * 12
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
           (Math.pow(1 + monthlyRate, months) - 1)
  }

  // Auto-focus logic based on the requirements
  useEffect(() => {
    const emi = calculateEMI(carData.carPrice - carData.downPayment, carData.interestRate, carData.tenure)
    
    if (carData.kmPerMonth > 0 && carData.fuelCostPerLiter > 0 && emi === 0 && carData.monthlyIncome === 0 && monthlyIncomeInputRef) {
      const isInputFocused = document.activeElement === monthlyIncomeInputRef.current
      if (!isInputFocused) {
        setTimeout(() => {
          monthlyIncomeInputRef.current?.focus()
        }, 100)
      }
    }
  }, [carData.kmPerMonth, carData.fuelCostPerLiter, carData.carPrice, carData.downPayment, carData.interestRate, carData.tenure, carData.monthlyIncome, monthlyIncomeInputRef])

  // Check if all required fields except Monthly Income are filled
  const allOtherFieldsFilled = carData.carPrice > 0 && carData.downPayment >= 0 && carData.tenure > 0
  const monthlyIncomeEmpty = carData.monthlyIncome === 0
  const shouldHighlightMonthlyIncome = allOtherFieldsFilled && monthlyIncomeEmpty

  return (
    <Box sx={{ '& .MuiTextField-root': { mb: 2 } }}>
      
      {/* Monthly Income - Required for calculations */}
      {shouldHighlightMonthlyIncome ? (
        <HighlightedPaper elevation={3}>
          <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
            Monthly Income
          </Typography>
          
          <Alert severity="warning" sx={{ mb: 2 }}>
            This field is mandatory to proceed
          </Alert>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr' }, gap: 3 }}>
            <Box>
              <FormControl fullWidth>
                <FormLabel sx={{ mb: 1, fontWeight: 500 }}>Monthly Income</FormLabel>
                <TextField
                  fullWidth
                  variant="outlined"
                  required
                  value={carData.monthlyIncome ? formatWithCommas(carData.monthlyIncome) : ''}
                  inputRef={monthlyIncomeInputRef}
                  onChange={(e) => {
                    const numericValue = removeCommas(e.target.value).replace(/[^0-9.]/g, '')
                    let income = parseFloat(numericValue) || 0
                    
                    if (income > 100000000) {
                      income = 100000000
                    }
                    
                    updateCarData({ monthlyIncome: income })
                  }}
                  onKeyPress={(e) => {
                    if (!/[0-9.,]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                      e.preventDefault()
                    }
                  }}
                  placeholder="Enter your monthly income"
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                  }}
                  color="success"
                />
              </FormControl>
            </Box>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'success.main', mr: 1 }} />
            Used to calculate the 10% rule: total car expenses should not exceed 10% of your income
          </Typography>
        </HighlightedPaper>
      ) : (
        <StyledPaper elevation={2}>
          <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
            Monthly Income
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr' }, gap: 3 }}>
            <Box>
              <FormControl fullWidth>
                <FormLabel sx={{ mb: 1, fontWeight: 500 }}>Monthly Income</FormLabel>
                <TextField
                  fullWidth
                  variant="outlined"
                  required
                  value={carData.monthlyIncome ? formatWithCommas(carData.monthlyIncome) : ''}
                  inputRef={monthlyIncomeInputRef}
                  onChange={(e) => {
                    const numericValue = removeCommas(e.target.value).replace(/[^0-9.]/g, '')
                    let income = parseFloat(numericValue) || 0
                    
                    if (income > 100000000) {
                      income = 100000000
                    }
                    
                    updateCarData({ monthlyIncome: income })
                  }}
                  onKeyPress={(e) => {
                    if (!/[0-9.,]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                      e.preventDefault()
                    }
                  }}
                  placeholder="Enter your monthly income"
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                  }}
                />
              </FormControl>
            </Box>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'success.main', mr: 1 }} />
            Used to calculate the 10% rule: total car expenses should not exceed 10% of your income
          </Typography>
        </StyledPaper>
      )}

      <StyledPaper elevation={2}>
        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
          Operational Cost
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
          {/* Insurance Cost */}
          <Box>
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1, fontWeight: 500 }}>Insurance Cost</FormLabel>
              <TextField
                fullWidth
                variant="outlined"
                value={carData.insuranceAndMaintenance ? formatWithCommas(carData.insuranceAndMaintenance) : ''}
                onChange={(e) => {
                  const numericValue = removeCommas(e.target.value).replace(/[^0-9]/g, '')
                  const value = parseFloat(numericValue) || 0
                  
                  if (value < 0 || value > 200000) {
                    return
                  }
                  
                  updateCarData({ insuranceAndMaintenance: value })
                }}
                onKeyPress={(e) => {
                  if (!/[0-9,]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                    e.preventDefault()
                  }
                }}
                onBlur={(e) => {
                  const numericValue = removeCommas(e.target.value).replace(/[^0-9]/g, '')
                  const value = parseFloat(numericValue) || 0
                  const clampedValue = Math.max(0, Math.min(200000, value))
                  if (clampedValue !== value) {
                    updateCarData({ insuranceAndMaintenance: clampedValue })
                  }
                }}
                placeholder="Enter Insurance cost"
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                }}
                color="secondary"
              />
            </FormControl>
          </Box>

          {/* Maintenance Cost (per year) */}
          <Box>
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1, fontWeight: 500 }}>Maintenance Cost (per year)</FormLabel>
              <TextField
                fullWidth
                variant="outlined"
                value={carData.maintenanceCostPerYear ? formatWithCommas(carData.maintenanceCostPerYear) : ''}
                onChange={(e) => {
                  const numericValue = removeCommas(e.target.value).replace(/[^0-9.]/g, '')
                  let cost = parseFloat(numericValue) || 0
                  
                  if (cost > 500000) {
                    cost = 500000
                  } else if (cost < 0) {
                    cost = 0
                  }
                  
                  updateCarData({ maintenanceCostPerYear: cost })
                }}
                onKeyPress={(e) => {
                  if (!/[0-9.,]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                    e.preventDefault()
                  }
                }}
                placeholder="Enter yearly maintenance cost"
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                }}
                color="success"
              />
            </FormControl>
          </Box>

          {/* Monthly Fuel Expense */}
          <Box>
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1, fontWeight: 500 }}>Monthly Fuel Expense</FormLabel>
              <TextField
                fullWidth
                variant="outlined"
                value={carData.monthlyFuelExpense ? formatWithCommas(carData.monthlyFuelExpense) : ''}
                onChange={(e) => {
                  const numericValue = removeCommas(e.target.value).replace(/[^0-9.]/g, '')
                  let expense = parseFloat(numericValue) || 0
                  
                  if (expense > 100000) {
                    expense = 100000
                  } else if (expense < 0) {
                    expense = 0
                  }
                  
                  updateCarData({ monthlyFuelExpense: expense })
                }}
                onKeyPress={(e) => {
                  if (!/[0-9.,]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                    e.preventDefault()
                  }
                }}
                placeholder="Enter monthly fuel expense"
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                }}
                color="info"
              />
            </FormControl>
          </Box>

          {/* Parking Fee */}
          <Box>
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1, fontWeight: 500 }}>Parking Fee</FormLabel>
              <TextField
                fullWidth
                variant="outlined"
                value={carData.parkingFee ? formatWithCommas(carData.parkingFee) : ''}
                onChange={(e) => {
                  const numericValue = removeCommas(e.target.value).replace(/[^0-9.]/g, '')
                  let fee = parseFloat(numericValue) || 0
                  
                  if (fee > 50000) {
                    fee = 50000
                  } else if (fee < 0) {
                    fee = 0
                  }
                  
                  updateCarData({ parkingFee: fee })
                }}
                onKeyPress={(e) => {
                  if (!/[0-9.,]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                    e.preventDefault()
                  }
                }}
                placeholder="Enter parking fee"
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                }}
                color="primary"
              />
            </FormControl>
          </Box>
        </Box>
      </StyledPaper>
    </Box>
  )
}