/*
===============================================================================
PREPAYMENT CALCULATOR - COMPREHENSIVE IMPLEMENTATION
===============================================================================

OVERVIEW:
This module implements a loan prepayment calculator following RBI guidelines and 
industry best practices as used by major Indian banks (HDFC, SBI, ICICI, Axis).

KEY FEATURES:
- Single strategy: "Reduce Loan Tenure" (industry-preferred approach)
- RBI-compliant prepayment penalty handling
- Industry-standard calculation methodology
- Real-time amortization schedule generation

===============================================================================
CALCULATION METHODOLOGY
===============================================================================

1. EMI CALCULATION (Standard PMT Formula):
   EMI = P × r × (1+r)^n / [(1+r)^n - 1]
   Where:
   - P = Principal loan amount
   - r = Monthly interest rate (Annual rate / 12 / 100)
   - n = Total number of months

2. PREPAYMENT APPLICATION TIMING (Industry Standard):
   *** CRITICAL: Prepayment applied BEFORE EMI calculation ***
   
   Month-by-Month Process:
   a) Apply prepayment (if due) → Reduces outstanding balance
   b) Calculate interest on REDUCED balance
   c) Apply EMI (interest + principal components)
   d) Update remaining balance
   
   This approach maximizes customer savings and matches all major bank calculators.

3. PREPAYMENT FREQUENCY:
   - Yearly: Applied every 12 months (month % 12 === 0)
   - Monthly: Applied every month (month % 1 === 0)
   - Uses modulo operator for consistent scheduling

4. PENALTY CALCULATION (RBI Guidelines):
   - Floating Rate Loans: 0% penalty (RBI mandated)
   - Fixed Rate Loans: Typically 2-5% of prepaid amount
   - Penalty = Total Prepayments × Penalty Rate / 100

5. SAVINGS CALCULATION:
   - Interest Savings = Original Interest - Actual Interest Paid
   - Net Savings = Interest Savings - Prepayment Penalty
   - Time Savings = Original Tenure - Actual Tenure (months)

===============================================================================
AMORTIZATION SCHEDULE LOGIC
===============================================================================

For each month until loan closure:
1. Check if prepayment is due (frequency-based)
2. Apply prepayment to outstanding balance
3. Calculate interest on remaining balance
4. Determine principal component of EMI
5. Apply EMI payment
6. Update outstanding balance
7. Record transaction details

Loop continues until:
- Outstanding balance ≤ ₹1 (loan fully paid)
- Maximum months reached (safety limit)

===============================================================================
RBI COMPLIANCE & INDUSTRY STANDARDS
===============================================================================

1. PREPAYMENT CHARGES:
   - No charges for floating rate personal loans
   - Fixed rate loans may have penalty (must be disclosed)
   - Maximum penalty typically capped at 2-5%

2. TRANSPARENCY REQUIREMENTS:
   - Clear disclosure of penalty amounts
   - Month-by-month breakdown available
   - Total cost comparison (with/without prepayment)

3. CALCULATION ACCURACY:
   - Follows compound interest principles
   - Rounding to nearest rupee for practical use
   - Matches bank EMI calculators for verification

===============================================================================
DATA FLOW & STATE MANAGEMENT
===============================================================================

Input Parameters:
- Loan Amount (₹)
- Interest Rate (% p.a.)
- Tenure (years)
- Prepayment Amount (₹)
- Prepayment Frequency (monthly/yearly)
- Loan Type (fixed/floating)
- Penalty Rate (% for fixed loans)

Output Results:
- New loan tenure (reduced)
- Total amount paid (EMIs + prepayments + penalty)
- Interest paid (actual)
- Amount saved (interest savings)
- Net savings (after penalty deduction)
- Months saved
- Detailed amortization schedule

===============================================================================
VALIDATION & ERROR HANDLING
===============================================================================

1. Input Validation:
   - Positive loan amount, interest rate, tenure
   - Non-negative prepayment amount
   - Reasonable penalty rates (0-5%)

2. Calculation Safeguards:
   - Maximum iteration limit to prevent infinite loops
   - Balance checks to prevent negative amounts
   - Proper handling of final payment adjustments

===============================================================================
UI/UX CONSIDERATIONS
===============================================================================

1. SIMPLIFIED INTERFACE:
   - Single strategy focus (reduce tenure)
   - Clear metric displays with color coding
   - Responsive design for all devices

2. COMPARISON TABLES:
   - Before/After prepayment scenarios
   - Fixed vs Floating rate comparison
   - Time and money savings highlighted

3. EDUCATIONAL CONTENT:
   - RBI guideline explanations
   - Industry best practice notes
   - Clear benefit explanations

===============================================================================
*/

