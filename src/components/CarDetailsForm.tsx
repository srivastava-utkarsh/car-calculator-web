'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Car, DollarSign, ArrowRight } from 'lucide-react'
import { CarData } from '@/app/page'

interface CarDetailsFormProps {
  carData: CarData
  updateCarData: (updates: Partial<CarData>) => void
  onNext: () => void
}

export default function CarDetailsForm({ carData, updateCarData, onNext }: CarDetailsFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

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

  return (
    <div className="space-y-6 sm:space-y-8">

      {/* Car Price */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <label className="flex items-center space-x-2 text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
          <Car className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
          <span>Car Price</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-base sm:text-lg">₹</span>
          <input
            type="number"
            value={carData.carPrice || ''}
            onChange={(e) => handleCarPriceChange(e.target.value)}
            placeholder="Enter on-road car price"
            className={`w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-3 sm:py-4 text-base sm:text-lg border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-900/50 transition-all bg-gray-900/50 text-white placeholder-gray-500 ${
              errors.carPrice 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-700 focus:border-emerald-500'
            }`}
          />
        </div>
        {errors.carPrice && (
          <p className="text-red-500 text-sm mt-2">{errors.carPrice}</p>
        )}
      </motion.div>

      {/* Down Payment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <label className="flex items-center space-x-2 text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
          <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
          <span>Down Payment</span>
          {downPaymentPercentage > 0 && (
            <span className="text-xs sm:text-sm text-gray-500">({downPaymentPercentage.toFixed(1)}%)</span>
          )}
        </label>
        <div className="relative">
          <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-base sm:text-lg">₹</span>
          <input
            type="number"
            value={carData.downPayment || ''}
            onChange={(e) => handleDownPaymentChange(e.target.value)}
            placeholder="Enter down payment"
            className={`w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-3 sm:py-4 text-base sm:text-lg border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-cyan-900/50 transition-all bg-gray-900/50 text-white placeholder-gray-500 ${
              errors.downPayment 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-700 focus:border-cyan-500'
            }`}
          />
        </div>
        {errors.downPayment && (
          <p className="text-red-500 text-sm mt-2">{errors.downPayment}</p>
        )}
      </motion.div>


      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <button
          onClick={handleNext}
          disabled={!carData.carPrice || carData.carPrice <= 0}
          className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold text-base sm:text-lg flex items-center justify-center space-x-2 hover:from-emerald-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/20 min-h-[48px]"
        >
          <span>Continue to Loan Terms</span>
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </motion.div>
    </div>
  )
}