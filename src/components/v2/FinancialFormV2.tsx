'use client'

import React, { useRef, useEffect } from 'react'
import { CarData } from '@/app/page'

interface FinancialFormV2Props {
  carData: CarData
  updateCarData: (updates: Partial<CarData>) => void
  monthlyIncomeInputRef?: React.RefObject<HTMLInputElement | null>
}

export default function FinancialFormV2({ carData, updateCarData, monthlyIncomeInputRef }: FinancialFormV2Props) {
  
  const kmInputRef = useRef<HTMLInputElement>(null)
  const fuelCostInputRef = useRef<HTMLInputElement>(null)
  
  const calculateEMI = (principal: number, rate: number, years: number) => {
    if (principal <= 0 || rate <= 0 || years <= 0) return 0
    const monthlyRate = rate / (12 * 100)
    const months = years * 12
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
           (Math.pow(1 + monthlyRate, months) - 1)
  }

  // Auto-focus logic based on the requirements
  useEffect(() => {
    const emi = calculateEMI(carData.carPrice - carData.downPayment, carData.interestRate, carData.tenure)
    
    // If fuel inputs are filled but no EMI, focus on monthly income
    if (carData.kmPerMonth > 0 && carData.fuelCostPerLiter > 0 && emi === 0 && carData.monthlyIncome === 0 && monthlyIncomeInputRef) {
      setTimeout(() => {
        monthlyIncomeInputRef.current?.focus()
      }, 100)
    }
  }, [carData, monthlyIncomeInputRef])

  
  const maxTenure = 7
  const minTenure = 1



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
    (carData.insuranceAndMaintenance || 0) > 0
  ];
  const isAdditionalDetailsMissing = isAllRequiredFieldsFilled && !additionalFields.every(Boolean);
  const missingAdditionalCount = additionalFields.filter(Boolean).length;

  const formContent = (
    <>
      {/* Loan Tenure */}
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-2">
          <label className="text-base min-[375px]:text-lg font-medium text-white" style={{ lineHeight: '1.5' }}>
            4. Loan Tenure
          </label>
          <span className="text-sm text-cyan-300 font-medium">{Math.round(carData.tenure || 0)} years</span>
        </div>
        
        <div className="space-y-3">
          <div className="relative group">
            <input
              type="range"
              min={minTenure}
              max={maxTenure}
              step="0.01"
              value={carData.tenure || minTenure}
              onChange={(e) => {
                const rawValue = parseFloat(e.target.value)
                const roundedYears = Math.round(rawValue)
                updateCarData({ tenure: roundedYears })
              }}
              className="w-full h-3 bg-white/20 rounded-full appearance-none cursor-pointer slider-enhanced transition-all duration-200 hover:h-4"
              style={{
                background: `linear-gradient(to right, ${(carData.tenure || minTenure) <= 4 ? '#06b6d4' : '#ef4444'} 0%, ${(carData.tenure || minTenure) <= 4 ? '#06b6d4' : '#ef4444'} ${(((carData.tenure || minTenure) - minTenure) / (maxTenure - minTenure)) * 100}%, rgba(255,255,255,0.2) ${(((carData.tenure || minTenure) - minTenure) / (maxTenure - minTenure)) * 100}%, rgba(255,255,255,0.2) 100%)`
              }}
            />
            {/* Value display tooltip */}
            <div 
              className="absolute -top-10 bg-gray-800/90 text-white text-xs px-2 py-1 rounded-md pointer-events-none transition-opacity duration-200 opacity-0 group-hover:opacity-100"
              style={{
                left: `${(((carData.tenure || minTenure) - minTenure) / (maxTenure - minTenure)) * 100}%`,
                transform: 'translateX(-50%)'
              }}
            >
              {Math.round(carData.tenure || minTenure)} years
            </div>
          </div>
          
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
                ⚠️ You&apos;re going above the suggested 4-year limit. Consider reducing the tenure for better financial health.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Interest Rate */}
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-2">
          <label className="text-base min-[375px]:text-lg font-medium text-white" style={{ lineHeight: '1.5' }}>
            5. Interest Rate
          </label>
          <span className="text-sm text-cyan-300 font-medium">{carData.interestRate}% per annum</span>
        </div>
        
        <div className="space-y-3">
          <input
            type="number"
            step="0.1"
            min="5"
            max="15"
            value={carData.interestRate}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (isNaN(value)) {
                updateCarData({ interestRate: 8 });
              } else if (value < 5) {
                updateCarData({ interestRate: 5 });
              } else if (value > 15) {
                updateCarData({ interestRate: 15 });
              } else {
                updateCarData({ interestRate: value });
              }
            }}
            onBlur={(e) => {
              // Additional validation on blur to handle edge cases
              const value = parseFloat(e.target.value);
              if (isNaN(value) || value < 5 || value > 15) {
                const clampedValue = isNaN(value) ? 8 : Math.max(5, Math.min(15, value));
                updateCarData({ interestRate: clampedValue });
              }
            }}
            className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
            placeholder="Interest rate (5-15%)"
          />
          
          {/* Interest Rate Slider */}
          <div className="relative group">
            <div className="relative">
              <input
                type="range"
                min="5"
                max="15"
                step="0.1"
                value={carData.interestRate}
                onChange={(e) => updateCarData({ interestRate: parseFloat(e.target.value) })}
                className="w-full h-3 bg-white/20 rounded-full appearance-none cursor-pointer slider-enhanced transition-all duration-200 hover:h-4"
                style={{
                  background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${((carData.interestRate - 5) / (15 - 5)) * 100}%, rgba(255,255,255,0.2) ${((carData.interestRate - 5) / (15 - 5)) * 100}%, rgba(255,255,255,0.2) 100%)`
                }}
              />
              {/* Value display tooltip */}
              <div 
                className="absolute -top-10 bg-gray-800/90 text-white text-xs px-2 py-1 rounded-md pointer-events-none transition-opacity duration-200 opacity-0 group-hover:opacity-100"
                style={{
                  left: `${((carData.interestRate - 5) / (15 - 5)) * 100}%`,
                  transform: 'translateX(-50%)'
                }}
              >
                {carData.interestRate.toFixed(1)}%
              </div>
            </div>
            <div className="flex justify-between text-xs text-white/60 mt-1">
              <span>5%</span>
              <span>10%</span>
              <span>15%</span>
            </div>
          </div>
          
        </div>
      </div>

      {/* Additional Details Section - Fixed Display */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">
          6. Additional Details
        </h3>
        
        {/* Smart Purchase Score Completion Notice - Smaller Box */}
        {isAdditionalDetailsMissing && (
          <div className="bg-amber-500/15 border border-amber-400/20 rounded-lg p-3">
            <h4 className="text-xs font-medium text-amber-200 mb-1">
              Complete Details for Full Analysis
            </h4>
            <p className="text-amber-300 text-xs">
              Add fuel costs, km/month, and insurance details ({missingAdditionalCount}/3 filled) to get your complete Smart Purchase Score analysis.
            </p>
          </div>
        )}
        
        <div className="space-y-6">
          {/* Consolidated Input for Processing Fee + Insurance + Others */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">
              Processing Fee + Insurance + Others
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 font-medium">₹</span>
              <input
                type="number"
                min="0"
                max={carData.carPrice}
                value={carData.insuranceAndMaintenance || ''}
                onChange={(e) => updateCarData({ insuranceAndMaintenance: parseFloat(e.target.value) || 0 })}
placeholder=""
                className="w-full pl-8 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Calculate Monthly Running Cost Section */}
          <div 
            data-section="monthly-running-cost"
            className="bg-white/5 rounded-lg p-4 border border-white/10 transition-all duration-300"
          >
            <h4 className="text-sm font-semibold text-white mb-3">
              Calculate Monthly Running Cost
            </h4>
            
            <div className="space-y-4">
              {/* KM Driven Per Month */}
              <div className="space-y-2">
                <label className="text-sm text-white/80">Estimated KM Driven Per Month</label>
                <input
                  ref={kmInputRef}
                  type="number"
                  min="1"
                  max="20000"
                  value={carData.kmPerMonth || ''}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/[^0-9.]/g, '')
                    let km = parseFloat(numericValue) || 0
                    
                    // Enforce limits
                    if (km > 20000) {
                      km = 20000
                    } else if (km < 0) {
                      km = 0
                    }
                    
                    updateCarData({ kmPerMonth: km })
                    
                    // Auto-enable "Include in budget?" toggle when both fuel inputs are filled
                    if (km > 0 && carData.fuelCostPerLiter > 0 && !carData.includeFuelInAffordability) {
                      updateCarData({ includeFuelInAffordability: true })
                    }
                  }}
                  onKeyPress={(e) => {
                    if (!/[0-9.]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                      e.preventDefault()
                    }
                  }}
                  placeholder="Click here to fill km per month"
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                />
              </div>

              {/* Fuel Cost Per Liter */}
              <div className="space-y-2">
                <label className="text-sm text-white/80">Fuel Cost Per Liter</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 font-medium">₹</span>
                  <input
                    ref={fuelCostInputRef}
                    type="number"
                    min="1"
                    max="300"
                    value={carData.fuelCostPerLiter || ''}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/[^0-9.]/g, '')
                      let fuelCost = parseFloat(numericValue) || 0
                      
                      // Enforce limits
                      if (fuelCost > 300) {
                        fuelCost = 300
                      } else if (fuelCost < 0) {
                        fuelCost = 0
                      }
                      
                      updateCarData({ fuelCostPerLiter: fuelCost })
                      
                      // Auto-enable "Include in budget?" toggle when both fuel inputs are filled
                      if (fuelCost > 0 && carData.kmPerMonth > 0 && !carData.includeFuelInAffordability) {
                        updateCarData({ includeFuelInAffordability: true })
                      }
                    }}
                    onKeyPress={(e) => {
                      if (!/[0-9.]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                        e.preventDefault()
                      }
                    }}
                    placeholder="Enter fuel cost per liter"
                    className="w-full pl-8 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )

  return (
    <div className="space-y-8">

      <div className="space-y-6">
        {formContent}
      </div>
    </div>
  )
}