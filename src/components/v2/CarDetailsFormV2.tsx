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
    { label: '5 Lakhs', value: 500000 },
    { label: '10 Lakhs', value: 1000000 },
    { label: '15 Lakhs', value: 1500000 },
    { label: '20 Lakhs+', value: 2000000 }
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
              1. Car Price
            </label>
          </div>
          
          {/* Preset Buttons - Mobile-First Design */}
          <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide">
            {carPresets.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => handleCarPriceChange(preset.value.toString())}
                className={`flex-shrink-0 min-h-[32px] px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 active:scale-95 ${
                  carData.carPrice === preset.value
                    ? 'bg-emerald-600 text-white shadow-md focus:ring-emerald-400/50'
                    : 'bg-white/10 text-white/90 border border-white/20 hover:bg-white/20 hover:border-white/30 focus:ring-white/30'
                }`}
                style={{ 
                  lineHeight: '1.2',
                  minWidth: '60px'
                }}
              >
                ₹{preset.label}
              </button>
            ))}
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
            2. Down Payment
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

      {/* Monthly Income - Required for calculations */}
      <div className={`space-y-2 p-2.5 rounded-lg transition-all duration-300 ${
        shouldHighlightMonthlyIncome 
          ? 'border-lime-400/40 shadow-lg shadow-lime-400/20 bg-lime-400/10 border' 
          : ''
      }`}>
        <label className="block text-base min-[375px]:text-lg font-medium text-white" style={{ lineHeight: '1.5' }}>
          3. Monthly Income
          <span className="text-xs text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full ml-2">Affordability Check</span>
        </label>
        {shouldHighlightMonthlyIncome && (
          <div className="text-red-300 text-sm font-medium flex items-center">
            <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
            This field is mandatory to proceed
          </div>
        )}
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 font-semibold">₹</span>
          <input
            type="number"
            min="0"
            max="100000000"
            required
            value={carData.monthlyIncome || ''}
            ref={monthlyIncomeInputRef}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/[^0-9.]/g, '')
              let income = parseFloat(numericValue) || 0
              
              // Enforce maximum limit
              if (income > 100000000) {
                income = 100000000
              }
              
              updateCarData({ monthlyIncome: income })
            }}
            onKeyPress={(e) => {
              if (!/[0-9.]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                e.preventDefault()
              }
            }}
            placeholder="Enter your monthly income"
            className={`w-full pl-8 pr-4 py-2.5 bg-white/10 backdrop-blur-md border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-base ${
              shouldHighlightMonthlyIncome 
                ? 'border-lime-400/60' 
                : 'border-white/20'
            }`}
          />
        </div>
        <p className="text-sm text-white/70 flex items-center mt-3">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-3"></span>
          Used to calculate the 10% rule: total car expenses should not exceed 10% of your income
        </p>
      </div>

    </>
  )

  return (
    <div className="space-y-8">
      
      <div className="space-y-5" role="form" aria-label="Car details form">
        {formContent}
      </div>
    </div>
  )
}