'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Car, DollarSign, ArrowRight, Sparkles, TrendingUp, Calculator } from 'lucide-react'
import { CarData } from '@/app/page'

interface CarDetailsFormV2Props {
  carData: CarData
  updateCarData: (updates: Partial<CarData>) => void
  onNext: () => void
  step: number
  totalSteps: number
}

export default function CarDetailsFormV2({ carData, updateCarData, onNext, step, totalSteps }: CarDetailsFormV2Props) {
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

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-3 mb-6">
            <Sparkles className="w-6 h-6 text-purple-300" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              Car Budget Calculator
            </h1>
            <Calculator className="w-6 h-6 text-blue-300" />
          </div>
          
          {/* Progress indicator */}
          <div className="flex justify-center space-x-2 mb-6">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`w-12 h-2 rounded-full transition-all duration-300 ${
                  index + 1 <= step 
                    ? 'bg-gradient-to-r from-purple-400 to-blue-400' 
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Main Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Section - Card Based */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Car Price Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-2xl flex items-center justify-center">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Car Price</h3>
                  <p className="text-white/70 text-sm">Choose your dream car budget</p>
                </div>
              </div>

              {/* Preset Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {carPresets.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => handleCarPriceChange(preset.value.toString())}
                    className={`p-3 rounded-xl text-sm font-semibold transition-all hover:scale-105 ${
                      carData.carPrice === preset.value
                        ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-white shadow-lg'
                        : 'bg-white/20 text-white/80 hover:bg-white/30'
                    }`}
                  >
                    ₹{preset.label}
                  </button>
                ))}
              </div>

              {/* Custom Input */}
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 text-lg font-semibold">₹</span>
                <input
                  type="number"
                  value={carData.carPrice || ''}
                  onChange={(e) => handleCarPriceChange(e.target.value)}
                  placeholder="Enter custom car price"
                  className={`w-full pl-8 pr-4 py-4 text-lg border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-400/50 transition-all bg-white/10 backdrop-blur-md text-white placeholder-white/50 ${
                    errors.carPrice 
                      ? 'border-red-400 focus:border-red-400' 
                      : 'border-white/30 focus:border-emerald-400'
                  }`}
                />
              </div>
              {errors.carPrice && (
                <p className="text-red-400 text-sm mt-2 flex items-center">
                  <span className="mr-2">⚠️</span>
                  {errors.carPrice}
                </p>
              )}
            </motion.div>

            {/* Down Payment Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white">Down Payment</h3>
                  <p className="text-white/70 text-sm">
                    {downPaymentPercentage > 0 && (
                      <span className="text-purple-300 font-semibold">
                        {downPaymentPercentage.toFixed(1)}% of car price
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Slider for down payment */}
              <div className="mb-6">
                <input
                  type="range"
                  min="0"
                  max={carData.carPrice}
                  step="10000"
                  value={carData.downPayment}
                  onChange={(e) => handleDownPaymentChange(e.target.value)}
                  className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-white/60 mt-2">
                  <span>₹0</span>
                  <span>₹{(carData.carPrice / 100000).toFixed(0)}L</span>
                </div>
              </div>

              {/* Custom Input */}
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 text-lg font-semibold">₹</span>
                <input
                  type="number"
                  value={carData.downPayment || ''}
                  onChange={(e) => handleDownPaymentChange(e.target.value)}
                  placeholder="Enter down payment"
                  className={`w-full pl-8 pr-4 py-4 text-lg border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-400/50 transition-all bg-white/10 backdrop-blur-md text-white placeholder-white/50 ${
                    errors.downPayment 
                      ? 'border-red-400 focus:border-red-400' 
                      : 'border-white/30 focus:border-purple-400'
                  }`}
                />
              </div>
              {errors.downPayment && (
                <p className="text-red-400 text-sm mt-2 flex items-center">
                  <span className="mr-2">⚠️</span>
                  {errors.downPayment}
                </p>
              )}
            </motion.div>
          </div>

          {/* Quick Results Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl sticky top-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">Quick Summary</h3>
              </div>

              <div className="space-y-4">
                <div className="bg-white/10 rounded-2xl p-4">
                  <p className="text-white/70 text-sm">Car Price</p>
                  <p className="text-2xl font-bold text-white">
                    ₹{carData.carPrice.toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="bg-white/10 rounded-2xl p-4">
                  <p className="text-white/70 text-sm">Down Payment</p>
                  <p className="text-2xl font-bold text-purple-300">
                    ₹{carData.downPayment.toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="bg-white/10 rounded-2xl p-4">
                  <p className="text-white/70 text-sm">Loan Amount</p>
                  <p className="text-2xl font-bold text-blue-300">
                    ₹{(carData.carPrice - carData.downPayment).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Continue Button */}
              <motion.button
                onClick={handleNext}
                disabled={!carData.carPrice || carData.carPrice <= 0}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 px-6 rounded-2xl font-semibold text-lg flex items-center justify-center space-x-2 hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25"
              >
                <span>Continue to Loan Terms</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}