'use client'

import React from 'react'
import { CarData } from '@/app/demo-new/page'

interface CarDetailsFormProps {
  carData: CarData
  updateCarData: (updates: Partial<CarData>) => void
}

export default function CarDetailsForm({ carData, updateCarData }: CarDetailsFormProps) {
  // Preset car price options
  const carPresets = [
    { label: '5L', value: 500000 },
    { label: '10L', value: 1000000 },
    { label: '15L', value: 1500000 },
    { label: '20L', value: 2000000 },
    { label: '50L', value: 5000000 }
  ]

  const handleCarPriceChange = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '')
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
    const numericValue = value.replace(/[^0-9]/g, '')
    let payment = parseInt(numericValue) || 0
    
    if (payment > carData.carPrice) {
      payment = carData.carPrice
    }
    
    updateCarData({ downPayment: payment })
  }

  const downPaymentPercentage = carData.carPrice > 0 ? (carData.downPayment / carData.carPrice) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Car Price */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="car-price" className="recipe-heading-3 text-slate-900">
            Car Price
          </label>
          <div className="flex gap-2 flex-wrap">
            {carPresets.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => handleCarPriceChange(preset.value.toString())}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  carData.carPrice === preset.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                ₹{preset.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">₹</span>
          <input
            id="car-price"
            type="number"
            min="1"
            max="50000000"
            value={carData.carPrice || ''}
            onChange={(e) => handleCarPriceChange(e.target.value)}
            className="recipe-input pl-8"
            placeholder="Enter car price"
          />
        </div>
      </div>

      {/* Down Payment */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="recipe-heading-3 text-slate-900">
            Down Payment
          </label>
          {downPaymentPercentage > 0 && (
            <span className="text-blue-600 font-semibold">
              {downPaymentPercentage.toFixed(1)}% of car price
            </span>
          )}
        </div>
        
        {/* Down Payment Slider */}
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max={carData.carPrice}
            step="1000"
            value={carData.downPayment}
            onChange={(e) => handleDownPaymentChange(e.target.value)}
            className="recipe-slider w-full"
          />
          <div className="flex justify-between text-sm text-slate-500">
            <span>₹0</span>
            <span>₹{(carData.carPrice / 200000).toFixed(1)}L</span>
            <span>₹{(carData.carPrice / 100000).toFixed(0)}L</span>
          </div>
        </div>
        
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">₹</span>
          <input
            type="number"
            min="0"
            max={carData.carPrice}
            value={carData.downPayment || ''}
            onChange={(e) => handleDownPaymentChange(e.target.value)}
            className="recipe-input pl-8"
            placeholder="Enter down payment"
          />
        </div>
      </div>

      {/* Loan Tenure */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="recipe-heading-3 text-slate-900">
            Loan Tenure
          </label>
          {carData.tenure > 0 && (
            <span className="text-blue-600 font-semibold">
              {carData.tenure} years
            </span>
          )}
        </div>
        
        <div className="space-y-2">
          <input
            type="range"
            min="1"
            max="7"
            step="1"
            value={carData.tenure || 1}
            onChange={(e) => updateCarData({ tenure: parseInt(e.target.value) })}
            className="recipe-slider w-full"
          />
          <div className="flex justify-between text-sm text-slate-500">
            <span>1yr</span>
            <span>2yr</span>
            <span>3yr</span>
            <span>4yr</span>
            <span>5yr</span>
            <span>6yr</span>
            <span>7yr</span>
          </div>
        </div>
        
        {carData.tenure > 4 && (
          <div className="recipe-alert-warning">
            <p className="text-sm">
              ⚠️ Consider reducing the tenure to 4 years or less for better financial health.
            </p>
          </div>
        )}
      </div>

      {/* Interest Rate */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="recipe-heading-3 text-slate-900">
            Interest Rate
          </label>
          <span className="text-blue-600 font-semibold">
            {carData.interestRate}% per annum
          </span>
        </div>
        
        <input
          type="number"
          step="0.1"
          min="5"
          max="15"
          value={carData.interestRate}
          onChange={(e) => {
            const value = parseFloat(e.target.value) || 8
            const clampedValue = Math.max(5, Math.min(15, value))
            updateCarData({ interestRate: clampedValue })
          }}
          className="recipe-input"
          placeholder="Interest rate (5-15%)"
        />
        
        <div className="space-y-2">
          <input
            type="range"
            min="5"
            max="15"
            step="0.1"
            value={carData.interestRate}
            onChange={(e) => updateCarData({ interestRate: parseFloat(e.target.value) })}
            className="recipe-slider w-full"
          />
          <div className="flex justify-between text-sm text-slate-500">
            <span>5%</span>
            <span>10%</span>
            <span>15%</span>
          </div>
        </div>
      </div>

      {/* Processing Fee */}
      <div className="space-y-3">
        <label className="recipe-heading-3 text-slate-900">
          Processing Fee (Optional)
        </label>
        
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">₹</span>
          <input
            type="number"
            min="0"
            value={carData.processingFee || ''}
            onChange={(e) => updateCarData({ processingFee: parseInt(e.target.value) || 0 })}
            className="recipe-input pl-8"
            placeholder="Enter processing fee"
          />
        </div>
      </div>
    </div>
  )
}