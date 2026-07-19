'use client'

import React from 'react'
import { CarData } from '@/types/CarData'
import { useTheme } from '@/contexts/ThemeContext'
import { getThemeStyles, themeClass } from '@/utils/themeStyles'
import { safeNumber, sanitizeInput, VALIDATION_LIMITS, formatNumberSafe } from '@/utils/safeCalculations'

interface CarDetailsFormV2Props {
  carData: CarData
  updateCarData: (updates: Partial<CarData>) => void
  monthlyIncomeInputRef?: React.RefObject<HTMLInputElement | null>
}

export default function CarDetailsFormV2({ carData, updateCarData, monthlyIncomeInputRef }: CarDetailsFormV2Props) {
  const { theme, isLight } = useTheme()
  const themeStyles = getThemeStyles(theme)
  
  // Local state for display values during editing (to avoid real-time validation)
  const [carPriceDisplay, setCarPriceDisplay] = React.useState('')
  const [downPaymentDisplay, setDownPaymentDisplay] = React.useState('')
  
  // Update display values when actual data changes from external sources
  React.useEffect(() => {
    setCarPriceDisplay(carData.carPrice ? formatWithCommas(carData.carPrice) : '')
  }, [carData.carPrice])
  
  React.useEffect(() => {
    setDownPaymentDisplay(carData.downPayment ? formatWithCommas(carData.downPayment) : '')
  }, [carData.downPayment])

  // Removed auto-fill of car price - let user choose explicitly
  
  // Check if all required fields except Monthly Income are filled
  const allOtherFieldsFilled = carData.carPrice > 0 && carData.downPayment >= 0 && carData.tenure > 0
  const monthlyIncomeEmpty = carData.monthlyIncome === 0
  const shouldHighlightMonthlyIncome = allOtherFieldsFilled && monthlyIncomeEmpty
  
  // Auto-focus Monthly Income when all other required fields are filled
  // Only focus if no input is currently focused to prevent interrupting user input
  React.useEffect(() => {
    if (shouldHighlightMonthlyIncome && monthlyIncomeInputRef?.current) {
      const activeElement = document.activeElement;
      
      // Check if the currently focused element is an input field
      const isInputFocused = activeElement && (
        activeElement.tagName === 'INPUT' || 
        activeElement.tagName === 'TEXTAREA' ||
        (activeElement as HTMLElement).contentEditable === 'true'
      );
      
      // Only focus monthly income input if no input is currently focused
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

  // Use safe formatting functions
  const formatWithCommas = (num: number): string => {
    return formatNumberSafe(num)
  }

  // Helper function to remove commas and convert to number
  const removeCommas = (str: string): string => {
    return str.replace(/,/g, '')
  }

  // Handle car price input validation only on blur (when user finishes editing)
  const handleCarPriceBlur = (value: string) => {
    try {
      // Sanitize input to prevent malformed data
      const sanitized = sanitizeInput(value, 'number')
      const numericValue = removeCommas(sanitized)
      
      if (numericValue === '' || numericValue === '0') {
        updateCarData({ carPrice: 0 })
        setCarPriceDisplay('')
        return
      }
      
      const parsedValue = parseFloat(numericValue)
      
      if (isNaN(parsedValue) || parsedValue <= 0) {
        updateCarData({ carPrice: 0 })
        setCarPriceDisplay('')
        return
      }
      
      // Use safe number validation with proper limits
      const price = safeNumber(
        parsedValue,
        VALIDATION_LIMITS.CAR_PRICE.MIN,
        VALIDATION_LIMITS.CAR_PRICE.MAX
      )
      
      updateCarData({ carPrice: price })
      
      // Update display with formatted value
      setCarPriceDisplay(formatWithCommas(price))
      
      // Auto-calculate 20% down payment with safe math
      if (price > 0) {
        const downPayment = Math.round(price * 0.2)
        const safeDownPayment = safeNumber(downPayment, 0, price)
        updateCarData({ downPayment: safeDownPayment })
        
        // Set default loan tenure to 3 years when car price is selected
        if (carData.tenure === 0) {
          updateCarData({ tenure: 3 })
        }
      }
    } catch (error) {
      console.error('Car price input error:', error)
      updateCarData({ carPrice: 0 })
      setCarPriceDisplay('')
    }
  }

  // Handle down payment input validation only on blur (when user finishes editing)
  const handleDownPaymentBlur = (value: string) => {
    try {
      // Sanitize input to prevent malformed data
      const sanitized = sanitizeInput(value, 'number')
      const numericValue = removeCommas(sanitized)
      
      if (numericValue === '' || numericValue === '0') {
        updateCarData({ downPayment: 0 })
        setDownPaymentDisplay('')
        return
      }
      
      const parsedValue = parseInt(numericValue)
      
      if (isNaN(parsedValue) || parsedValue < 0) {
        updateCarData({ downPayment: 0 })
        setDownPaymentDisplay('')
        return
      }
      
      // Use safe number validation with car price as maximum
      const safeCarPrice = safeNumber(carData.carPrice, VALIDATION_LIMITS.CAR_PRICE.MIN, VALIDATION_LIMITS.CAR_PRICE.MAX)
      const payment = safeNumber(
        parsedValue,
        VALIDATION_LIMITS.DOWN_PAYMENT.MIN,
        safeCarPrice // Down payment cannot exceed car price
      )
      
      updateCarData({ downPayment: payment })
      
      // Update display with formatted value
      setDownPaymentDisplay(formatWithCommas(payment))
    } catch (error) {
      console.error('Down payment input error:', error)
      updateCarData({ downPayment: 0 })
      setDownPaymentDisplay('')
    }
  }


  // Safe percentage calculation to prevent division by zero
  const downPaymentPercentage = (() => {
    const safeCarPrice = safeNumber(carData.carPrice, 1) // Prevent division by zero
    const safeDownPayment = safeNumber(carData.downPayment, 0)
    return safeCarPrice > 0 ? (safeDownPayment / safeCarPrice) * 100 : 0
  })()


  const formContent = (
    <>
      {/* Car Price and Down Payment Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 relative">
        {/* Car Price */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="car-price-input" className={`text-sm font-medium ${themeClass(themeStyles.primaryText, 'text-white', isLight)}`} style={{ lineHeight: '1.5' }}>
              Car Price
            </label>
          </div>
          
          <div className="relative">
            <span className={`absolute left-4 top-1/2 transform -translate-y-1/2 font-semibold ${isLight ? 'text-slate-400' : 'text-white/70'} z-10`}>₹</span>
            <input
              id="car-price-input"
              type="text"
              required
              value={carPriceDisplay}
              onChange={(e) => {
                // Store exactly what user types, allowing for empty states
                const value = e.target.value
                if (value === '') {
                  setCarPriceDisplay('')
                  return
                }
                // Format with commas as user types
                const numericOnly = value.replace(/[^0-9.]/g, '')
                if (numericOnly === '') {
                  setCarPriceDisplay('')
                  return
                }
                const formatted = numericOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                setCarPriceDisplay(formatted)
              }}
              onBlur={(e) => {
                handleCarPriceBlur(e.target.value)
              }}
              onKeyDown={(e) => {
                // Enhanced key validation to prevent invalid characters
                const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter']
                const isAllowedKey = allowedKeys.includes(e.key)
                const isNumber = /^[0-9]$/.test(e.key)
                const isDecimal = e.key === '.' && !e.currentTarget.value.includes('.')
                const isComma = e.key === ','
                
                if (!isAllowedKey && !isNumber && !isDecimal && !isComma) {
                  e.preventDefault()
                }
              }}
              className={`w-full pl-8 pr-4 py-1.5 max-md:py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-sm max-md:text-base ${isLight ? 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400' : 'bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50'} max-md:min-h-[48px]`}
              placeholder="Enter car price"
            />
          </div>
          
          {/* Preset Buttons - moved below input box */}
          <div className="flex justify-center">
            <div className="flex gap-1 overflow-x-auto scrollbar-hide">
              {carPresets.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => {
                    setCarPriceDisplay(formatWithCommas(preset.value))
                    handleCarPriceBlur(preset.value.toString())
                  }}
                  className={`flex-shrink-0 min-h-[20px] max-md:min-h-[44px] px-1.5 max-md:px-3 py-0.5 max-md:py-2 text-xs max-md:text-sm font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-1 active:scale-95 rounded ${
                    carData.carPrice === preset.value
                      ? 'bg-emerald-600 text-white shadow-sm focus:ring-emerald-400/50 border border-emerald-300'
                      : themeClass(
                          'bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200 hover:border-slate-400 focus:ring-slate-300',
                          'bg-white/10 text-white/90 border border-white/30 hover:bg-white/20 hover:border-white/50 focus:ring-white/30',
                          isLight
                        )
                  }`}
                  style={{ 
                    lineHeight: '1.1',
                    minWidth: '38px'
                  }}
                >
                  ₹{preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Vertical Separator - Only visible on large screens */}
        <div className={`hidden lg:block absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-px ${isLight ? 'bg-gradient-to-b from-transparent via-slate-300 to-transparent' : 'bg-gradient-to-b from-transparent via-white/20 to-transparent'}`}></div>

        {/* Down Payment */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className={`text-sm font-medium ${themeClass(themeStyles.primaryText, 'text-white', isLight)}`} style={{ lineHeight: '1.5' }}>
              Down Payment
            </label>
            {downPaymentPercentage > 0 && (
              <span className={`text-sm font-bold ${themeClass('text-cyan-600', 'text-cyan-300', isLight)}`}>
                {downPaymentPercentage.toFixed(1)}%
              </span>
            )}
          </div>
          
          <div className="relative">
            <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-semibold ${isLight ? 'text-slate-400' : 'text-white/70'} z-10`}>₹</span>
            <input
              type="text"
              required
              value={downPaymentDisplay}
              onChange={(e) => {
                // Store exactly what user types, allowing for empty states
                const value = e.target.value
                if (value === '') {
                  setDownPaymentDisplay('')
                  return
                }
                // Format with commas as user types
                const numericOnly = value.replace(/[^0-9]/g, '')
                if (numericOnly === '') {
                  setDownPaymentDisplay('')
                  return
                }
                const formatted = numericOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                setDownPaymentDisplay(formatted)
              }}
              onBlur={(e) => {
                handleDownPaymentBlur(e.target.value)
              }}
              onKeyDown={(e) => {
                // Enhanced key validation for down payment (no decimals)
                const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter']
                const isAllowedKey = allowedKeys.includes(e.key)
                const isNumber = /^[0-9]$/.test(e.key)
                const isComma = e.key === ','
                
                if (!isAllowedKey && !isNumber && !isComma) {
                  e.preventDefault()
                }
              }}
              className={`w-full pl-8 pr-4 py-1.5 max-md:py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all text-sm max-md:text-base ${isLight ? 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400' : 'bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50'} max-md:min-h-[48px]`}
              placeholder="Enter down payment"
            />
          </div>
          
          {/* Enhanced Slider for down payment - moved below input */}
          <div>
            <div className="relative group">
              <input
                type="range"
                min="0"
                max={carData.carPrice}
                step="1000"
                value={carData.downPayment}
                onChange={(e) => {
                  const value = e.target.value
                  setDownPaymentDisplay(formatWithCommas(parseInt(value)))
                  handleDownPaymentBlur(value)
                }}
                className={`w-full h-0.5 rounded-full appearance-none cursor-pointer slider-enhanced transition-all duration-200 ${isLight ? 'light-theme' : 'dark-theme'}`}
                style={{
                  background: `linear-gradient(to right, ${downPaymentPercentage >= 20 ? '#06b6d4' : '#f97316'} 0%, ${downPaymentPercentage >= 20 ? '#06b6d4' : '#f97316'} ${carData.carPrice > 0 ? (carData.downPayment / carData.carPrice) * 100 : 0}%, ${isLight ? '#e2e8f0' : 'rgba(255,255,255,0.2)'} ${carData.carPrice > 0 ? (carData.downPayment / carData.carPrice) * 100 : 0}%, ${isLight ? '#e2e8f0' : 'rgba(255,255,255,0.2)'} 100%)`
                }}
              />
            </div>
            <div className={`flex justify-between text-xs mt-1 ${themeClass(themeStyles.mutedText, 'text-white/60', isLight)}`}>
              <span>₹0</span>
              <span>₹{(carData.carPrice / 100000).toFixed(0)}L</span>
            </div>
          </div>
        </div>
      </div>

      {/* Loan Details Section Header */}
      <div className="flex items-center space-x-3 mb-3">
        <h4 className={`text-lg font-semibold ${themeClass('text-slate-900', 'text-blue-400', isLight)}`}>
          Loan Details
        </h4>
        <div className={`h-px w-16 ${themeClass('bg-slate-300', 'bg-white/30', isLight)}`}></div>
      </div>

      {/* Loan Tenure and Interest Rate Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 relative">
        {/* Loan Tenure */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <label className={`text-sm font-medium ${themeClass(themeStyles.primaryText, 'text-white', isLight)}`} style={{ lineHeight: '1.5' }}>
              Loan Tenure
            </label>
            {carData.tenure > 0 && (
              <span className={`text-sm font-bold ${themeClass('text-cyan-600', 'text-cyan-300', isLight)}`}>
                {Math.round(carData.tenure || 0)} years
              </span>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="relative group">
              <input
                type="range"
                min="1"
                max="7"
                step="0.01"
                value={carData.tenure || 1}
                onChange={(e) => {
                  try {
                    const rawValue = parseFloat(e.target.value)
                    const safeYears = safeNumber(
                      Math.round(rawValue),
                      VALIDATION_LIMITS.TENURE_YEARS.MIN,
                      VALIDATION_LIMITS.TENURE_YEARS.MAX
                    )
                    updateCarData({ tenure: safeYears })
                  } catch (error) {
                    console.error('Tenure input error:', error)
                    updateCarData({ tenure: VALIDATION_LIMITS.TENURE_YEARS.MIN })
                  }
                }}
                className={`w-full h-0.5 rounded-full appearance-none cursor-pointer slider-enhanced transition-all duration-200 ${isLight ? 'light-theme' : 'dark-theme'}`}
                style={{
                  background: `linear-gradient(to right, ${(carData.tenure || 1) <= 4 ? '#06b6d4' : '#ef4444'} 0%, ${(carData.tenure || 1) <= 4 ? '#06b6d4' : '#ef4444'} ${(((carData.tenure || 1) - 1) / (7 - 1)) * 100}%, ${isLight ? '#e2e8f0' : 'rgba(255,255,255,0.2)'} ${(((carData.tenure || 1) - 1) / (7 - 1)) * 100}%, ${isLight ? '#e2e8f0' : 'rgba(255,255,255,0.2)'} 100%)`
                }}
              />
            </div>
            
            <div className={`flex justify-between text-xs ${themeClass(themeStyles.mutedText, 'text-white/60', isLight)}`}>
              <span>1yr</span>
              <span>3yr</span>
              <span>5yr</span>
              <span>7yr</span>
            </div>
            
            {/* Warning for tenure > 4 years */}
            {carData.tenure > 4 && (
              <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-1">
                <p className="text-red-300 text-xs break-words">
                  ⚠️ Consider reducing tenure for better financial health
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Vertical Separator - Only visible on large screens */}
        <div className={`hidden lg:block absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-px ${isLight ? 'bg-gradient-to-b from-transparent via-slate-300 to-transparent' : 'bg-gradient-to-b from-transparent via-white/20 to-transparent'}`}></div>

        {/* Interest Rate */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <label className={`text-sm font-medium ${themeClass(themeStyles.primaryText, 'text-white', isLight)}`} style={{ lineHeight: '1.5' }}>
              Interest Rate
            </label>
            <span className={`text-sm font-bold ${themeClass('text-cyan-600', 'text-cyan-300', isLight)}`}>{carData.interestRate}% per annum</span>
          </div>
          
          <div className="space-y-2">
            {/* Interest Rate Slider */}
            <div className="relative group">
              <div className="relative">
                <input
                  type="range"
                  min="5"
                  max="15"
                  step="0.1"
                  value={carData.interestRate}
                  onChange={(e) => {
                    try {
                      const rate = safeNumber(
                        parseFloat(e.target.value),
                        VALIDATION_LIMITS.INTEREST_RATE.MIN,
                        VALIDATION_LIMITS.INTEREST_RATE.MAX
                      )
                      updateCarData({ interestRate: rate })
                    } catch (error) {
                      console.error('Interest rate input error:', error)
                      updateCarData({ interestRate: VALIDATION_LIMITS.INTEREST_RATE.MIN })
                    }
                  }}
                  className={`w-full h-0.5 rounded-full appearance-none cursor-pointer slider-enhanced transition-all duration-200 ${isLight ? 'light-theme' : 'dark-theme'}`}
                  style={{
                    background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${((carData.interestRate - 5) / (15 - 5)) * 100}%, ${isLight ? '#e2e8f0' : 'rgba(255,255,255,0.2)'} ${((carData.interestRate - 5) / (15 - 5)) * 100}%, ${isLight ? '#e2e8f0' : 'rgba(255,255,255,0.2)'} 100%)`
                  }}
                />
              </div>
              <div className={`flex justify-between text-xs mt-1 ${themeClass(themeStyles.mutedText, 'text-white/60', isLight)}`}>
                <span>5%</span>
                <span>10%</span>
                <span>15%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )

  return (
    <div className="space-y-10">
      
      <div className="space-y-8" role="form" aria-label="Car details form">
        {formContent}
      </div>
    </div>
  )
}