'use client'

import React from 'react'
import { CarData } from '@/app/page'
import { CheckCircle, XCircle, Percent, Clock } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { getThemeStyles, themeClass } from '@/utils/themeStyles'

interface AffordabilityCheckProps {
  carData: CarData
}

export default function AffordabilityCheck({ carData }: AffordabilityCheckProps) {
  const { theme, isLight } = useTheme()
  const themeStyles = getThemeStyles(theme)

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
  
  // Monthly car expenses calculation for 20/4/10 rule
  const totalMonthlyCarExpenses = emi + monthlyFuelCost
  
  // 20/4/10 Rule Check - Only calculate when valid data is available
  const downPaymentPercentage = carData.carPrice > 0 ? (carData.downPayment / carData.carPrice) * 100 : 0
  const isDownPaymentOk = downPaymentPercentage >= 20
  const isTenureOk = carData.tenure > 0 && carData.tenure <= 4
  const expensePercentage = carData.monthlyIncome > 0 && totalMonthlyCarExpenses > 0 ? (totalMonthlyCarExpenses / carData.monthlyIncome) * 100 : 0
  const isExpenseOk = carData.monthlyIncome > 0 && totalMonthlyCarExpenses > 0 ? expensePercentage <= 10 : true
  const isAffordable = isDownPaymentOk && isTenureOk && isExpenseOk

  // Calculate completion of required fields for Smart Purchase Score
  const requiredFields = [
    carData.carPrice > 0,
    carData.downPayment >= 0,
    carData.monthlyIncome > 0
  ];
  const isAllRequiredFieldsFilled = requiredFields.every(Boolean);

  const formatPercentage = (value: number) => {
    if (isNaN(value) || !isFinite(value)) return '0.0'
    if (value < 1 && value > 0) return '< 1'
    if (value > 100) return '> 100'
    return value.toFixed(1)
  }

  // Auto-focus the afford panel when all mandatory fields are completed
  React.useEffect(() => {
    if (isAllRequiredFieldsFilled && carData.tenure > 0 && emi > 0) {
      const affordPanel = document.getElementById('afford-panel');
      const activeElement = document.activeElement;
      
      // Check if the currently focused element is an input field
      const isInputFocused = activeElement && (
        activeElement.tagName === 'INPUT' || 
        activeElement.tagName === 'TEXTAREA' ||
        (activeElement as HTMLElement).contentEditable === 'true'
      );
      
      // Only focus the panel if no input is currently focused
      if (affordPanel && !isInputFocused) {
        affordPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
        affordPanel.focus();
      }
    }
  }, [isAllRequiredFieldsFilled, carData.tenure, emi]);

  return (
    <div 
      id="afford-panel"
      tabIndex={-1}
      className={`relative p-3 sm:p-4 rounded-lg sm:rounded-xl border backdrop-blur-xl shadow-xl transition-all duration-300 hover:shadow-xl hover:scale-[1.01] overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-400/50 ${
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
        <div className="flex items-center justify-between mb-2">
          {/* Left side - "Can you afford?" text */}
          <div className="flex items-center">
            <h5 className={`font-bold text-sm sm:text-base tracking-tight leading-tight ${themeClass(themeStyles.primaryText, 'text-white', isLight)}`}>
              Can you afford?
            </h5>
          </div>
          
          {/* Right side - Centered budget status display */}
          <div className="flex items-center justify-center">
            {!isAllRequiredFieldsFilled || carData.carPrice <= 0 || carData.tenure <= 0 || emi <= 0 ? (
              <span className="text-xl font-bold text-gray-400 leading-none">--</span>
            ) : isAffordable ? (
              <span className="text-xl font-bold text-green-400 leading-none">Yes</span>
            ) : (
              <span className="text-xl font-bold text-red-400 leading-none">No</span>
            )}
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
              <span className={`font-medium flex items-center text-sm ${themeClass(themeStyles.secondaryText, 'text-white/90', isLight)}`}>
                <span className="text-yellow-400 mr-1 font-bold">₹</span>
                20% Down Payment
              </span>
              <div className="flex items-center space-x-2">
                <span className={`font-bold text-sm ${themeClass(themeStyles.primaryText, 'text-white', isLight)}`}>{formatPercentage(downPaymentPercentage)}%</span>
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
              <span className={`font-medium flex items-center text-sm ${themeClass(themeStyles.secondaryText, 'text-white/90', isLight)}`}>
                <Clock className="w-3 h-3 mr-1 text-blue-400" />
                Max 4 Years
              </span>
              <div className="flex items-center space-x-2">
                <span className={`font-bold text-sm ${themeClass(themeStyles.primaryText, 'text-white', isLight)}`}>{carData.tenure || 0}y</span>
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
              <span className={`font-medium flex items-center text-sm ${themeClass(themeStyles.secondaryText, 'text-white/90', isLight)}`}>
                <Percent className="w-3 h-3 mr-1 text-purple-400" />
                Max 10% Income
              </span>
              <div className="flex items-center space-x-2">
                <span className={`font-bold text-sm ${themeClass(themeStyles.primaryText, 'text-white', isLight)}`}>{formatPercentage(expensePercentage)}%</span>
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
  )
}