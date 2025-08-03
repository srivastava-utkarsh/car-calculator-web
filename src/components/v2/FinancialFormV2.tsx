'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Percent, Clock, Receipt, ArrowRight, ArrowLeft, Car, Fuel, ChevronDown, ChevronUp, Calculator, Info } from 'lucide-react'
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

  // Check if Smart Purchase Score requirements are met and additional details are missing
  const requiredFields = [
    carData.carPrice > 0,
    carData.downPayment >= 0,
    carData.monthlyIncome > 0
  ];
  const isAllRequiredFieldsFilled = requiredFields.every(Boolean);
  
  const additionalFields = [
    carData.kmPerMonth > 0,
    carData.fuelCostPerLiter > 0,
    carData.insuranceAndMaintenance > 0
  ];
  const isAdditionalDetailsMissing = isAllRequiredFieldsFilled && !additionalFields.every(Boolean);
  const missingAdditionalCount = additionalFields.filter(Boolean).length;

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
        <div className="mb-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Loan Terms</h3>
              <p className="text-gray-400 text-sm">Configure your loan details</p>
            </div>
          </div>
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


        {/* Additional Details Section */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setShowOptionalInputs(!showOptionalInputs)}
            className="w-full p-4 text-left hover:bg-white/10 transition-colors flex items-center justify-between"
            title={isAdditionalDetailsMissing ? `Complete Additional Details for full analysis - Add fuel costs, km/month, and insurance details (${missingAdditionalCount}/3 filled)` : undefined}
          >
            <div className="flex items-center space-x-2">
              <div>
                <h3 className="text-lg font-semibold text-white flex items-center">
                  Additional Details
                  {isAdditionalDetailsMissing && (
                    <Info className="w-4 h-4 ml-2 text-amber-400" />
                  )}
                </h3>
                <p className="text-white/70 text-sm">Add processing fees, insurance and running costs</p>
              </div>
            </div>
            {showOptionalInputs ? (
              <ChevronUp className="w-5 h-5 text-white/70" />
            ) : (
              <ChevronDown className="w-5 h-5 text-white/70" />
            )}
          </button>

          {showOptionalInputs && (
            <div className="border-t border-white/20 p-6 space-y-6">
              {/* Consolidated Input for Processing Fee + Insurance + Others */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-white">
                  <Receipt className="w-4 h-4 text-purple-400" />
                  <span>Processing Fee + Insurance + Others</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 font-medium">₹</span>
                  <input
                    type="number"
                    value={carData.insuranceAndMaintenance || ''}
                    onChange={(e) => updateCarData({ insuranceAndMaintenance: parseFloat(e.target.value) || 0 })}
                    placeholder="Enter monthly processing fee, insurance & other costs"
                    className="w-full pl-8 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                  />
                </div>
                <p className="text-xs text-white/60 flex items-center">
                  <span className="w-1 h-1 bg-purple-400 rounded-full mr-2"></span>
                  Include processing fees, insurance or any other costs
                </p>
              </div>

              {/* Monthly Running Cost Section */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="text-sm font-semibold text-white mb-3 flex items-center">
                  <Car className="w-4 h-4 mr-2 text-cyan-400" />
                  Monthly Running Cost
                </h4>
                
                <div className="space-y-4">
                  {/* KM Driven Per Month */}
                  <div className="space-y-2">
                    <label className="text-sm text-white/80">Estimated KM Driven Per Month</label>
                    <input
                      type="number"
                      value={carData.kmPerMonth || ''}
                      onChange={(e) => updateCarData({ kmPerMonth: parseFloat(e.target.value) || 0 })}
                      placeholder="Enter km per month"
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Fuel Cost Per Liter */}
                  <div className="space-y-2">
                    <label className="text-sm text-white/80">Fuel Cost Per Liter</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 font-medium">₹</span>
                      <input
                        type="number"
                        value={carData.fuelCostPerLiter || ''}
                        onChange={(e) => updateCarData({ fuelCostPerLiter: parseFloat(e.target.value) || 0 })}
                        placeholder="Enter fuel cost per liter"
                        className="w-full pl-8 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </form>

      {/* Back Button - Only show on mobile standalone mode */}
      {standalone && (
        <div className="lg:hidden pt-4 border-t border-white/20">
          <button
            type="button"
            onClick={onBack}
            className="w-full bg-gray-700/50 backdrop-blur-md text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-medium hover:bg-gray-600/50 transition-all duration-200 flex items-center justify-center space-x-2 border border-white/20 text-sm sm:text-base"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Car Details</span>
          </button>
        </div>
      )}
    </div>
  )
}