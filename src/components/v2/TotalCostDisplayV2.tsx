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

  const formatTenure = (tenureInYears: number) => {
    if (tenureInYears === 0) return '--'
    const years = Math.floor(tenureInYears)
    const months = Math.round((tenureInYears % 1) * 12)
    if (months === 0) {
      return `${years} years`
    } else {
      return `${years} years ${months} months`
    }
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


      {/* New Boxed Summary Format matching suggestions.txt */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/40 backdrop-blur-xl border-2 border-slate-600/30 text-gray-100 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header with completion status */}
        <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 border-b border-slate-600/30 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-bold text-lg">
              Car Summary
            </h3>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${completionPercentage === 100 ? 'bg-green-400' : completionPercentage >= 66 ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
              <span className="text-white font-bold">{completionPercentage}% Complete</span>
            </div>
          </div>
        </div>
        
        {/* Main Summary Content */}
        <div className="p-4 space-y-4">
          {/* EMI and Fuel Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2">
              <span className="text-white font-medium">EMI:</span>
              <span className="text-white font-bold text-lg">{formatCurrency(emi)}/mo</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-white font-medium">Fuel:</span>
              <span className="text-white font-bold text-lg">{formatCurrency(monthlyFuelCost)}/mo</span>
            </div>
          </div>

          
          {/* Total Monthly Outgo */}
          <div className="border-t border-slate-600/30 pt-3 mt-3">
            <div className="flex justify-between items-center py-2 bg-slate-700/30 rounded-lg px-3">
              <span className="text-white font-bold text-lg">Total Monthly Outgo:</span>
              <span className="text-white font-bold text-xl">{formatCurrency(totalMonthlyCarExpenses)}</span>
            </div>
          </div>

          
          {/* One-time Fees */}
          {(carData.insuranceAndMaintenance || 0) > 0 && (
            <div className="border-t border-slate-600/30 pt-3 mt-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-white font-medium">One-time Fees:</span>
                <span className="text-white font-bold">{formatCurrency(carData.insuranceAndMaintenance || 0)} (Insurance/Others)</span>
              </div>
            </div>
          )}
          
          {/* Loan Snapshot and Timeline Grid */}
          <div className="border-t border-slate-600/30 pt-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Loan Snapshot */}
              <div>
                <h4 className="text-white font-bold mb-3 flex items-center space-x-1">
                  <span>🔎</span>
                  <span>Loan Snapshot</span>
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Loan Amt:</span>
                    <span className="text-white font-bold">{formatCurrency(loanAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Tenure:</span>
                    <span className="text-white font-bold">{formatDuration()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Interest:</span>
                    <span className="text-white font-bold">{carData.interestRate}%</span>
                  </div>
                </div>
              </div>
              
              {/* Timeline */}
              <div>
                <h4 className="text-white font-bold mb-3 flex items-center space-x-1">
                  <span>📆</span>
                  <span>Timeline</span>
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Start:</span>
                    <span className="text-white font-bold">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">End:</span>
                    <span className="text-white font-bold">{getLastEMIDate()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* At a glance section */}
          <div className="border-t border-slate-600/30 pt-4 mt-4">
            <h4 className="text-white font-bold mb-3 flex items-center space-x-1">
              <span>💡</span>
              <span>At a glance:</span>
            </h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-white">•</span>
                <span className="text-gray-300">Total Interest:</span>
                <span className="text-white font-bold">{formatCurrency(totalInterest)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-white">•</span>
                <span className="text-gray-300">Total Payment:</span>
                <span className="text-white font-bold">{formatCurrency(totalPayment)}</span>
              </div>
            </div>
          </div>
          
          {/* Tenure toggle and fuel charge section */}
          <div className="border-t border-slate-600/30 pt-4 mt-4 space-y-3">
            {/* Tenure Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">Tenure Display:</span>
              <div className="flex bg-slate-700/50 rounded-lg p-1 border border-slate-600/50">
                <button
                  onClick={() => setDurationToggle('months')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                    durationToggle === 'months'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/30'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Months
                </button>
                <button
                  onClick={() => setDurationToggle('years')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                    durationToggle === 'years'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/30'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Years
                </button>
              </div>
            </div>
            
            {/* Add fuel charge option when not selected */}
            {(!carData.monthlyFuelExpense || carData.monthlyFuelExpense === 0) && (
              <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-400">⛽</span>
                    <span className="text-white font-medium">Add Fuel Charge</span>
                  </div>
                  <button className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 font-medium px-3 py-1 rounded-lg transition-all duration-200 text-sm">
                    + Add
                  </button>
                </div>
                <p className="text-gray-300 text-sm mt-1">Include monthly fuel costs for a complete picture</p>
              </div>
            )}
          </div>
        </div>
      </div>






    </div>
  )
}