'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CarData } from '@/app/page'
import { DollarSign, TrendingUp, Car, Fuel, CheckCircle, XCircle, Zap, Percent, Clock, Info } from 'lucide-react'

interface TotalCostDisplayV2Props {
  carData: CarData
}

export default function TotalCostDisplayV2({ carData }: TotalCostDisplayV2Props) {
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
  
  // Monthly car expenses calculation for 20/4/10 rule
  // Including EMI and fuel only (insurance moved to one-time costs)
  const totalMonthlyCarExpenses = emi + monthlyFuelCost
  
  // 20/4/10 Rule Check
  const downPaymentPercentage = carData.carPrice > 0 ? (carData.downPayment / carData.carPrice) * 100 : 0
  const isDownPaymentOk = downPaymentPercentage >= 20
  const isTenureOk = carData.tenure <= 4
  const expensePercentage = carData.monthlyIncome > 0 ? (totalMonthlyCarExpenses / carData.monthlyIncome) * 100 : 0
  const isExpenseOk = carData.monthlyIncome > 0 ? expensePercentage <= 10 : true
  const isAffordable = isDownPaymentOk && isTenureOk && isExpenseOk

  const formatCurrency = (value: number) => `₹${Math.round(value).toLocaleString('en-IN')}`
  const formatDuration = () => {
    return durationToggle === 'months' ? `${carData.tenure * 12} months` : `${carData.tenure} years`
  }

  // Calculate completion of required fields for Smart Purchase Score
  const requiredFields = [
    carData.carPrice > 0,
    carData.downPayment >= 0,
    carData.monthlyIncome > 0
  ];
  const isAllRequiredFieldsFilled = requiredFields.every(Boolean);
  
  // Calculate completion percentage for all fields
  const allFields = [
    carData.carPrice > 0,
    carData.downPayment >= 0,
    carData.monthlyIncome > 0,
    carData.kmPerMonth > 0,
    carData.fuelCostPerLiter > 0,
    carData.insuranceAndMaintenance > 0
  ];
  const completionPercentage = Math.round((allFields.filter(Boolean).length / allFields.length) * 100);
  

  return (
    <div className="space-y-4">
      {/* Smart Purchase Score - Show at top when all required fields filled */}
      {isAllRequiredFieldsFilled && carData.carPrice > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative p-3 sm:p-4 rounded-lg sm:rounded-xl border backdrop-blur-md shadow-lg mb-3 sm:mb-4 transition-all duration-300 hover:shadow-xl hover:scale-[1.01] overflow-hidden ${
            isAffordable 
              ? 'bg-gradient-to-br from-green-50/15 via-emerald-50/10 to-green-100/15 border-green-200/30 shadow-green-500/20' 
              : 'bg-gradient-to-br from-red-50/15 via-red-50/10 to-red-100/15 border-red-200/30 shadow-red-500/20'
          }`}
        >
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className={`absolute inset-0 bg-gradient-to-r ${isAffordable ? 'from-green-400 to-emerald-400' : 'from-red-400 to-red-500'}`}></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="flex items-center space-x-2">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shadow-md ${
                  isAffordable 
                    ? 'bg-gradient-to-br from-green-500 to-emerald-500' 
                    : 'bg-gradient-to-br from-red-500 to-red-600'
                }`}>
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <div>
                  <h5 className="font-bold text-white text-base sm:text-lg tracking-tight">Smart Purchase Score</h5>
                  <p className="text-white/70 text-xs">20/4/10 Financial Rule</p>
                </div>
              </div>
              
              {/* Score badge without blinking */}
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg text-xs font-bold shadow-md transition-all duration-200 hover:scale-105 ${
                  isAffordable 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border border-green-300/50' 
                    : 'bg-gradient-to-r from-red-500 to-red-600 text-white border border-red-300/50'
                }`}
              >
                <div className="flex items-center space-x-1">
                  {isAffordable ? (
                    <>
                      <CheckCircle className="w-3 h-3" />
                      <span>EXCELLENT</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3" />
                      <span>NEEDS REVIEW</span>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          
            {/* Compact rule indicators */}
            <div className="space-y-1.5 sm:space-y-2 text-sm">
              {/* 20% Down Payment Rule */}
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className={`relative p-2 sm:p-3 rounded-md sm:rounded-lg border transition-all duration-300 hover:scale-[1.01] ${
                  isDownPaymentOk 
                    ? 'bg-slate-100/10 border-green-200/30 hover:bg-slate-100/15' 
                    : 'bg-slate-100/10 border-red-200/30 hover:bg-slate-100/15'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white/90 font-medium flex items-center text-sm">
                    <DollarSign className="w-3 h-3 mr-1 text-yellow-400" />
                    20% Down Payment
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-bold text-sm">{downPaymentPercentage.toFixed(1)}%</span>
                    {isDownPaymentOk ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                </div>
                <div className="w-full bg-white/15 rounded-full h-1.5 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(downPaymentPercentage, 100)}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={`h-full rounded-full ${
                      isDownPaymentOk ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-red-400 to-red-500'
                    }`}
                  />
                </div>
              </motion.div>
              
              {/* 4 Year Tenure Rule */}
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`relative p-2 sm:p-3 rounded-md sm:rounded-lg border transition-all duration-300 hover:scale-[1.01] ${
                  isTenureOk 
                    ? 'bg-slate-100/10 border-green-200/30 hover:bg-slate-100/15' 
                    : 'bg-slate-100/10 border-red-200/30 hover:bg-slate-100/15'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white/90 font-medium flex items-center text-sm">
                    <Clock className="w-3 h-3 mr-1 text-blue-400" />
                    Max 4 Years
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-bold text-sm">{carData.tenure}y</span>
                    {isTenureOk ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                </div>
                <div className="w-full bg-white/15 rounded-full h-1.5 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(carData.tenure / 7) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className={`h-full rounded-full ${
                      isTenureOk ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-red-400 to-red-500'
                    }`}
                  />
                </div>
              </motion.div>
              
              {/* 10% Income Rule */}
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={`relative p-2 sm:p-3 rounded-md sm:rounded-lg border transition-all duration-300 hover:scale-[1.01] ${
                  isExpenseOk 
                    ? 'bg-slate-100/10 border-green-200/30 hover:bg-slate-100/15' 
                    : 'bg-slate-100/10 border-red-200/30 hover:bg-slate-100/15'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white/90 font-medium flex items-center text-sm">
                    <Percent className="w-3 h-3 mr-1 text-purple-400" />
                    Max 10% Income
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-bold text-sm">{expensePercentage.toFixed(1)}%</span>
                    {isExpenseOk ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                </div>
                <div className="w-full bg-white/15 rounded-full h-1.5 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(expensePercentage, 100)}%` }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className={`h-full rounded-full ${
                      isExpenseOk ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-red-400 to-red-500'
                    }`}
                  />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Compact recommendation message */}
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`mt-2 sm:mt-3 p-2 sm:p-3 rounded-md sm:rounded-lg text-center backdrop-blur-md border transition-all duration-300 hover:scale-[1.01] ${
              isAffordable 
                ? 'bg-slate-100/10 border-green-200/30 text-green-100' 
                : 'bg-slate-100/10 border-red-200/30 text-red-100'
            }`}
          >
            <div className="flex items-center justify-center mb-1">
              {isAffordable ? (
                <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              ) : (
                <XCircle className="w-4 h-4 text-red-400 mr-2" />
              )}
              <p className="font-bold text-sm">
                {isAffordable ? 'Excellent Choice!' : 'Needs Review'}
              </p>
            </div>
            <p className="font-medium text-xs leading-relaxed text-white/80">
              {isAffordable 
                ? 'This purchase aligns with the 20/4/10 rule - smart financing!' 
                : 'Consider adjusting terms for better financial health'
              }
            </p>
          </motion.div>
        </motion.div>
      )}


      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-white text-sm">Smart Loan Insights</h4>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${completionPercentage === 100 ? 'bg-green-400' : completionPercentage >= 66 ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
          <span className="text-xs text-white/70">{completionPercentage}% Complete</span>
        </div>
      </div>
      
      {/* Loan Summary - Compact Display */}
      <motion.div 
        className={`bg-gradient-to-br from-slate-50/10 to-slate-100/5 backdrop-blur-md border border-white/10 text-white p-4 rounded-xl mb-4 shadow-lg transition-all duration-300 hover:scale-[1.01] ${
          completionPercentage === 100 
            ? 'shadow-emerald-500/20 ring-1 ring-emerald-400/30' 
            : 'shadow-black/20 hover:shadow-black/30'
        }`}
        animate={completionPercentage === 100 ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 0.6, repeat: 0 }}
      >
        {/* Main EMI Display */}
        <div className="text-center mb-3 pb-3 border-b border-white/30">
          <p className="text-xs text-white/70 mb-1 font-medium">
            Monthly EMI {completionPercentage === 100 && '✨'}
          </p>
          <p className="text-2xl font-bold tracking-tight text-white">{formatCurrency(emi)}</p>
        </div>

        {/* Compact Loan Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          {/* Period with toggle */}
          <div className="flex flex-col items-center bg-white/15 border border-white/20 rounded-lg p-2">
            <div className="flex items-center mb-1">
              <Clock size={12} className="mr-1 text-cyan-300"/>
              <span className="text-white/90 font-medium">Period</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-white">{formatDuration()}</span>
              <div className="flex bg-white/25 rounded-full p-0.5">
                <button
                  onClick={() => setDurationToggle('years')}
                  className={`text-xs px-1.5 py-0.5 rounded-full transition-all duration-200 font-medium ${
                    durationToggle === 'years' 
                      ? 'bg-white text-slate-700 shadow-sm' 
                      : 'text-white/80 hover:bg-white/30'
                  }`}
                >
                  Y
                </button>
                <button
                  onClick={() => setDurationToggle('months')}
                  className={`text-xs px-1.5 py-0.5 rounded-full transition-all duration-200 font-medium ${
                    durationToggle === 'months' 
                      ? 'bg-white text-slate-700 shadow-sm' 
                      : 'text-white/80 hover:bg-white/30'
                  }`}
                >
                  M
                </button>
              </div>
            </div>
          </div>

          {/* Interest Rate */}
          <div className="flex flex-col items-center bg-white/15 border border-white/20 rounded-lg p-2">
            <div className="flex items-center mb-1">
              <Percent size={12} className="mr-1 text-red-300"/>
              <span className="text-white/90 font-medium">Interest</span>
            </div>
            <span className="font-bold text-white">{carData.interestRate}%</span>
          </div>

          {/* Interest Cost */}
          <div className="flex flex-col items-center bg-white/15 border border-white/20 rounded-lg p-2">
            <div className="flex items-center mb-1">
              <TrendingUp size={12} className="mr-1 text-yellow-300"/>
              <span className="text-white/90 font-medium">Interest Cost</span>
            </div>
            <span className="font-bold text-white">{formatCurrency(totalInterest)}</span>
          </div>

          {/* Total Payment */}
          <div className="flex flex-col items-center bg-white/15 border border-white/20 rounded-lg p-2">
            <div className="flex items-center mb-1">
              <DollarSign size={12} className="mr-1 text-purple-300"/>
              <span className="text-white/90 font-medium">Total Payment</span>
            </div>
            <span className="font-bold text-white">{formatCurrency(totalPayment)}</span>
          </div>
        </div>

        {/* Processing Fee - One-time cost */}
        {carData.processingFee > 0 && (
          <div className="mt-3 pt-3 border-t border-white/20">
            <div className="flex justify-between items-center bg-orange-500/30 backdrop-blur-md rounded-lg p-2">
              <span className="text-xs text-orange-100 flex items-center font-medium">
                <Info size={12} className="mr-1 text-orange-200"/>
                Processing Fee
                <span className="ml-1 text-xs text-orange-200 bg-orange-500/40 px-1.5 py-0.5 rounded-full">one-time</span>
              </span>
              <span className="font-bold text-orange-100 text-sm">{formatCurrency(carData.processingFee)}</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Monthly Car Expenses */}
      <div className="mb-4">
        <h5 className="font-semibold text-white mb-2 text-sm">Monthly Car Expenses</h5>
        <div className="bg-blue-500/20 backdrop-blur-md border border-blue-400/30 p-3 rounded-lg shadow-lg hover:shadow-xl hover:bg-blue-500/25 transition-all duration-300">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-xs text-blue-200">EMI Payment</span>
              <span className="font-semibold text-blue-200 text-sm">{formatCurrency(emi)}</span>
            </div>
            {monthlyFuelCost > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-blue-200">Fuel Cost</span>
                <span className="font-semibold text-blue-200 text-sm">{formatCurrency(monthlyFuelCost)}</span>
              </div>
            )}
            <div className="border-t border-blue-400/20 pt-1.5">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-blue-100">Total Monthly Cost</span>
                <span className="font-bold text-base text-blue-100">{formatCurrency(totalMonthlyCarExpenses)}</span>
              </div>
            </div>
            {carData.monthlyIncome > 0 && (
              <div className="mt-1 pt-1 border-t border-blue-400/20">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-blue-300">% of Income</span>
                  <span className={`text-xs font-bold ${expensePercentage <= 10 ? 'text-green-300' : 'text-red-300'}`}>
                    {expensePercentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            )}
          </div>
          <p className="text-xs text-blue-300 mt-2 opacity-80">
            *Insurance & maintenance costs moved to one-time costs section
          </p>
        </div>
      </div>

      {/* One-time Costs */}
      {carData.insuranceAndMaintenance > 0 && (
        <div className="mb-4">
          <h5 className="font-semibold text-white mb-2 text-sm">One-time Costs</h5>
          <div className="bg-purple-500/20 backdrop-blur-md border border-purple-400/30 p-3 rounded-lg shadow-lg hover:shadow-xl hover:bg-purple-500/25 transition-all duration-300">
            <div className="flex justify-between items-center">
              <span className="text-xs text-purple-200">Insurance & Other Costs</span>
              <span className="font-semibold text-purple-200 text-sm">{formatCurrency(carData.insuranceAndMaintenance)}</span>
            </div>
            <p className="text-xs text-purple-300 mt-2 opacity-80">
              *Processing fees, insurance premiums and other upfront costs
            </p>
          </div>
        </div>
      )}


      {/* Additional Info - Compact */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-3 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-xs text-white/80 shadow-md hover:shadow-lg hover:bg-white/15 transition-all duration-300 group"
      >
        <div className="flex items-start space-x-2">
          <div className="flex-shrink-0 w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center mt-0.5 group-hover:bg-blue-500/30 transition-colors">
            <Info size={10} className="text-blue-400" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-white mb-0.5 text-xs">Important Note</p>
            <p className="text-white/70 leading-relaxed text-xs">
              Calculations are indicative. Actual rates may vary by lender and credit profile.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}