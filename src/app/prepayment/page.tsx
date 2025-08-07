'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Calculator, TrendingDown, Clock, DollarSign, PiggyBank, Target, Zap } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'

interface LoanData {
  loanAmount: number
  interestRate: number
  tenure: number
  emi: number
}

interface PrepaymentResult {
  scenario: 'reduce_tenure' | 'reduce_emi'
  prepaymentAmount: number
  newTenure?: number
  newEMI?: number
  totalAmountPaid: number
  interestPaid: number
  amountSaved: number
  originalTotalAmount: number
  originalInterest: number
  penaltyAmount?: number
  netSavings?: number
  monthsSaved?: number
}

// Core calculation functions based on the Excel sheet
const calculateEMI = (principal: number, rate: number, years: number): number => {
  const monthlyRate = rate / (12 * 100)
  const months = years * 12
  if (monthlyRate === 0) return principal / months
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
}

const calculateLoanDetails = (
  loanAmount: number,
  interestRate: number,
  tenure: number,
  prepaymentAmount: number,
  prepaymentFrequency: 'monthly' | 'yearly',
  scenario: 'reduce_tenure' | 'reduce_emi',
  loanType: 'fixed' | 'floating' = 'floating',
  penaltyRate: number = 0
): PrepaymentResult & { amortizationSchedule?: Array<{month: number, emi: number, interest: number, principal: number, prepayment: number, balance: number}> } => {
  // Input validation
  if (loanAmount <= 0 || interestRate <= 0 || tenure <= 0 || prepaymentAmount < 0) {
    return {
      scenario,
      prepaymentAmount,
      newTenure: tenure,
      newEMI: 0,
      totalAmountPaid: 0,
      interestPaid: 0,
      amountSaved: 0,
      originalTotalAmount: 0,
      originalInterest: 0,
      penaltyAmount: 0,
      netSavings: 0
    }
  }

  const originalEMI = calculateEMI(loanAmount, interestRate, tenure)
  const originalTotalAmount = originalEMI * tenure * 12
  const originalInterest = originalTotalAmount - loanAmount
  
  const monthlyRate = interestRate / (12 * 100)
  // RBI Compliant: Apply prepayment at specific intervals, not distributed monthly
  const isYearlyPrepayment = prepaymentFrequency === 'yearly'
  
  if (scenario === 'reduce_tenure') {
    // RBI Compliant: Reduce tenure scenario - apply prepayment after scheduled EMI
    let remainingPrincipal = loanAmount
    let totalEMIsPaid = 0
    let totalPrepaymentsPaid = 0
    let months = 0
    const maxMonths = tenure * 12
    const amortizationSchedule: Array<{month: number, emi: number, interest: number, principal: number, prepayment: number, balance: number}> = []
    
    while (remainingPrincipal > 0.01 && months < maxMonths) {
      months++
      
      // Step 1: Apply scheduled EMI (interest + principal)
      const interestPortion = remainingPrincipal * monthlyRate
      const principalFromEMI = Math.min(originalEMI - interestPortion, remainingPrincipal)
      
      if (principalFromEMI <= 0) break
      
      remainingPrincipal -= principalFromEMI
      totalEMIsPaid += originalEMI
      
      // Step 2: Apply prepayment AFTER EMI (RBI compliant timing)
      let currentPrepayment = 0
      if (prepaymentAmount > 0 && remainingPrincipal > 0.01) {
        // For yearly: apply at 12th, 24th, 36th month etc.
        // For monthly: apply every month
        const shouldApplyPrepayment = isYearlyPrepayment ? (months % 12 === 0) : true
        
        if (shouldApplyPrepayment) {
          const prepaymentAmountThisMonth = isYearlyPrepayment ? prepaymentAmount : prepaymentAmount
          currentPrepayment = Math.min(prepaymentAmountThisMonth, remainingPrincipal)
          remainingPrincipal -= currentPrepayment
          totalPrepaymentsPaid += currentPrepayment
        }
      }
      
      // Track amortization for transparency
      amortizationSchedule.push({
        month: months,
        emi: originalEMI,
        interest: interestPortion,
        principal: principalFromEMI,
        prepayment: currentPrepayment,
        balance: remainingPrincipal
      })
    }
    
    // Calculate penalty amount for fixed-rate loans
    const totalPrepaymentMade = totalPrepaymentsPaid
    const penaltyAmount = loanType === 'fixed' ? (totalPrepaymentMade * penaltyRate / 100) : 0
    
    // RBI Compliant Results Calculation
    const newTenureYears = months / 12
    const totalAmountPaid = totalEMIsPaid + totalPrepaymentsPaid + penaltyAmount
    const interestPaid = totalEMIsPaid - loanAmount  // Interest = EMIs paid - original loan
    const grossSavings = Math.max(0, originalTotalAmount - (totalEMIsPaid + totalPrepaymentsPaid))
    const netSavings = Math.max(0, grossSavings - penaltyAmount)
    const monthsSaved = (tenure * 12) - months
    
    return {
      scenario: 'reduce_tenure',
      prepaymentAmount,
      newTenure: newTenureYears,
      totalAmountPaid: Math.round(totalAmountPaid), // Round to nearest rupee
      interestPaid: Math.round(interestPaid),
      amountSaved: Math.round(grossSavings),
      originalTotalAmount: Math.round(originalTotalAmount),
      originalInterest: Math.round(originalInterest),
      penaltyAmount: Math.round(penaltyAmount),
      netSavings: Math.round(netSavings),
      amortizationSchedule,
      monthsSaved
    }
  } else {
    // Reduce EMI scenario - keep tenure same, reduce EMI
    // Simulate month by month with prepayments to calculate new EMI
    const totalMonths = tenure * 12
    let tempPrincipal = loanAmount
    let totalEMIs = 0
    let totalPrepayments = 0
    const monthlyPrepayment = prepaymentFrequency === 'monthly' ? prepaymentAmount : prepaymentAmount / 12
    
    for (let month = 1; month <= totalMonths; month++) {
      if (tempPrincipal <= 0.01) break
      
      // Apply prepayment first (reduces principal before interest calculation)
      if (monthlyPrepayment > 0) {
        const actualPrepayment = Math.min(monthlyPrepayment, tempPrincipal)
        tempPrincipal -= actualPrepayment
        totalPrepayments += actualPrepayment
      }
      
      if (tempPrincipal <= 0.01) break
      
      // Calculate what EMI is needed for remaining months
      const remainingMonths = totalMonths - month + 1
      const requiredEMI = calculateEMI(tempPrincipal, interestRate, remainingMonths / 12)
      
      // Apply EMI
      const interestPortion = tempPrincipal * monthlyRate
      const principalPortion = Math.min(requiredEMI - interestPortion, tempPrincipal)
      
      if (principalPortion > 0) {
        tempPrincipal -= principalPortion
        totalEMIs += requiredEMI
      }
    }
    
    // Calculate average EMI needed
    const newEMI = totalEMIs / totalMonths
    
    // Recalculate totals with the new EMI
    let finalPrincipal = loanAmount
    let finalTotalEMIs = 0
    let finalTotalPrepayments = 0
    
    for (let month = 1; month <= totalMonths; month++) {
      if (finalPrincipal <= 0.01) break
      
      // Apply prepayment
      if (monthlyPrepayment > 0) {
        const actualPrepayment = Math.min(monthlyPrepayment, finalPrincipal)
        finalPrincipal -= actualPrepayment
        finalTotalPrepayments += actualPrepayment
      }
      
      if (finalPrincipal <= 0.01) break
      
      // Apply EMI
      const interestPortion = finalPrincipal * monthlyRate
      const principalPortion = Math.min(newEMI - interestPortion, finalPrincipal)
      
      if (principalPortion > 0) {
        finalPrincipal -= principalPortion
        finalTotalEMIs += newEMI
      }
    }
    
    // Calculate penalty for fixed-rate loans
    const penaltyAmount = loanType === 'fixed' ? (finalTotalPrepayments * penaltyRate / 100) : 0;
    
    const totalAmountPaidWithPenalty = finalTotalEMIs + finalTotalPrepayments + penaltyAmount
    const interestPaid = Math.max(0, finalTotalEMIs - loanAmount)
    const grossSavings = Math.max(0, originalTotalAmount - (finalTotalEMIs + finalTotalPrepayments))
    const netSavings = Math.max(0, grossSavings - penaltyAmount)
    
    return {
      scenario: 'reduce_emi',
      prepaymentAmount,
      newEMI: Math.max(0, newEMI),
      totalAmountPaid: totalAmountPaidWithPenalty,
      interestPaid,
      amountSaved: grossSavings,
      originalTotalAmount,
      originalInterest,
      penaltyAmount,
      netSavings
    }
  }
}

