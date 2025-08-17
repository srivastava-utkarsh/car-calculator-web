'use client'

import React, { useRef, useEffect } from 'react'
import { CarData } from '@/app/page'
import { Box, Typography, TextField, Divider } from '@mui/material'
import { useTheme } from '@mui/material/styles'

interface FinancialFormV2Props {
  carData: CarData
  updateCarData: (updates: Partial<CarData>) => void
  monthlyIncomeInputRef?: React.RefObject<HTMLInputElement | null>
}

export default function FinancialFormV2({ carData, updateCarData, monthlyIncomeInputRef }: FinancialFormV2Props) {
  const muiTheme = useTheme()
  const isLight = muiTheme.palette.mode === 'light'

  // Helper function to format number with commas
  const formatWithCommas = (num: number): string => {
    return num.toLocaleString('en-IN')
  }

  // Helper function to remove commas and convert to number
  const removeCommas = (str: string): string => {
    return str.replace(/,/g, '')
  }
  
  const kmInputRef = useRef<HTMLInputElement>(null)
  const fuelCostInputRef = useRef<HTMLInputElement>(null)
  
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
    
    // Only auto-focus if the monthly income input is not currently focused
    // This prevents focus stealing while user is typing
    if (carData.kmPerMonth > 0 && carData.fuelCostPerLiter > 0 && emi === 0 && carData.monthlyIncome === 0 && monthlyIncomeInputRef) {
      const isInputFocused = document.activeElement === monthlyIncomeInputRef.current
      if (!isInputFocused) {
        setTimeout(() => {
          monthlyIncomeInputRef.current?.focus()
        }, 100)
      }
    }
  }, [carData.kmPerMonth, carData.fuelCostPerLiter, carData.carPrice, carData.downPayment, carData.interestRate, carData.tenure, monthlyIncomeInputRef])

  
  const maxTenure = 7
  const minTenure = 1



  // Check if Smart Purchase Score requirements are met and additional details are missing
  const requiredFields = [
    carData.carPrice > 0,
    carData.downPayment >= 0,
    carData.monthlyIncome > 0
  ];
  const isAllRequiredFieldsFilled = requiredFields.every(Boolean);
  
  const additionalFields = [
    carData.kmPerMonth > 0,
    carData.fuelCostPerLiter > 0,
    (carData.insuranceAndMaintenance || 0) > 0
  ];
  const isAdditionalDetailsMissing = isAllRequiredFieldsFilled && !additionalFields.every(Boolean);
  const missingAdditionalCount = additionalFields.filter(Boolean).length;

  // Check if all required fields except Monthly Income are filled
  const allOtherFieldsFilled = carData.carPrice > 0 && carData.downPayment >= 0 && carData.tenure > 0
  const monthlyIncomeEmpty = carData.monthlyIncome === 0
  const shouldHighlightMonthlyIncome = allOtherFieldsFilled && monthlyIncomeEmpty
  
  const formContent = (
    <>
      {/* Monthly Income - Required for calculations */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Monthly Income
        </Typography>
        <Divider sx={{ flexGrow: 1, maxWidth: '64px' }} />
      </Box>
      
      <div className={`space-y-2 p-2.5 rounded-lg transition-all duration-300 ${
        shouldHighlightMonthlyIncome 
          ? 'border-lime-400/40 shadow-lg shadow-lime-400/20 bg-lime-400/10 border' 
          : ''
      }`}>
        {shouldHighlightMonthlyIncome && (
          <div className="text-red-300 text-sm font-medium flex items-center">
            <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
            This field is mandatory to proceed
          </div>
        )}
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 font-semibold text-white/70 z-10">₹</span>
          <input
            type="text"
            required
            value={carData.monthlyIncome ? formatWithCommas(carData.monthlyIncome) : ''}
            ref={monthlyIncomeInputRef}
            onChange={(e) => {
              const numericValue = removeCommas(e.target.value).replace(/[^0-9.]/g, '')
              let income = parseFloat(numericValue) || 0
              
              // Enforce maximum limit
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
            className={`w-full pl-8 pr-4 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-sm bg-white/10 backdrop-blur-md border text-white placeholder-white/50 ${
              shouldHighlightMonthlyIncome 
                ? 'border-lime-400/60' 
                : 'border-white/20'
            }`}
          />
        </div>
        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mt: 2, color: 'text.secondary' }}>
          <Box component="span" sx={{ width: 6, height: 6, bgcolor: 'success.main', borderRadius: '50%', mr: 1.5 }} />
          Used to calculate the 10% rule: total car expenses should not exceed 10% of your income
        </Typography>
      </div>

      {/* Operational Cost Section Header */}
      <div className="flex items-center space-x-3 mb-3">
        <h4 className="text-lg font-semibold text-white">
          Operational Cost
        </h4>
        <Divider sx={{ flexGrow: 1, maxWidth: '64px' }} />
      </div>

      {/* Insurance Cost and Maintenance Cost Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 relative">
        {/* Insurance Cost */}
        <div className="space-y-2">
          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.5 }}>
            Insurance Cost
          </Typography>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 font-semibold text-white/70 z-10">₹</span>
            <input
              type="text"
              value={carData.insuranceAndMaintenance ? formatWithCommas(carData.insuranceAndMaintenance) : ''}
              onChange={(e) => {
                const numericValue = removeCommas(e.target.value).replace(/[^0-9]/g, '')
                const value = parseFloat(numericValue) || 0
                
                // Validate range: 0 to 200,000
                if (value < 0 || value > 200000) {
                  return // Don't update if outside valid range
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
                // Clamp value to valid range on blur
                const clampedValue = Math.max(0, Math.min(200000, value))
                if (clampedValue !== value) {
                  updateCarData({ insuranceAndMaintenance: clampedValue })
                }
              }}
              placeholder="Enter Insurance cost"
              className="w-full pl-8 pr-4 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all text-sm bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50"
            />
          </div>
        </div>

        {/* Vertical Separator - Only visible on large screens */}
        <div className={`hidden lg:block absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-px ${isLight ? 'bg-gradient-to-b from-transparent via-slate-300 to-transparent' : 'bg-gradient-to-b from-transparent via-white/20 to-transparent'}`}></div>

        {/* Maintenance Cost (per year) */}
        <div className="space-y-2">
          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.5 }}>
            Maintenance Cost (per year)
          </Typography>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 font-semibold text-white/70 z-10">₹</span>
            <input
              type="text"
              value={carData.maintenanceCostPerYear ? formatWithCommas(carData.maintenanceCostPerYear) : ''}
              onChange={(e) => {
                const numericValue = removeCommas(e.target.value).replace(/[^0-9.]/g, '')
                let cost = parseFloat(numericValue) || 0
                
                // Enforce limits
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
              className="w-full pl-8 pr-4 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all text-sm bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50"
            />
          </div>
        </div>
      </div>

      {/* Monthly Fuel Expense and Parking Fee Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mt-6 relative">
        {/* Monthly Fuel Expense */}
        <div className="space-y-2" id="monthly-fuel-expense">
          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.5 }}>
            Monthly Fuel Expense
          </Typography>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 font-semibold text-white/70 z-10">₹</span>
            <input
              type="text"
              value={carData.monthlyFuelExpense ? formatWithCommas(carData.monthlyFuelExpense) : ''}
              onChange={(e) => {
                const numericValue = removeCommas(e.target.value).replace(/[^0-9.]/g, '')
                let expense = parseFloat(numericValue) || 0
                
                // Enforce limits
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
              className="w-full pl-8 pr-4 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all text-sm bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50"
            />
          </div>
        </div>

        {/* Vertical Separator - Only visible on large screens */}
        <div className={`hidden lg:block absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-px ${isLight ? 'bg-gradient-to-b from-transparent via-slate-300 to-transparent' : 'bg-gradient-to-b from-transparent via-white/20 to-transparent'}`}></div>

        {/* Parking Fee */}
        <div className="space-y-2">
          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.5 }}>
            Parking Fee (per month)
          </Typography>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 font-semibold text-white/70 z-10">₹</span>
            <input
              type="text"
              value={carData.parkingFee ? formatWithCommas(carData.parkingFee) : ''}
              onChange={(e) => {
                const numericValue = removeCommas(e.target.value).replace(/[^0-9.]/g, '')
                let fee = parseFloat(numericValue) || 0
                
                // Enforce limits
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
              className="w-full pl-8 pr-4 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-sm bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50"
            />
          </div>
        </div>
      </div>


    </>
  )

  return (
    <div className="space-y-10">

      <div className="space-y-8">
        {formContent}
      </div>
    </div>
  )
}