'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Percent, Clock, Receipt, ArrowRight, ArrowLeft, Car, Fuel, ChevronDown, ChevronUp } from 'lucide-react'
import { CarData } from '@/app/page'

interface FinancialFormProps {
  carData: CarData
  updateCarData: (updates: Partial<CarData>) => void
  onNext: () => void
  onBack: () => void
}

export default function FinancialFormV1({ carData, updateCarData, onNext, onBack }: FinancialFormProps) {
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
  
  const maxTenure = 7 // 7 years maximum
  const minTenure = 1 // 1 year minimum

  return (
    <div className="space-y-6 sm:space-y-8">


      {/* Loan Tenure */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <label className="flex items-center space-x-2 text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
          <span>Loan Tenure ({carData.tenure} years)</span>
        </label>
        
        <div className="space-y-3 sm:space-y-4">
          <input
            type="range"
            min={minTenure}
            max={maxTenure}
            value={carData.tenure}
            onChange={(e) => {
              const years = parseInt(e.target.value)
              updateCarData({ tenure: years })
            }}
            className="w-full h-2 sm:h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${carData.tenure <= 4 ? '#06b6d4' : '#ef4444'} 0%, ${carData.tenure <= 4 ? '#06b6d4' : '#ef4444'} ${((carData.tenure - minTenure) / (maxTenure - minTenure)) * 100}%, #374151 ${((carData.tenure - minTenure) / (maxTenure - minTenure)) * 100}%, #374151 100%)`
            }}
          />
          
          <div className="flex justify-between text-xs text-gray-400">
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
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-400 text-xs sm:text-sm">
                ⚠️ You're going above the suggested 4-year limit. Consider reducing the tenure for better financial health.
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Interest Rate */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <label className="flex items-center space-x-2 text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
          <Percent className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
          <span>Interest Rate (% per annum)</span>
        </label>
        <div className="space-y-3 sm:space-y-4">
          <input
            type="number"
            step="0.1"
            value={carData.interestRate}
            onChange={(e) => updateCarData({ interestRate: parseFloat(e.target.value) || 8 })}
            className="w-full px-3 sm:px-4 py-3 sm:py-4 text-base sm:text-lg border-2 border-gray-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-900/50 focus:border-red-400 transition-all bg-gray-900/50 text-white placeholder-gray-500"
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
              className="w-full h-2 sm:h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${((carData.interestRate - 5) / (15 - 5)) * 100}%, #374151 ${((carData.interestRate - 5) / (15 - 5)) * 100}%, #374151 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>5%</span>
              <span>10%</span>
              <span>15%</span>
            </div>
          </div>
        </div>
      </motion.div>


      {/* Optional Inputs Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-800/30 border border-gray-700/50 rounded-xl overflow-hidden"
      >
        <button
          onClick={() => setShowOptionalInputs(!showOptionalInputs)}
          className="w-full p-4 text-left hover:bg-gray-700/30 transition-colors flex items-center justify-between"
        >
          <div>
            <h3 className="text-lg font-semibold text-white">Hidden Cost</h3>
            <p className="text-gray-400 text-sm">Optimize your decision with these hidden factors</p>
          </div>
          {showOptionalInputs ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {showOptionalInputs && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-700/50 p-6 space-y-6"
          >
            {/* Processing Fee */}
            <div>
              <label className="flex items-center space-x-2 text-lg font-semibold text-white mb-4">
                <Receipt className="w-5 h-5 text-purple-400" />
                <span>Processing Fee</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">₹</span>
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
                  className="w-full pl-8 pr-4 py-4 text-lg border-2 border-gray-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-900/50 focus:border-purple-400 transition-all bg-gray-900/50 text-white placeholder-gray-500"
                />
              </div>
            </div>

            {/* KM Driven Per Month */}
            <div>
              <label className="flex items-center space-x-2 text-lg font-semibold text-white mb-4">
                <Car className="w-5 h-5 text-orange-400" />
                <span>KM Driven Per Month</span>
              </label>
              <input
                type="number"
                value={carData.kmPerMonth || ''}
                onChange={(e) => updateCarData({ kmPerMonth: parseFloat(e.target.value) || 0 })}
                placeholder="Enter km per month"
                className="w-full px-4 py-4 text-lg border-2 border-gray-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-900/50 focus:border-orange-400 transition-all bg-gray-900/50 text-white placeholder-gray-500"
              />
            </div>

            {/* Fuel Cost Per Liter */}
            <div>
              <label className="flex items-center space-x-2 text-lg font-semibold text-white mb-4">
                <Fuel className="w-5 h-5 text-red-400" />
                <span>Fuel Cost Per Liter</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">₹</span>
                <input
                  type="number"
                  value={carData.fuelCostPerLiter || ''}
                  onChange={(e) => updateCarData({ fuelCostPerLiter: parseFloat(e.target.value) || 0 })}
                  placeholder="Enter fuel cost per liter"
                  className="w-full pl-8 pr-4 py-4 text-lg border-2 border-gray-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-900/50 focus:border-red-400 transition-all bg-gray-900/50 text-white placeholder-gray-500"
                />
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>


      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4"
      >
        <button
          onClick={onBack}
          className="w-full sm:flex-1 bg-gray-700 text-gray-300 py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold text-base sm:text-lg flex items-center justify-center space-x-2 hover:bg-gray-600 transition-all transform hover:scale-[1.02] active:scale-[0.98] min-h-[48px]"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Back</span>
        </button>
        
        <button
          onClick={onNext}
          className="w-full sm:flex-1 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold text-base sm:text-lg flex items-center justify-center space-x-2 hover:from-emerald-700 hover:to-cyan-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/20 min-h-[48px]"
        >
          <span>See EMI Plan</span>
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </motion.div>
    </div>
  )
}