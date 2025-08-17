'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CarData } from '@/app/page'
import { TrendingUp, CheckCircle, XCircle, Percent, Clock, Info, Calendar, DollarSign, TrendingDown, CreditCard, Car, IndianRupee, Fuel, ParkingCircle } from 'lucide-react'
import { useTheme } from '@mui/material/styles'
import { Box, Paper, Typography, Chip, LinearProgress, Divider, Stack, IconButton } from '@mui/material'
import { getThemeStyles, themeClass } from '@/utils/themeStyles'

interface TotalCostDisplayV2Props {
  carData: CarData
  updateCarData: (updates: Partial<CarData>) => void
}

export default function TotalCostDisplayV2({ carData, updateCarData: _updateCarData }: TotalCostDisplayV2Props) {
  const muiTheme = useTheme()
  const isLight = muiTheme.palette.mode === 'light'
  const themeStyles = getThemeStyles(isLight ? 'light' : 'dark')
  
  // Use monthly fuel expense from form input
  const monthlyFuelCost = carData.monthlyFuelExpense || 0
  const monthlyParkingCost = carData.parkingFee || 0
  
  const calculateEMI = (principal: number, rate: number, years: number) => {
    if (principal <= 0 || rate <= 0 || years <= 0) return 0
    const monthlyRate = rate / (12 * 100)
    const months = years * 12
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
    return isNaN(emi) ? 0 : emi
  }

  // Safe calculation helpers
  const loanAmount = Math.max(0, carData.carPrice - carData.downPayment)
  const emi = carData.tenure > 0 ? calculateEMI(loanAmount, carData.interestRate, carData.tenure) : 0
  const totalInterest = carData.tenure > 0 && emi > 0 ? (emi * carData.tenure * 12) - loanAmount : 0

  // Calculate completion date
  const currentDate = new Date()
  const completionDate = new Date(currentDate.getFullYear() + carData.tenure, currentDate.getMonth(), currentDate.getDate())
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', { 
      month: 'short', 
      year: 'numeric' 
    })
  }
  
  // Monthly car expenses calculation for 20/4/10 rule
  // Including EMI, fuel, and parking when available (insurance moved to one-time costs)
  const totalMonthlyCarExpenses = emi + monthlyFuelCost + monthlyParkingCost
  
  // 20/4/10 Rule Check - Only calculate when valid data is available
  const downPaymentPercentage = carData.carPrice > 0 ? (carData.downPayment / carData.carPrice) * 100 : 0
  const isDownPaymentOk = downPaymentPercentage >= 20
  const isTenureOk = carData.tenure > 0 && carData.tenure <= 4
  const expensePercentage = carData.monthlyIncome > 0 && totalMonthlyCarExpenses > 0 ? (totalMonthlyCarExpenses / carData.monthlyIncome) * 100 : 0
  const isExpenseOk = carData.monthlyIncome > 0 && totalMonthlyCarExpenses > 0 ? expensePercentage <= 10 : true
  const isAffordable = isDownPaymentOk && isTenureOk && isExpenseOk

  const formatCurrency = (value: number) => {
    if (isNaN(value) || !isFinite(value) || value < 0) return '₹0'
    return `₹${Math.round(value).toLocaleString('en-IN')}`
  }
  
  const formatPercentage = (value: number) => {
    if (isNaN(value) || !isFinite(value)) return '0.0'
    if (value < 1 && value > 0) return '< 1'
    if (value > 100) return '> 100'
    return value.toFixed(1)
  }

  // Calculate completion of required fields for Smart Purchase Score
  const requiredFields = [
    carData.carPrice > 0,
    carData.downPayment >= 0,
    carData.monthlyIncome > 0
  ];
  const isAllRequiredFieldsFilled = requiredFields.every(Boolean);

  // Auto-focus the afford panel when all mandatory fields are completed
  // Only focus if no input is currently focused to prevent interrupting user input
  React.useEffect(() => {
    if (isAllRequiredFieldsFilled && carData.tenure > 0 && emi > 0) {
      const affordPanel = document.getElementById('afford-panel');
      const activeElement = document.activeElement;
      
      // Check if the currently focused element is an input field
      const isInputFocused = activeElement && (
        activeElement.tagName === 'INPUT' || 
        activeElement.tagName === 'TEXTAREA' ||
        (activeElement as HTMLElement).contentEditable === 'true'
      );
      
      // Only focus the panel if no input is currently focused
      if (affordPanel && !isInputFocused) {
        affordPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
        affordPanel.focus();
      }
    }
  }, [isAllRequiredFieldsFilled, carData.tenure, emi]);

  // Calculate completion percentage for all fields (required + optional)
  const allFields = [
    carData.carPrice > 0,
    carData.downPayment >= 0,
    carData.tenure > 0,
    carData.interestRate > 0,
    carData.monthlyIncome > 0,
    (carData.insuranceAndMaintenance || 0) > 0,
    (carData.monthlyFuelExpense || 0) > 0,
    (carData.parkingFee || 0) >= 0
  ];
  const completionPercentage = Math.round((allFields.filter(Boolean).length / allFields.length) * 100);
  

  return (
    <Stack spacing={5}>
      {/* Smart Purchase Score - Always show, but with empty state when required fields not filled */}
      <Paper 
        id="afford-panel"
        tabIndex={-1}
        elevation={3}
        sx={{ 
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: 6
          },
          '&:focus': {
            outline: 'none',
            boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.2)'
          },
          background: !isAllRequiredFieldsFilled || carData.carPrice <= 0 || carData.tenure <= 0 || emi <= 0
            ? 'linear-gradient(135deg, rgba(158, 158, 158, 0.1) 0%, rgba(117, 117, 117, 0.1) 100%)'
            : isAffordable 
              ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(56, 142, 60, 0.1) 100%)'
              : 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(198, 40, 40, 0.1) 100%)',
          borderLeft: 4,
          borderLeftColor: !isAllRequiredFieldsFilled || carData.carPrice <= 0 || carData.tenure <= 0 || emi <= 0
            ? 'grey.400'
            : isAffordable ? 'success.main' : 'error.main'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          {/* Left side - "Can you afford?" text */}
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            Can you afford?
          </Typography>
              
          {/* Right side - Status with icons */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {!isAllRequiredFieldsFilled || carData.carPrice <= 0 || carData.tenure <= 0 || emi <= 0 ? (
              <Chip 
                icon={<Clock size={16} />}
                label="Pending"
                variant="outlined"
                sx={{ 
                  color: 'grey.600',
                  borderColor: 'grey.400',
                  fontWeight: 600
                }}
              />
            ) : isAffordable ? (
              <Chip 
                icon={<CheckCircle size={16} />}
                label="In Budget"
                color="success"
                sx={{ fontWeight: 600 }}
              />
            ) : (
              <Chip 
                icon={<XCircle size={16} />}
                label="Over Budget"
                color="error"
                sx={{ fontWeight: 600 }}
              />
            )}
          </Box>
        </Box>
        
        {/* Compact rule indicators */}
        <Stack spacing={1}>
          {/* 20% Down Payment Rule */}
          <Paper 
            elevation={1}
            sx={{ 
              p: 2,
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.01)',
                boxShadow: 2
              },
              borderLeft: 3,
              borderLeftColor: isDownPaymentOk ? 'success.main' : 'error.main',
              backgroundColor: isDownPaymentOk ? 'success.50' : 'error.50'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                <Typography component="span" sx={{ color: 'warning.main', mr: 1, fontWeight: 700 }}>₹</Typography>
                20% Down Payment
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatPercentage(downPaymentPercentage)}%</Typography>
                {isDownPaymentOk ? (
                  <CheckCircle size={16} color="#4caf50" />
                ) : (
                  <XCircle size={16} color="#f44336" />
                )}
              </Box>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={Math.min(downPaymentPercentage, 100)}
              color={isDownPaymentOk ? 'success' : 'error'}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Paper>
          
          {/* 4 Year Tenure Rule */}
          <Paper 
            elevation={1}
            sx={{ 
              p: 2,
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.01)',
                boxShadow: 2
              },
              borderLeft: 3,
              borderLeftColor: isTenureOk ? 'success.main' : 'error.main',
              backgroundColor: isTenureOk ? 'success.50' : 'error.50'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                <Clock size={12} style={{ marginRight: 4, color: '#2196f3' }} />
                Max 4 Years
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{carData.tenure || 0}y</Typography>
                {isTenureOk ? (
                  <CheckCircle size={16} color="#4caf50" />
                ) : (
                  <XCircle size={16} color="#f44336" />
                )}
              </Box>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={Math.min((carData.tenure / 7) * 100, 100)}
              color={isTenureOk ? 'success' : 'error'}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Paper>
          
          {/* 10% Income Rule */}
          <Paper 
            elevation={1}
            sx={{ 
              p: 2,
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.01)',
                boxShadow: 2
              },
              borderLeft: 3,
              borderLeftColor: isExpenseOk ? 'success.main' : 'error.main',
              backgroundColor: isExpenseOk ? 'success.50' : 'error.50'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                <Percent size={12} style={{ marginRight: 4, color: '#9c27b0' }} />
                Max 10% Income
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatPercentage(expensePercentage)}%</Typography>
                {isExpenseOk ? (
                  <CheckCircle size={16} color="#4caf50" />
                ) : (
                  <XCircle size={16} color="#f44336" />
                )}
              </Box>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={Math.min(expensePercentage, 100)}
              color={isExpenseOk ? 'success' : 'error'}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Paper>
        </Stack>
      </Paper>
      
      {/* Monthly EMI Section - Simplified for now */}
      <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Monthly EMI</Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
          {formatCurrency(emi)}
        </Typography>
        
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
          {completionPercentage}% Complete
        </Typography>
        
        {/* Add Fuel Expense Button */}
        <Box sx={{ mt: 2 }}>
          <Typography 
            variant="body2" 
            component="button"
            onClick={() => {
              const fuelSection = document.getElementById('monthly-fuel-expense')
              if (fuelSection) {
                fuelSection.scrollIntoView({ behavior: 'smooth' })
                const input = fuelSection.querySelector('input')
                if (input) {
                  setTimeout(() => input.focus(), 300)
                }
              }
            }}
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              p: 2,
              border: '2px dashed',
              borderColor: 'grey.300',
              borderRadius: 2,
              backgroundColor: 'grey.50',
              color: 'text.secondary',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'primary.50',
                color: 'primary.main'
              }
            }}
          >
            <Fuel size={16} style={{ marginRight: 8 }} />
            + Add Fuel Expense
            <br />
            <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
              Get your complete monthly car cost
            </Typography>
          </Typography>
        </Box>
      </Paper>
    </Stack>
  )
}