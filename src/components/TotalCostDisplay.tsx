'use client'

import { motion } from 'framer-motion'
import { CarData } from '@/app/page'
import { DollarSign, TrendingUp, Car, Fuel, CheckCircle, XCircle } from 'lucide-react'

interface TotalCostDisplayProps {
  carData: CarData
}

export default function TotalCostDisplay({ carData }: TotalCostDisplayProps) {
  const calculateEMI = (principal: number, rate: number, years: number) => {
    if (principal <= 0 || rate <= 0 || years <= 0) return 0
    const monthlyRate = rate / (12 * 100)
    const months = years * 12
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
           (Math.pow(1 + monthlyRate, months) - 1)
  }

  // Calculate values
  const loanAmount = carData.carPrice - carData.downPayment
  const emi = calculateEMI(loanAmount, carData.interestRate, carData.tenure)
  const totalInterest = (emi * carData.tenure * 12) - loanAmount
  
  // Check if optional fields are filled
  const hasProcessingFee = carData.processingFee > 0
  const hasFuelData = carData.kmPerMonth > 0 && carData.fuelCostPerLiter > 0
  const hasMonthlyIncome = carData.monthlyIncome > 0
  
  // Monthly running cost calculation (assuming 15 km/liter average)
  const fuelEfficiency = 15 // km per liter
  const monthlyFuelCost = hasFuelData ? (carData.kmPerMonth / fuelEfficiency) * carData.fuelCostPerLiter : 0
  
  // Total cost calculation (only add processing fee if provided)
  const totalCost = carData.carPrice + (hasProcessingFee ? carData.processingFee : 0)
  
  // 20/4/10 rule check (only if all data available)
  const downPaymentPercentage = (carData.downPayment / carData.carPrice) * 100
  const isDownPaymentOk = downPaymentPercentage >= 20
  const isTenureOk = carData.tenure <= 4
  const totalMonthlyExpense = emi + monthlyFuelCost
  const expensePercentage = hasMonthlyIncome ? (totalMonthlyExpense / carData.monthlyIncome) * 100 : 0
  const isExpenseOk = hasMonthlyIncome ? expensePercentage <= 10 : true
  const isAffordable = isDownPaymentOk && isTenureOk && isExpenseOk

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto lg:h-full">
      {/* Summary Cards */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Financial Summary</h3>
        
        {/* Car Price - Always shown */}
        <div className="bg-gray-800/40 rounded-lg p-3 sm:p-4 border border-gray-700/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Car className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
              <span className="text-gray-400 text-sm sm:text-base">Car Price</span>
            </div>
            <span className="font-bold text-emerald-400 text-base sm:text-lg">
              ₹{carData.carPrice.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Down Payment - Always shown */}
        <div className="bg-gray-800/40 rounded-lg p-3 sm:p-4 border border-gray-700/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
              <span className="text-gray-400 text-sm sm:text-base">Down Payment</span>
            </div>
            <span className="font-bold text-cyan-400 text-base sm:text-lg">
              ₹{carData.downPayment.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Loan Amount - Always shown */}
        <div className="bg-gray-800/40 rounded-lg p-3 sm:p-4 border border-gray-700/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              <span className="text-gray-400 text-sm sm:text-base">Loan Amount</span>
            </div>
            <span className="font-bold text-purple-400 text-base sm:text-lg">
              ₹{loanAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Monthly EMI - Always shown */}
        {emi > 0 && (
          <div className="bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 rounded-lg p-4 sm:p-6 border border-emerald-500/30">
            <div className="text-center">
              <p className="text-emerald-300 text-xs sm:text-sm mb-2">Monthly EMI</p>
              <p className="font-bold text-2xl sm:text-3xl text-white">
                ₹{emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </p>
              <p className="text-emerald-300 text-xs sm:text-sm mt-2">per month for {carData.tenure} years</p>
            </div>
          </div>
        )}

        {/* Processing Fee - Only if filled */}
        {hasProcessingFee && (
          <div className="bg-gray-800/40 rounded-lg p-3 sm:p-4 border border-gray-700/30">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm sm:text-base">Processing Fee</span>
              <span className="font-bold text-yellow-400 text-base sm:text-lg">
                ₹{carData.processingFee.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        )}


        {/* Total Monthly Expense - Only if fuel data provided */}
        {hasFuelData && (
          <div className="bg-gray-700/40 rounded-lg p-3 sm:p-4 border border-gray-600/50">
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold text-sm sm:text-base">Total Monthly Cost</span>
              <span className="font-bold text-lg sm:text-xl text-yellow-400">
                ₹{totalMonthlyExpense.toLocaleString('en-IN', { maximumFractionDigits: 0 })}/mo
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 20/4/10 Rule Check - Only show after car price is filled */}
      {carData.carPrice > 0 && (
        <div className="bg-gray-800/30 rounded-lg p-3 sm:p-4 border border-gray-700/50">
        <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">20/4/10 Rule Check</h4>
        
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs sm:text-sm">20% Down Payment</span>
            <div className="flex items-center space-x-2">
              <span className="text-xs sm:text-sm text-white">{downPaymentPercentage.toFixed(1)}%</span>
              {isDownPaymentOk ? (
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
              ) : (
                <XCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs sm:text-sm">Max 4 Year Tenure</span>
            <div className="flex items-center space-x-2">
              <span className="text-xs sm:text-sm text-white">{carData.tenure}y</span>
              {isTenureOk ? (
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
              ) : (
                <XCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
              )}
            </div>
          </div>
          
          {/* Income check - only if monthly income provided */}
          {hasMonthlyIncome && (
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs sm:text-sm">Max 10% of Income</span>
              <div className="flex items-center space-x-2">
                <span className="text-xs sm:text-sm text-white">{expensePercentage.toFixed(1)}%</span>
                {isExpenseOk ? (
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                ) : (
                  <XCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Overall affordability - only if all data available */}
        {hasMonthlyIncome && (
          <div className={`mt-3 sm:mt-4 p-3 rounded-lg ${isAffordable ? 'bg-green-900/30 border border-green-700/50' : 'bg-red-900/30 border border-red-700/50'}`}>
            <p className={`text-xs sm:text-sm font-semibold ${isAffordable ? 'text-green-400' : 'text-red-400'}`}>
              {isAffordable ? '✅ Car is Affordable!' : '⚠️ Car may be too expensive'}
            </p>
            {!isAffordable && (
              <p className="text-red-300 text-xs mt-1">
                Consider adjusting your budget or loan terms
              </p>
            )}
          </div>
        )}
        </div>
      )}

      {/* Detailed Breakdown */}
      <div className="bg-gray-800/30 rounded-lg p-3 sm:p-4 border border-gray-700/50">
        <h4 className="text-white font-semibold mb-3 text-sm sm:text-base">Loan Details</h4>
        <div className="space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Interest Rate:</span>
            <span className="text-white">{carData.interestRate}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Tenure:</span>
            <span className="text-white">{carData.tenure} years</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Total Interest:</span>
            <span className="text-white">₹{totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
          </div>
        </div>
      </div>
    </div>
  )
}