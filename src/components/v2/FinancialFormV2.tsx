'use client'

import React, { useRef, useEffect } from 'react'
import { CarData } from '@/app/page'
import { useTheme } from '@/contexts/ThemeContext'
import { getThemeStyles, themeClass } from '@/utils/themeStyles'
import { safeNumber, sanitizeInput, VALIDATION_LIMITS, formatNumberSafe, calculateSafeEMI } from '@/utils/safeCalculations'

interface FinancialFormV2Props {
  carData: CarData
  updateCarData: (updates: Partial<CarData>) => void
  monthlyIncomeInputRef?: React.RefObject<HTMLInputElement | null>
}

export default function FinancialFormV2({ carData, updateCarData, monthlyIncomeInputRef }: FinancialFormV2Props) {
  const { theme, isLight, isDark } = useTheme()
  const themeStyles = getThemeStyles(theme)
  
  // Local state for display values during editing (to avoid real-time validation)
  const [monthlyIncomeDisplay, setMonthlyIncomeDisplay] = React.useState('')
  const [insuranceDisplay, setInsuranceDisplay] = React.useState('')
  const [maintenanceDisplay, setMaintenanceDisplay] = React.useState('')
  const [fuelExpenseDisplay, setFuelExpenseDisplay] = React.useState('')
  const [parkingFeeDisplay, setParkingFeeDisplay] = React.useState('')
  
  // Update display values when actual data changes from external sources
  React.useEffect(() => {
    setMonthlyIncomeDisplay(carData.monthlyIncome ? formatWithCommas(carData.monthlyIncome) : '')
  }, [carData.monthlyIncome])
  
  React.useEffect(() => {
    setInsuranceDisplay(carData.insuranceAndMaintenance ? formatWithCommas(carData.insuranceAndMaintenance) : '')
  }, [carData.insuranceAndMaintenance])
  
  React.useEffect(() => {
    setMaintenanceDisplay(carData.maintenanceCostPerYear ? formatWithCommas(carData.maintenanceCostPerYear) : '')
  }, [carData.maintenanceCostPerYear])
  
  React.useEffect(() => {
    setFuelExpenseDisplay(carData.monthlyFuelExpense ? formatWithCommas(carData.monthlyFuelExpense) : '')
  }, [carData.monthlyFuelExpense])
  
  React.useEffect(() => {
    setParkingFeeDisplay(carData.parkingFee ? formatWithCommas(carData.parkingFee) : '')
  }, [carData.parkingFee])

  // Use safe formatting functions
  const formatWithCommas = (num: number): string => {
    return formatNumberSafe(num)
  }

  // Helper function to remove commas and convert to number
  const removeCommas = (str: string): string => {
    return str.replace(/,/g, '')
  }
  
  const kmInputRef = useRef<HTMLInputElement>(null)
  const fuelCostInputRef = useRef<HTMLInputElement>(null)
  
  // Replace unsafe EMI calculation with safe version
  const calculateEMI = (principal: number, rate: number, years: number) => {
    return calculateSafeEMI(principal, rate, years)
  }

  // Blur handlers for inputs (focus-based validation)
  const handleMonthlyIncomeBlur = (value: string) => {
    try {
      const sanitized = sanitizeInput(value, 'number')
      const numericValue = removeCommas(sanitized)
      
      if (numericValue === '' || numericValue === '0') {
        updateCarData({ monthlyIncome: 0 })
        setMonthlyIncomeDisplay('')
        return
      }
      
      const parsedValue = parseFloat(numericValue)
      
      if (isNaN(parsedValue) || parsedValue < 0) {
        updateCarData({ monthlyIncome: 0 })
        setMonthlyIncomeDisplay('')
        return
      }
      
      const income = safeNumber(
        parsedValue,
        0, // Allow 0 for monthly income to handle empty state
        VALIDATION_LIMITS.MONTHLY_INCOME.MAX
      )
      
      updateCarData({ monthlyIncome: income })
      setMonthlyIncomeDisplay(formatWithCommas(income))
      
    } catch (error) {
      console.error('Monthly income input error:', error)
      updateCarData({ monthlyIncome: 0 })
      setMonthlyIncomeDisplay('')
    }
  }

  const handleInsuranceBlur = (value: string) => {
    try {
      const sanitized = sanitizeInput(value, 'number')
      const numericValue = removeCommas(sanitized)
      
      if (numericValue === '' || numericValue === '0') {
        updateCarData({ insuranceAndMaintenance: 0 })
        setInsuranceDisplay('')
        return
      }
      
      const parsedValue = parseFloat(numericValue)
      
      if (isNaN(parsedValue) || parsedValue < 0) {
        updateCarData({ insuranceAndMaintenance: 0 })
        setInsuranceDisplay('')
        return
      }
      
      const cost = safeNumber(parsedValue, 0, 200000) // 2 Lakh limit for insurance
      updateCarData({ insuranceAndMaintenance: cost })
      setInsuranceDisplay(formatWithCommas(cost))
      
    } catch (error) {
      console.error('Insurance cost input error:', error)
      updateCarData({ insuranceAndMaintenance: 0 })
      setInsuranceDisplay('')
    }
  }

  const handleMaintenanceBlur = (value: string) => {
    try {
      const sanitized = sanitizeInput(value, 'number')
      const numericValue = removeCommas(sanitized)
      
      if (numericValue === '' || numericValue === '0') {
        updateCarData({ maintenanceCostPerYear: 0 })
        setMaintenanceDisplay('')
        return
      }
      
      const parsedValue = parseFloat(numericValue)
      
      if (isNaN(parsedValue) || parsedValue < 0) {
        updateCarData({ maintenanceCostPerYear: 0 })
        setMaintenanceDisplay('')
        return
      }
      
      const cost = safeNumber(parsedValue, 0, 500000) // 5 Lakh limit for yearly maintenance
      updateCarData({ maintenanceCostPerYear: cost })
      setMaintenanceDisplay(formatWithCommas(cost))
      
    } catch (error) {
      console.error('Maintenance cost input error:', error)
      updateCarData({ maintenanceCostPerYear: 0 })
      setMaintenanceDisplay('')
    }
  }

  const handleFuelExpenseBlur = (value: string) => {
    try {
      const sanitized = sanitizeInput(value, 'number')
      const numericValue = removeCommas(sanitized)
      
      if (numericValue === '' || numericValue === '0') {
        updateCarData({ monthlyFuelExpense: 0 })
        setFuelExpenseDisplay('')
        return
      }
      
      const parsedValue = parseFloat(numericValue)
      
      if (isNaN(parsedValue) || parsedValue < 0) {
        updateCarData({ monthlyFuelExpense: 0 })
        setFuelExpenseDisplay('')
        return
      }
      
      const expense = safeNumber(parsedValue, 0, VALIDATION_LIMITS.OPERATIONAL_COSTS.MAX) // 10 Lakh limit
      updateCarData({ monthlyFuelExpense: expense })
      setFuelExpenseDisplay(formatWithCommas(expense))
      
    } catch (error) {
      console.error('Fuel expense input error:', error)
      updateCarData({ monthlyFuelExpense: 0 })
      setFuelExpenseDisplay('')
    }
  }

  const handleParkingFeeBlur = (value: string) => {
    try {
      const sanitized = sanitizeInput(value, 'number')
      const numericValue = removeCommas(sanitized)
      
      if (numericValue === '' || numericValue === '0') {
        updateCarData({ parkingFee: 0 })
        setParkingFeeDisplay('')
        return
      }
      
      const parsedValue = parseFloat(numericValue)
      
      if (isNaN(parsedValue) || parsedValue < 0) {
        updateCarData({ parkingFee: 0 })
        setParkingFeeDisplay('')
        return
      }
      
      const fee = safeNumber(parsedValue, 0, 50000) // 50K limit for parking
      updateCarData({ parkingFee: fee })
      setParkingFeeDisplay(formatWithCommas(fee))
      
    } catch (error) {
      console.error('Parking fee input error:', error)
      updateCarData({ parkingFee: 0 })
      setParkingFeeDisplay('')
    }
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
      <div className="flex items-center space-x-3 mb-3">
        <h4 className="text-lg font-semibold text-blue-400">
          Monthly Income
        </h4>
        <div className={`h-px w-16 ${themeClass('bg-slate-300', 'bg-white/30', isLight)}`}></div>
      </div>
      
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
            inputMode="numeric"
            pattern="[0-9,]*"
            autoComplete="off"
            required
            value={monthlyIncomeDisplay}
            ref={monthlyIncomeInputRef}
            onChange={(e) => {
              // Store exactly what user types - no processing until blur
              setMonthlyIncomeDisplay(e.target.value)
            }}
            onBlur={(e) => {
              handleMonthlyIncomeBlur(e.target.value)
            }}
            onKeyDown={(e) => {
              // Enhanced mobile keyboard handling
              const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter', 'Escape']
              const isAllowedKey = allowedKeys.includes(e.key)
              const isNumber = /^[0-9]$/.test(e.key)
              const isDecimal = e.key === '.' && !e.currentTarget.value.includes('.')
              const isComma = e.key === ','
              
              if (!isAllowedKey && !isNumber && !isDecimal && !isComma) {
                e.preventDefault()
              }
            }}
            placeholder="Enter your monthly income"
            className={`w-full pl-8 pr-4 py-1.5 max-md:py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-sm max-md:text-base bg-white/10 backdrop-blur-md border text-white placeholder-white/50 max-md:min-h-[48px] touch-manipulation ${
              shouldHighlightMonthlyIncome 
                ? 'border-lime-400/60' 
                : 'border-white/20'
            }`}
            style={{ WebkitAppearance: 'none', WebkitTapHighlightColor: 'transparent' }}
          />
        </div>
        <p className={`text-sm flex items-center mt-3 ${themeClass(themeStyles.secondaryText, 'text-white/70', isLight)}`}>
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-3"></span>
          Used to calculate the 10% rule: total car expenses should not exceed 10% of your income
        </p>
      </div>

      {/* Operational Cost Section Header */}
      <div className="flex items-center space-x-3 mb-3">
        <h4 className="text-lg font-semibold text-blue-400">
          Operational Cost
        </h4>
        <div className={`h-px w-16 ${themeClass('bg-slate-300', 'bg-white/30', isLight)}`}></div>
      </div>

      {/* Insurance Cost and Maintenance Cost Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 relative">
        {/* Insurance Cost */}
        <div className="space-y-2">
          <label className={`text-sm font-medium ${themeClass(themeStyles.primaryText, 'text-white', isLight)}`} style={{ lineHeight: '1.5' }}>
            Insurance Cost
          </label>
          <div className="relative rounded-md border-2 border-white/20 focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-400/20 transition-all duration-200">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 font-semibold text-white/70 z-10 pointer-events-none">₹</span>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9,]*"
              autoComplete="off"
              value={insuranceDisplay}
              onChange={(e) => {
                // Store exactly what user types - no processing until blur
                setInsuranceDisplay(e.target.value)
              }}
              onBlur={(e) => {
                handleInsuranceBlur(e.target.value)
              }}
              onKeyDown={(e) => {
                // Enhanced mobile keyboard handling
                const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter', 'Escape']
                const isAllowedKey = allowedKeys.includes(e.key)
                const isNumber = /^[0-9]$/.test(e.key)
                const isComma = e.key === ','
                const isPeriod = e.key === '.'
                
                if (!isAllowedKey && !isNumber && !isComma && !isPeriod) {
                  e.preventDefault()
                }
              }}
              placeholder="Enter Insurance cost"
              className="w-full pl-8 pr-4 py-1.5 max-md:py-3 rounded-md focus:outline-none border-0 bg-transparent text-sm max-md:text-base text-white placeholder-white/50 max-md:min-h-[48px] touch-manipulation"
              style={{ WebkitAppearance: 'none', WebkitTapHighlightColor: 'transparent' }}
            />
          </div>
        </div>

        {/* Vertical Separator - Only visible on large screens */}
        <div className={`hidden lg:block absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-px ${isLight ? 'bg-gradient-to-b from-transparent via-slate-300 to-transparent' : 'bg-gradient-to-b from-transparent via-white/20 to-transparent'}`}></div>

        {/* Maintenance Cost (per year) */}
        <div className="space-y-2">
          <label className={`text-sm font-medium ${themeClass(themeStyles.primaryText, 'text-white', isLight)}`} style={{ lineHeight: '1.5' }}>
            Maintenance Cost (per year)
          </label>
          <div className="relative rounded-md border-2 border-white/20 focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-400/20 transition-all duration-200">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 font-semibold text-white/70 z-10 pointer-events-none">₹</span>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9,]*"
              autoComplete="off"
              value={maintenanceDisplay}
              onChange={(e) => {
                // Store exactly what user types - no processing until blur
                setMaintenanceDisplay(e.target.value)
              }}
              onBlur={(e) => {
                handleMaintenanceBlur(e.target.value)
              }}
              onKeyDown={(e) => {
                // Enhanced mobile keyboard handling
                const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter', 'Escape']
                const isAllowedKey = allowedKeys.includes(e.key)
                const isNumber = /^[0-9]$/.test(e.key)
                const isDecimal = e.key === '.' && !e.currentTarget.value.includes('.')
                const isComma = e.key === ','
                
                if (!isAllowedKey && !isNumber && !isDecimal && !isComma) {
                  e.preventDefault()
                }
              }}
              placeholder="Enter yearly maintenance cost"
              className="w-full pl-8 pr-4 py-1.5 max-md:py-3 rounded-md focus:outline-none border-0 bg-transparent text-sm max-md:text-base text-white placeholder-white/50 max-md:min-h-[48px] touch-manipulation"
              style={{ WebkitAppearance: 'none', WebkitTapHighlightColor: 'transparent' }}
            />
          </div>
        </div>
      </div>

      {/* Monthly Fuel Expense and Parking Fee Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mt-6 relative">
        {/* Monthly Fuel Expense */}
        <div className="space-y-2" id="monthly-fuel-expense">
          <label className={`text-sm font-medium ${themeClass(themeStyles.primaryText, 'text-white', isLight)}`} style={{ lineHeight: '1.5' }}>
            Monthly Fuel Expense
          </label>
          <div className="relative rounded-md border-2 border-white/20 focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-400/20 transition-all duration-200">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 font-semibold text-white/70 z-10 pointer-events-none">₹</span>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9,]*"
              autoComplete="off"
              value={fuelExpenseDisplay}
              onChange={(e) => {
                // Store exactly what user types - no processing until blur
                setFuelExpenseDisplay(e.target.value)
              }}
              onBlur={(e) => {
                handleFuelExpenseBlur(e.target.value)
              }}
              onKeyDown={(e) => {
                // Enhanced mobile keyboard handling
                const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter', 'Escape']
                const isAllowedKey = allowedKeys.includes(e.key)
                const isNumber = /^[0-9]$/.test(e.key)
                const isDecimal = e.key === '.' && !e.currentTarget.value.includes('.')
                const isComma = e.key === ','
                
                if (!isAllowedKey && !isNumber && !isDecimal && !isComma) {
                  e.preventDefault()
                }
              }}
              placeholder="Enter monthly fuel expense"
              className="w-full pl-8 pr-4 py-1.5 max-md:py-3 rounded-md focus:outline-none border-0 bg-transparent text-sm max-md:text-base text-white placeholder-white/50 max-md:min-h-[48px] touch-manipulation"
              style={{ WebkitAppearance: 'none', WebkitTapHighlightColor: 'transparent' }}
            />
          </div>
        </div>

        {/* Vertical Separator - Only visible on large screens */}
        <div className={`hidden lg:block absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-px ${isLight ? 'bg-gradient-to-b from-transparent via-slate-300 to-transparent' : 'bg-gradient-to-b from-transparent via-white/20 to-transparent'}`}></div>

        {/* Parking Fee */}
        <div className="space-y-2">
          <label className={`text-sm font-medium ${themeClass(themeStyles.primaryText, 'text-white', isLight)}`} style={{ lineHeight: '1.5' }}>
            Parking Fee (per month)
          </label>
          <div className="relative rounded-md border-2 border-white/20 focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-400/20 transition-all duration-200">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 font-semibold text-white/70 z-10 pointer-events-none">₹</span>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9,]*"
              autoComplete="off"
              value={parkingFeeDisplay}
              onChange={(e) => {
                // Store exactly what user types - no processing until blur
                setParkingFeeDisplay(e.target.value)
              }}
              onBlur={(e) => {
                handleParkingFeeBlur(e.target.value)
              }}
              onKeyDown={(e) => {
                // Enhanced mobile keyboard handling
                const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter', 'Escape']
                const isAllowedKey = allowedKeys.includes(e.key)
                const isNumber = /^[0-9]$/.test(e.key)
                const isDecimal = e.key === '.' && !e.currentTarget.value.includes('.')
                const isComma = e.key === ','
                
                if (!isAllowedKey && !isNumber && !isDecimal && !isComma) {
                  e.preventDefault()
                }
              }}
              placeholder="Enter parking fee"
              className="w-full pl-8 pr-4 py-1.5 max-md:py-3 rounded-md focus:outline-none border-0 bg-transparent text-sm max-md:text-base text-white placeholder-white/50 max-md:min-h-[48px] touch-manipulation"
              style={{ WebkitAppearance: 'none', WebkitTapHighlightColor: 'transparent' }}
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