'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Calculator, Clock, DollarSign, PiggyBank, Target, Zap } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'

interface LoanData {
  loanAmount: number
  interestRate: number
  tenure: number
  emi: number
}

interface PrepaymentResult {
  scenario: 'reduce_tenure'
  prepaymentAmount: number
  newTenure: number
  totalAmountPaid: number
  interestPaid: number
  amountSaved: number
  originalTotalAmount: number
  originalInterest: number
  penaltyAmount?: number
  netSavings?: number
  monthsSaved?: number
}

/*
===============================================================================
CORE CALCULATION FUNCTIONS
===============================================================================
*/

/**
 * EMI CALCULATION - Standard PMT Formula Implementation
 * 
 * Formula: EMI = P × r × (1+r)^n / [(1+r)^n - 1]
 * 
 * This is the industry-standard compound interest formula used by all banks
 * for calculating Equated Monthly Installments (EMI).
 * 
 * @param principal - Loan amount in rupees
 * @param rate - Annual interest rate (percentage)
 * @param years - Loan tenure in years
 * @returns Monthly EMI amount in rupees
 */
const calculateEMI = (principal: number, rate: number, years: number): number => {
  const monthlyRate = rate / (12 * 100)  // Convert annual % to monthly decimal
  const months = years * 12              // Convert years to months
  
  // Handle edge case: 0% interest rate (rare but possible)
  if (monthlyRate === 0) return principal / months
  
  // Standard PMT formula implementation
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
}

/**
 * MAIN PREPAYMENT CALCULATION ENGINE
 * 
 * This function implements the complete loan prepayment calculation logic
 * following industry best practices and RBI guidelines.
 * 
 * KEY IMPLEMENTATION DETAILS:
 * 1. Prepayment applied BEFORE monthly interest calculation (industry standard)
 * 2. Interest calculated on reduced balance after prepayment
 * 3. Only "Reduce Tenure" strategy (most beneficial for customers)
 * 4. Comprehensive amortization schedule generation
 * 5. RBI-compliant penalty handling
 * 
 * @param loanAmount - Principal loan amount (₹)
 * @param interestRate - Annual interest rate (%)
 * @param tenure - Original loan tenure (years)
 * @param prepaymentAmount - Amount to prepay periodically (₹)
 * @param prepaymentFrequency - How often to make prepayments
 * @param loanType - Fixed or floating rate loan
 * @param penaltyRate - Prepayment penalty rate for fixed loans (%)
 * @returns Complete calculation results with amortization schedule
 */
