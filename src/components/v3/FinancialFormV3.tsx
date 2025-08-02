'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Percent, Clock, Receipt, ArrowRight, ArrowLeft, Car, Fuel, ChevronDown, ChevronUp } from 'lucide-react'
import { CarData } from '@/app/page'

interface FinancialFormV3Props {
  carData: CarData
  updateCarData: (updates: Partial<CarData>) => void
  onNext: () => void
  onBack: () => void
}

export default function FinancialFormV3({ carData, updateCarData, onNext, onBack }: FinancialFormV3Props) {
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

  return (
    <div className="space-y-6 sm:space-y-8">

      {/* Loan Tenure */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white border-4 border-black p-6"
        style={{ boxShadow: '8px 8px 0px 0px #000000' }}
      >
        <label className="flex items-center space-x-2 text-base sm:text-lg font-black text-black mb-3 sm:mb-4 uppercase tracking-tight">
          <div className="w-8 h-8 bg-black flex items-center justify-center shadow-neo-sm">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
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
            className="w-full h-4 bg-gray-200 appearance-none cursor-pointer border-4 border-black"
            style={{ boxShadow: '4px 4px 0px 0px #000000' }}
            style={{
              background: `linear-gradient(to right, ${carData.tenure <= 4 ? '#eab308' : '#ef4444'} 0%, ${carData.tenure <= 4 ? '#eab308' : '#ef4444'} ${((carData.tenure - minTenure) / (maxTenure - minTenure)) * 100}%, #e5e7eb ${((carData.tenure - minTenure) / (maxTenure - minTenure)) * 100}%, #e5e7eb 100%)`
            }}
          />
          
          <div className="flex justify-between text-xs text-black font-bold">
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
            <div className="bg-red-100 border-4 border-red-500 p-4 shadow-neo">
              <p className="text-red-800 text-xs sm:text-sm font-bold">
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
        className="bg-white border-4 border-black p-6"
        style={{ boxShadow: '8px 8px 0px 0px #000000' }}
      >
        <label className="flex items-center space-x-2 text-base sm:text-lg font-black text-black mb-3 sm:mb-4 uppercase tracking-tight">
          <div className="w-8 h-8 bg-black flex items-center justify-center shadow-neo-sm">
            <Percent className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <span>Interest Rate (% per annum)</span>
        </label>
        <div className="space-y-3 sm:space-y-4">
          <input
            type="number"
            step="0.1"
            value={carData.interestRate}
            onChange={(e) => updateCarData({ interestRate: parseFloat(e.target.value) || 8 })}
            className="w-full px-4 py-4 text-base sm:text-lg border-4 border-black bg-white text-black placeholder-gray-500 font-semibold shadow-neo focus:outline-none focus:border-yellow-400 transition-all"
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
              className="w-full h-4 bg-gray-200 appearance-none cursor-pointer border-4 border-black"
            style={{ boxShadow: '4px 4px 0px 0px #000000' }}
              style={{
                background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${((carData.interestRate - 5) / (15 - 5)) * 100}%, #e5e7eb ${((carData.interestRate - 5) / (15 - 5)) * 100}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-black font-bold mt-1">
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
        className="neo-card overflow-hidden"
      >
        <button
          onClick={() => setShowOptionalInputs(!showOptionalInputs)}
          className="w-full p-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
        >
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black flex items-center justify-center shadow-neo-sm">
              <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-black uppercase tracking-tight">Hidden Cost</h3>
              <p className="text-black text-xs sm:text-sm font-semibold">Optimize your decision with these hidden factors</p>
            </div>
          </div>
          {showOptionalInputs ? (
            <ChevronUp className="w-5 h-5 text-black" />
          ) : (
            <ChevronDown className="w-5 h-5 text-black" />
          )}
        </button>

        {showOptionalInputs && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t-4 border-black p-6 space-y-6 bg-gray-50"
          >
            {/* Processing Fee */}
            <div>
              <label className="flex items-center space-x-2 text-base sm:text-lg font-black text-black mb-4 uppercase tracking-tight">
                <div className="w-6 h-6 bg-black flex items-center justify-center">
                  <Receipt className="w-3 h-3 text-white" />
                </div>
                <span>Processing Fee</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black text-lg font-bold">₹</span>
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
                  className="w-full pl-8 pr-4 py-4 text-lg border-4 border-black bg-white text-black placeholder-gray-500 font-semibold shadow-neo focus:outline-none focus:border-yellow-400 transition-all"
                />
              </div>
            </div>

            {/* KM Driven Per Month */}
            <div>
              <label className="flex items-center space-x-2 text-base sm:text-lg font-black text-black mb-4 uppercase tracking-tight">
                <div className="w-6 h-6 bg-black flex items-center justify-center">
                  <Car className="w-3 h-3 text-white" />
                </div>
                <span>KM Driven Per Month</span>
              </label>
              <input
                type="number"
                value={carData.kmPerMonth || ''}
                onChange={(e) => updateCarData({ kmPerMonth: parseFloat(e.target.value) || 0 })}
                placeholder="Enter km per month"
                className="w-full px-4 py-4 text-lg border-4 border-black bg-white text-black placeholder-gray-500 font-semibold focus:outline-none focus:border-yellow-400 transition-all"
            style={{ boxShadow: '4px 4px 0px 0px #000000' }}
              />
            </div>

            {/* Fuel Cost Per Liter */}
            <div>
              <label className="flex items-center space-x-2 text-base sm:text-lg font-black text-black mb-4 uppercase tracking-tight">
                <div className="w-6 h-6 bg-black flex items-center justify-center">
                  <Fuel className="w-3 h-3 text-white" />
                </div>
                <span>Fuel Cost Per Liter</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black text-lg font-bold">₹</span>
                <input
                  type="number"
                  value={carData.fuelCostPerLiter || ''}
                  onChange={(e) => updateCarData({ fuelCostPerLiter: parseFloat(e.target.value) || 0 })}
                  placeholder="Enter fuel cost per liter"
                  className="w-full pl-8 pr-4 py-4 text-lg border-4 border-black bg-white text-black placeholder-gray-500 font-semibold shadow-neo focus:outline-none focus:border-yellow-400 transition-all"
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
          className="w-full sm:flex-1 bg-gray-200 hover:bg-gray-100 text-black py-3 sm:py-4 px-4 sm:px-6 border-4 border-black font-black text-base sm:text-lg flex items-center justify-center space-x-2 transition-all uppercase tracking-tight min-h-[48px]"
          style={{ boxShadow: '8px 8px 0px 0px #000000' }}
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Back</span>
        </button>
        
        <button
          onClick={onNext}
          className="w-full sm:flex-1 bg-yellow-400 hover:bg-yellow-300 text-black py-3 sm:py-4 px-4 sm:px-6 border-4 border-black font-black text-base sm:text-lg flex items-center justify-center space-x-2 transition-all uppercase tracking-tight min-h-[48px]"
          style={{ boxShadow: '8px 8px 0px 0px #000000' }}
        >
          <span>See EMI Plan</span>
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </motion.div>
    </div>
  )
}