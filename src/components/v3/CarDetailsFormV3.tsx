'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Car, DollarSign, ArrowRight } from 'lucide-react'
import { CarData } from '@/app/page'

interface CarDetailsFormV3Props {
  carData: CarData
  updateCarData: (updates: Partial<CarData>) => void
  onNext: () => void
}

export default function CarDetailsFormV3({ carData, updateCarData, onNext }: CarDetailsFormV3Props) {
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
        className="bg-white border-4 border-black p-6"
        style={{ boxShadow: '8px 8px 0px 0px #000000' }}
      >
        <label className="flex items-center space-x-2 text-base sm:text-lg font-black text-black mb-3 sm:mb-4 uppercase tracking-tight">
          <div className="w-8 h-8 bg-black flex items-center justify-center" style={{ boxShadow: '4px 4px 0px 0px #000000' }}>
            <Car className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <span>Car Price</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black text-base sm:text-lg font-bold">₹</span>
          <input
            type="number"
            value={carData.carPrice || ''}
            onChange={(e) => handleCarPriceChange(e.target.value)}
            placeholder="Enter on-road car price"
            className={`w-full pl-8 pr-4 py-4 text-base sm:text-lg border-4 bg-white text-black placeholder-gray-500 font-semibold focus:outline-none transition-all ${
              errors.carPrice 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-black focus:border-yellow-400'
            }`}
            style={{ boxShadow: '4px 4px 0px 0px #000000' }}
          />
        </div>
        {errors.carPrice && (
          <p className="text-red-600 text-sm mt-2 font-bold">{errors.carPrice}</p>
        )}
      </motion.div>

      {/* Down Payment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white border-4 border-black p-6"
        style={{ boxShadow: '8px 8px 0px 0px #000000' }}
      >
        <label className="flex items-center space-x-2 text-base sm:text-lg font-black text-black mb-3 sm:mb-4 uppercase tracking-tight">
          <div className="w-8 h-8 bg-black flex items-center justify-center" style={{ boxShadow: '4px 4px 0px 0px #000000' }}>
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <span>Down Payment</span>
          {downPaymentPercentage > 0 && (
            <span className="text-xs sm:text-sm text-gray-600 font-bold">({downPaymentPercentage.toFixed(1)}%)</span>
          )}
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black text-base sm:text-lg font-bold">₹</span>
          <input
            type="number"
            value={carData.downPayment || ''}
            onChange={(e) => handleDownPaymentChange(e.target.value)}
            placeholder="Enter down payment"
            className={`w-full pl-8 pr-4 py-4 text-base sm:text-lg border-4 bg-white text-black placeholder-gray-500 font-semibold focus:outline-none transition-all ${
              errors.downPayment 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-black focus:border-yellow-400'
            }`}
            style={{ boxShadow: '4px 4px 0px 0px #000000' }}
          />
        </div>
        {errors.downPayment && (
          <p className="text-red-600 text-sm mt-2 font-bold">{errors.downPayment}</p>
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
          className="w-full bg-yellow-400 hover:bg-yellow-300 text-black py-4 px-6 border-4 border-black font-black text-base sm:text-lg flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-tight min-h-[48px]"
          style={{ boxShadow: '8px 8px 0px 0px #000000' }}
        >
          <span>Continue to Loan Terms</span>
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </motion.div>
    </div>
  )
}