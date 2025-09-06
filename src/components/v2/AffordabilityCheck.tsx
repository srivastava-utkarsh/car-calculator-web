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
      className={`relative p-4 sm:p-6 rounded-2xl border backdrop-blur-2xl shadow-2xl transition-all duration-500 hover:shadow-3xl hover:scale-[1.02] overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-400/50 ${
        !isAllRequiredFieldsFilled || carData.carPrice <= 0 || carData.tenure <= 0 || emi <= 0
          ? 'bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/60 border-slate-600/30 shadow-slate-900/20'
          : isAffordable 
            ? 'bg-gradient-to-br from-emerald-900/80 via-green-900/60 to-emerald-900/80 border-emerald-400/40 shadow-emerald-900/30' 
            : 'bg-gradient-to-br from-red-900/80 via-red-900/60 to-red-900/80 border-red-400/40 shadow-red-900/30'
      }`}
      style={{
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: isAffordable 
          ? '0 25px 50px -12px rgba(16, 185, 129, 0.25), 0 0 0 1px rgba(16, 185, 129, 0.1) inset'
          : !isAllRequiredFieldsFilled || carData.carPrice <= 0 || carData.tenure <= 0 || emi <= 0
          ? '0 25px 50px -12px rgba(71, 85, 105, 0.25), 0 0 0 1px rgba(71, 85, 105, 0.1) inset'
          : '0 25px 50px -12px rgba(220, 38, 127, 0.25), 0 0 0 1px rgba(220, 38, 127, 0.1) inset'
      }}
    >
      {/* Glassmorphism background with animated gradient */}
      <div className="absolute inset-0 opacity-10">
        <div className={`absolute inset-0 bg-gradient-to-tr animate-pulse ${
          !isAllRequiredFieldsFilled || carData.carPrice <= 0 || carData.tenure <= 0 || emi <= 0
            ? 'from-slate-400 via-slate-500 to-slate-600'
            : isAffordable ? 'from-emerald-400 via-green-400 to-teal-500' : 'from-red-400 via-pink-500 to-rose-500'
        }`}></div>
      </div>

      {/* Floating orbs for depth */}
      <div className="absolute top-4 right-4 w-12 h-12 rounded-full opacity-20 blur-xl animate-pulse"
           style={{
             background: isAffordable 
               ? 'radial-gradient(circle, rgba(16, 185, 129, 0.8) 0%, rgba(5, 150, 105, 0.4) 70%, transparent 100%)'
               : !isAllRequiredFieldsFilled 
               ? 'radial-gradient(circle, rgba(71, 85, 105, 0.8) 0%, rgba(51, 65, 85, 0.4) 70%, transparent 100%)'
               : 'radial-gradient(circle, rgba(220, 38, 127, 0.8) 0%, rgba(190, 24, 93, 0.4) 70%, transparent 100%)'
           }}>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          {/* Left side - "Can you afford?" text with enhanced typography */}
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              !isAllRequiredFieldsFilled || carData.carPrice <= 0 || carData.tenure <= 0 || emi <= 0
                ? 'bg-slate-600/50'
                : isAffordable 
                ? 'bg-emerald-500/30'
                : 'bg-red-500/30'
            }`}>
              <svg className={`w-5 h-5 ${
                !isAllRequiredFieldsFilled || carData.carPrice <= 0 || carData.tenure <= 0 || emi <= 0
                  ? 'text-slate-400'
                  : isAffordable 
                  ? 'text-emerald-300'
                  : 'text-red-300'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h5 className={`font-bold text-lg sm:text-xl tracking-tight ${themeClass(themeStyles.primaryText, 'text-white', isLight)}`}>
              Can you afford?
            </h5>
          </div>
          
          {/* Right side - Status badge with enhanced design */}
          <div className="flex items-center">
            {!isAllRequiredFieldsFilled || carData.carPrice <= 0 || carData.tenure <= 0 || emi <= 0 ? (
              <div className="px-4 py-2 rounded-full bg-slate-700/50 border border-slate-500/30">
                <span className="text-lg font-bold text-slate-300 leading-none">--</span>
              </div>
            ) : isAffordable ? (
              <div className="px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/40 shadow-lg shadow-emerald-500/20">
                <span className="text-lg font-bold text-emerald-200 leading-none flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Within Budget
                </span>
              </div>
            ) : (
              <div className="px-4 py-2 rounded-full bg-red-500/20 border border-red-400/40 shadow-lg shadow-red-500/20">
                <span className="text-lg font-bold text-red-200 leading-none flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Over Budget
                </span>
              </div>
            )}
          </div>
        </div>
      
        {/* Enhanced rule indicators with glassmorphism */}
        <div className="space-y-3">
          {/* 20% Down Payment Rule */}
          <div 
            className={`relative p-3 sm:p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
              isDownPaymentOk 
                ? 'bg-emerald-500/10 border-emerald-400/30 hover:bg-emerald-500/15 shadow-emerald-500/20' 
                : 'bg-red-500/10 border-red-400/30 hover:bg-red-500/15 shadow-red-500/20'
            }`}
            style={{ backdropFilter: 'blur(8px)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`font-bold flex items-center text-sm ${themeClass(themeStyles.secondaryText, 'text-white/90', isLight)}`}>
                <div className={`w-8 h-8 rounded-lg mr-3 flex items-center justify-center ${
                  isDownPaymentOk ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  <span className="text-2xl">💰</span>
                </div>
                <span className="text-white">
                  <span className="text-green-400 text-xl font-black mr-1">20</span>% Down Payment
                </span>
              </span>
              <div className="flex items-center space-x-2">
                <span className={`font-black text-lg px-3 py-1 rounded-lg shadow-lg ${
                  isDownPaymentOk 
                    ? 'bg-green-500/30 text-green-100 border border-green-400/40' 
                    : 'bg-red-500/30 text-red-100 border border-red-400/40'
                }`}>{formatPercentage(downPaymentPercentage)}%</span>
                {isDownPaymentOk ? (
                  <div className="w-6 h-6 rounded-full bg-emerald-500/30 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-emerald-300" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-red-500/30 flex items-center justify-center">
                    <XCircle className="w-4 h-4 text-red-300" />
                  </div>
                )}
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden shadow-inner">
              <div 
                style={{ width: `${Math.min(downPaymentPercentage, 100)}%` }}
                className={`h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden ${
                  isDownPaymentOk ? 'bg-gradient-to-r from-emerald-400 to-green-500' : 'bg-gradient-to-r from-red-400 to-pink-500'
                }`}
              >
                <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
              </div>
            </div>
          </div>
          
          {/* 4 Year Tenure Rule */}
          <div 
            className={`relative p-3 sm:p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
              isTenureOk 
                ? 'bg-emerald-500/10 border-emerald-400/30 hover:bg-emerald-500/15 shadow-emerald-500/20' 
                : 'bg-red-500/10 border-red-400/30 hover:bg-red-500/15 shadow-red-500/20'
            }`}
            style={{ backdropFilter: 'blur(8px)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`font-bold flex items-center text-sm ${themeClass(themeStyles.secondaryText, 'text-white/90', isLight)}`}>
                <div className={`w-8 h-8 rounded-lg mr-3 flex items-center justify-center ${
                  isTenureOk ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  <span className="text-2xl">⏳</span>
                </div>
                <span className="text-white">
                  <span className="text-orange-400 text-xl font-black mr-1">4</span> Years Max
                </span>
              </span>
              <div className="flex items-center space-x-2">
                <span className={`font-black text-lg px-3 py-1 rounded-lg shadow-lg ${
                  isTenureOk 
                    ? 'bg-green-500/30 text-green-100 border border-green-400/40' 
                    : 'bg-red-500/30 text-red-100 border border-red-400/40'
                }`}>{carData.tenure || 0}y</span>
                {isTenureOk ? (
                  <div className="w-6 h-6 rounded-full bg-emerald-500/30 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-emerald-300" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-red-500/30 flex items-center justify-center">
                    <XCircle className="w-4 h-4 text-red-300" />
                  </div>
                )}
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden shadow-inner">
              <div 
                style={{ width: `${Math.min((carData.tenure / 4) * 100, 100)}%` }}
                className={`h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden ${
                  isTenureOk ? 'bg-gradient-to-r from-emerald-400 to-green-500' : 'bg-gradient-to-r from-red-400 to-pink-500'
                }`}
              >
                <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
              </div>
            </div>
          </div>
          
          {/* 10% Income Rule */}
          <div 
            className={`relative p-3 sm:p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
              isExpenseOk 
                ? 'bg-emerald-500/10 border-emerald-400/30 hover:bg-emerald-500/15 shadow-emerald-500/20' 
                : 'bg-red-500/10 border-red-400/30 hover:bg-red-500/15 shadow-red-500/20'
            }`}
            style={{ backdropFilter: 'blur(8px)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`font-bold flex items-center text-sm ${themeClass(themeStyles.secondaryText, 'text-white/90', isLight)}`}>
                <div className={`w-8 h-8 rounded-lg mr-3 flex items-center justify-center ${
                  isExpenseOk ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  <span className="text-2xl">📊</span>
                </div>
                <span className="text-white">
                  <span className="text-blue-400 text-xl font-black mr-1">10</span>% Income Max
                </span>
              </span>
              <div className="flex items-center space-x-2">
                <span className={`font-black text-lg px-3 py-1 rounded-lg shadow-lg ${
                  isExpenseOk 
                    ? 'bg-green-500/30 text-green-100 border border-green-400/40' 
                    : 'bg-red-500/30 text-red-100 border border-red-400/40'
                }`}>{formatPercentage(expensePercentage)}%</span>
                {isExpenseOk ? (
                  <div className="w-6 h-6 rounded-full bg-emerald-500/30 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-emerald-300" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-red-500/30 flex items-center justify-center">
                    <XCircle className="w-4 h-4 text-red-300" />
                  </div>
                )}
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden shadow-inner">
              <div 
                style={{ width: `${Math.min(expensePercentage, 100)}%` }}
                className={`h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden ${
                  isExpenseOk ? 'bg-gradient-to-r from-emerald-400 to-green-500' : 'bg-gradient-to-r from-red-400 to-pink-500'
                }`}
              >
                <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}