'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CarData } from '@/app/page'
import { DollarSign, TrendingUp, Car, Fuel, CheckCircle, XCircle, Calendar, BarChart, Target, Info, Percent, Clock } from 'lucide-react'

interface TotalCostDisplayProps {
  carData: CarData
}

export default function TotalCostDisplayV5({ carData }: TotalCostDisplayProps) {
  const [durationToggle, setDurationToggle] = useState<'months' | 'years'>('months')
  
  const calculateEMI = (principal: number, rate: number, years: number) => {
    if (principal <= 0 || rate <= 0 || years <= 0) return 0
    const monthlyRate = rate / (12 * 100)
    const months = years * 12
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
    return isNaN(emi) ? 0 : emi
  }

  const loanAmount = carData.carPrice - carData.downPayment
  const emi = calculateEMI(loanAmount, carData.interestRate, carData.tenure)
  const totalInterest = (emi * carData.tenure * 12) - loanAmount
  const totalPayment = loanAmount + totalInterest
  const monthlyFuelCost = carData.kmPerMonth && carData.fuelCostPerLiter ? (carData.kmPerMonth / 15) * carData.fuelCostPerLiter : 0
  const totalMonthlyCost = emi + monthlyFuelCost + (carData.insuranceAndMaintenance || 0)
  
  // 20/4/10 Rule Check
  const downPaymentPercentage = carData.carPrice > 0 ? (carData.downPayment / carData.carPrice) * 100 : 0
  const isDownPaymentOk = downPaymentPercentage >= 20
  const isTenureOk = carData.tenure <= 4
  const expensePercentage = carData.monthlyIncome > 0 ? (totalMonthlyCost / carData.monthlyIncome) * 100 : 0
  const isExpenseOk = carData.monthlyIncome > 0 ? expensePercentage <= 10 : true
  const isAffordable = isDownPaymentOk && isTenureOk && isExpenseOk

  const formatCurrency = (value: number) => `₹${Math.round(value).toLocaleString('en-IN')}`
  const formatDuration = () => {
    return durationToggle === 'months' ? `${carData.tenure * 12} months` : `${carData.tenure} years`
  }

  return (
    <div className="w-full lg:w-2/5 bg-white p-6 rounded-lg shadow-lg h-full sticky top-10">
      <h4 className="font-semibold text-gray-800 mb-4">EMI Summary</h4>
      
      {/* Monthly EMI - Prominent Display */}
      <div className="bg-blue-600 text-white p-6 rounded-xl mb-6 text-center">
        <p className="text-sm text-blue-100 mb-2">Monthly EMI</p>
        <p className="text-3xl font-bold">{formatCurrency(emi)}</p>
      </div>

      {/* Compact Metrics */}
      <div className="space-y-3 mb-6">
        {/* Duration with Toggle */}
        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
          <span className="text-sm text-gray-600 flex items-center">
            <Clock size={16} className="mr-2"/>Loan Duration
          </span>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-800">{formatDuration()}</span>
            <button
              onClick={() => setDurationToggle(prev => prev === 'months' ? 'years' : 'months')}
              className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full hover:bg-blue-200 transition-colors"
            >
              Toggle
            </button>
          </div>
        </div>

        {/* Interest Rate */}
        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
          <span className="text-sm text-gray-600 flex items-center">
            <Percent size={16} className="mr-2"/>Interest Rate
          </span>
          <span className="font-semibold text-gray-800">{carData.interestRate}% p.a.</span>
        </div>

        {/* Final Loan Amount */}
        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
          <span className="text-sm text-gray-600 flex items-center">
            <DollarSign size={16} className="mr-2"/>Total Payment
          </span>
          <span className="font-semibold text-gray-800">{formatCurrency(totalPayment)}</span>
        </div>
      </div>

      {/* 20/4/10 Rule Check - Highlighted */}
      {carData.carPrice > 0 && (
        <div className={`p-4 rounded-xl border-2 mb-4 ${
          isAffordable 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-bold text-gray-800">20/4/10 Rule Check</h5>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isAffordable 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {isAffordable ? 'AFFORDABLE' : 'REVIEW NEEDED'}
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">20% Down Payment</span>
              <div className="flex items-center space-x-2">
                <span className="text-gray-800">{downPaymentPercentage.toFixed(1)}%</span>
                {isDownPaymentOk ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Max 4 Year Tenure</span>
              <div className="flex items-center space-x-2">
                <span className="text-gray-800">{carData.tenure}y</span>
                {isTenureOk ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
              </div>
            </div>
            
            {carData.monthlyIncome > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Max 10% of Income</span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-800">{expensePercentage.toFixed(1)}%</span>
                  {isExpenseOk ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>
            )}
          </div>

          <div className={`mt-3 p-3 rounded-lg text-center ${
            isAffordable 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            <p className="font-semibold text-sm">
              {isAffordable 
                ? '✅ This car fits your budget well!' 
                : '⚠️ Consider adjusting your budget or loan terms'
              }
            </p>
          </div>
        </div>
      )}

      {/* Additional Info */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700 flex items-center">
        <Info size={16} className="mr-2 flex-shrink-0" />
        <span>EMI calculations are indicative. Final rates may vary by lender.</span>
      </div>
    </div>
  )
}
