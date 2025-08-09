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
      {/* Processing Fee + Insurance + Others */}
      <div className="space-y-2">
        <label className="text-base min-[375px]:text-lg font-medium text-white" style={{ lineHeight: '1.5' }}>
          Processing Fee etc <span className="text-sm text-white/60">(optional)</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 font-semibold">₹</span>
          <input
            type="number"
            min="0"
            max="200000"
            value={carData.insuranceAndMaintenance || ''}
            onChange={(e) => {
              const value = e.target.value
              const numericValue = parseFloat(value) || 0
              
              // Validate range: 0 to 200,000
              if (numericValue < 0 || numericValue > 200000) {
                return // Don't update if outside valid range
              }
              
              updateCarData({ insuranceAndMaintenance: numericValue })
            }}
            onBlur={(e) => {
              const value = parseFloat(e.target.value) || 0
              // Clamp value to valid range on blur
              const clampedValue = Math.max(0, Math.min(200000, value))
              if (clampedValue !== value) {
                updateCarData({ insuranceAndMaintenance: clampedValue })
              }
            }}
            placeholder="Enter Processing Fee,Insurance or Other Expenses"
            className="w-full pl-8 pr-4 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all text-base"
          />
        </div>
      </div>

      {/* Monthly Fuel Expense */}
      <div className="space-y-2" id="monthly-fuel-expense">
        <label className="text-base min-[375px]:text-lg font-medium text-white" style={{ lineHeight: '1.5' }}>
          Fuel per Month <span className="text-sm text-white/60">(optional)</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 font-semibold">₹</span>
          <input
            type="number"
            min="1"
            max="100000"
            value={carData.monthlyFuelExpense || ''}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/[^0-9.]/g, '')
              let expense = parseFloat(numericValue) || 0
              
              // Enforce limits
              if (expense > 100000) {
                expense = 100000
              } else if (expense < 0) {
                expense = 0
              }
              
              updateCarData({ monthlyFuelExpense: expense })
            }}
            onKeyPress={(e) => {
              if (!/[0-9.]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                e.preventDefault()
              }
            }}
            placeholder="Enter monthly fuel expense"
            className="w-full pl-8 pr-4 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all text-base"
          />
        </div>
      </div>

    </>
  )

  return (
    <div className="space-y-6">
      {/* STEP 2: Your Profile */}
      <div className="border border-white/10 rounded-2xl p-6 bg-white/5">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
            2
          </div>
          <h3 className="text-lg font-bold text-white">Your Profile</h3>
        </div>
        
        {/* Monthly Income - First in Step 2 */}
        <div className={`space-y-2 p-3 rounded-lg mb-6 transition-all duration-300 ${
          carData.carPrice > 0 && carData.downPayment >= 0 && carData.tenure > 0 && carData.monthlyIncome === 0
            ? 'border-lime-400/40 shadow-lg shadow-lime-400/20 bg-lime-400/10 border' 
            : ''
        }`}>
          <label className="block text-base min-[375px]:text-lg font-medium text-white" style={{ lineHeight: '1.5' }}>
            Monthly Income
            <span className="text-xs text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full ml-2">Affordability Check ⓘ</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 font-semibold">₹</span>
            <input
              type="number"
              min="0"
              max="100000000"
              required
              value={carData.monthlyIncome || ''}
              ref={monthlyIncomeInputRef}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/[^0-9.]/g, '')
                let income = parseFloat(numericValue) || 0
                
                if (income > 100000000) {
                  income = 100000000
                }
                
                updateCarData({ monthlyIncome: income })
              }}
              onKeyPress={(e) => {
                if (!/[0-9.]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                  e.preventDefault()
                }
              }}
              placeholder="Enter your monthly income"
              className={`w-full pl-8 pr-4 py-2.5 bg-white/10 backdrop-blur-md border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-base ${
                carData.carPrice > 0 && carData.downPayment >= 0 && carData.tenure > 0 && carData.monthlyIncome === 0
                  ? 'border-lime-400/60' 
                  : 'border-white/20'
              }`}
            />
          </div>
          <p className="text-sm text-white/70 flex items-center mt-3">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-3"></span>
            Used to calculate the 10% rule: total car expenses should not exceed 10% of your income
          </p>
        </div>
        
        <div className="space-y-4">
          {formContent}
        </div>
      </div>
    </div>
  )
}