'use client'

import { motion } from 'framer-motion'
import { CarData } from '@/app/page'
import { DollarSign, TrendingUp, Car, Fuel, CheckCircle, XCircle } from 'lucide-react'

interface TotalCostDisplayV3Props {
  carData: CarData
}

export default function TotalCostDisplayV3({ carData }: TotalCostDisplayV3Props) {
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
      <div className="text-center">
        <h3 className="text-lg sm:text-xl font-black text-black uppercase tracking-tight">Financial Summary</h3>
      </div>

      {/* Car Price - Always shown */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border-4 border-black p-4"
        style={{ boxShadow: '8px 8px 0px 0px #000000' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-black flex items-center justify-center">
              <Car className="w-3 h-3 text-white" />
            </div>
            <span className="text-black font-bold text-sm sm:text-base">Car Price</span>
          </div>
          <span className="font-black text-black text-base sm:text-lg">
            ₹{carData.carPrice.toLocaleString('en-IN')}
          </span>
        </div>
      </motion.div>

      {/* Down Payment - Always shown */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white border-4 border-black p-4"
        style={{ boxShadow: '8px 8px 0px 0px #000000' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-black flex items-center justify-center">
              <DollarSign className="w-3 h-3 text-white" />
            </div>
            <span className="text-black font-bold text-sm sm:text-base">Down Payment</span>
          </div>
          <div className="text-right">
            <span className="font-black text-black text-base sm:text-lg block">
              ₹{carData.downPayment.toLocaleString('en-IN')}
            </span>
            <span className="text-black text-xs font-bold">
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
        className="bg-white border-4 border-black p-4"
        style={{ boxShadow: '8px 8px 0px 0px #000000' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-black flex items-center justify-center">
              <TrendingUp className="w-3 h-3 text-white" />
            </div>
            <span className="text-black font-bold text-sm sm:text-base">Loan Amount</span>
          </div>
          <span className="font-black text-black text-base sm:text-lg">
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
          className="bg-yellow-400 border-4 border-black p-4"
          style={{ boxShadow: '8px 8px 0px 0px #000000' }}
        >
          <div className="text-center">
            <p className="text-black text-xs sm:text-sm mb-2 font-bold uppercase tracking-tight">Monthly EMI</p>
            <p className="font-black text-2xl sm:text-3xl text-black">
              ₹{emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </p>
            <p className="text-black text-xs sm:text-sm mt-2 font-bold uppercase tracking-tight">
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
          className="bg-white border-4 border-black p-4"
        style={{ boxShadow: '8px 8px 0px 0px #000000' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-black font-bold text-sm sm:text-base">Processing Fee</span>
            <span className="font-black text-red-600 text-base sm:text-lg">
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
          className="bg-orange-200 border-4 border-black p-4"
          style={{ boxShadow: '8px 8px 0px 0px #000000' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-black flex items-center justify-center">
                <Fuel className="w-3 h-3 text-white" />
              </div>
              <span className="text-black font-bold text-sm sm:text-base">Total Monthly Cost</span>
            </div>
            <span className="font-black text-xl text-black">
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
          className="bg-white border-4 border-black p-4"
        style={{ boxShadow: '8px 8px 0px 0px #000000' }}
        >
          <h4 className="text-black font-black mb-3 text-sm sm:text-base uppercase tracking-tight">Smart Finance Check</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-black font-semibold text-xs sm:text-sm">20% Down Payment</span>
              <div className="flex items-center space-x-2">
                <span className="text-xs sm:text-sm text-black font-bold">{downPaymentPercentage.toFixed(1)}%</span>
                <div className={`w-5 h-5 border-2 border-black flex items-center justify-center text-xs font-black ${
                  isDownPaymentOk ? 'bg-green-400' : 'bg-red-400'
                }`}>
                  {isDownPaymentOk ? '✓' : '✗'}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-black font-semibold text-xs sm:text-sm">Max 4 Year Tenure</span>
              <div className="flex items-center space-x-2">
                <span className="text-xs sm:text-sm text-black font-bold">{carData.tenure}y</span>
                <div className={`w-5 h-5 border-2 border-black flex items-center justify-center text-xs font-black ${
                  isTenureOk ? 'bg-green-400' : 'bg-red-400'
                }`}>
                  {isTenureOk ? '✓' : '✗'}
                </div>
              </div>
            </div>
            
            {/* Income check - only if monthly income provided */}
            {hasMonthlyIncome && (
              <div className="flex items-center justify-between">
                <span className="text-black font-semibold text-xs sm:text-sm">Max 10% of Income</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs sm:text-sm text-black font-bold">{expensePercentage.toFixed(1)}%</span>
                  <div className={`w-5 h-5 border-2 border-black flex items-center justify-center text-xs font-black ${
                    isExpenseOk ? 'bg-green-400' : 'bg-red-400'
                  }`}>
                    {isExpenseOk ? '✓' : '✗'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Overall affordability - only if all data available */}
          {hasMonthlyIncome && (
            <div className={`mt-4 p-3 border-4 border-black ${
              isAffordable ? 'bg-green-200' : 'bg-red-200'
            }`}
              style={{ boxShadow: '8px 8px 0px 0px #000000' }}>
              <p className={`text-xs sm:text-sm font-black uppercase tracking-tight ${
                isAffordable ? 'text-green-800' : 'text-red-800'
              }`}>
                {isAffordable ? '✅ Car is Affordable!' : '⚠️ Car may be too expensive'}
              </p>
              {!isAffordable && (
                <p className="text-red-800 text-xs font-bold mt-1">
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
        className="bg-white border-4 border-black p-4"
        style={{ boxShadow: '8px 8px 0px 0px #000000' }}
      >
        <h4 className="text-black font-black mb-3 text-sm sm:text-base uppercase tracking-tight">Loan Details</h4>
        <div className="space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between">
            <span className="text-black font-semibold">Interest Rate:</span>
            <span className="text-black font-bold">{carData.interestRate}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-black font-semibold">Tenure:</span>
            <span className="text-black font-bold">{carData.tenure} years</span>
          </div>
          <div className="flex justify-between">
            <span className="text-black font-semibold">Total Interest:</span>
            <span className="text-black font-bold">₹{totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}