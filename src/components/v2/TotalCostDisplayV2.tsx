'use client'

import React from 'react'
import { CarData } from '@/types/CarData'
// Only import icons that are actually used to reduce bundle size
import { CheckCircle, XCircle, Percent, Clock, Info, Calendar, CreditCard, Car, IndianRupee, Fuel, ParkingCircle } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { getThemeStyles, themeClass } from '@/utils/themeStyles'

interface TotalCostDisplayV2Props {
  carData: CarData
  updateCarData: (updates: Partial<CarData>) => void
}

export default function TotalCostDisplayV2({ carData }: TotalCostDisplayV2Props) {
  const { isLight } = useTheme()
  const themeStyles = getThemeStyles(isLight ? 'light' : 'dark')
  
  // Use monthly fuel expense from form input
  const monthlyFuelCost = carData.monthlyFuelExpense || 0
  const monthlyParkingCost = carData.parkingFee || 0
  
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

  // Calculate completion date
  const currentDate = new Date()
  const completionDate = new Date(currentDate.getFullYear() + carData.tenure, currentDate.getMonth(), currentDate.getDate())
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', { 
      month: 'short', 
      year: 'numeric' 
    })
  }
  
  // Monthly car expenses calculation for 20/4/10 rule
  // Including EMI, fuel, and parking when available (insurance moved to one-time costs)
  const totalMonthlyCarExpenses = emi + monthlyFuelCost + monthlyParkingCost
  
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
    if (value < 1 && value > 0) return '< 1'
    if (value > 100) return '> 100'
    return value.toFixed(1)
  }

  // Calculate completion of required fields for Smart Purchase Score
  const requiredFields = [
    carData.carPrice > 0,
    carData.downPayment >= 0,
    carData.monthlyIncome > 0
  ];
  const isAllRequiredFieldsFilled = requiredFields.every(Boolean);

  // Auto-focus the afford panel when all mandatory fields are completed (desktop only)
  // Only focus if no input is currently focused to prevent interrupting user input
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
      
      // Check if we're on desktop (screen width >= 1024px for lg breakpoint)
      const isDesktop = window.innerWidth >= 1024;
      
      // Only focus the panel if no input is currently focused and we're on desktop
      if (affordPanel && !isInputFocused && isDesktop) {
        affordPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
        affordPanel.focus();
      }
    }
  }, [isAllRequiredFieldsFilled, carData.tenure, emi]);
  
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
    <div className="space-y-6 lg:space-y-10">

      {/* Smart Purchase Score - Always show, but with empty state when required fields not filled */}
        <div 
          id="afford-panel"
          tabIndex={-1}
          className={`relative p-4 sm:p-5 rounded-2xl border mb-6 sm:mb-8 transition-all duration-300 overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-400/50 ${
            isLight
              ? `bg-white shadow-sm ${
                  !isAllRequiredFieldsFilled || carData.carPrice <= 0 || carData.tenure <= 0 || emi <= 0
                    ? 'border-slate-200'
                    : isAffordable
                      ? 'border-emerald-300'
                      : 'border-red-300'
                }`
              : `backdrop-blur-xl shadow-xl hover:shadow-xl hover:scale-[1.01] ${
                  !isAllRequiredFieldsFilled || carData.carPrice <= 0 || carData.tenure <= 0 || emi <= 0
                    ? 'bg-gradient-to-br from-slate-500/20 via-slate-600/10 to-slate-700/20 border-slate-400/30 shadow-slate-500/20'
                    : isAffordable
                      ? 'bg-gradient-to-br from-emerald-400/20 via-green-500/15 to-emerald-600/20 border-emerald-400/40 shadow-emerald-500/20'
                      : 'bg-gradient-to-br from-red-400/20 via-red-500/15 to-red-600/20 border-red-400/40 shadow-red-500/20'
                }`
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
              
              {/* Right side - Status with icons like reference */}
              <div className="flex items-center">
                {!isAllRequiredFieldsFilled || carData.carPrice <= 0 || carData.tenure <= 0 || emi <= 0 ? (
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${themeClass('bg-slate-100', 'bg-gray-400/20', isLight)}`}>
                      <Clock className={`w-4 h-4 ${themeClass('text-slate-400', 'text-gray-400', isLight)}`} />
                    </div>
                    <span className={`text-lg font-bold ${themeClass('text-slate-400', 'text-gray-400', isLight)}`}>Pending</span>
                  </div>
                ) : isAffordable ? (
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${themeClass('bg-emerald-50', 'bg-green-400/20', isLight)}`}>
                      <CheckCircle className={`w-4 h-4 ${themeClass('text-emerald-600', 'text-green-400', isLight)}`} />
                    </div>
                    <span className={`text-lg font-bold ${themeClass('text-emerald-600', 'text-green-400', isLight)}`}>In Budget</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${themeClass('bg-red-50', 'bg-red-400/20', isLight)}`}>
                      <XCircle className={`w-4 h-4 ${themeClass('text-red-500', 'text-red-400', isLight)}`} />
                    </div>
                    <span className={`text-lg font-bold ${themeClass('text-red-500', 'text-red-400', isLight)}`}>Over Budget</span>
                  </div>
                )}
              </div>
            </div>
          
            {/* Compact rule indicators */}
            <div className="space-y-1 text-sm">
              {/* 20% Down Payment Rule */}
              <div 
                className={`relative p-2 sm:p-3 rounded-md sm:rounded-lg border transition-all duration-300 ${
                  isLight
                    ? 'bg-slate-50 border-slate-200'
                    : isDownPaymentOk
                      ? 'bg-slate-100/10 border-green-200/30 hover:bg-slate-100/15 hover:scale-[1.01]'
                      : 'bg-slate-100/10 border-red-200/30 hover:bg-slate-100/15 hover:scale-[1.01]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-medium flex items-center text-sm ${themeClass(themeStyles.secondaryText, 'text-white/90', isLight)}`}>
                    <span className={`mr-1 font-bold ${themeClass('text-amber-500', 'text-yellow-400', isLight)}`}>₹</span>
                    20% Down Payment
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className={`font-bold text-sm ${themeClass(themeStyles.primaryText, 'text-white', isLight)}`}>{formatPercentage(downPaymentPercentage)}%</span>
                    {isDownPaymentOk ? (
                      <CheckCircle className={`w-4 h-4 ${themeClass('text-emerald-600', 'text-green-400', isLight)}`} />
                    ) : (
                      <XCircle className={`w-4 h-4 ${themeClass('text-red-500', 'text-red-400', isLight)}`} />
                    )}
                  </div>
                </div>
                <div className={`w-full rounded-full h-1.5 overflow-hidden ${themeClass('bg-slate-200', 'bg-white/15', isLight)}`}>
                  <div 
                    style={{ width: `${Math.min(downPaymentPercentage, 100)}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${
                      isDownPaymentOk ? themeClass('bg-emerald-500', 'bg-gradient-to-r from-green-400 to-emerald-500', isLight) : themeClass('bg-red-500', 'bg-gradient-to-r from-red-400 to-red-500', isLight)
                    }`}
                  />
                </div>
              </div>
              
              {/* 4 Year Tenure Rule */}
              <div 
                className={`relative p-2 sm:p-3 rounded-md sm:rounded-lg border transition-all duration-300 ${
                  isLight
                    ? 'bg-slate-50 border-slate-200'
                    : isTenureOk
                      ? 'bg-slate-100/10 border-green-200/30 hover:bg-slate-100/15 hover:scale-[1.01]'
                      : 'bg-slate-100/10 border-red-200/30 hover:bg-slate-100/15 hover:scale-[1.01]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-medium flex items-center text-sm ${themeClass(themeStyles.secondaryText, 'text-white/90', isLight)}`}>
                    <Clock className={`w-3 h-3 mr-1 ${themeClass('text-blue-600', 'text-blue-400', isLight)}`} />
                    Max 4 Years
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className={`font-bold text-sm ${themeClass(themeStyles.primaryText, 'text-white', isLight)}`}>{carData.tenure || 0}y</span>
                    {isTenureOk ? (
                      <CheckCircle className={`w-4 h-4 ${themeClass('text-emerald-600', 'text-green-400', isLight)}`} />
                    ) : (
                      <XCircle className={`w-4 h-4 ${themeClass('text-red-500', 'text-red-400', isLight)}`} />
                    )}
                  </div>
                </div>
                <div className={`w-full rounded-full h-1.5 overflow-hidden ${themeClass('bg-slate-200', 'bg-white/15', isLight)}`}>
                  <div 
                    style={{ width: `${(carData.tenure / 7) * 100}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${
                      isTenureOk ? themeClass('bg-emerald-500', 'bg-gradient-to-r from-green-400 to-emerald-500', isLight) : themeClass('bg-red-500', 'bg-gradient-to-r from-red-400 to-red-500', isLight)
                    }`}
                  />
                </div>
              </div>
              
              {/* 10% Income Rule */}
              <div 
                className={`relative p-2 sm:p-3 rounded-md sm:rounded-lg border transition-all duration-300 ${
                  isLight
                    ? 'bg-slate-50 border-slate-200'
                    : isExpenseOk
                      ? 'bg-slate-100/10 border-green-200/30 hover:bg-slate-100/15 hover:scale-[1.01]'
                      : 'bg-slate-100/10 border-red-200/30 hover:bg-slate-100/15 hover:scale-[1.01]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-medium flex items-center text-sm ${themeClass(themeStyles.secondaryText, 'text-white/90', isLight)}`}>
                    <Percent className={`w-3 h-3 mr-1 ${themeClass('text-violet-600', 'text-purple-400', isLight)}`} />
                    Max 10% Income
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className={`font-bold text-sm ${themeClass(themeStyles.primaryText, 'text-white', isLight)}`}>{formatPercentage(expensePercentage)}%</span>
                    {isExpenseOk ? (
                      <CheckCircle className={`w-4 h-4 ${themeClass('text-emerald-600', 'text-green-400', isLight)}`} />
                    ) : (
                      <XCircle className={`w-4 h-4 ${themeClass('text-red-500', 'text-red-400', isLight)}`} />
                    )}
                  </div>
                </div>
                <div className={`w-full rounded-full h-1.5 overflow-hidden ${themeClass('bg-slate-200', 'bg-white/15', isLight)}`}>
                  <div 
                    style={{ width: `${Math.min(expensePercentage, 100)}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${
                      isExpenseOk ? themeClass('bg-emerald-500', 'bg-gradient-to-r from-green-400 to-emerald-500', isLight) : themeClass('bg-red-500', 'bg-gradient-to-r from-red-400 to-red-500', isLight)
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>


      <div className="flex items-center justify-between mb-3">
        <h4 className={`font-bold text-lg ${themeClass(themeStyles.primaryText, 'text-white', isLight)}`}>Summary</h4>
        <div className="flex items-center space-x-2">
          {completionPercentage === 100 ? (
            <>
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${themeClass('bg-emerald-50', 'bg-green-400/20', isLight)}`}>
                <CheckCircle className={`w-4 h-4 ${themeClass('text-emerald-600', 'text-green-400', isLight)}`} />
              </div>
              <span className={`text-lg font-bold ${themeClass('text-emerald-600', 'text-green-400', isLight)}`}>100% Complete</span>
            </>
          ) : (
            <>
              <div className={`w-2 h-2 rounded-full ${completionPercentage >= 66 ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
              <span className={`text-sm font-bold ${themeClass(themeStyles.secondaryText, 'text-white/80', isLight)}`}>{completionPercentage}% Complete</span>
            </>
          )}
        </div>
      </div>
      
      {/* Loan Summary - Compact Display */}
      <div 
        className="p-2 sm:p-4 mb-2 transition-all duration-300"
      >
        {/* Main EMI Display - Proportional UX */}
        <div className="text-center mb-2">
          {/* Primary EMI Section - highlighted result card */}
          <div className={`rounded-2xl p-4 mb-3 relative overflow-hidden ${
            isLight
              ? 'bg-white border-2 border-[#E8542F] shadow-sm'
              : 'bg-gradient-to-r from-teal-500 to-teal-600 shadow-lg'
          }`}>
            {/* Content container - centered */}
            <div className="text-center relative z-10">
              <h3 className={`text-lg font-semibold mb-2 tracking-wide ${themeClass('text-slate-500', 'text-white', isLight)}`}>
                Monthly EMI
              </h3>
              <div className={`text-4xl font-bold tracking-tight ${themeClass('text-slate-900', 'text-white', isLight)}`}>
                {formatCurrency(emi)}
              </div>
            </div>
          </div>

          {/* Horizontal Separator */}
          {carData.tenure > 0 && emi > 0 && (
            <div className="border-t border-gray-600/30 my-4"></div>
          )}

          {/* Loan Details - Modern Gradient Background with Header and Icons */}
          {carData.tenure > 0 && emi > 0 && (
            <div className={`rounded-2xl p-4 mb-3 ${
              isLight
                ? 'bg-white border border-slate-200 shadow-sm'
                : 'bg-gradient-to-br from-purple-600 to-indigo-700 shadow-lg'
            }`}>
              <h3 className={`font-bold text-lg mb-4 text-left ${themeClass('text-slate-900', 'text-white', isLight)}`}>Loan Details</h3>
              <div className={`space-y-3 ${themeClass('text-slate-700', 'text-white', isLight)}`}>
                {/* Loan Amount - Highlighted */}
                <div className={`flex justify-between items-center rounded-lg p-3 border ${themeClass('bg-slate-50 border-slate-200', 'bg-white/10 border-white/20', isLight)}`}>
                  <div className="flex items-center space-x-2">
                    <IndianRupee className={`w-5 h-5 ${themeClass('text-slate-500', 'text-yellow-300', isLight)}`} />
                    <span className={`text-sm font-bold ${themeClass('text-slate-600', '', isLight)}`}>Loan Amount</span>
                  </div>
                  <span className={`text-lg font-black ${themeClass('text-slate-900', 'text-yellow-300', isLight)}`}>₹{loanAmount.toLocaleString('en-IN')}</span>
                </div>

                {/* Total Interest - Highlighted */}
                <div className={`flex justify-between items-center rounded-lg p-3 border ${themeClass('bg-amber-50 border-amber-200', 'bg-white/10 border-white/20', isLight)}`}>
                  <div className="flex items-center space-x-2">
                    <IndianRupee className={`w-5 h-5 ${themeClass('text-amber-600', 'text-orange-300', isLight)}`} />
                    <span className={`text-sm font-bold ${themeClass('text-slate-600', '', isLight)}`}>Total Interest</span>
                  </div>
                  <span className={`text-lg font-black ${themeClass('text-amber-600', 'text-orange-300', isLight)}`}>₹{totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <IndianRupee className={`w-4 h-4 ${themeClass('text-slate-400', 'text-white', isLight)}`} />
                    <span className={`text-sm font-medium ${themeClass('text-slate-500', '', isLight)}`}>Down Payment</span>
                  </div>
                  <span className={`text-sm font-bold ${themeClass('text-slate-900', '', isLight)}`}>₹{carData.downPayment.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Percent className={`w-4 h-4 ${themeClass('text-slate-400', 'text-white', isLight)}`} />
                    <span className={`text-sm font-medium ${themeClass('text-slate-500', '', isLight)}`}>Interest Rate</span>
                  </div>
                  <span className={`text-sm font-bold ${themeClass('text-slate-900', '', isLight)}`}>{carData.interestRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Clock className={`w-4 h-4 ${themeClass('text-slate-400', 'text-white', isLight)}`} />
                    <span className={`text-sm font-medium ${themeClass('text-slate-500', '', isLight)}`}>Loan Period</span>
                  </div>
                  <span className={`text-sm font-bold ${themeClass('text-slate-900', '', isLight)}`}>{carData.tenure} Years</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Calendar className={`w-4 h-4 ${themeClass('text-slate-400', 'text-white', isLight)}`} />
                    <span className={`text-sm font-medium ${themeClass('text-slate-500', '', isLight)}`}>Completion Date</span>
                  </div>
                  <span className={`text-sm font-bold ${themeClass('text-slate-900', '', isLight)}`}>{formatDate(completionDate)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Monthly Running Cost - Tabular format like Yearly section */}
          {(monthlyFuelCost > 0 || monthlyParkingCost > 0) ? (
            <div className={`rounded-2xl p-3 mb-2 ${isLight ? 'bg-white border border-slate-200 shadow-sm' : 'bg-gradient-to-br from-yellow-400 via-orange-400 to-yellow-500 shadow-lg'}`}>
              <div className="text-center mb-4">
                <h3 className={`font-bold text-lg sm:text-xl tracking-wide mb-3 ${themeClass('text-slate-900', 'text-black', isLight)}`}>Monthly Running Cost</h3>
                <div className={`text-2xl sm:text-3xl font-bold mb-4 ${themeClass('text-slate-900', 'text-black', isLight)}`}>
                  {formatCurrency(totalMonthlyCarExpenses)}
                </div>
              </div>
              
              {/* Tabular breakdown with icons - same style as yearly cost */}
              <div className="space-y-2">
                {emi > 0 && (
                  <div className={`flex justify-between items-center ${themeClass('text-slate-600', 'text-black/90', isLight)}`}>
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <CreditCard className={`w-4 h-4 flex-shrink-0 ${themeClass('text-amber-600', 'text-black', isLight)}`} />
                      <span className="font-medium text-sm sm:text-base truncate">EMI</span>
                    </div>
                    <span className="font-bold text-sm sm:text-base ml-2 flex-shrink-0">{formatCurrency(emi)}</span>
                  </div>
                )}
                
                {monthlyFuelCost > 0 && (
                  <div className={`flex justify-between items-center ${themeClass('text-slate-600', 'text-black/90', isLight)}`}>
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <Fuel className={`w-4 h-4 flex-shrink-0 ${themeClass('text-amber-600', 'text-black', isLight)}`} />
                      <span className="font-medium text-sm sm:text-base truncate">Fuel</span>
                    </div>
                    <span className="font-bold text-sm sm:text-base ml-2 flex-shrink-0">{formatCurrency(monthlyFuelCost)}</span>
                  </div>
                )}
                
                {monthlyParkingCost > 0 && (
                  <div className={`flex justify-between items-center ${themeClass('text-slate-600', 'text-black/90', isLight)}`}>
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <ParkingCircle className={`w-4 h-4 flex-shrink-0 ${themeClass('text-amber-600', 'text-black', isLight)}`} />
                      <span className="font-medium text-sm sm:text-base truncate">Parking</span>
                    </div>
                    <span className="font-bold text-sm sm:text-base ml-2 flex-shrink-0">{formatCurrency(monthlyParkingCost)}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className={`rounded-xl p-3 mb-3 ${themeClass('bg-white border border-slate-200 shadow-sm', 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/20', isLight)}`}>
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
                className={`w-full p-2 transition-all duration-200 cursor-pointer rounded-lg border outline-none ${
                  isLight
                    ? 'text-[#E8542F] hover:text-[#D64A28] bg-orange-50 hover:bg-orange-100 border-orange-200 hover:border-orange-300'
                    : 'text-cyan-300 hover:text-cyan-200 bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-400/20 hover:border-cyan-400/40'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-sm font-medium">+ Add Fuel Expense</span>
                </div>
                <p className={`text-sm mt-1 ${themeClass('text-slate-500', 'text-cyan-400/80', isLight)}`}>Get your complete monthly car cost</p>
              </button>
            </div>
          )}


          {/* Yearly Running Cost - Pink/Red Gradient like Reference */}
          {(emi > 0 || monthlyFuelCost > 0 || monthlyParkingCost > 0 || (carData.insuranceAndMaintenance || 0) > 0 || (carData.maintenanceCostPerYear || 0) > 0) && (
            <div className={`rounded-2xl p-3 mb-2 ${isLight ? 'bg-white border border-slate-200 shadow-sm' : 'bg-gradient-to-br from-yellow-400 via-orange-400 to-yellow-500 shadow-lg'}`}>
              <div className="text-center mb-4">
                <h3 className={`font-bold text-xl tracking-wide mb-3 ${themeClass('text-slate-900', 'text-black', isLight)}`}>Yearly Running Cost</h3>
                <div className={`text-3xl font-bold mb-4 ${themeClass('text-slate-900', 'text-black', isLight)}`}>
                  {formatCurrency((totalMonthlyCarExpenses * 12) + (carData.insuranceAndMaintenance || 0) + (carData.maintenanceCostPerYear || 0))}
                </div>
              </div>
              
              {/* Breakdown with icons - vertical layout */}
              <div className="space-y-2">
                {emi > 0 && (
                  <div className={`flex justify-between items-center ${themeClass('text-slate-600', 'text-black/90', isLight)}`}>
                    <div className="flex items-center space-x-2">
                      <CreditCard className={`w-4 h-4 ${themeClass('text-amber-600', 'text-black', isLight)}`} />
                      <span className="font-medium">EMI × 12</span>
                    </div>
                    <span className="font-bold">{formatCurrency(emi * 12)}</span>
                  </div>
                )}
                {totalInterest > 0 && carData.tenure > 0 && (
                  <div className={`flex justify-between items-center ${themeClass('text-slate-600', 'text-black/90', isLight)}`}>
                    <div className="flex items-center space-x-2">
                      <IndianRupee className={`w-4 h-4 ${themeClass('text-amber-600', 'text-black', isLight)}`} />
                      <span className="font-medium">Total Interest (1Y)</span>
                    </div>
                    <span className="font-bold">{formatCurrency(totalInterest / carData.tenure)}</span>
                  </div>
                )}
                {monthlyFuelCost > 0 && (
                  <div className={`flex justify-between items-center ${themeClass('text-slate-600', 'text-black/90', isLight)}`}>
                    <div className="flex items-center space-x-2">
                      <Fuel className={`w-4 h-4 ${themeClass('text-amber-600', 'text-black', isLight)}`} />
                      <span className="font-medium">Fuel × 12</span>
                    </div>
                    <span className="font-bold">{formatCurrency(monthlyFuelCost * 12)}</span>
                  </div>
                )}
                {monthlyParkingCost > 0 && (
                  <div className={`flex justify-between items-center ${themeClass('text-slate-600', 'text-black/90', isLight)}`}>
                    <div className="flex items-center space-x-2">
                      <ParkingCircle className={`w-4 h-4 ${themeClass('text-amber-600', 'text-black', isLight)}`} />
                      <span className="font-medium">Parking × 12</span>
                    </div>
                    <span className="font-bold">{formatCurrency(monthlyParkingCost * 12)}</span>
                  </div>
                )}
                {(carData.insuranceAndMaintenance || 0) > 0 && (
                  <div className={`flex justify-between items-center ${themeClass('text-slate-600', 'text-black/90', isLight)}`}>
                    <div className="flex items-center space-x-2">
                      <Info className={`w-4 h-4 ${themeClass('text-amber-600', 'text-black', isLight)}`} />
                      <span className="font-medium">Insurance</span>
                    </div>
                    <span className="font-bold">{formatCurrency(carData.insuranceAndMaintenance || 0)}</span>
                  </div>
                )}
                {(carData.maintenanceCostPerYear || 0) > 0 && (
                  <div className={`flex justify-between items-center ${themeClass('text-slate-600', 'text-black/90', isLight)}`}>
                    <div className="flex items-center space-x-2">
                      <Car className={`w-4 h-4 ${themeClass('text-amber-600', 'text-black', isLight)}`} />
                      <span className="font-medium">Maintenance</span>
                    </div>
                    <span className="font-bold">{formatCurrency(carData.maintenanceCostPerYear || 0)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>


        {/* Loan Breakdown - Redesigned into Loan and Money sections */}
        <div className={`pt-3 ${themeClass('border-t border-slate-300/30', 'border-t border-slate-700/30', isLight)}`}>
          
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

      </div>






    </div>
  )
}