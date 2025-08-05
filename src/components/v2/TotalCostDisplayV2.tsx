'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CarData } from '@/app/page'
import { TrendingUp, CheckCircle, XCircle, Percent, Clock, Info } from 'lucide-react'

interface TotalCostDisplayV2Props {
  carData: CarData
  updateCarData: (updates: Partial<CarData>) => void
}

export default function TotalCostDisplayV2({ carData, updateCarData: _updateCarData }: TotalCostDisplayV2Props) {
  const [durationToggle, setDurationToggle] = useState<'months' | 'years'>('months')
  
  // Use monthly fuel expense from form input
  const monthlyFuelCost = carData.monthlyFuelExpense || 0
  
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
  // Including EMI and fuel when available (insurance moved to one-time costs)
  const totalMonthlyCarExpenses = emi + monthlyFuelCost
  
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
    (carData.insuranceAndMaintenance || 0) > 0,
    (carData.monthlyFuelExpense || 0) > 0
  ];
  const completionPercentage = Math.round((allFields.filter(Boolean).length / allFields.length) * 100);
  

  return (
    <div className="space-y-3">

      {/* Smart Purchase Score - Always show, but with empty state when required fields not filled */}
        <div 
          className={`relative p-3 sm:p-4 rounded-lg sm:rounded-xl border backdrop-blur-xl shadow-xl mb-3 sm:mb-4 transition-all duration-300 hover:shadow-xl hover:scale-[1.01] overflow-hidden ${
            !isAllRequiredFieldsFilled || carData.carPrice <= 0 || carData.tenure <= 0 || emi <= 0
              ? 'bg-gradient-to-br from-gray-500/10 via-gray-500/5 to-gray-600/10 border-gray-400/20 shadow-gray-500/10'
              : isAffordable 
                ? 'bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-emerald-600/10 border-emerald-400/20 shadow-emerald-500/10' 
                : 'bg-gradient-to-br from-red-500/10 via-red-500/5 to-red-600/10 border-red-400/20 shadow-red-500/10'
          }`}
        >
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className={`absolute inset-0 bg-gradient-to-r ${
              !isAllRequiredFieldsFilled || carData.carPrice <= 0 || carData.tenure <= 0 || emi <= 0
                ? 'from-gray-400 to-gray-500'
                : isAffordable ? 'from-green-400 to-emerald-400' : 'from-red-400 to-red-500'
            }`}></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-2 gap-2">
              <div className="flex items-center space-x-2 min-w-0 flex-1">
                <div className="min-w-0 flex-1">
                  <h5 className="font-bold text-white text-sm sm:text-base tracking-tight leading-tight">Can you afford?</h5>
                </div>
              </div>
              
              {/* Score display - YES/NO in big text */}
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center">
                  {!isAllRequiredFieldsFilled || carData.carPrice <= 0 || carData.tenure <= 0 || emi <= 0 ? (
                    <span className="text-3xl font-bold text-gray-400 leading-none">--</span>
                  ) : isAffordable ? (
                    <span className="text-3xl font-bold text-green-400 leading-none">YES</span>
                  ) : (
                    <span className="text-3xl font-bold text-red-400 leading-none">NO</span>
                  )}
                </div>
              </div>
            </div>
          
            {/* Compact rule indicators */}
            <div className="space-y-1 text-sm">
              {/* 20% Down Payment Rule */}
              <div 
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
                  <div 
                    style={{ width: `${Math.min(downPaymentPercentage, 100)}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${
                      isDownPaymentOk ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-red-400 to-red-500'
                    }`}
                  />
                </div>
              </div>
              
              {/* 4 Year Tenure Rule */}
              <div 
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
                  <div 
                    style={{ width: `${(carData.tenure / 7) * 100}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${
                      isTenureOk ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-red-400 to-red-500'
                    }`}
                  />
                </div>
              </div>
              
              {/* 10% Income Rule */}
              <div 
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
                  <div 
                    style={{ width: `${Math.min(expensePercentage, 100)}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${
                      isExpenseOk ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-red-400 to-red-500'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>


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
        {/* Main EMI Display - Proportional UX */}
        <div className="text-center mb-4">
          {/* Primary EMI Section */}
          <div className="mb-3">
            <h3 className="text-sm font-medium text-gray-300 mb-1 tracking-wide">
              Monthly EMI {completionPercentage === 100 && '✨'}
            </h3>
            <div className="text-3xl font-bold text-white mb-2 tracking-tight">
              {formatCurrency(emi)}
            </div>
          </div>

          {/* Fuel Cost Integration - Compact */}
          {monthlyFuelCost > 0 ? (
            <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-400/30 rounded-xl p-3 mb-3">
              <h3 className="text-sm font-medium text-emerald-300 mb-1 tracking-wide">Overall Monthly Expense</h3>
              <div className="text-3xl font-bold text-emerald-100 mb-3 tracking-tight">
                {formatCurrency(totalMonthlyCarExpenses)}
              </div>
              <div className="bg-emerald-500/10 rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-emerald-200 font-medium text-sm">EMI</span>
                  <span className="font-bold text-emerald-100 text-lg">{formatCurrency(emi)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-200 font-medium text-sm">Fuel</span>
                  <span className="font-bold text-emerald-100 text-lg">{formatCurrency(monthlyFuelCost)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/20 rounded-xl p-3 mb-3">
              <button
                onClick={() => {
                  const fuelExpenseElement = document.getElementById('monthly-fuel-expense');
                  if (fuelExpenseElement) {
                    fuelExpenseElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => {
                      const input = fuelExpenseElement.querySelector('input');
                      if (input) input.focus();
                    }, 500);
                  }
                }}
                className="w-full p-2 text-cyan-300 hover:text-cyan-200 transition-all duration-200 cursor-pointer bg-cyan-500/10 hover:bg-cyan-500/20 rounded-lg border border-cyan-400/20 hover:border-cyan-400/40 outline-none"
              >
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-xs font-medium">+ Add Fuel Expense</span>
                </div>
                <p className="text-xs text-cyan-400/80 mt-1">Get your complete monthly car cost</p>
              </button>
            </div>
          )}

          {/* Insurance + Others - One-time cost */}
          {(carData.insuranceAndMaintenance || 0) > 0 && (
            <div className="bg-blue-500/10 border border-blue-400/20 rounded-lg p-3 mb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Info size={14} className="text-blue-300"/>
                  </div>
                  <div>
                    <div className="text-blue-100 font-semibold text-sm">Insurance + Others</div>
                    <div className="text-blue-300 text-xs">One-time additional costs</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-100">{formatCurrency(carData.insuranceAndMaintenance || 0)}</div>
                </div>
              </div>
            </div>
          )}

        </div>


        {/* Loan Details - Compact Layout */}
        <div className="border-t border-slate-700/30 pt-3">
          <h4 className="text-gray-200 font-medium mb-3 text-sm tracking-wide">Loan Breakdown</h4>
          
          {/* Loan Duration Info */}
          <div className="bg-slate-500/10 border border-slate-400/20 rounded-lg p-3 mb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-slate-500/20 rounded-full flex items-center justify-center">
                  <Clock size={14} className="text-slate-300"/>
                </div>
                <div>
                  <div className="text-slate-100 font-semibold text-sm">Loan Duration</div>
                  <div className="text-slate-300 text-xs">Loan completion date</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-slate-100">{getLastEMIDate()}</div>
              </div>
            </div>
          </div>

          {/* Loan Period */}
          <div className="bg-cyan-500/10 border border-cyan-400/20 rounded-lg p-3 mb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center">
                  <Clock size={14} className="text-cyan-300"/>
                </div>
                <div>
                  <div className="text-cyan-100 font-semibold text-sm">Loan Period</div>
                  <div className="text-cyan-300 text-xs">Repayment duration</div>
                </div>
              </div>
              <div className="text-right flex items-center space-x-2">
                <div className="text-lg font-bold text-cyan-100">
                  {durationToggle === 'months' ? `${carData.tenure * 12}m` : `${carData.tenure}y`}
                </div>
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
          </div>

          {/* Interest Rate */}
          <div className="bg-red-500/10 border border-red-400/20 rounded-lg p-3 mb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                  <Percent size={14} className="text-red-300"/>
                </div>
                <div>
                  <div className="text-red-100 font-semibold text-sm">Interest Rate</div>
                  <div className="text-red-300 text-xs">Annual percentage rate</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-red-100">{carData.interestRate}%</div>
              </div>
            </div>
          </div>

          {/* Principal Amount */}
          <div className="bg-green-500/10 border border-green-400/20 rounded-lg p-3 mb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <span className="text-green-300 font-bold text-sm">₹</span>
                </div>
                <div>
                  <div className="text-green-100 font-semibold text-sm">Principal Amount</div>
                  <div className="text-green-300 text-xs">Loan amount after down payment</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-100">{formatCurrency(loanAmount)}</div>
              </div>
            </div>
          </div>

          {/* Interest Cost */}  
          <div className="bg-yellow-500/10 border border-yellow-400/20 rounded-lg p-3 mb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <TrendingUp size={14} className="text-yellow-300"/>
                </div>
                <div>
                  <div className="text-yellow-100 font-semibold text-sm">Total Interest</div>
                  <div className="text-yellow-300 text-xs">Amount paid over principal</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-yellow-100">{formatCurrency(totalInterest)}</div>
              </div>
            </div>
          </div>

          {/* Total Payment - Compact */}
          <div className="bg-gradient-to-br from-purple-600/30 to-indigo-600/30 border border-purple-400/40 rounded-lg p-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-500/30 rounded-full flex items-center justify-center">
                  <span className="text-purple-200 font-bold text-sm">₹</span>
                </div>
                <div>
                  <div className="text-purple-100 font-bold text-base">Total Payment</div>
                  <div className="text-purple-300 text-xs">Principal + Interest</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-purple-100">{formatCurrency(totalPayment)}</div>
                <div className="text-purple-300 text-xs mt-0.5">Over {formatDuration()}</div>
              </div>
            </div>
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






    </div>
  )
}