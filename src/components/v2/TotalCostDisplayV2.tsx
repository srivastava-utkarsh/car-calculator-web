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
  
  // Comprehensive monthly car expenses calculation for 20/4/10 rule
  // Including EMI, fuel, insurance (user input) as per best practices
  const totalMonthlyCarExpenses = emi + monthlyFuelCost + (carData.insuranceAndMaintenance || 0)
  
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

  // Calculate completion percentage
  const completionFields = [
    carData.carPrice > 0,
    carData.downPayment >= 0,
    carData.monthlyIncome > 0,
    carData.kmPerMonth > 0,
    carData.fuelCostPerLiter > 0,
    carData.insuranceAndMaintenance > 0
  ];
  const completionPercentage = Math.round((completionFields.filter(Boolean).length / completionFields.length) * 100);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-white text-sm">Smart Loan Insights</h4>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${completionPercentage === 100 ? 'bg-green-400' : completionPercentage >= 66 ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
          <span className="text-xs text-white/70">{completionPercentage}% Complete</span>
        </div>
      </div>
      
      {/* Monthly EMI - Compact Display */}
      <motion.div 
        className={`bg-gradient-to-r from-emerald-600 to-cyan-600 text-white p-4 rounded-xl mb-4 text-center shadow-xl transition-all duration-300 hover:scale-[1.01] ${
          completionPercentage === 100 
            ? 'shadow-emerald-500/40 ring-2 ring-emerald-400/50' 
            : 'shadow-emerald-500/20 hover:shadow-emerald-500/30'
        }`}
        animate={completionPercentage === 100 ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 0.6, repeat: 0 }}
      >
        <p className="text-xs text-emerald-100 mb-1 font-medium">
          Monthly EMI {completionPercentage === 100 && '✨'}
        </p>
        <p className="text-2xl font-bold tracking-tight">{formatCurrency(emi)}</p>
      </motion.div>

      {/* Compact Metrics */}
      <div className="space-y-2 mb-4">
        {/* Duration with Year/Month Options */}
        <div className="flex justify-between items-center bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-lg shadow-md hover:shadow-lg hover:bg-white/15 transition-all duration-300 group">
          <span className="text-xs text-white/80 flex items-center group-hover:text-white transition-colors">
            <Clock size={14} className="mr-1.5 text-cyan-400"/>Period
          </span>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-white text-sm">{formatDuration()}</span>
            <div className="flex bg-white/10 rounded-full p-0.5 shadow-inner">
              <button
                onClick={() => setDurationToggle('years')}
                className={`text-xs px-2 py-1 rounded-full transition-all duration-200 font-medium min-w-[36px] ${
                  durationToggle === 'years' 
                    ? 'bg-emerald-500 text-white shadow-sm transform scale-105' 
                    : 'text-emerald-300 hover:bg-white/15 hover:text-white'
                }`}
              >
                Y
              </button>
              <button
                onClick={() => setDurationToggle('months')}
                className={`text-xs px-2 py-1 rounded-full transition-all duration-200 font-medium min-w-[36px] ${
                  durationToggle === 'months' 
                    ? 'bg-emerald-500 text-white shadow-sm transform scale-105' 
                    : 'text-emerald-300 hover:bg-white/15 hover:text-white'
                }`}
              >
                M
              </button>
            </div>
          </div>
        </div>

        {/* Interest Rate */}
        <div className="flex justify-between items-center bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-lg shadow-md hover:shadow-lg hover:bg-white/15 transition-all duration-300 group">
          <span className="text-xs text-white/80 flex items-center group-hover:text-white transition-colors">
            <Percent size={14} className="mr-1.5 text-red-400"/>Interest
          </span>
          <span className="font-semibold text-white text-sm">{carData.interestRate}% p.a.</span>
        </div>

        {/* Total Interest */}
        <div className="flex justify-between items-center bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-lg shadow-md hover:shadow-lg hover:bg-white/15 transition-all duration-300 group">
          <span className="text-xs text-white/80 flex items-center group-hover:text-white transition-colors">
            <TrendingUp size={14} className="mr-1.5 text-yellow-400"/>Interest Cost
          </span>
          <span className="font-semibold text-white text-sm">{formatCurrency(totalInterest)}</span>
        </div>

        {/* Final Payment Amount */}
        <div className="flex justify-between items-center bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-lg shadow-md hover:shadow-lg hover:bg-white/15 transition-all duration-300 group">
          <span className="text-xs text-white/80 flex items-center group-hover:text-white transition-colors">
            <DollarSign size={14} className="mr-1.5 text-purple-400"/>Total Payment
          </span>
          <span className="font-semibold text-white text-sm">{formatCurrency(totalPayment)}</span>
        </div>

        {/* Processing Fee - One-time cost */}
        {carData.processingFee > 0 && (
          <div className="flex justify-between items-center bg-orange-500/20 backdrop-blur-md border border-orange-400/30 p-2 rounded-lg shadow-md hover:shadow-lg hover:bg-orange-500/25 transition-all duration-300 group">
            <span className="text-xs text-orange-200 flex items-center group-hover:text-orange-100 transition-colors">
              <Info size={14} className="mr-1.5 text-orange-400"/>Processing Fee
              <span className="ml-1 text-xs text-orange-300 bg-orange-500/30 px-1.5 py-0.5 rounded-full">one-time</span>
            </span>
            <span className="font-semibold text-orange-200 group-hover:text-orange-100 transition-colors text-sm">{formatCurrency(carData.processingFee)}</span>
          </div>
        )}
      </div>

      {/* Comprehensive Monthly Car Expenses */}
      <div className="mb-4">
        <h5 className="font-semibold text-white mb-2 text-sm">Total Monthly Car Expenses</h5>
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
            {carData.insuranceAndMaintenance > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-blue-200">Insurance & Maintenance</span>
                <span className="font-semibold text-blue-200 text-sm">{formatCurrency(carData.insuranceAndMaintenance)}</span>
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
            {completionPercentage === 100 
              ? '*Comprehensive calculation includes all major costs' 
              : '*Add missing details for accurate calculation'
            }
          </p>
        </div>
      </div>

      {/* Enhanced 20/4/10 Rule Check - Compact */}
      {carData.carPrice > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-xl border backdrop-blur-md shadow-lg mb-4 transition-all duration-300 hover:shadow-xl hover:scale-[1.01] ${
            isAffordable 
              ? 'bg-green-500/20 border-green-400/40 shadow-green-500/20 hover:shadow-green-500/30' 
              : 'bg-red-500/20 border-red-400/40 shadow-red-500/20 hover:shadow-red-500/30'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-bold text-white flex items-center text-sm">
              <Zap className="w-4 h-4 mr-1.5 text-yellow-400" />
              Smart Purchase Score
            </h5>
            <div className={`px-2 py-1 rounded-full text-xs font-bold shadow-sm transition-all duration-200 hover:scale-105 ${
              isAffordable 
                ? 'bg-green-500/40 text-green-200 border border-green-400/50' 
                : 'bg-red-500/40 text-red-200 border border-red-400/50'
            }`}>
              {isAffordable ? 'EXCELLENT' : 'REVIEW'}
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-lg shadow-md hover:shadow-lg hover:bg-white/15 transition-all duration-300 group">
              <span className="text-white/80 group-hover:text-white transition-colors font-medium text-xs">20% Down Payment</span>
              <div className="flex items-center space-x-2">
                <span className="text-white font-semibold text-sm">{downPaymentPercentage.toFixed(1)}%</span>
                {isDownPaymentOk ? (
                  <CheckCircle className="w-3 h-3 text-green-400 drop-shadow-sm" />
                ) : (
                  <XCircle className="w-3 h-3 text-red-400 drop-shadow-sm" />
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-lg shadow-md hover:shadow-lg hover:bg-white/15 transition-all duration-300 group">
              <span className="text-white/80 group-hover:text-white transition-colors font-medium text-xs">Max 4 Year Tenure</span>
              <div className="flex items-center space-x-2">
                <span className="text-white font-semibold text-sm">{carData.tenure}y</span>
                {isTenureOk ? (
                  <CheckCircle className="w-3 h-3 text-green-400 drop-shadow-sm" />
                ) : (
                  <XCircle className="w-3 h-3 text-red-400 drop-shadow-sm" />
                )}
              </div>
            </div>
            
            {carData.monthlyIncome > 0 && (
              <div className="flex items-center justify-between bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-lg shadow-md hover:shadow-lg hover:bg-white/15 transition-all duration-300 group">
                <span className="text-white/80 group-hover:text-white transition-colors font-medium text-xs">Max 10% of Income</span>
                <div className="flex items-center space-x-2">
                  <span className="text-white font-semibold text-sm">{expensePercentage.toFixed(1)}%</span>
                  {isExpenseOk ? (
                    <CheckCircle className="w-3 h-3 text-green-400 drop-shadow-sm" />
                  ) : (
                    <XCircle className="w-3 h-3 text-red-400 drop-shadow-sm" />
                  )}
                </div>
              </div>
            )}
          </div>

          <div className={`mt-3 p-2 rounded-lg text-center shadow-inner backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${
            isAffordable 
              ? 'bg-green-500/30 text-green-200 border border-green-400/40' 
              : 'bg-red-500/30 text-red-200 border border-red-400/40'
          }`}>
            <p className="font-semibold text-xs">
              {isAffordable 
                ? '🎯 Great! Fits your budget' 
                : '⚠️ Consider adjusting terms'
              }
            </p>
          </div>
        </motion.div>
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