'use client'

import React from 'react'
import { CarData } from '@/app/demo-new/page'

interface FinancialFormProps {
  carData: CarData
  updateCarData: (updates: Partial<CarData>) => void
}

export default function FinancialForm({ carData, updateCarData }: FinancialFormProps) {
  const handleMonthlyIncomeChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '')
    const income = parseInt(numericValue) || 0
    updateCarData({ monthlyIncome: income })
  }

  const handleKmPerMonthChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '')
    const km = parseInt(numericValue) || 0
    updateCarData({ kmPerMonth: km })
    
    // Auto-calculate fuel expense
    if (km > 0 && carData.fuelCostPerLiter > 0) {
      const fuelExpense = Math.round((km / 15) * carData.fuelCostPerLiter)
      updateCarData({ monthlyFuelExpense: fuelExpense })
    }
  }

  const handleFuelCostChange = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '')
    const cost = parseFloat(numericValue) || 0
    updateCarData({ fuelCostPerLiter: cost })
    
    // Auto-calculate fuel expense
    if (carData.kmPerMonth > 0 && cost > 0) {
      const fuelExpense = Math.round((carData.kmPerMonth / 15) * cost)
      updateCarData({ monthlyFuelExpense: fuelExpense })
    }
  }

  // Income preset options
  const incomePresets = [
    { label: '25K', value: 25000 },
    { label: '50K', value: 50000 },
    { label: '75K', value: 75000 },
    { label: '1L', value: 100000 },
    { label: '2L', value: 200000 }
  ]

  return (
    <div className="space-y-6">
      {/* Monthly Income */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="recipe-heading-3 text-slate-900">
            Monthly Income
          </label>
          <div className="flex gap-2 flex-wrap">
            {incomePresets.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => updateCarData({ monthlyIncome: preset.value })}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  carData.monthlyIncome === preset.value
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                ₹{preset.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">₹</span>
          <input
            type="number"
            min="0"
            value={carData.monthlyIncome || ''}
            onChange={(e) => handleMonthlyIncomeChange(e.target.value)}
            className="recipe-input pl-8"
            placeholder="Enter monthly income"
          />
        </div>
      </div>

      {/* Monthly Driving */}
      <div className="space-y-3">
        <label className="recipe-heading-3 text-slate-900">
          Monthly Driving (KM)
        </label>
        
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="3000"
            step="100"
            value={carData.kmPerMonth || 0}
            onChange={(e) => handleKmPerMonthChange(e.target.value)}
            className="recipe-slider w-full"
          />
          <div className="flex justify-between text-sm text-slate-500">
            <span>0 KM</span>
            <span>1500 KM</span>
            <span>3000 KM</span>
          </div>
        </div>
        
        <input
          type="number"
          min="0"
          max="5000"
          value={carData.kmPerMonth || ''}
          onChange={(e) => handleKmPerMonthChange(e.target.value)}
          className="recipe-input"
          placeholder="Expected monthly driving distance"
        />
      </div>

      {/* Fuel Cost */}
      <div className="space-y-3">
        <label className="recipe-heading-3 text-slate-900">
          Fuel Cost per Liter
        </label>
        
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">₹</span>
          <input
            type="number"
            step="0.1"
            min="0"
            max="200"
            value={carData.fuelCostPerLiter || ''}
            onChange={(e) => handleFuelCostChange(e.target.value)}
            className="recipe-input pl-8"
            placeholder="Current fuel price per liter"
          />
        </div>
        
        <div className="space-y-2">
          <input
            type="range"
            min="80"
            max="150"
            step="1"
            value={carData.fuelCostPerLiter || 100}
            onChange={(e) => handleFuelCostChange(e.target.value)}
            className="recipe-slider w-full"
          />
          <div className="flex justify-between text-sm text-slate-500">
            <span>₹80</span>
            <span>₹115</span>
            <span>₹150</span>
          </div>
        </div>
      </div>

      {/* Monthly Fuel Expense Preview */}
      {carData.monthlyFuelExpense && carData.monthlyFuelExpense > 0 && (
        <div className="recipe-alert-info">
          <div className="flex items-center justify-between">
            <span className="font-medium">Estimated Monthly Fuel Cost:</span>
            <span className="text-lg font-bold text-blue-700">
              ₹{carData.monthlyFuelExpense.toLocaleString()}
            </span>
          </div>
          <p className="text-sm mt-1">
            Based on {carData.kmPerMonth} KM/month at ₹{carData.fuelCostPerLiter}/liter (assuming 15 KM/liter mileage)
          </p>
        </div>
      )}

      {/* Insurance & Maintenance */}
      <div className="space-y-3">
        <label className="recipe-heading-3 text-slate-900">
          Monthly Insurance & Maintenance (Optional)
        </label>
        
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">₹</span>
          <input
            type="number"
            min="0"
            value={carData.insuranceAndMaintenance || ''}
            onChange={(e) => updateCarData({ insuranceAndMaintenance: parseInt(e.target.value) || 0 })}
            className="recipe-input pl-8"
            placeholder="Monthly insurance + maintenance cost"
          />
        </div>
        
        <p className="text-sm text-slate-500">
          Typically ranges from ₹2,000 - ₹8,000 per month depending on car value and coverage.
        </p>
      </div>

      {/* Include Fuel in Affordability */}
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          id="include-fuel"
          checked={carData.includeFuelInAffordability || false}
          onChange={(e) => updateCarData({ includeFuelInAffordability: e.target.checked })}
          className="mt-1 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
        />
        <div>
          <label htmlFor="include-fuel" className="font-medium text-slate-900 cursor-pointer">
            Include fuel costs in affordability calculation
          </label>
          <p className="text-sm text-slate-500 mt-1">
            This will factor in monthly fuel expenses when calculating if the loan EMI is affordable based on your income.
          </p>
        </div>
      </div>
    </div>
  )
}