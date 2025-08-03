'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Car, ArrowRight, Sparkles, TrendingUp, Calculator } from 'lucide-react'
import { CarData } from '@/app/page'

interface CarDetailsFormV2Props {
  carData: CarData
  updateCarData: (updates: Partial<CarData>) => void
  onNext: () => void
  step: number
  totalSteps: number
  standalone?: boolean
}

export default function CarDetailsFormV2({ carData, updateCarData, onNext, step, totalSteps, standalone = true }: CarDetailsFormV2Props) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [currentCard, setCurrentCard] = useState(0)

  // Preset car price options
  const carPresets = [
    { label: '5 Lakhs', value: 500000 },
    { label: '10 Lakhs', value: 1000000 },
    { label: '15 Lakhs', value: 1500000 },
    { label: '20 Lakhs+', value: 2000000 }
  ]

  const handleCarPriceChange = (value: string) => {
    const price = parseFloat(value) || 0
    updateCarData({ carPrice: price })
    
    // Auto-calculate 20% down payment
    const downPayment = price * 0.2
    updateCarData({ downPayment })
    
    if (errors.carPrice) {
      setErrors(prev => ({ ...prev, carPrice: '' }))
    }
  }

  const handleDownPaymentChange = (value: string) => {
    const payment = parseFloat(value) || 0
    updateCarData({ downPayment: payment })
    
    if (errors.downPayment) {
      setErrors(prev => ({ ...prev, downPayment: '' }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!carData.carPrice || carData.carPrice <= 0) {
      newErrors.carPrice = 'Car price is required'
    }
    
    if (carData.downPayment < 0) {
      newErrors.downPayment = 'Down payment cannot be negative'
    }
    
    if (carData.downPayment >= carData.carPrice) {
      newErrors.downPayment = 'Down payment cannot exceed car price'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validate()) {
      onNext()
    }
  }

  const downPaymentPercentage = carData.carPrice > 0 ? (carData.downPayment / carData.carPrice) * 100 : 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onNext()
    }
  }

  return (
    <div className="space-y-8">
      {standalone && (
        <div className="hidden lg:block text-center space-y-3 mb-6">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-2xl flex items-center justify-center mb-3">
            <Car className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-white">Car Details</h2>
          <p className="text-gray-400">Enter your car information to get started</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6" role="form" aria-label="Car details form">
        {/* Car Price */}
        <div className="space-y-2">
          <label htmlFor="car-price-input" className="block text-base min-[375px]:text-lg font-medium text-white" style={{ lineHeight: '1.5' }}>
            Car Price
          </label>
          
          {/* Preset Buttons */}
          <div className="grid grid-cols-2 min-[375px]:grid-cols-2 min-[768px]:grid-cols-4 gap-3 min-[375px]:gap-4 mb-6">
            {carPresets.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => handleCarPriceChange(preset.value.toString())}
                className={`min-h-[44px] min-[375px]:min-h-[48px] p-3 min-[375px]:p-4 rounded-xl min-[375px]:rounded-2xl text-sm min-[375px]:text-base font-semibold transition-all hover:scale-105 focus:outline-none focus:ring-4 ${
                  carData.carPrice === preset.value
                    ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-white shadow-lg focus:ring-emerald-400/50'
                    : 'bg-white/20 text-white/80 hover:bg-white/30 focus:ring-white/20'
                }`}
                style={{ lineHeight: '1.5' }}
              >
                ₹{preset.label}
              </button>
            ))}
          </div>
          
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 font-semibold">₹</span>
            <input
              id="car-price-input"
              type="number"
              value={carData.carPrice || ''}
              onChange={(e) => handleCarPriceChange(e.target.value)}
              className={`w-full pl-8 pr-4 py-2 sm:py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg sm:rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-sm sm:text-base ${
                errors.carPrice 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-white/20'
              }`}
              placeholder="Enter on-road car price"
              aria-describedby={errors.carPrice ? "car-price-error" : undefined}
              aria-invalid={!!errors.carPrice}
            />
          </div>
          {errors.carPrice && (
            <p id="car-price-error" className="text-red-400 text-sm mt-1" role="alert">{errors.carPrice}</p>
          )}
        </div>

        {/* Down Payment */}
        <div className="space-y-3">
          <label className="block text-base min-[375px]:text-lg font-medium text-white" style={{ lineHeight: '1.5' }}>
            Down Payment
            {downPaymentPercentage > 0 && (
              <span className="min-[1024px]:hidden text-sm min-[375px]:text-base text-gray-400 ml-3">({downPaymentPercentage.toFixed(1)}%)</span>
            )}
          </label>
          
          
          {/* Slider for down payment with color */}
          <div className="mb-4">
            <input
              type="range"
              min="0"
              max={carData.carPrice}
              step="10000"
              value={carData.downPayment}
              onChange={(e) => handleDownPaymentChange(e.target.value)}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${downPaymentPercentage >= 20 ? '#06b6d4' : '#f97316'} 0%, ${downPaymentPercentage >= 20 ? '#06b6d4' : '#f97316'} ${(carData.downPayment / carData.carPrice) * 100}%, rgba(255,255,255,0.2) ${(carData.downPayment / carData.carPrice) * 100}%, rgba(255,255,255,0.2) 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-white/60 mt-2">
              <span>₹0</span>
              <span>₹{(carData.carPrice / 100000).toFixed(0)}L</span>
            </div>
          </div>
          
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 font-semibold">₹</span>
            <input
              type="number"
              value={carData.downPayment || ''}
              onChange={(e) => handleDownPaymentChange(e.target.value)}
              className={`w-full pl-8 pr-4 py-2 sm:py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg sm:rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all text-sm sm:text-base ${
                errors.downPayment 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-white/20'
              }`}
              placeholder="Enter down payment"
            />
          </div>
          {errors.downPayment && (
            <p className="text-red-400 text-sm mt-2">{errors.downPayment}</p>
          )}
        </div>

        {/* Monthly Income - Required for calculations */}
        <div className="space-y-2">
          <label className="block text-base min-[375px]:text-lg font-medium text-white" style={{ lineHeight: '1.5' }}>
            Monthly Income
            <span className="text-xs text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full ml-2">for affordability check</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 font-semibold">₹</span>
            <input
              type="number"
              value={carData.monthlyIncome || ''}
              onChange={(e) => updateCarData({ monthlyIncome: parseFloat(e.target.value) || 0 })}
              placeholder="Enter your monthly income"
              className="w-full pl-8 pr-4 py-2 sm:py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg sm:rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-sm sm:text-base"
            />
          </div>
          <p className="text-xs text-white/60 flex items-center">
            <span className="w-1 h-1 bg-emerald-400 rounded-full mr-2"></span>
            Used to calculate the 10% rule: total car expenses should not exceed 10% of your income
          </p>
        </div>

        {/* Continue Button - Only show on mobile */}
        <div className="min-[1024px]:hidden">
          <button
            type="submit"
            disabled={!carData.carPrice || carData.carPrice <= 0}
            className="w-full min-h-[44px] min-[375px]:min-h-[48px] min-[768px]:min-h-[52px] bg-gradient-to-r from-emerald-600 to-cyan-600 text-white py-4 min-[375px]:py-4 min-[768px]:py-4 px-6 min-[375px]:px-8 rounded-xl min-[375px]:rounded-2xl font-medium hover:from-emerald-700 hover:to-cyan-700 focus:ring-4 focus:ring-emerald-400/50 focus:outline-none transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] text-base min-[375px]:text-lg"
            style={{ lineHeight: '1.5' }}
          >
            <span>Continue to Loan Terms</span>
            <ArrowRight className="w-5 h-5 min-[375px]:w-6 min-[375px]:h-6" />
          </button>
        </div>
      </form>
    </div>
  )
}