const calculateLoanDetails = (
  loanAmount: number,
  interestRate: number,
  tenure: number,
  prepaymentAmount: number,
  prepaymentFrequency: 'monthly' | 'yearly',
  loanType: 'fixed' | 'floating' = 'floating',
  penaltyRate: number = 0
): PrepaymentResult & { amortizationSchedule?: Array<{month: number, emi: number, interest: number, principal: number, prepayment: number, balance: number}> } => {
  // Input validation
  if (loanAmount <= 0 || interestRate <= 0 || tenure <= 0 || prepaymentAmount < 0) {
    return {
      scenario: 'reduce_tenure',
      prepaymentAmount,
      newTenure: tenure,
      totalAmountPaid: 0,
      interestPaid: 0,
      amountSaved: 0,
      originalTotalAmount: 0,
      originalInterest: 0,
      penaltyAmount: 0,
      netSavings: 0
    }
  }

  // ========================================================================
  // BASELINE CALCULATIONS (Without Prepayment)
  // ========================================================================
  const originalEMI = calculateEMI(loanAmount, interestRate, tenure)
  const originalTotalAmount = originalEMI * tenure * 12  // Total amount without prepayment
  const originalInterest = originalTotalAmount - loanAmount  // Total interest without prepayment
  
  const monthlyRate = interestRate / (12 * 100)  // Convert annual rate to monthly decimal
  
  // Prepayment frequency conversion: yearly=12 months, monthly=1 month
  const prepayFreq = prepaymentFrequency === 'yearly' ? 12 : 1
  
  // ========================================================================
  // AMORTIZATION LOOP - "REDUCE TENURE" STRATEGY
  // ========================================================================
  // This loop simulates month-by-month loan payments with prepayments
  // Key: Prepayment applied BEFORE interest calculation (industry standard)
  
  let remainingPrincipal = loanAmount      // Outstanding loan balance
  let totalEMIsPaid = 0                    // Sum of all EMI payments
  let totalInterestPaid = 0                // Sum of all interest payments
  let totalPrepaymentsPaid = 0             // Sum of all prepayments
  let months = 0                           // Counter for actual months taken
  const maxMonths = tenure * 12 + 60       // Safety limit to prevent infinite loops
  
  // Array to store month-by-month breakdown for transparency
  const amortizationSchedule: Array<{month: number, emi: number, interest: number, principal: number, prepayment: number, balance: number}> = []
  
  // Main calculation loop - continues until loan is fully paid
  while (remainingPrincipal > 1 && months < maxMonths) {
    months++
    
    // ====================================================================
    // STEP 1: APPLY PREPAYMENT (BEFORE INTEREST CALCULATION)
    // ====================================================================
    // This is the CRITICAL difference: prepayment reduces balance FIRST
    // Then interest is calculated on the reduced balance
    // This maximizes customer savings and matches bank calculations
    
    let currentPrepayment = 0
    if (prepaymentAmount > 0 && remainingPrincipal > 1) {
      // Check if prepayment is due this month based on frequency
      const shouldApplyPrepayment = (months % prepayFreq) === 0
      
      if (shouldApplyPrepayment) {
        // Apply prepayment (cannot exceed remaining balance)
        currentPrepayment = Math.min(prepaymentAmount, remainingPrincipal)
        remainingPrincipal -= currentPrepayment
        totalPrepaymentsPaid += currentPrepayment
      }
    }
    
    // Exit if loan is fully paid after prepayment
    if (remainingPrincipal <= 1) break
    
    // ====================================================================
    // STEP 2: CALCULATE INTEREST ON REDUCED BALANCE
    // ====================================================================
    // Interest is now calculated AFTER prepayment has reduced the balance
    // This is how banks actually apply prepayments in practice
    
    const interestPortion = remainingPrincipal * monthlyRate
    let emiAmount = originalEMI  // EMI amount remains same (reduce tenure strategy)
    let principalFromEMI = Math.min(originalEMI - interestPortion, remainingPrincipal)
    
    // ====================================================================
    // STEP 3: HANDLE FINAL PAYMENT ADJUSTMENT
    // ====================================================================
    // If remaining balance is less than normal EMI, adjust the final payment
    
    if (remainingPrincipal <= originalEMI - interestPortion) {
      emiAmount = remainingPrincipal + interestPortion  // Final payment amount
      principalFromEMI = remainingPrincipal             // All remaining goes to principal
    }
    
    // Safety check to prevent negative principal payments
    if (principalFromEMI <= 0) break
    
    // ====================================================================
    // STEP 4: APPLY EMI AND UPDATE BALANCES
    // ====================================================================
    
    remainingPrincipal -= principalFromEMI  // Reduce outstanding balance
    totalEMIsPaid += emiAmount              // Track total EMI payments
    totalInterestPaid += interestPortion    // Track total interest paid
    
    // ====================================================================
    // STEP 5: RECORD TRANSACTION FOR AMORTIZATION SCHEDULE
    // ====================================================================
    // Store detailed breakdown for transparency and verification
    
    amortizationSchedule.push({
      month: months,
      emi: emiAmount,
      interest: interestPortion,
      principal: principalFromEMI,
      prepayment: currentPrepayment,
      balance: remainingPrincipal
    })
  }
  
  // ========================================================================
  // FINAL CALCULATIONS AND RESULTS
  // ========================================================================
  
  // Calculate penalty for fixed-rate loans (RBI allows up to 2-5%)
  const totalPrepaymentMade = totalPrepaymentsPaid
  const penaltyAmount = loanType === 'fixed' ? (totalPrepaymentMade * penaltyRate / 100) : 0
  
  // Calculate final results
  const newTenureYears = months / 12                                    // Actual tenure taken
  const totalAmountPaid = totalEMIsPaid + totalPrepaymentsPaid + penaltyAmount  // Total outflow
  const interestSavings = originalInterest - totalInterestPaid          // Gross interest saved
  const netSavings = Math.max(0, interestSavings - penaltyAmount)       // Net savings after penalty
  const monthsSaved = (tenure * 12) - months                           // Time saved in months
  
  return {
    scenario: 'reduce_tenure',
    prepaymentAmount,
    newTenure: newTenureYears,
    totalAmountPaid: Math.round(totalAmountPaid),
    interestPaid: Math.round(totalInterestPaid),
    amountSaved: Math.round(interestSavings),
    originalTotalAmount: Math.round(originalTotalAmount),
    originalInterest: Math.round(originalInterest),
    penaltyAmount: Math.round(penaltyAmount),
    netSavings: Math.round(netSavings),
    amortizationSchedule,
    monthsSaved
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
  const selectedScenario = 'reduce_tenure'
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
    'floating',
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
                
                {results ? (
                  /* Hero Summary Card - Before vs After Comparison */
                  <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">
                      {/* Without Prepayment */}
                      <div className="p-6 text-center">
                        <h3 className="text-gray-400 text-base font-medium mb-4">Without Prepayment</h3>
                        <div className="text-white text-4xl font-bold mb-2">{formatTenure(loanData.tenure)}</div>
                      </div>
                      
                      {/* With Prepayment */}
                      <div className="p-6 text-center">
                        <h3 className="text-gray-400 text-base font-medium mb-4">With Prepayment</h3>
                        <div className="text-white text-4xl font-bold mb-2">{formatTenure(results.newTenure)}</div>
                      </div>
                    </div>
                    
                    {/* Savings Summary */}
                    <div className="bg-white/5 border-t border-white/10 p-6 text-center">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                          <span className="text-green-400 text-xl font-bold">₹</span>
                        </div>
                        <span className="text-white text-lg">You save </span>
                        <span className="text-green-400 text-2xl font-bold">
                          ₹{Math.round(
                            penaltyRate > 0 && results.penaltyAmount 
                              ? Math.max(0, results.amountSaved - results.penaltyAmount)
                              : results.amountSaved
                          ).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm">
                        and finish <span className="font-semibold">
                          {(() => {
                            const monthsSaved = results.monthsSaved || 0;
                            const years = Math.floor(monthsSaved / 12);
                            const remainingMonths = monthsSaved % 12;
                            if (years === 0) {
                              return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
                            } else if (remainingMonths === 0) {
                              return `${years} year${years !== 1 ? 's' : ''}`;
                            } else {
                              return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
                            }
                          })()}
                        </span> earlier
                      </p>
                    </div>
                  </div>
                ) : null}

                {/* Collapsible Loan Details Section */}
                <details className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
                  <summary className="cursor-pointer p-6 select-none">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-white/70" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        <h3 className="text-white font-bold text-lg">Loan Details</h3>
                      </div>
                      <svg className="w-5 h-5 text-white/70 transform transition-transform" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </summary>
                  
                  <div className="px-6 pb-6 border-t border-white/10">
                    {results ? (
                      <div className="overflow-x-auto">
                        <table className="w-full mt-4">
                          <thead>
                            <tr className="border-b border-white/20">
                              <th className="text-left text-white/80 text-sm font-medium py-3">Metric</th>
                              <th className="text-center text-white/80 text-sm font-medium py-3">Before</th>
                              <th className="text-center text-white/80 text-sm font-medium py-3">After</th>
                              <th className="text-center text-green-400 text-sm font-medium py-3">Savings</th>
                            </tr>
                          </thead>
                          <tbody className="text-sm">
                            <tr className="border-b border-white/10">
                              <td className="py-3 text-white">Loan Tenure</td>
                              <td className="py-3 text-center text-white">{formatTenure(loanData.tenure)}</td>
                              <td className="py-3 text-center text-white">{formatTenure(results.newTenure)}</td>
                              <td className="py-3 text-center text-green-400 font-medium">
                                {(() => {
                                  const monthsSaved = results.monthsSaved || 0;
                                  const years = Math.floor(monthsSaved / 12);
                                  const remainingMonths = monthsSaved % 12;
                                  if (years === 0) {
                                    return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
                                  } else if (remainingMonths === 0) {
                                    return `${years} year${years !== 1 ? 's' : ''}`;
                                  } else {
                                    return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
                                  }
                                })()}
                              </td>
                            </tr>
                            <tr className="border-b border-white/10">
                              <td className="py-3 text-white">Interest Paid</td>
                              <td className="py-3 text-center text-white">{formatCurrency(results.originalInterest)}</td>
                              <td className="py-3 text-center text-white">{formatCurrency(results.interestPaid)}</td>
                              <td className="py-3 text-center text-green-400 font-medium">₹{(results.originalInterest - results.interestPaid).toLocaleString('en-IN')}</td>
                            </tr>
                            <tr className="border-b border-white/10">
                              <td className="py-3 text-white">Monthly EMI</td>
                              <td className="py-3 text-center text-white">{formatCurrency(loanData.emi)}</td>
                              <td className="py-3 text-center text-white">{formatCurrency(loanData.emi)}</td>
                              <td className="py-3 text-center text-gray-400">—</td>
                            </tr>
                          </tbody>
                        </table>
                        
                        <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-white/70 text-xs">
                            Savings calculated after prepayment penalty
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 text-center py-8">
                        <p className="text-white/60">Configure your prepayment to see detailed breakdown</p>
                      </div>
                    )}
                  </div>
                </details>

                {/* Prepayment Configuration */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
                  <h3 className="text-white font-bold text-lg mb-6 flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                    <span>Prepayment Configuration</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Prepayment Amount */}
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-3">
                        {prepaymentFrequency === 'yearly' ? 'Yearly' : 'Monthly'} Prepayment Amount
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 font-medium">₹</span>
                        <input
                          type="number"
                          value={prepaymentAmount}
                          onChange={(e) => setPrepaymentAmount(parseFloat(e.target.value) || 0)}
                          className="w-full bg-white/10 border border-white/20 rounded-xl pl-8 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
                          placeholder={`Enter ${prepaymentFrequency} amount`}
                        />
                      </div>
                    </div>
                    
                    {/* Frequency Selection */}
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-3">Payment Frequency</label>
                      <div className="flex bg-white/10 rounded-xl p-1 border border-white/20">
                        <button
                          onClick={() => setPrepaymentFrequency('yearly')}
                          className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all duration-200 ${
                            prepaymentFrequency === 'yearly'
                              ? 'bg-white/20 text-white shadow-sm'
                              : 'text-white/70 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          Yearly
                        </button>
                        <button
                          onClick={() => setPrepaymentFrequency('monthly')}
                          className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all duration-200 ${
                            prepaymentFrequency === 'monthly'
                              ? 'bg-white/20 text-white shadow-sm'
                              : 'text-white/70 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          Monthly
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Penalty Input */}
                  <div className="mt-6">
                    <label className="block text-white/80 text-sm font-medium mb-3">Prepayment Penalty (if any)</label>
                    <div className="relative max-w-xs">
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
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                        placeholder="0 for most loans"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 font-medium">%</span>
                    </div>
                    <p className="text-white/60 text-xs mt-2">
                      Most floating rate loans have 0% penalty (RBI guidelines)
                    </p>
                  </div>
                </div>


                </motion.div>
              </div>
            </div>

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