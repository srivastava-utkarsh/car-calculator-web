'use client'

import React from 'react'
import { CarData } from '@/app/page'

interface CarDetailsFormV2Props {
  carData: CarData
  updateCarData: (updates: Partial<CarData>) => void
  monthlyIncomeInputRef?: React.RefObject<HTMLInputElement | null>
}

export default function CarDetailsFormV2({ carData, updateCarData, monthlyIncomeInputRef }: CarDetailsFormV2Props) {

  // Removed auto-fill of car price - let user choose explicitly
  
  // Check if all required fields except Monthly Income are filled
  const allOtherFieldsFilled = carData.carPrice > 0 && carData.downPayment >= 0 && carData.tenure > 0
  const monthlyIncomeEmpty = carData.monthlyIncome === 0
  const shouldHighlightMonthlyIncome = allOtherFieldsFilled && monthlyIncomeEmpty
  
  // Auto-focus Monthly Income when all other required fields are filled
  React.useEffect(() => {
    if (shouldHighlightMonthlyIncome && monthlyIncomeInputRef?.current) {
      monthlyIncomeInputRef.current.focus()
    }
  }, [shouldHighlightMonthlyIncome, monthlyIncomeInputRef])

  // Preset car price options
  const carPresets = [
    { label: '5L', value: 500000 },
    { label: '10L', value: 1000000 },
    { label: '20L', value: 2000000 },
    { label: '50L+', value: 5000000 }
  ]

  const handleCarPriceChange = (value: string) => {
    // Allow only numbers and enforce limits
    const numericValue = value.replace(/[^0-9.]/g, '')
    let price = parseFloat(numericValue) || 0
    
    // Enforce maximum limit
    if (price > 50000000) {
      price = 50000000
    }
    
    updateCarData({ carPrice: price })
    
    // Auto-calculate 20% down payment
    const downPayment = price * 0.2
    updateCarData({ downPayment })
    
    // Set default loan tenure to 3 years when car price is selected
    if (price > 0 && carData.tenure === 0) {
      updateCarData({ tenure: 3 })
    }
  }

  const handleDownPaymentChange = (value: string) => {
    // Allow only numbers and enforce limits
    const numericValue = value.replace(/[^0-9.]/g, '')
    let payment = parseFloat(numericValue) || 0
    
    // Enforce maximum limit (car price)
    if (payment > carData.carPrice) {
      payment = carData.carPrice
    }
    
    updateCarData({ downPayment: payment })
  }


  const downPaymentPercentage = carData.carPrice > 0 ? (carData.downPayment / carData.carPrice) * 100 : 0


  const formContent = (
    <>
      {/* Car Price */}
      <div className="space-y-2">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <label htmlFor="car-price-input" className="text-base min-[375px]:text-lg font-medium text-white" style={{ lineHeight: '1.5' }}>
              Car Price
            </label>
            {/* Compact Price Selection Buttons */}
            <div className="flex gap-1">
              {carPresets.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => handleCarPriceChange(preset.value.toString())}
                  className={`px-2 py-1 text-xs font-medium rounded-md transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-1 active:scale-95 ${
                    carData.carPrice === preset.value
                      ? 'bg-emerald-500 text-white shadow-sm focus:ring-emerald-400/50'
                      : 'bg-white/10 text-white/80 border border-white/20 hover:bg-emerald-500/20 hover:border-emerald-400/40 focus:ring-white/30'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 font-semibold">₹</span>
          <input
            id="car-price-input"
            type="number"
            min="1"
            max="50000000"
            required
            value={carData.carPrice || ''}
            onChange={(e) => handleCarPriceChange(e.target.value)}
            onKeyPress={(e) => {
              if (!/[0-9.]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                e.preventDefault()
              }
            }}
            className="w-full pl-8 pr-4 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-base"
            placeholder="Enter on-road car price"
          />
        </div>
      </div>

      {/* Down Payment */}
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-2">
          <label className="text-base min-[375px]:text-lg font-medium text-white" style={{ lineHeight: '1.5' }}>
            Down Payment
          </label>
          {downPaymentPercentage > 0 && (
            <span className="text-sm text-cyan-300 font-medium">{downPaymentPercentage.toFixed(1)}% of car price</span>
          )}
        </div>
        
        {/* Enhanced Slider for down payment */}
        <div className="mb-4">
          <div className="relative group">
            <input
              type="range"
              min="0"
              max={carData.carPrice}
              step="10000"
              value={carData.downPayment}
              onChange={(e) => handleDownPaymentChange(e.target.value)}
              className="w-full h-3 bg-white/20 rounded-full appearance-none cursor-pointer slider-enhanced transition-all duration-200 hover:h-4"
              style={{
                background: `linear-gradient(to right, ${downPaymentPercentage >= 20 ? '#06b6d4' : '#f97316'} 0%, ${downPaymentPercentage >= 20 ? '#06b6d4' : '#f97316'} ${(carData.downPayment / carData.carPrice) * 100}%, rgba(255,255,255,0.2) ${(carData.downPayment / carData.carPrice) * 100}%, rgba(255,255,255,0.2) 100%)`
              }}
            />
            {/* Value display tooltip */}
            <div 
              className="absolute -top-10 bg-gray-800/90 text-white text-xs px-2 py-1 rounded-md pointer-events-none transition-opacity duration-200 opacity-0 group-hover:opacity-100"
              style={{
                left: `${(carData.downPayment / carData.carPrice) * 100}%`,
                transform: 'translateX(-50%)'
              }}
            >
              ₹{(carData.downPayment / 100000).toFixed(1)}L
            </div>
          </div>
          <div className="flex justify-between text-xs text-white/60 mt-2">
            <span>₹0</span>
            <span className="text-center">₹{(carData.carPrice / 200000).toFixed(1)}L</span>
            <span>₹{(carData.carPrice / 100000).toFixed(0)}L</span>
          </div>
        </div>
        
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 font-semibold">₹</span>
          <input
            type="number"
            min="0"
            max={carData.carPrice}
            required
            value={carData.downPayment || ''}
            onChange={(e) => handleDownPaymentChange(e.target.value)}
            onKeyPress={(e) => {
              if (!/[0-9.]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                e.preventDefault()
              }
            }}
            className="w-full pl-8 pr-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all text-base"
            placeholder="Enter down payment"
          />
        </div>
      </div>

      {/* Loan Tenure */}
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-2">
          <label className="text-base min-[375px]:text-lg font-medium text-white" style={{ lineHeight: '1.5' }}>
            Loan Tenure
          </label>
          <span className="text-sm text-cyan-300 font-medium">{Math.round(carData.tenure || 3)} years</span>
        </div>
        
        <div className="space-y-3">
          <div className="relative group">
            <input
              type="range"
              min="1"
              max="7"
              step="1"
              value={carData.tenure || 3}
              onChange={(e) => updateCarData({ tenure: parseInt(e.target.value) })}
              className="w-full h-3 bg-white/20 rounded-full appearance-none cursor-pointer slider-enhanced transition-all duration-200 hover:h-4"
              style={{
                background: `linear-gradient(to right, ${(carData.tenure || 3) <= 4 ? '#06b6d4' : '#ef4444'} 0%, ${(carData.tenure || 3) <= 4 ? '#06b6d4' : '#ef4444'} ${(((carData.tenure || 3) - 1) / (7 - 1)) * 100}%, rgba(255,255,255,0.2) ${(((carData.tenure || 3) - 1) / (7 - 1)) * 100}%, rgba(255,255,255,0.2) 100%)`
              }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-white/60">
            <span>1yr</span>
            <span>2yr</span>
            <span>3yr</span>
            <span>4yr</span>
            <span>5yr</span>
            <span>6yr</span>
            <span>7yr</span>
          </div>
          
          {/* Warning for tenure > 4 years */}
          {carData.tenure > 4 && (
            <div className="bg-red-500/20 border border-red-400/50 rounded-2xl p-3">
              <p className="text-red-300 text-xs">
                ⚠️ You're going above the suggested 4-year limit. Consider reducing the tenure for better financial health.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Interest Rate */}
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-2">
          <label className="text-base min-[375px]:text-lg font-medium text-white" style={{ lineHeight: '1.5' }}>
            Interest Rate
          </label>
          <span className="text-sm text-cyan-300 font-medium">{carData.interestRate}% per annum</span>
        </div>
        
        <div className="space-y-3">
          {/* Interest Rate Input */}
          <input
            type="number"
            step="0.1"
            min="5"
            max="15"
            value={carData.interestRate}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (isNaN(value)) {
                updateCarData({ interestRate: 8 });
              } else if (value < 5) {
                updateCarData({ interestRate: 5 });
              } else if (value > 15) {
                updateCarData({ interestRate: 15 });
              } else {
                updateCarData({ interestRate: value });
              }
            }}
            onBlur={(e) => {
              const value = parseFloat(e.target.value);
              if (isNaN(value) || value < 5 || value > 15) {
                const clampedValue = isNaN(value) ? 8 : Math.max(5, Math.min(15, value));
                updateCarData({ interestRate: clampedValue });
              }
            }}
            className="w-full px-4 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all text-base"
            placeholder="Interest rate (5-15%)"
          />
          
          {/* Interest Rate Slider */}
          <div className="relative group">
            <input
              type="range"
              min="5"
              max="15"
              step="0.1"
              value={carData.interestRate}
              onChange={(e) => updateCarData({ interestRate: parseFloat(e.target.value) })}
              className="w-full h-3 bg-white/20 rounded-full appearance-none cursor-pointer slider-enhanced transition-all duration-200 hover:h-4"
              style={{
                background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${((carData.interestRate - 5) / (15 - 5)) * 100}%, rgba(255,255,255,0.2) ${((carData.interestRate - 5) / (15 - 5)) * 100}%, rgba(255,255,255,0.2) 100%)`
              }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-white/60">
            <span>5%</span>
            <span>10%</span>
            <span>15%</span>
          </div>
        </div>
      </div>

    </>
  )

  return (
    <div className="space-y-8">
      {/* STEP 1: Car & Loan Details */}
      <div className="border border-white/10 rounded-2xl p-6 bg-white/5">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
            1
          </div>
          <h3 className="text-lg font-bold text-white">Car & Loan Details</h3>
        </div>
        <div className="space-y-5" role="form" aria-label="Car details form">
          {formContent}
        </div>
      </div>
    </div>
  )
}