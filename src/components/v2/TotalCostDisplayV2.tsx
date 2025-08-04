'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CarData } from '@/app/page'
import { TrendingUp, CheckCircle, XCircle, Zap, Percent, Clock, Info } from 'lucide-react'

interface TotalCostDisplayV2Props {
  carData: CarData
  updateCarData: (updates: Partial<CarData>) => void
}

export default function TotalCostDisplayV2({ carData, updateCarData }: TotalCostDisplayV2Props) {
  const [durationToggle, setDurationToggle] = useState<'months' | 'years'>('months')
  
  // Auto-turn on "Include in budget?" toggle when fuel cost is calculated
  const monthlyFuelCost = carData.kmPerMonth && carData.fuelCostPerLiter ? (carData.kmPerMonth / 15) * carData.fuelCostPerLiter : 0
  
  const calculateEMI = (principal: number, rate: number, years: number) => {
    if (principal <= 0 || rate <= 0 || years <= 0) return 0
    const monthlyRate = rate / (12 * 100)
    const months = years * 12
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
    return isNaN(emi) ? 0 : emi
  }

  // Safe calculation helpers
  const loanAmount = Math.max(0, carData.carPrice - carData.downPayment)
  const emi = carData.tenure > 0 ? calculateEMI(loanAmount, carData.interestRate, carData.tenure) : 0
  const totalInterest = carData.tenure > 0 && emi > 0 ? (emi * carData.tenure * 12) - loanAmount : 0
  const totalPayment = loanAmount + totalInterest
  
  // Monthly car expenses calculation for 20/4/10 rule
  // Including EMI and optionally fuel (insurance moved to one-time costs)
  const totalMonthlyCarExpenses = emi + (carData.includeFuelInAffordability ? monthlyFuelCost : 0)
  
  // 20/4/10 Rule Check - Only calculate when valid data is available
  const downPaymentPercentage = carData.carPrice > 0 ? (carData.downPayment / carData.carPrice) * 100 : 0
  const isDownPaymentOk = downPaymentPercentage >= 20
  const isTenureOk = carData.tenure > 0 && carData.tenure <= 4
  const expensePercentage = carData.monthlyIncome > 0 && totalMonthlyCarExpenses > 0 ? (totalMonthlyCarExpenses / carData.monthlyIncome) * 100 : 0
  const isExpenseOk = carData.monthlyIncome > 0 && totalMonthlyCarExpenses > 0 ? expensePercentage <= 10 : true
  const isAffordable = isDownPaymentOk && isTenureOk && isExpenseOk

  const formatCurrency = (value: number) => {
    if (isNaN(value) || !isFinite(value) || value < 0) return '₹0'
    return `₹${Math.round(value).toLocaleString('en-IN')}`
  }
  
  const formatPercentage = (value: number) => {
    if (isNaN(value) || !isFinite(value)) return '0.0'
    return value.toFixed(1)
  }
  const formatDuration = () => {
    if (carData.tenure === 0) return '--'
    return durationToggle === 'months' ? `${carData.tenure * 12} months` : `${carData.tenure} years`
  }

  const getLastEMIDate = () => {
    if (carData.tenure <= 0) return '--'
    const today = new Date()
    const lastEMIDate = new Date(today.getFullYear(), today.getMonth() + (carData.tenure * 12), today.getDate())
    return lastEMIDate.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
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
    (carData.insuranceAndMaintenance || 0) > 0
  ];
  const completionPercentage = Math.round((allFields.filter(Boolean).length / allFields.length) * 100);
  

  return (
    <div className="space-y-4">

      {/* Smart Purchase Score - Show at top when all required fields filled and valid calculations */}
      {isAllRequiredFieldsFilled && carData.carPrice > 0 && carData.tenure > 0 && emi > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative p-4 sm:p-6 rounded-xl sm:rounded-2xl border backdrop-blur-xl shadow-2xl mb-4 sm:mb-6 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] overflow-hidden ${
            isAffordable 
              ? 'bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-emerald-600/10 border-emerald-400/20 shadow-emerald-500/10' 
              : 'bg-gradient-to-br from-red-500/10 via-red-500/5 to-red-600/10 border-red-400/20 shadow-red-500/10'
          }`}
        >
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className={`absolute inset-0 bg-gradient-to-r ${isAffordable ? 'from-green-400 to-emerald-400' : 'from-red-400 to-red-500'}`}></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-2 sm:mb-3 gap-3">
              <div className="flex items-center space-x-2 min-w-0 flex-1">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shadow-md flex-shrink-0 ${
                  isAffordable 
                    ? 'bg-gradient-to-br from-green-500 to-emerald-500' 
                    : 'bg-gradient-to-br from-red-500 to-red-600'
                }`}>
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h5 className="font-bold text-white text-sm sm:text-base tracking-tight leading-tight">Affordability Score</h5>
                </div>
              </div>
              
              {/* Score badge without blinking */}
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs font-bold shadow-md transition-all duration-200 hover:scale-105 flex-shrink-0 ${
                  isAffordable 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border border-green-300/50' 
                    : 'bg-gradient-to-r from-red-500 to-red-600 text-white border border-red-300/50'
                }`}
              >
                <div className="flex items-center justify-center space-x-1">
                  {isAffordable ? (
                    <>
                      <CheckCircle className="w-3 h-3 flex-shrink-0" />
                      <span className="text-xs font-bold whitespace-nowrap leading-none">EXCELLENT</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3 flex-shrink-0" />
                      <span className="text-xs font-bold whitespace-nowrap leading-none">NEEDS REVIEW</span>
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
                    <span className="text-yellow-400 mr-1 font-bold">₹</span>
                    20% Down Payment
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-bold text-sm">{formatPercentage(downPaymentPercentage)}%</span>
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
                    <span className="text-white font-bold text-sm">{carData.tenure || 0}y</span>
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
                    <span className="text-white font-bold text-sm">{formatPercentage(expensePercentage)}%</span>
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
                ? 'Perfect! Your car purchase fits comfortably within your budget.' 
                : 'Try adjusting your down payment or loan term for a better fit.'
              }
            </p>
          </motion.div>
        </motion.div>
      )}


      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-white text-sm">Final Monthly Summary</h4>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${completionPercentage === 100 ? 'bg-green-400' : completionPercentage >= 66 ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
          <span className="text-sm font-bold text-white/80">{completionPercentage}% Complete</span>
        </div>
      </div>
      
      {/* Loan Summary - Compact Display */}
      <motion.div 
        className={`bg-gradient-to-br from-slate-800/40 to-slate-900/30 backdrop-blur-xl border border-slate-700/30 text-gray-100 p-6 rounded-2xl mb-6 shadow-2xl transition-all duration-300 hover:scale-[1.02] ${
          completionPercentage === 100 
            ? 'shadow-emerald-500/10 ring-1 ring-emerald-400/20' 
            : 'shadow-black/10 hover:shadow-black/20'
        }`}
        animate={completionPercentage === 100 ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 0.6, repeat: 0 }}
      >
        {/* Main EMI Display */}
        <div className="text-center mb-3 pb-3 border-b border-slate-700/40">
          <p className="text-sm text-gray-300 mb-1 font-medium">
            Monthly EMI {completionPercentage === 100 && '✨'}
          </p>
          <p className="text-3xl font-bold tracking-tight text-gray-100">{formatCurrency(emi)}</p>
          {monthlyFuelCost > 0 && carData.includeFuelInAffordability && (
            <div className="mt-2 pt-2 border-t border-slate-700/20">
              <p className="text-sm text-emerald-300 mb-1">Including Fuel Cost</p>
              <p className="text-2xl font-bold text-emerald-200">{formatCurrency(totalMonthlyCarExpenses)}</p>
              <p className="text-xs text-gray-400 mt-1">EMI ({formatCurrency(emi)}) + Fuel ({formatCurrency(monthlyFuelCost)})</p>
            </div>
          )}
          <p className="text-sm text-gray-400 mt-1">Ends: {getLastEMIDate()}</p>
        </div>

        {/* Fuel Cost Integration - Always show */}
        <div className="mb-3 pb-3 border-b border-slate-700/40">
          <div className="bg-slate-800/50 rounded-lg p-4 space-y-3 border border-slate-700/20">
            {monthlyFuelCost > 0 ? (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-200 font-medium">Fuel Cost</span>
                  <span className="font-semibold text-gray-100 text-base">{formatCurrency(monthlyFuelCost)}</span>
                </div>
                
                {/* Toggle for including fuel in budget */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-gray-200 font-medium">Include in budget?</span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${carData.includeFuelInAffordability ? 'text-gray-200' : 'text-gray-400'}`}>
                      {carData.includeFuelInAffordability ? 'ON' : 'OFF'}
                    </span>
                    <button
                      onClick={() => updateCarData({ includeFuelInAffordability: !carData.includeFuelInAffordability })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                        carData.includeFuelInAffordability ? 'bg-blue-500' : 'bg-gray-600'
                      }`}
                      role="switch"
                      aria-checked={carData.includeFuelInAffordability}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          carData.includeFuelInAffordability ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
                
                {/* Show processing fee below Include in budget? when filled */}
                {(carData.insuranceAndMaintenance || 0) > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-700/40">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Processing Fee + Insurance + Others</span>
                      <span className="font-semibold text-gray-100 text-sm">{formatCurrency(carData.insuranceAndMaintenance || 0)}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">*Not included in budget calculations</p>
                  </div>
                )}
                
              </>
            ) : (
              <div className="text-center py-4">
                <button 
                  onClick={() => {
                    // Scroll to the Monthly Running Cost section
                    const section = document.querySelector('[data-section="monthly-running-cost"]')
                    if (section) {
                      section.scrollIntoView({ behavior: 'smooth', block: 'center' })
                      // Add temporary fluorescent highlight
                      section.classList.add('!border-lime-400/80', '!shadow-lg', '!shadow-lime-400/40', '!bg-lime-400/20', 'transition-all', 'duration-300')
                      setTimeout(() => {
                        section.classList.remove('!border-lime-400/80', '!shadow-lg', '!shadow-lime-400/40', '!bg-lime-400/20', 'transition-all', 'duration-300')
                      }, 4000)
                    }
                  }}
                  className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 hover:text-cyan-200 rounded-lg cursor-pointer transition-colors duration-200 mb-2 border border-cyan-500/30"
                >
                  + Add Fuel Cost
                </button>
              </div>
            )}
            
            {/* Show percentage of income */}
            {carData.monthlyIncome > 0 && monthlyFuelCost > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-700/40">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">% of Income</span>
                  <span className={`text-sm font-bold ${expensePercentage <= 10 ? 'text-emerald-300' : 'text-red-300'}`}>
                    {formatPercentage(expensePercentage)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Compact Loan Details Grid - Reduced spacing */}
        <div className="grid grid-cols-3 gap-2 text-sm">
          {/* Period with toggle - Enhanced visibility */}
          <div className="flex flex-col items-center bg-slate-800/60 border border-slate-700/30 rounded-lg p-2">
            <div className="flex items-center mb-0.5">
              <Clock size={12} className="mr-1 text-cyan-300"/>
              <span className="text-gray-200 font-bold text-xs">Period</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="font-bold text-gray-100 text-sm">{formatDuration()}</span>
              <div className="flex bg-slate-700/50 rounded-full p-0.5">
                <button
                  onClick={() => setDurationToggle('years')}
                  className={`text-xs px-1.5 py-0.5 rounded-full transition-all duration-200 font-bold ${
                    durationToggle === 'years' 
                      ? 'bg-cyan-400 text-slate-800 shadow-sm' 
                      : 'text-gray-300 hover:bg-slate-600/50'
                  }`}
                >
                  Y
                </button>
                <button
                  onClick={() => setDurationToggle('months')}
                  className={`text-xs px-1.5 py-0.5 rounded-full transition-all duration-200 font-bold ${
                    durationToggle === 'months' 
                      ? 'bg-cyan-400 text-slate-800 shadow-sm' 
                      : 'text-gray-300 hover:bg-slate-600/50'
                  }`}
                >
                  M
                </button>
              </div>
            </div>
          </div>

          {/* Interest Rate */}
          <div className="flex flex-col items-center bg-slate-800/60 border border-slate-700/30 rounded-lg p-2">
            <div className="flex items-center mb-0.5">
              <Percent size={12} className="mr-1 text-red-300"/>
              <span className="text-gray-200 font-bold text-xs">Interest</span>
            </div>
            <span className="font-bold text-gray-100 text-sm">{carData.interestRate}%</span>
          </div>

          {/* Total Payment - Made bigger and more visible as 3rd column */}
          <div className="flex flex-col items-center bg-gradient-to-br from-purple-600/40 to-purple-500/30 border-2 border-purple-400/50 rounded-lg p-3 shadow-lg">
            <div className="flex items-center mb-1">
              <span className="text-purple-200 mr-1 font-bold text-sm">₹</span>
              <span className="text-purple-100 font-bold text-sm">Total Payment</span>
            </div>
            <span className="font-bold text-purple-100 text-lg">{formatCurrency(totalPayment)}</span>
            <span className="text-purple-200 text-xs mt-1">Principal + Interest</span>
          </div>
        </div>

        {/* Second row for Interest Cost - Reduced spacing */}
        <div className="grid grid-cols-1 gap-2 text-sm mt-2">
          <div className="flex flex-col items-center bg-slate-800/60 border border-slate-700/30 rounded-lg p-2">
            <div className="flex items-center mb-0.5">
              <TrendingUp size={12} className="mr-1 text-yellow-300"/>
              <span className="text-gray-200 font-bold text-xs">Interest Cost</span>
            </div>
            <span className="font-bold text-gray-100 text-sm">{formatCurrency(totalInterest)}</span>
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



      {/* Additional Info - Compact */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-3 p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-xs text-white/70 shadow-xl hover:shadow-2xl hover:bg-white/10 transition-all duration-300 group"
      >
        <div className="flex items-start space-x-2">
          <div className="flex-shrink-0 w-5 h-5 bg-white/10 rounded-full flex items-center justify-center mt-0.5 group-hover:bg-white/20 transition-colors">
            <Info size={10} className="text-white/50" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-white/80 mb-0.5 text-xs">Important Note</p>
            <p className="text-white/60 leading-relaxed text-xs">
              Calculations are indicative. Actual rates may vary by lender and credit profile.
            </p>
          </div>
        </div>
      </motion.div>


    </div>
  )
}