function PrepaymentCalculator() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [loanData, setLoanData] = useState<LoanData>({
    loanAmount: 0,
    interestRate: 8,
    tenure: 0,
    emi: 0
  })
  
  const [prepaymentAmount, setPrepaymentAmount] = useState(0)
  const [prepaymentFrequency, setPrepaymentFrequency] = useState<'monthly' | 'yearly'>('yearly')
  const [selectedScenario, setSelectedScenario] = useState<'reduce_tenure' | 'reduce_emi'>('reduce_tenure')
  const [loanType, setLoanType] = useState<'fixed' | 'floating'>('floating')
  const [penaltyRate, setPenaltyRate] = useState(0)
  const [tenureDisplayFormat, setTenureDisplayFormat] = useState<'years' | 'months'>('years')

  useEffect(() => {
    // Extract parameters from URL with safe parsing
    const carPrice = Math.max(0, parseFloat(searchParams.get('carPrice') || '0'))
    const downPayment = Math.max(0, parseFloat(searchParams.get('downPayment') || '0'))
    const interestRate = Math.max(0.1, Math.min(20, parseFloat(searchParams.get('interestRate') || '8')))
    const tenure = Math.max(1, Math.min(10, parseFloat(searchParams.get('tenure') || '5')))
    
    const loanAmount = Math.max(0, carPrice - downPayment)
    const emi = loanAmount > 0 ? calculateEMI(loanAmount, interestRate, tenure) : 0
    
    setLoanData({
      loanAmount,
      interestRate,
      tenure,
      emi
    })
    
    // Set default prepayment amount (2% of loan amount)
    if (loanAmount > 0) {
      setPrepaymentAmount(Math.round(loanAmount * 0.02))
    }
  }, [searchParams])

  const results = loanData.loanAmount > 0 ? calculateLoanDetails(
    loanData.loanAmount,
    loanData.interestRate,
    loanData.tenure,
    prepaymentAmount,
    prepaymentFrequency,
    selectedScenario,
    loanType,
    penaltyRate
  ) : null

  const formatCurrency = (amount: number) => {
    return `₹${Math.round(amount).toLocaleString('en-IN')}`
  }

  const formatTenure = (tenureInYears: number) => {
    if (tenureDisplayFormat === 'months') {
      return `${Math.round(tenureInYears * 12)} months`
    } else {
      const years = Math.floor(tenureInYears)
      const months = Math.round((tenureInYears % 1) * 12)
      if (months === 0) {
        return `${years} years`
      } else {
        return `${years} years ${months} months`
      }
    }
  }

  return (
    <main className="min-h-screen bg-black font-sans relative" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header Navigation - Same as calculator page */}
      <header className="bg-black border-b border-white/5">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo - Far Left Positioning */}
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-white/80 hover:text-white transition-all duration-200 bg-white/5 hover:bg-white/10 px-3 py-2 rounded-xl border border-white/10 hover:border-white/20"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back</span>
              </button>
              <div className="w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center">
                <Image 
                  src="/bck-logo.svg" 
                  alt="BudgetGear Logo" 
                  className="w-10 h-10 sm:w-16 sm:h-16 object-contain"
                  width={64}
                  height={64}
                />
              </div>
              <span className="text-base sm:text-2xl font-extrabold text-white tracking-tight flex items-center">BudgetGear</span>
            </div>

            {/* Navigation Menu - Center with proper spacing */}
            <div className="flex-1 flex justify-center px-4">
              <nav className="flex items-center" role="navigation" aria-label="Main navigation">
                <h1 className="text-white font-bold text-xs sm:text-base tracking-wide flex items-center space-x-2">
                  <PiggyBank className="w-5 h-5 text-emerald-400" />
                  <span>Smart Prepayment Calculator</span>
                </h1>
              </nav>
            </div>

            {/* Empty div for balance */}
            <div className="w-20 sm:w-32 flex-shrink-0"></div>
          </div>
        </div>
      </header>

      {/* Immersive Background Gradient - exclude header */}
      <div className="absolute top-20 left-0 right-0 bottom-0 bg-gradient-to-br from-gray-900/50 via-black to-gray-900/30 pointer-events-none"></div>

      {/* Main Content Section - Compact Layout */}
      <section className="relative z-10 pt-8" id="calculator">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            
            {/* Current Loan Form - Editable */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 mb-6 shadow-2xl"
            >
              <h2 className="text-white font-bold text-lg mb-4 flex items-center space-x-2">
                <Calculator className="w-5 h-5 text-blue-400" />
                <span>Your Current Loan</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/5 rounded-xl p-3 border border-blue-400/20">
                  <label className="text-blue-300 text-xs font-medium mb-2 block">Loan Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 font-medium">₹</span>
                    <input
                      type="number"
                      value={loanData.loanAmount}
                      onChange={(e) => {
                        const newAmount = parseFloat(e.target.value) || 0
                        const newEMI = newAmount > 0 ? calculateEMI(newAmount, loanData.interestRate, loanData.tenure) : 0
                        setLoanData(prev => ({ ...prev, loanAmount: newAmount, emi: newEMI }))
                      }}
                      className="w-full bg-white/10 border border-blue-400/30 rounded-lg pl-8 pr-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                      placeholder="Enter amount"
                    />
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-emerald-400/20">
                  <div className="text-emerald-300 text-xs font-medium mb-2">Monthly EMI</div>
                  <div className="text-white text-lg font-bold">{formatCurrency(loanData.emi)}</div>
                  <div className="text-emerald-200/60 text-xs mt-1">Auto-calculated</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-purple-400/20">
                  <label className="text-purple-300 text-xs font-medium mb-2 block">Interest Rate</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="20"
                      value={loanData.interestRate}
                      onChange={(e) => {
                        const newRate = Math.min(20, Math.max(0.1, parseFloat(e.target.value) || 8))
                        const newEMI = loanData.loanAmount > 0 ? calculateEMI(loanData.loanAmount, newRate, loanData.tenure) : 0
                        setLoanData(prev => ({ ...prev, interestRate: newRate, emi: newEMI }))
                      }}
                      className="w-full bg-white/10 border border-purple-400/30 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                      placeholder="Rate"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 font-medium">%</span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-orange-400/20">
                  <label className="text-orange-300 text-xs font-medium mb-2 block">Loan Tenure</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      max="10"
                      value={loanData.tenure}
                      onChange={(e) => {
                        const newTenure = Math.min(10, Math.max(1, parseFloat(e.target.value) || 5))
                        const newEMI = loanData.loanAmount > 0 ? calculateEMI(loanData.loanAmount, loanData.interestRate, newTenure) : 0
                        setLoanData(prev => ({ ...prev, tenure: newTenure, emi: newEMI }))
                      }}
                      className="w-full bg-white/10 border border-orange-400/30 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
                      placeholder="Years"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 font-medium">yrs</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main Content Section */}
            <div className="max-w-4xl mx-auto">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="space-y-6"
                >
                {/* Strategy Selection */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 mb-6 shadow-2xl">
                  <h3 className="text-white font-bold text-lg mb-4 flex items-center space-x-2">
                    <Target className="w-5 h-5 text-emerald-400" />
                    <span>Choose Your Strategy</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => setSelectedScenario('reduce_tenure')}
                      className={`bg-white/5 rounded-xl p-4 border transition-all duration-300 text-left ${
                        selectedScenario === 'reduce_tenure'
                          ? 'border-emerald-400/50 bg-emerald-500/20'
                          : 'border-white/20 hover:border-emerald-400/30 hover:bg-emerald-500/10'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <Clock className="w-5 h-5 text-emerald-400" />
                        <div className={`text-emerald-300 text-xs font-medium ${
                          selectedScenario === 'reduce_tenure' ? 'text-emerald-300' : 'text-white/80'
                        }`}>
                          Strategy A
                        </div>
                      </div>
                      <h4 className={`font-semibold text-lg mb-1 ${
                        selectedScenario === 'reduce_tenure' ? 'text-emerald-300' : 'text-white'
                      }`}>
                        Reduce Loan Tenure
                      </h4>
                      <p className={`text-xs ${
                        selectedScenario === 'reduce_tenure' ? 'text-emerald-200/80' : 'text-white/60'
                      }`}>
                        Keep EMI same, finish loan faster
                      </p>
                    </button>

                    <button
                      onClick={() => setSelectedScenario('reduce_emi')}
                      className={`bg-white/5 rounded-xl p-4 border transition-all duration-300 text-left ${
                        selectedScenario === 'reduce_emi'
                          ? 'border-blue-400/50 bg-blue-500/20'
                          : 'border-white/20 hover:border-blue-400/30 hover:bg-blue-500/10'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <TrendingDown className="w-5 h-5 text-blue-400" />
                        <div className={`text-blue-300 text-xs font-medium ${
                          selectedScenario === 'reduce_emi' ? 'text-blue-300' : 'text-white/80'
                        }`}>
                          Strategy B
                        </div>
                      </div>
                      <h4 className={`font-semibold text-lg mb-1 ${
                        selectedScenario === 'reduce_emi' ? 'text-blue-300' : 'text-white'
                      }`}>
                        Reduce Monthly EMI
                      </h4>
                      <p className={`text-xs ${
                        selectedScenario === 'reduce_emi' ? 'text-blue-200/80' : 'text-white/60'
                      }`}>
                        Lower monthly burden, same tenure
                      </p>
                    </button>
                  </div>
                </div>

                {/* Loan Type Configuration */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 mb-6 shadow-2xl">
                  <h3 className="text-white font-bold text-lg mb-4 flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-blue-400" />
                    <span>Loan Type</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Floating Rate Option */}
                    <button
                      onClick={() => {
                        setLoanType('floating')
                        setPenaltyRate(0)
                      }}
                      className={`bg-white/5 rounded-xl p-4 border transition-all duration-300 text-left ${
                        loanType === 'floating'
                          ? 'border-emerald-400/50 bg-emerald-500/20'
                          : 'border-white/20 hover:border-emerald-400/30 hover:bg-emerald-500/10'
                      }`}
                    >
                      <div className={`text-emerald-300 text-xs font-medium mb-2 ${
                        loanType === 'floating' ? 'text-emerald-300' : 'text-white/80'
                      }`}>
                        Recommended
                      </div>
                      <h4 className={`font-semibold text-lg mb-1 ${
                        loanType === 'floating' ? 'text-emerald-300' : 'text-white'
                      }`}>
                        Floating Rate
                      </h4>
                      <p className={`text-xs ${
                        loanType === 'floating' ? 'text-emerald-200/80' : 'text-white/60'
                      }`}>
                        No prepayment penalty
                      </p>
                    </button>

                    {/* Fixed Rate Option */}
                    <button
                      onClick={() => {
                        setLoanType('fixed')
                        setPenaltyRate(2.5)
                      }}
                      className={`bg-white/5 rounded-xl p-4 border transition-all duration-300 text-left ${
                        loanType === 'fixed'
                          ? 'border-orange-400/50 bg-orange-500/20'
                          : 'border-white/20 hover:border-orange-400/30 hover:bg-orange-500/10'
                      }`}
                    >
                      <div className={`text-orange-300 text-xs font-medium mb-2 ${
                        loanType === 'fixed' ? 'text-orange-300' : 'text-white/80'
                      }`}>
                        May have penalty
                      </div>
                      <h4 className={`font-semibold text-lg mb-1 ${
                        loanType === 'fixed' ? 'text-orange-300' : 'text-white'
                      }`}>
                        Fixed Rate
                      </h4>
                      <p className={`text-xs ${
                        loanType === 'fixed' ? 'text-orange-200/80' : 'text-white/60'
                      }`}>
                        Rate locked throughout
                      </p>
                    </button>

                    {/* Penalty Rate Input for Fixed Loans */}
                    {loanType === 'fixed' && (
                      <div className="bg-white/5 rounded-xl p-4 border border-orange-400/20">
                        <label className="text-orange-300 text-xs font-medium mb-2 block">
                          Penalty Rate
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="5"
                            value={penaltyRate}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              if (isNaN(value)) {
                                setPenaltyRate(0);
                              } else if (value < 0) {
                                setPenaltyRate(0);
                              } else if (value > 5) {
                                setPenaltyRate(5);
                              } else {
                                setPenaltyRate(value);
                              }
                            }}
                            className="w-full bg-white/10 border border-orange-400/30 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
                            placeholder="0-5"
                          />
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 font-medium">%</span>
                        </div>
                        <div className="text-orange-200/60 text-xs mt-1">
                          Typical: 2-5%
                        </div>
                        {penaltyRate > 4 && (
                          <div className="text-red-300 text-xs mt-2">
                            ⚠️ Above 4% may violate RBI guidelines
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* RBI Compliance Info */}
                  <div className={`mt-4 rounded-xl p-3 border transition-all duration-300 ${
                    loanType === 'floating'
                      ? 'bg-emerald-500/10 border-emerald-400/30'
                      : 'bg-orange-500/10 border-orange-400/30'
                  }`}>
                    <div className="flex items-start space-x-2">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 ${
                        loanType === 'floating' ? 'bg-emerald-400' : 'bg-orange-400'
                      }`}></div>
                      <div>
                        <div className={`font-medium text-xs mb-1 ${
                          loanType === 'floating' ? 'text-emerald-300' : 'text-orange-300'
                        }`}>
                          RBI Guidelines
                        </div>
                        <p className="text-white/70 text-xs leading-relaxed">
                          {loanType === 'floating'
                            ? 'No prepayment charges for floating rate personal loans as per RBI regulations.'
                            : 'Fixed rate loans may have prepayment penalty. Must be disclosed in loan agreement.'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Impact Analysis */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 mb-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-bold text-lg flex items-center space-x-2">
                      <Zap className="w-5 h-5 text-yellow-400" />
                      <span>Impact Analysis</span>
                    </h3>
                    
                    {/* Tenure Display Toggle */}
                    <div className="flex bg-white/5 rounded-lg p-1 border border-white/20">
                      <button
                        onClick={() => setTenureDisplayFormat('years')}
                        className={`px-3 py-1 rounded text-xs font-medium transition-all duration-200 ${
                          tenureDisplayFormat === 'years'
                            ? 'bg-white/20 text-white shadow-sm'
                            : 'text-white/70 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        Years
                      </button>
                      <button
                        onClick={() => setTenureDisplayFormat('months')}
                        className={`px-3 py-1 rounded text-xs font-medium transition-all duration-200 ${
                          tenureDisplayFormat === 'months'
                            ? 'bg-white/20 text-white shadow-sm'
                            : 'text-white/70 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        Months
                      </button>
                    </div>
                  </div>
                
                {results ? (
                  <div className="space-y-4">
                    {/* Key Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedScenario === 'reduce_tenure' && results.newTenure && (
                        <div className="bg-white/5 rounded-xl p-4 border border-emerald-400/20">
                          <div className="text-emerald-300 text-xs font-medium mb-2">New Tenure</div>
                          <div className="text-white text-xl font-bold">
                            {formatTenure(results.newTenure)}
                          </div>
                          <div className="text-emerald-200 text-xs mt-1">
                            {(() => {
                              const monthsSaved = results.monthsSaved || 0;
                              return tenureDisplayFormat === 'months'
                                ? `${monthsSaved} months saved`
                                : monthsSaved >= 12
                                ? `${Math.floor(monthsSaved / 12)} years ${monthsSaved % 12} months saved`
                                : `${monthsSaved} months saved`;
                            })()}
                          </div>
                        </div>
                      )}
                      
                      {selectedScenario === 'reduce_emi' && results.newEMI && (
                        <div className="bg-white/5 rounded-xl p-4 border border-blue-400/20">
                          <div className="text-blue-300 text-xs font-medium mb-2">New EMI</div>
                          <div className="text-white text-xl font-bold">{formatCurrency(results.newEMI)}</div>
                          <div className="text-blue-200 text-xs mt-1">
                            {formatCurrency(loanData.emi - results.newEMI)} reduced
                          </div>
                        </div>
                      )}

                      <div className="bg-white/5 rounded-xl p-4 border border-yellow-400/20">
                        <div className="text-yellow-300 text-xs font-medium mb-2">
                          {loanType === 'fixed' && results.penaltyAmount && results.penaltyAmount > 0 ? 'Gross Savings' : 'Total Savings'}
                        </div>
                        <div className="text-white text-xl font-bold">{formatCurrency(results.amountSaved)}</div>
                        <div className="text-yellow-200 text-xs mt-1">Interest saved</div>
                      </div>
                      
                      {/* Show penalty and net savings for fixed loans */}
                      {loanType === 'fixed' && results.penaltyAmount && results.penaltyAmount > 0 && (
                        <>
                          <div className="bg-white/5 rounded-xl p-4 border border-red-400/20">
                            <div className="text-red-300 text-xs font-medium mb-2">Penalty Amount</div>
                            <div className="text-white text-xl font-bold">{formatCurrency(results.penaltyAmount)}</div>
                            <div className="text-red-200 text-xs mt-1">{penaltyRate}% of prepaid amount</div>
                          </div>
                          <div className="bg-white/5 rounded-xl p-4 border border-emerald-400/20">
                            <div className="text-emerald-300 text-xs font-medium mb-2">Net Savings</div>
                            <div className="text-white text-xl font-bold">{formatCurrency(results.netSavings || 0)}</div>
                            <div className="text-emerald-200 text-xs mt-1">After penalty deduction</div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Old vs New Comparison Table */}
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <h4 className="text-white font-semibold mb-4 flex items-center justify-between">
                        <span className="flex items-center space-x-2">
                          <span>Before vs After Prepayment</span>
                          <div className="px-2 py-1 bg-green-500/20 rounded text-xs text-green-300 border border-green-500/30">RBI Verified</div>
                        </span>
                      </h4>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-white/20">
                              <th className="text-left text-white/80 text-sm font-medium py-3 px-2">Metric</th>
                              <th className="text-center text-red-300 text-sm font-medium py-3 px-2">Without Prepayment</th>
                              <th className="text-center text-emerald-300 text-sm font-medium py-3 px-2">With Prepayment</th>
                              <th className="text-center text-blue-300 text-sm font-medium py-3 px-2">Difference</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-white/10">
                              <td className="text-white/90 py-3 px-2 font-medium">Loan Tenure</td>
                              <td className="text-red-200 py-3 px-2 text-center">{formatTenure(loanData.tenure)}</td>
                              <td className="text-emerald-200 py-3 px-2 text-center">{formatTenure(results.newTenure || loanData.tenure)}</td>
                              <td className="text-blue-200 py-3 px-2 text-center">
                                {selectedScenario === 'reduce_tenure' ? (
                                  <>
                                    -{(() => {
                                      const monthsSaved = results.monthsSaved || 0;
                                      if (tenureDisplayFormat === 'months') {
                                        return `${monthsSaved} months`;
                                      } else {
                                        const years = Math.floor(monthsSaved / 12);
                                        const remainingMonths = monthsSaved % 12;
                                        if (years === 0) {
                                          return `${remainingMonths} months`;
                                        } else if (remainingMonths === 0) {
                                          return `${years} years`;
                                        } else {
                                          return `${years} years ${remainingMonths} months`;
                                        }
                                      }
                                    })()}
                                  </>
                                ) : 'No change'}
                              </td>
                            </tr>
                            <tr className="border-b border-white/10">
                              <td className="text-white/90 py-3 px-2 font-medium">Monthly EMI</td>
                              <td className="text-red-200 py-3 px-2 text-center">{formatCurrency(loanData.emi)}</td>
                              <td className="text-emerald-200 py-3 px-2 text-center">
                                {selectedScenario === 'reduce_emi' && results.newEMI 
                                  ? formatCurrency(results.newEMI) 
                                  : formatCurrency(loanData.emi)
                                }
                              </td>
                              <td className="text-blue-200 py-3 px-2 text-center">
                                {selectedScenario === 'reduce_emi' && results.newEMI ? (
                                  <>-{formatCurrency(loanData.emi - results.newEMI)}</>
                                ) : 'No change'}
                              </td>
                            </tr>
                            <tr className="border-b border-white/10">
                              <td className="text-white/90 py-3 px-2 font-medium">Total Cost to You</td>
                              <td className="text-red-200 py-3 px-2 text-center">{formatCurrency(results.originalTotalAmount)}</td>
                              <td className="text-emerald-200 py-3 px-2 text-center">{formatCurrency(results.totalAmountPaid)}</td>
                              <td className="text-blue-200 py-3 px-2 text-center">
                                {(() => {
                                  const difference = results.originalTotalAmount - results.totalAmountPaid;
                                  const isHigherCost = difference < 0;
                                  return isHigherCost 
                                    ? `+${formatCurrency(Math.abs(difference))}`
                                    : `-${formatCurrency(difference)}`;
                                })()}
                              </td>
                            </tr>
                            <tr className="border-b border-white/10">
                              <td className="text-white/90 py-3 px-2 font-medium">Interest Paid</td>
                              <td className="text-red-200 py-3 px-2 text-center">{formatCurrency(results.originalInterest)}</td>
                              <td className="text-emerald-200 py-3 px-2 text-center">{formatCurrency(results.interestPaid)}</td>
                              <td className="text-blue-200 py-3 px-2 text-center">
                                {(() => {
                                  const difference = results.originalInterest - results.interestPaid;
                                  return difference >= 0 
                                    ? `-${formatCurrency(difference)}`
                                    : `+${formatCurrency(Math.abs(difference))}`;
                                })()}
                              </td>
                            </tr>
                            {loanType === 'fixed' && results.penaltyAmount && results.penaltyAmount > 0 && (
                              <tr className="border-b border-white/10 bg-orange-500/10">
                                <td className="text-white/90 py-3 px-2 font-medium">Prepayment Penalty</td>
                                <td className="text-red-200 py-3 px-2 text-center">₹0</td>
                                <td className="text-orange-200 py-3 px-2 text-center">{formatCurrency(results.penaltyAmount)}</td>
                                <td className="text-orange-200 py-3 px-2 text-center">+{formatCurrency(results.penaltyAmount)}</td>
                              </tr>
                            )}
                            <tr className="bg-emerald-500/20 border border-emerald-400/40">
                              <td className="text-emerald-100 py-4 px-2 font-bold">Total Savings</td>
                              <td className="text-center py-4 px-2">-</td>
                              <td className="text-center py-4 px-2">-</td>
                              <td className="text-emerald-100 py-4 px-2 text-center font-bold text-lg">
                                {(() => {
                                  // Use the interest savings as the primary savings metric
                                  const interestSavings = results.originalInterest - results.interestPaid;
                                  // For fixed loans, subtract penalty from savings
                                  const netSavings = loanType === 'fixed' && results.penaltyAmount 
                                    ? interestSavings - results.penaltyAmount 
                                    : interestSavings;
                                  
                                  // If prepayment is 0, savings will be 0
                                  if (prepaymentAmount === 0) {
                                    return "₹0";
                                  }
                                  
                                  return formatCurrency(Math.max(0, netSavings));
                                })()}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="mt-4 space-y-3">
                        {loanType === 'fixed' && results.penaltyAmount && results.penaltyAmount > 0 && (
                          <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-400/30">
                            <p className="text-orange-200 text-xs">
                              * Net savings calculated after deducting {penaltyRate}% prepayment penalty for fixed rate loans
                            </p>
                          </div>
                        )}
                        
                        <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-400/30">
                          <p className="text-blue-200 text-xs font-medium mb-2">💡 Why "Total Cost to You" is higher with prepayment:</p>
                          <p className="text-blue-200 text-xs leading-relaxed">
                            • <strong>Without prepayment:</strong> You only pay EMIs (₹{formatCurrency(results.originalTotalAmount).replace('₹', '')}) <br/>
                            • <strong>With prepayment:</strong> You pay EMIs + prepayment amounts (₹{formatCurrency(results.totalAmountPaid).replace('₹', '')}) <br/>
                            • <strong>The benefit:</strong> You save ₹{formatCurrency(results.originalInterest - results.interestPaid).replace('₹', '')} in interest and finish {(() => {
                              const monthsSaved = results.monthsSaved || 0;
                              return monthsSaved >= 12 
                                ? `${Math.floor(monthsSaved / 12)} years ${monthsSaved % 12} months` 
                                : `${monthsSaved} months`;
                            })()} earlier!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calculator className="w-16 h-16 text-white/30 mx-auto mb-4" />
                    <p className="text-white/60">Configure your prepayment to see RBI-compliant calculations</p>
                    <p className="text-white/40 text-sm mt-2">Prepayments applied after scheduled EMI as per RBI guidelines</p>
                  </div>
                )}
                </div>

                {/* Prepayment Configuration */}
                <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                  <h3 className="text-white font-semibold text-lg mb-4 flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-yellow-400" />
                    <span>Prepayment Details</span>
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Frequency Selection */}
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-3">Payment Frequency</label>
                      <div className="flex bg-white/5 rounded-xl p-1 border border-white/20">
                        <button
                          onClick={() => setPrepaymentFrequency('yearly')}
                          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                            prepaymentFrequency === 'yearly'
                              ? 'bg-white/20 text-white shadow-sm'
                              : 'text-white/70 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          Yearly
                        </button>
                        <button
                          onClick={() => setPrepaymentFrequency('monthly')}
                          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                            prepaymentFrequency === 'monthly'
                              ? 'bg-white/20 text-white shadow-sm'
                              : 'text-white/70 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          Monthly
                        </button>
                      </div>
                    </div>

                    {/* Simple Prepayment Amount Input */}
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-3">
                        {prepaymentFrequency === 'yearly' ? 'Yearly' : 'Monthly'} Prepayment Amount
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 font-medium">₹</span>
                        <input
                          type="number"
                          value={prepaymentAmount}
                          onChange={(e) => setPrepaymentAmount(parseFloat(e.target.value) || 0)}
                          className="w-full bg-white/10 border border-white/20 rounded-xl pl-8 pr-4 py-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 backdrop-blur-sm"
                          placeholder={`Enter ${prepaymentFrequency} amount`}
                        />
                      </div>
                      <p className="text-white/60 text-xs mt-2">
                        Suggested: {formatCurrency(loanData.loanAmount * (prepaymentFrequency === 'yearly' ? 0.1 : 0.008))}
                      </p>
                    </div>
                  </div>
                </div>
                </motion.div>
              </div>
            </div>

            {/* Side-by-side Comparison Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-12"
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
                <h3 className="text-white font-bold text-2xl mb-6 flex items-center space-x-2">
                  <span>⚖️</span>
                  <span>Fixed vs Floating Rate Comparison</span>
                </h3>
                
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Floating Rate Results */}
                  <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/20 rounded-2xl p-6 border border-emerald-400/30">
                    <h4 className="text-emerald-300 font-bold text-lg mb-4 flex items-center space-x-2">
                      <span>💚</span>
                      <span>Floating Rate Loan</span>
                    </h4>
                    
                    {(() => {
                      const floatingResults = loanData.loanAmount > 0 ? calculateLoanDetails(
                        loanData.loanAmount,
                        loanData.interestRate,
                        loanData.tenure,
                        prepaymentAmount,
                        prepaymentFrequency,
                        selectedScenario,
                        'floating',
                        0
                      ) : null;

                      return floatingResults ? (
                        <div className="space-y-4">
                          <div className="bg-white/10 rounded-lg p-4">
                            <div className="text-emerald-200 text-sm mb-2">Interest Savings</div>
                            <div className="text-white text-xl font-bold">{formatCurrency(floatingResults.amountSaved)}</div>
                          </div>
                          <div className="bg-white/10 rounded-lg p-4">
                            <div className="text-emerald-200 text-sm mb-2">Prepayment Penalty</div>
                            <div className="text-white text-xl font-bold">₹0</div>
                            <div className="text-emerald-200 text-xs mt-1">RBI compliant - no penalty</div>
                          </div>
                          <div className="bg-emerald-500/20 rounded-lg p-4 border border-emerald-400/40">
                            <div className="text-emerald-200 text-sm mb-2">Net Savings</div>
                            <div className="text-emerald-100 text-2xl font-bold">{formatCurrency(floatingResults.amountSaved)}</div>
                          </div>
                          {selectedScenario === 'reduce_tenure' && floatingResults.newTenure && (
                            <div className="bg-white/10 rounded-lg p-4">
                              <div className="text-emerald-200 text-sm mb-2">Time Saved</div>
                              <div className="text-white text-lg font-semibold">
                                {formatTenure(loanData.tenure - floatingResults.newTenure)}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-emerald-200/60 text-center py-8">
                          Configure prepayment to see comparison
                        </div>
                      );
                    })()}
                  </div>

                  {/* Fixed Rate Results */}
                  <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/20 rounded-2xl p-6 border border-orange-400/30">
                    <h4 className="text-orange-300 font-bold text-lg mb-4 flex items-center space-x-2">
                      <span>🔒</span>
                      <span>Fixed Rate Loan</span>
                    </h4>
                    
                    {(() => {
                      const fixedResults = loanData.loanAmount > 0 ? calculateLoanDetails(
                        loanData.loanAmount,
                        loanData.interestRate,
                        loanData.tenure,
                        prepaymentAmount,
                        prepaymentFrequency,
                        selectedScenario,
                        'fixed',
                        2.5 // Default penalty rate for comparison
                      ) : null;

                      return fixedResults ? (
                        <div className="space-y-4">
                          <div className="bg-white/10 rounded-lg p-4">
                            <div className="text-orange-200 text-sm mb-2">Interest Savings</div>
                            <div className="text-white text-xl font-bold">{formatCurrency(fixedResults.amountSaved)}</div>
                          </div>
                          <div className="bg-white/10 rounded-lg p-4">
                            <div className="text-orange-200 text-sm mb-2">Prepayment Penalty</div>
                            <div className="text-white text-xl font-bold">{formatCurrency(fixedResults.penaltyAmount || 0)}</div>
                            <div className="text-orange-200 text-xs mt-1">2.5% of prepaid amount</div>
                          </div>
                          <div className="bg-orange-500/20 rounded-lg p-4 border border-orange-400/40">
                            <div className="text-orange-200 text-sm mb-2">Net Savings</div>
                            <div className="text-orange-100 text-2xl font-bold">{formatCurrency(fixedResults.netSavings || 0)}</div>
                          </div>
                          {selectedScenario === 'reduce_tenure' && fixedResults.newTenure && (
                            <div className="bg-white/10 rounded-lg p-4">
                              <div className="text-orange-200 text-sm mb-2">Time Saved</div>
                              <div className="text-white text-lg font-semibold">
                                {formatTenure(loanData.tenure - fixedResults.newTenure)}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-orange-200/60 text-center py-8">
                          Configure prepayment to see comparison
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Comparison Summary */}
                {loanData.loanAmount > 0 && prepaymentAmount > 0 && (
                  <div className="mt-8 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-blue-400/20">
                    <h4 className="text-white font-semibold text-lg mb-4 flex items-center space-x-2">
                      <span>📊</span>
                      <span>Quick Comparison</span>
                    </h4>
                    
                    {(() => {
                      const floatingResult = calculateLoanDetails(
                        loanData.loanAmount,
                        loanData.interestRate,
                        loanData.tenure,
                        prepaymentAmount,
                        prepaymentFrequency,
                        selectedScenario,
                        'floating',
                        0
                      );
                      
                      const fixedResult = calculateLoanDetails(
                        loanData.loanAmount,
                        loanData.interestRate,
                        loanData.tenure,
                        prepaymentAmount,
                        prepaymentFrequency,
                        selectedScenario,
                        'fixed',
                        2.5
                      );

                      const difference = (floatingResult?.amountSaved || 0) - (fixedResult?.netSavings || 0);

                      return (
                        <div className="text-center">
                          <div className="text-white/70 text-sm mb-2">Floating rate saves you</div>
                          <div className={`text-2xl font-bold ${difference > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {formatCurrency(Math.abs(difference))} more
                          </div>
                          <div className="text-white/60 text-xs mt-2">
                            {difference > 0 ? 'Choose floating for better savings' : 'Fixed may be better despite penalty'}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer - Compact like calculator page */}
      <footer className="relative z-10 mt-12 mb-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-lg">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-5 h-5 bg-white/10 rounded-full flex items-center justify-center mt-0.5">
                <svg className="w-3 h-3 text-white/50" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-white/90 mb-1 text-sm">Important Note</p>
                <p className="text-white/70 leading-relaxed text-sm">
                  RBI-compliant calculations. Actual rates may vary by lender. Fixed-rate loans may have prepayment penalties.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

export default function PrepaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <Calculator className="w-12 h-12 mx-auto mb-4 animate-pulse text-blue-400" />
          <p className="text-lg">Loading Smart Prepayment Calculator...</p>
          <p className="text-white/60 text-sm mt-2">Analyzing your loan data</p>
        </div>
      </div>
    }>
      <PrepaymentCalculator />
    </Suspense>
  )
}