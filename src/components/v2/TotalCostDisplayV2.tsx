'use client'

import { motion } from 'framer-motion'
import { CarData } from '@/app/page'
import { DollarSign, TrendingUp, Car, Fuel, CheckCircle, XCircle, Zap } from 'lucide-react'

interface TotalCostDisplayV2Props {
  carData: CarData
}

export default function TotalCostDisplayV2({ carData }: TotalCostDisplayV2Props) {
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
  const fuelEfficiency = 15
  const monthlyFuelCost = hasFuelData ? (carData.kmPerMonth / fuelEfficiency) * carData.fuelCostPerLiter : 0
  
  // Total cost calculation
  const totalCost = carData.carPrice + (hasProcessingFee ? carData.processingFee : 0)
  
  // 20/4/10 rule check
  const downPaymentPercentage = (carData.downPayment / carData.carPrice) * 100
  const isDownPaymentOk = downPaymentPercentage >= 20
  const isTenureOk = carData.tenure <= 4
  const totalMonthlyExpense = emi + monthlyFuelCost
  const expensePercentage = hasMonthlyIncome ? (totalMonthlyExpense / carData.monthlyIncome) * 100 : 0
  const isExpenseOk = hasMonthlyIncome ? expensePercentage <= 10 : true
  const isAffordable = isDownPaymentOk && isTenureOk && isExpenseOk

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto lg:h-full">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-400 rounded-xl flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-white">Live Summary</h3>
      </div>

      {/* Car Price - Always shown */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Car className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
            <span className="text-white/80 text-sm sm:text-base">Car Price</span>
          </div>
          <span className="font-bold text-emerald-400 text-base sm:text-lg">
            ₹{carData.carPrice.toLocaleString('en-IN')}
          </span>
        </div>
      </motion.div>

      {/* Down Payment - Always shown */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
            <span className="text-white/80 text-sm sm:text-base">Down Payment</span>
          </div>
          <div className="text-right">
            <span className="font-bold text-cyan-400 text-base sm:text-lg block">
              ₹{carData.downPayment.toLocaleString('en-IN')}
            </span>
            <span className="text-cyan-300/70 text-xs">
              {downPaymentPercentage.toFixed(1)}%
            </span>
          </div>
        </div>
      </motion.div>

      {/* Loan Amount - Always shown */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
            <span className="text-white/80 text-sm sm:text-base">Loan Amount</span>
          </div>
          <span className="font-bold text-purple-400 text-base sm:text-lg">
            ₹{loanAmount.toLocaleString('en-IN')}
          </span>
        </div>
      </motion.div>

      {/* Monthly EMI - Always shown */}
      {emi > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-md border border-emerald-400/30 rounded-2xl p-6 shadow-xl"
        >
          <div className="text-center">
            <p className="text-emerald-300 text-xs sm:text-sm mb-2">Monthly EMI</p>
            <p className="font-bold text-2xl sm:text-3xl text-white">
              ₹{emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </p>
            <p className="text-emerald-300 text-xs sm:text-sm mt-2">
              per month for {carData.tenure} years
            </p>
          </div>
        </motion.div>
      )}

      {/* Processing Fee - Only if filled */}
      {hasProcessingFee && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-xl"
        >
          <div className="flex items-center justify-between">
            <span className="text-white/80 text-sm sm:text-base">Processing Fee</span>
            <span className="font-bold text-yellow-400 text-base sm:text-lg">
              ₹{carData.processingFee.toLocaleString('en-IN')}
            </span>
          </div>
        </motion.div>
      )}

      {/* Total Monthly Expense - Only if fuel data provided */}
      {hasFuelData && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-md border border-orange-400/30 rounded-2xl p-4 shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Fuel className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
              <span className="text-white font-semibold text-sm sm:text-base">Total Monthly Cost</span>
            </div>
            <span className="font-bold text-xl text-orange-300">
              ₹{totalMonthlyExpense.toLocaleString('en-IN', { maximumFractionDigits: 0 })}/mo
            </span>
          </div>
        </motion.div>
      )}

      {/* 20/4/10 Rule Check - Only show after car price is filled */}
      {carData.carPrice > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-xl"
        >
          <h4 className="text-white font-semibold mb-3 text-sm sm:text-base">Smart Finance Check</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/70 text-xs sm:text-sm">20% Down Payment</span>
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
              <span className="text-white/70 text-xs sm:text-sm">Max 4 Year Tenure</span>
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
                <span className="text-white/70 text-xs sm:text-sm">Max 10% of Income</span>
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
            <div className={`mt-4 p-3 rounded-xl ${
              isAffordable 
                ? 'bg-green-500/20 border border-green-400/30' 
                : 'bg-red-500/20 border border-red-400/30'
            }`}>
              <p className={`text-xs sm:text-sm font-semibold ${
                isAffordable ? 'text-green-400' : 'text-red-400'
              }`}>
                {isAffordable ? '✅ Car is Affordable!' : '⚠️ Car may be too expensive'}
              </p>
              {!isAffordable && (
                <p className="text-red-300 text-xs mt-1">
                  Consider adjusting your budget or loan terms
                </p>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* Detailed Breakdown */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7 }}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-xl"
      >
        <h4 className="text-white font-semibold mb-3 text-sm sm:text-base">Loan Details</h4>
        <div className="space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between">
            <span className="text-white/70">Interest Rate:</span>
            <span className="text-white">{carData.interestRate}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Tenure:</span>
            <span className="text-white">{carData.tenure} years</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Total Interest:</span>
            <span className="text-white">₹{totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
          </div>
        </div>
      </motion.div>

      {/* Ad Space for Monetization */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-md border border-blue-400/30 rounded-2xl p-4 shadow-xl"
      >
        <div className="text-center">
          <h5 className="text-white font-semibold text-sm mb-2">🎯 Sponsored</h5>
          <p className="text-white/80 text-xs mb-3">
            Get pre-approved car loans with instant approval
          </p>
          <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all">
            Apply Now
          </button>
        </div>
      </motion.div>
    </div>
  )
}