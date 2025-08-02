'use client'

import { useState } from 'react'
import { Car, DollarSign, ArrowRight } from 'lucide-react'
import { CarData } from '@/app/page'

interface CarDetailsFormV5Props {
  carData: CarData
  updateCarData: (updates: Partial<CarData>) => void
  onNext: () => void
  standalone?: boolean
}

export default function CarDetailsFormV5(props: CarDetailsFormV5Props) {
  const { carData, updateCarData, onNext } = props
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onNext()
    }
  }

  const downPaymentPercentage = carData.carPrice > 0 ? (carData.downPayment / carData.carPrice) * 100 : 0

  return (
    <div className="space-y-8">
      {props.standalone && (
        <div className="text-center space-y-3 mb-6">
          <div className="w-16 h-16 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center mb-3">
            <Car className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">Car Details</h2>
          <p className="text-gray-600">Enter your car information to get started</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Car Price */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Car Price (₹)
          </label>
          <div className="relative">
            <input
              type="number"
              value={carData.carPrice || ''}
              onChange={(e) => handleCarPriceChange(e.target.value)}
              className={`w-full pl-4 pr-4 py-3 bg-white border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.carPrice 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-200'
              }`}
              placeholder="Enter on-road car price"
            />
          </div>
          {errors.carPrice && (
            <p className="text-red-500 text-sm mt-1">{errors.carPrice}</p>
          )}
        </div>

        {/* Down Payment */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Down Payment
            <span className="lg:hidden text-xs text-gray-500 ml-2">({downPaymentPercentage.toFixed(1)}%)</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
            <input
              type="number"
              value={carData.downPayment || ''}
              onChange={(e) => handleDownPaymentChange(e.target.value)}
              className={`w-full pl-8 pr-4 py-3 bg-white border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.downPayment 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-200'
              }`}
              placeholder="Enter down payment"
            />
          </div>
          {errors.downPayment && (
            <p className="text-red-500 text-sm mt-2">{errors.downPayment}</p>
          )}
        </div>

        {/* Continue Button - Only show on mobile */}
        <div className="lg:hidden">
          <button
            type="submit"
            disabled={!carData.carPrice || carData.carPrice <= 0}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Continue to Loan Terms</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  )
}