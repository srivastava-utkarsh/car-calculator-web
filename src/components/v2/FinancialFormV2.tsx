'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Percent, Clock, Receipt, ArrowRight, ArrowLeft, Car, Fuel, ChevronDown, ChevronUp, Calculator } from 'lucide-react'
import { CarData } from '@/app/page'

interface FinancialFormV2Props {
  carData: CarData
  updateCarData: (updates: Partial<CarData>) => void
  onNext: () => void
  onBack: () => void
  standalone?: boolean
}

export default function FinancialFormV2({ carData, updateCarData, onNext, onBack, standalone = true }: FinancialFormV2Props) {
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
    { label: 'Fair Credit', rate: 10.5, description: 'Higher rates' }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext()
  }

  return (
    <div className="space-y-8">
      {standalone ? (
        <div className="text-center space-y-3 mb-6">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center mb-3">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-white">Financial Details</h2>
          <p className="text-gray-400">Enter your loan and financial information</p>
        </div>
      ) : (
        <div className="lg:hidden mb-4">
          <h3 className="text-lg font-semibold text-white">Loan Terms</h3>
          <p className="text-gray-400 text-sm">Configure your loan details</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Loan Tenure */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-white">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Loan Tenure ({carData.tenure} years)</span>
          </label>
          
          <div className="space-y-3">
            <input
              type="range"
              min={minTenure}
              max={maxTenure}
              value={carData.tenure}
              onChange={(e) => {
                const years = parseInt(e.target.value)
                updateCarData({ tenure: years })
              }}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${carData.tenure <= 4 ? '#06b6d4' : '#ef4444'} 0%, ${carData.tenure <= 4 ? '#06b6d4' : '#ef4444'} ${((carData.tenure - minTenure) / (maxTenure - minTenure)) * 100}%, rgba(255,255,255,0.2) ${((carData.tenure - minTenure) / (maxTenure - minTenure)) * 100}%, rgba(255,255,255,0.2) 100%)`
              }}
            />
            
            <div className="flex justify-between text-xs text-white/60">
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
              <div className="bg-red-500/20 border border-red-400/50 rounded-2xl p-3">
                <p className="text-red-300 text-xs">
                  ⚠️ You're going above the suggested 4-year limit. Consider reducing the tenure for better financial health.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Interest Rate */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-white">
            <Percent className="w-4 h-4 text-red-400" />
            <span>Interest Rate (% per annum)</span>
          </label>
          
          
          <div className="space-y-3">
            <input
              type="number"
              step="0.1"
              value={carData.interestRate}
              onChange={(e) => updateCarData({ interestRate: parseFloat(e.target.value) || 8 })}
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
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
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${((carData.interestRate - 5) / (15 - 5)) * 100}%, rgba(255,255,255,0.2) ${((carData.interestRate - 5) / (15 - 5)) * 100}%, rgba(255,255,255,0.2) 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-white/60 mt-1">
                <span>5%</span>
                <span>10%</span>
                <span>15%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden Cost Reminder Popup */}
        {(!carData.kmPerMonth || !carData.fuelCostPerLiter || !carData.insuranceAndMaintenance) && !showOptionalInputs && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 bg-amber-500/20 backdrop-blur-md border border-amber-400/30 p-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-start space-x-2">
              <div className="flex-shrink-0 w-6 h-6 bg-amber-500/30 rounded-full flex items-center justify-center mt-0.5">
                <Calculator size={12} className="text-amber-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-amber-200 mb-1 text-sm">💡 Complete Your Analysis</p>
                <p className="text-amber-300/80 text-xs leading-relaxed">
                  Add driving distance, fuel costs, and insurance details in "Hidden Cost" below for accurate total cost calculation.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Optional Inputs Section */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setShowOptionalInputs(!showOptionalInputs)}
            className="w-full p-4 text-left hover:bg-white/10 transition-colors flex items-center justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold text-white">Hidden Cost</h3>
              <p className="text-white/70 text-sm">Optimize your decision with these hidden factors</p>
            </div>
            {showOptionalInputs ? (
              <ChevronUp className="w-5 h-5 text-white/70" />
            ) : (
              <ChevronDown className="w-5 h-5 text-white/70" />
            )}
          </button>

          {showOptionalInputs && (
            <div className="border-t border-white/20 p-6 space-y-6">
              {/* Processing Fee */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-white">
                  <Receipt className="w-4 h-4 text-purple-400" />
                  <span>Processing Fee</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 font-medium">₹</span>
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
                    className="w-full pl-8 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* KM Driven Per Month */}
              <div className="space-y-2">
                <label className="flex items-center justify-between text-sm font-medium text-white">
                  <div className="flex items-center space-x-2">
                    <Car className="w-4 h-4 text-orange-400" />
                    <span>KM Driven Per Month</span>
                  </div>
                  {!carData.kmPerMonth && (
                    <div className="flex space-x-1">
                      <button
                        type="button"
                        onClick={() => updateCarData({ kmPerMonth: 800 })}
                        className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full hover:bg-orange-500/30 transition-all"
                      >
                        City 800km
                      </button>
                      <button
                        type="button"
                        onClick={() => updateCarData({ kmPerMonth: 1500 })}
                        className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full hover:bg-orange-500/30 transition-all"
                      >
                        Mixed 1500km
                      </button>
                    </div>
                  )}
                </label>
                <input
                  type="number"
                  value={carData.kmPerMonth || ''}
                  onChange={(e) => updateCarData({ kmPerMonth: parseFloat(e.target.value) || 0 })}
                  placeholder="Enter km per month"
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                />
              </div>

              {/* Fuel Cost Per Liter */}
              <div className="space-y-2">
                <label className="flex items-center justify-between text-sm font-medium text-white">
                  <div className="flex items-center space-x-2">
                    <Fuel className="w-4 h-4 text-red-400" />
                    <span>Fuel Cost Per Liter</span>
                  </div>
                  {!carData.fuelCostPerLiter && (
                    <div className="flex space-x-1">
                      <button
                        type="button"
                        onClick={() => updateCarData({ fuelCostPerLiter: 95 })}
                        className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded-full hover:bg-red-500/30 transition-all"
                      >
                        Petrol ₹95
                      </button>
                      <button
                        type="button"
                        onClick={() => updateCarData({ fuelCostPerLiter: 85 })}
                        className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded-full hover:bg-red-500/30 transition-all"
                      >
                        Diesel ₹85
                      </button>
                    </div>
                  )}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 font-medium">₹</span>
                  <input
                    type="number"
                    value={carData.fuelCostPerLiter || ''}
                    onChange={(e) => updateCarData({ fuelCostPerLiter: parseFloat(e.target.value) || 0 })}
                    placeholder="Enter fuel cost per liter"
                    className="w-full pl-8 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Monthly Insurance & Maintenance */}
              <div className="space-y-2">
                <label className="flex items-center justify-between text-sm font-medium text-white">
                  <div className="flex items-center space-x-2">
                    <Receipt className="w-4 h-4 text-green-400" />
                    <span>Monthly Insurance & Maintenance</span>
                  </div>
                  {carData.carPrice > 0 && !carData.insuranceAndMaintenance && (
                    <button
                      type="button"
                      onClick={() => {
                        const suggested = Math.round((carData.carPrice * 0.009) / 12);
                        updateCarData({ insuranceAndMaintenance: suggested });
                      }}
                      className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full hover:bg-green-500/30 transition-all"
                    >
                      Use suggested: ₹{Math.round((carData.carPrice * 0.009) / 12).toLocaleString('en-IN')}
                    </button>
                  )}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 font-medium">₹</span>
                  <input
                    type="number"
                    value={carData.insuranceAndMaintenance || ''}
                    onChange={(e) => updateCarData({ insuranceAndMaintenance: parseFloat(e.target.value) || 0 })}
                    placeholder="Enter monthly insurance & maintenance"
                    className="w-full pl-8 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                  />
                </div>
                <p className="text-xs text-white/60 flex items-center">
                  <span className="w-1 h-1 bg-green-400 rounded-full mr-2"></span>
                  Typically 0.8-1% of car price monthly for insurance + maintenance costs
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Monthly Income - Required for 20/4/10 Rule */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-white">
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span>Monthly Income</span>
            <span className="text-xs text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full">required for 20/4/10 rule</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 font-medium">₹</span>
            <input
              type="number"
              value={carData.monthlyIncome || ''}
              onChange={(e) => updateCarData({ monthlyIncome: parseFloat(e.target.value) || 0 })}
              placeholder="Enter your monthly income"
              className="w-full pl-8 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
            />
          </div>
          <p className="text-xs text-white/60 flex items-center">
            <span className="w-1 h-1 bg-emerald-400 rounded-full mr-2"></span>
            Used to calculate the 10% rule: total car expenses should not exceed 10% of your income
          </p>
        </div>

      </form>
    </div>
  )
}