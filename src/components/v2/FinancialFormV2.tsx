'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Percent, Clock, Receipt, ArrowRight, ArrowLeft, Car, Fuel, ChevronDown, ChevronUp, Zap, Target, TrendingUp } from 'lucide-react'
import { CarData } from '@/app/page'

interface FinancialFormV2Props {
  carData: CarData
  updateCarData: (updates: Partial<CarData>) => void
  onNext: () => void
  onBack: () => void
}

export default function FinancialFormV2({ carData, updateCarData, onNext, onBack }: FinancialFormV2Props) {
  const [showOptionalInputs, setShowOptionalInputs] = useState(false)
  
  const calculateEMI = (principal: number, rate: number, years: number) => {
    if (principal <= 0 || rate <= 0 || years <= 0) return 0
    const monthlyRate = rate / (12 * 100)
    const months = years * 12
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
           (Math.pow(1 + monthlyRate, months) - 1)
  }

  const loanAmount = carData.carPrice - carData.downPayment
  const emi = calculateEMI(loanAmount, carData.interestRate, carData.tenure)
  const totalPayment = emi * carData.tenure * 12
  const totalInterest = totalPayment - loanAmount
  
  const maxTenure = 7
  const minTenure = 1

  // Preset interest rates
  const interestPresets = [
    { label: 'Excellent Credit', rate: 6.5, description: 'Best rates available' },
    { label: 'Good Credit', rate: 8.0, description: 'Standard rates' },
    { label: 'Fair Credit', rate: 10.5, description: 'Higher rates' },
    { label: 'Custom', rate: carData.interestRate, description: 'Set your own' }
  ]

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-3 mb-6">
            <Target className="w-6 h-6 text-blue-300" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Loan Configuration</h2>
            <Zap className="w-6 h-6 text-purple-300" />
          </div>
        </motion.div>

        {/* Main Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Loan Tenure Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-2xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Loan Tenure</h3>
                  <p className="text-white/70 text-sm">{carData.tenure} years selected</p>
                </div>
              </div>

              {/* Tenure Slider with Visual Feedback */}
              <div className="space-y-6">
                <div className="relative">
                  <input
                    type="range"
                    min={minTenure}
                    max={maxTenure}
                    value={carData.tenure}
                    onChange={(e) => {
                      const years = parseInt(e.target.value)
                      updateCarData({ tenure: years })
                    }}
                    className="w-full h-4 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, ${carData.tenure <= 4 ? '#06b6d4' : '#ef4444'} 0%, ${carData.tenure <= 4 ? '#06b6d4' : '#ef4444'} ${((carData.tenure - minTenure) / (maxTenure - minTenure)) * 100}%, rgba(255,255,255,0.2) ${((carData.tenure - minTenure) / (maxTenure - minTenure)) * 100}%, rgba(255,255,255,0.2) 100%)`
                    }}
                  />
                  
                  {/* Year markers */}
                  <div className="flex justify-between text-xs text-white/60 mt-2">
                    {Array.from({ length: maxTenure }, (_, i) => (
                      <span key={i + 1} className={carData.tenure === i + 1 ? 'text-cyan-300 font-semibold' : ''}>
                        {i + 1}yr
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Tenure Impact Display */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/10 rounded-2xl p-4 text-center">
                    <p className="text-white/70 text-sm">Monthly EMI</p>
                    <p className="text-lg font-bold text-cyan-300">
                      ₹{emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-4 text-center">
                    <p className="text-white/70 text-sm">Total Interest</p>
                    <p className="text-lg font-bold text-yellow-300">
                      ₹{totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-4 text-center">
                    <p className="text-white/70 text-sm">Total Payment</p>
                    <p className="text-lg font-bold text-red-300">
                      ₹{totalPayment.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                </div>
                
                {/* Warning for tenure > 4 years */}
                {carData.tenure > 4 && (
                  <div className="bg-red-500/20 border border-red-400/50 rounded-2xl p-4">
                    <p className="text-red-300 text-sm flex items-center">
                      <span className="mr-2">⚠️</span>
                      You're going above the suggested 4-year limit. Consider reducing the tenure for better financial health.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Interest Rate Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-400 rounded-2xl flex items-center justify-center">
                  <Percent className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Interest Rate</h3>
                  <p className="text-white/70 text-sm">{carData.interestRate}% per annum</p>
                </div>
              </div>

              {/* Interest Rate Presets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {interestPresets.slice(0, 3).map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => updateCarData({ interestRate: preset.rate })}
                    className={`p-4 rounded-2xl text-left transition-all hover:scale-105 ${
                      Math.abs(carData.interestRate - preset.rate) < 0.1
                        ? 'bg-gradient-to-r from-red-400 to-pink-400 text-white shadow-lg'
                        : 'bg-white/20 text-white/80 hover:bg-white/30'
                    }`}
                  >
                    <p className="font-semibold">{preset.label}</p>
                    <p className="text-sm opacity-80">{preset.rate}% - {preset.description}</p>
                  </button>
                ))}
              </div>

              {/* Custom Rate Input */}
              <div className="space-y-4">
                <input
                  type="number"
                  step="0.1"
                  value={carData.interestRate}
                  onChange={(e) => updateCarData({ interestRate: parseFloat(e.target.value) || 8 })}
                  className="w-full px-4 py-4 text-lg border-2 border-white/30 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-400/50 focus:border-red-400 transition-all bg-white/10 backdrop-blur-md text-white placeholder-white/50"
                  placeholder="Custom interest rate"
                />
                
                {/* Interest Rate Slider */}
                <div className="relative">
                  <input
                    type="range"
                    min="5"
                    max="15"
                    step="0.1"
                    value={carData.interestRate}
                    onChange={(e) => updateCarData({ interestRate: parseFloat(e.target.value) })}
                    className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${((carData.interestRate - 5) / (15 - 5)) * 100}%, rgba(255,255,255,0.2) ${((carData.interestRate - 5) / (15 - 5)) * 100}%, rgba(255,255,255,0.2) 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-white/60 mt-2">
                    <span>5%</span>
                    <span>10%</span>
                    <span>15%</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Optional Advanced Settings */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl overflow-hidden shadow-2xl"
            >
              <button
                onClick={() => setShowOptionalInputs(!showOptionalInputs)}
                className="w-full p-6 text-left hover:bg-white/10 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-xl flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Advanced Settings</h3>
                    <p className="text-white/70 text-sm">Processing fees, fuel costs & more</p>
                  </div>
                </div>
                {showOptionalInputs ? (
                  <ChevronUp className="w-5 h-5 text-white/70" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-white/70" />
                )}
              </button>

              {showOptionalInputs && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-white/20 p-6 space-y-6"
                >
                  {/* Processing Fee */}
                  <div>
                    <label className="flex items-center space-x-2 text-lg font-semibold text-white mb-4">
                      <Receipt className="w-5 h-5 text-purple-400" />
                      <span>Processing Fee</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 text-lg">₹</span>
                      <input
                        type="number"
                        value={carData.processingFee === 0 ? '' : carData.processingFee}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '') {
                            updateCarData({ processingFee: 0 });
                          } else {
                            const fee = parseFloat(value);
                            updateCarData({ processingFee: isNaN(fee) ? 0 : fee });
                          }
                        }}
                        placeholder="Enter processing fee (if any)"
                        className="w-full pl-8 pr-4 py-4 text-lg border-2 border-white/30 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-400/50 focus:border-purple-400 transition-all bg-white/10 backdrop-blur-md text-white placeholder-white/50"
                      />
                    </div>
                  </div>

                  {/* Running Costs */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center space-x-2 text-lg font-semibold text-white mb-4">
                        <Car className="w-5 h-5 text-orange-400" />
                        <span>KM/Month</span>
                      </label>
                      <input
                        type="number"
                        value={carData.kmPerMonth || ''}
                        onChange={(e) => updateCarData({ kmPerMonth: parseFloat(e.target.value) || 0 })}
                        placeholder="Monthly kilometers"
                        className="w-full px-4 py-4 text-lg border-2 border-white/30 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-400/50 focus:border-orange-400 transition-all bg-white/10 backdrop-blur-md text-white placeholder-white/50"
                      />
                    </div>

                    <div>
                      <label className="flex items-center space-x-2 text-lg font-semibold text-white mb-4">
                        <Fuel className="w-5 h-5 text-red-400" />
                        <span>Fuel Cost/L</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 text-lg">₹</span>
                        <input
                          type="number"
                          value={carData.fuelCostPerLiter || ''}
                          onChange={(e) => updateCarData({ fuelCostPerLiter: parseFloat(e.target.value) || 0 })}
                          placeholder="Cost per liter"
                          className="w-full pl-8 pr-4 py-4 text-lg border-2 border-white/30 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-400/50 focus:border-red-400 transition-all bg-white/10 backdrop-blur-md text-white placeholder-white/50"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Enhanced Results Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl sticky top-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">Loan Summary</h3>
              </div>

              <div className="space-y-4">
                {/* EMI Highlight */}
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-2xl p-4 text-center">
                  <p className="text-green-300 text-sm font-semibold">Monthly EMI</p>
                  <p className="text-3xl font-bold text-white">
                    ₹{emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-green-300 text-xs">for {carData.tenure} years</p>
                </div>

                {/* Other Details */}
                <div className="space-y-3">
                  <div className="bg-white/10 rounded-2xl p-3">
                    <p className="text-white/70 text-sm">Total Interest</p>
                    <p className="text-xl font-bold text-yellow-300">
                      ₹{totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </p>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-3">
                    <p className="text-white/70 text-sm">Total Payment</p>
                    <p className="text-xl font-bold text-red-300">
                      ₹{totalPayment.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                </div>

                {/* 20/4/10 Rule Check */}
                <div className="bg-white/10 rounded-2xl p-4">
                  <h4 className="text-white font-semibold mb-3 text-sm">Smart Finance Check</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Tenure ≤ 4 years</span>
                      <span className={carData.tenure <= 4 ? 'text-green-400' : 'text-red-400'}>
                        {carData.tenure <= 4 ? '✓' : '✗'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Down ≥ 20%</span>
                      <span className={((carData.downPayment / carData.carPrice) * 100) >= 20 ? 'text-green-400' : 'text-red-400'}>
                        {((carData.downPayment / carData.carPrice) * 100) >= 20 ? '✓' : '✗'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex flex-col space-y-3 mt-6">
                <button
                  onClick={onBack}
                  className="w-full bg-white/20 text-white py-3 px-4 rounded-2xl font-semibold flex items-center justify-center space-x-2 hover:bg-white/30 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                
                <motion.button
                  onClick={onNext}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-4 rounded-2xl font-semibold flex items-center justify-center space-x-2 hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg shadow-purple-500/25"
                >
                  <span>See EMI Plan</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}