'use client'

import { useState } from 'react'
import { Calculator, ArrowRight, ArrowLeft, Percent, Clock, Receipt, Car, Fuel, ChevronDown, ChevronUp } from 'lucide-react'
import { CarData } from '@/app/page'

interface FinancialFormV5Props {
  carData: CarData
  updateCarData: (updates: Partial<CarData>) => void
  onNext: () => void
  onBack: () => void
}

export default function FinancialFormV5({
  carData,
  updateCarData,
  onNext,
  onBack
}: FinancialFormV5Props) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto bg-blue-600 rounded-2xl flex items-center justify-center mb-4">
          <Calculator className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900">Financial Details</h2>
        <p className="text-gray-600">Configure your loan terms</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Loan Tenure */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <Clock className="w-4 h-4 text-blue-600" />
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
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${carData.tenure <= 4 ? '#2563eb' : '#ef4444'} 0%, ${carData.tenure <= 4 ? '#2563eb' : '#ef4444'} ${((carData.tenure - minTenure) / (maxTenure - minTenure)) * 100}%, #e5e7eb ${((carData.tenure - minTenure) / (maxTenure - minTenure)) * 100}%, #e5e7eb 100%)`
              }}
            />
            
            <div className="flex justify-between text-xs text-gray-500">
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
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-xs">
                  ⚠️ You're going above the suggested 4-year limit. Consider reducing the tenure for better financial health.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Interest Rate */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <Percent className="w-4 h-4 text-blue-600" />
            <span>Interest Rate (% per annum)</span>
          </label>
          <div className="space-y-3">
            <input
              type="number"
              step="0.1"
              value={carData.interestRate}
              onChange={(e) => updateCarData({ interestRate: parseFloat(e.target.value) || 8 })}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${((carData.interestRate - 5) / (15 - 5)) * 100}%, #e5e7eb ${((carData.interestRate - 5) / (15 - 5)) * 100}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5%</span>
                <span>10%</span>
                <span>15%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Optional Inputs Section */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setShowOptionalInputs(!showOptionalInputs)}
            className="w-full p-4 text-left hover:bg-gray-100 transition-colors flex items-center justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Hidden Cost</h3>
              <p className="text-gray-600 text-sm">Optimize your decision with these hidden factors</p>
            </div>
            {showOptionalInputs ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>

          {showOptionalInputs && (
            <div className="border-t border-gray-200 p-6 space-y-6">
            
              {/* Processing Fee */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Receipt className="w-4 h-4 text-blue-600" />
                  <span>Processing Fee</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₹</span>
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
                    className="w-full pl-8 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* KM Driven Per Month */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Car className="w-4 h-4 text-blue-600" />
                  <span>KM Driven Per Month</span>
                </label>
                <input
                  type="number"
                  value={carData.kmPerMonth || ''}
                  onChange={(e) => updateCarData({ kmPerMonth: parseFloat(e.target.value) || 0 })}
                  placeholder="Enter km per month"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Fuel Cost Per Liter */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Fuel className="w-4 h-4 text-blue-600" />
                  <span>Fuel Cost Per Liter</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₹</span>
                  <input
                    type="number"
                    value={carData.fuelCostPerLiter || ''}
                    onChange={(e) => updateCarData({ fuelCostPerLiter: parseFloat(e.target.value) || 0 })}
                    placeholder="Enter fuel cost per liter"
                    className="w-full pl-8 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>See EMI Plan</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  )
}