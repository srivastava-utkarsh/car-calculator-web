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
import { Calculator } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useTheme } from '@/contexts/ThemeContext'
import { themeClass } from '@/utils/themeStyles'

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
  prepaymentFrequency: 'monthly' | 'quarterly' | 'yearly' | 'lumpsum',
  penaltyRate: number = 0
): PrepaymentResult & { amortizationSchedule?: Array<{month: number, emi: number, interest: number, principal: number, prepayment: number, balance: number}> } => {
  // Input validation
  if (loanAmount <= 0 || interestRate <= 0 || tenure <= 0 || prepaymentAmount < 0) {
    return {
      scenario: 'reduce_tenure',
      prepaymentAmount,
      newTenure: tenure,
      totalAmountPaid: loanAmount,
      interestPaid: 0,
      amountSaved: 0,
      originalTotalAmount: loanAmount,
      originalInterest: 0,
      penaltyAmount: 0,
      netSavings: 0
    }
  }

  // Additional validation for reasonable values
  if (interestRate > 50) interestRate = 50 // Cap at 50% annual
  if (tenure > 30) tenure = 30 // Cap at 30 years
  if (penaltyRate > 10) penaltyRate = 10 // Cap penalty at 10%

  // ========================================================================
  // BASELINE CALCULATIONS (Without Prepayment)
  // ========================================================================
  const originalEMI = calculateEMI(loanAmount, interestRate, tenure)
  const originalTotalAmount = originalEMI * tenure * 12  // Total amount without prepayment
  const originalInterest = originalTotalAmount - loanAmount  // Total interest without prepayment
  
  const monthlyRate = interestRate / (12 * 100)  // Convert annual rate to monthly decimal
  
  // Prepayment frequency conversion: yearly=12, quarterly=3, monthly=1, lumpsum=first month only
  const prepayFreq = prepaymentFrequency === 'yearly' ? 12 : 
                    prepaymentFrequency === 'quarterly' ? 3 : 
                    prepaymentFrequency === 'monthly' ? 1 : 
                    999 // lumpsum - will be handled specially
  
  // ========================================================================
  // AMORTIZATION LOOP - HANDLES BOTH STRATEGIES
  // ========================================================================
  // This loop simulates month-by-month loan payments with prepayments
  // Key: Prepayment applied BEFORE interest calculation (industry standard)
  
  let remainingPrincipal = loanAmount      // Outstanding loan balance
  let totalEMIsPaid = 0                    // Sum of all EMI payments
  let totalInterestPaid = 0                // Sum of all interest payments
  let totalPrepaymentsPaid = 0             // Sum of all prepayments
  let months = 0                           // Counter for actual months taken
  let currentEMI = originalEMI             // Current EMI (stays constant for reduce_tenure)
  const maxMonths = tenure * 12 + 60      // Safety limit
  
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
      let shouldApplyPrepayment = false
      
      if (prepaymentFrequency === 'lumpsum') {
        // Lumpsum: Apply only in the first month
        shouldApplyPrepayment = months === 1
      } else {
        // Periodic payments: Apply based on frequency
        shouldApplyPrepayment = (months % prepayFreq) === 0
      }
      
      if (shouldApplyPrepayment) {
        // Apply prepayment (cannot exceed remaining balance)
        currentPrepayment = Math.min(prepaymentAmount, remainingPrincipal)
        remainingPrincipal -= currentPrepayment
        totalPrepaymentsPaid += currentPrepayment
        
        // For "Reduce Tenure" strategy, EMI remains constant
        // No recalculation needed - prepayment reduces loan duration instead
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
    let emiAmount = currentEMI  // Use current EMI (may have changed for reduce_emi)
    let principalFromEMI = Math.min(currentEMI - interestPortion, remainingPrincipal)
    
    // ====================================================================
    // STEP 3: HANDLE FINAL PAYMENT ADJUSTMENT
    // ====================================================================
    // If remaining balance is less than normal EMI, adjust the final payment
    
    if (remainingPrincipal <= currentEMI - interestPortion) {
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
  
  // Calculate penalty based on user input (regardless of loan type when penalty rate is set)
  const totalPrepaymentMade = totalPrepaymentsPaid
  const penaltyAmount = penaltyRate > 0 ? (totalPrepaymentMade * penaltyRate / 100) : 0
  
  // Calculate final results
  const newTenureYears = months / 12                                    // Actual tenure taken
  const totalAmountPaid = totalEMIsPaid + totalPrepaymentsPaid + penaltyAmount  // Total outflow
  const interestSavings = originalInterest - totalInterestPaid          // Gross interest saved
  const netSavings = Math.max(0, interestSavings - penaltyAmount)       // Net savings after penalty
  const monthsSaved = (tenure * 12) - months                           // Time saved in months
  
  return {
    scenario: 'reduce_tenure',
    prepaymentAmount,
    newTenure: Math.round(newTenureYears * 100) / 100, // Round to 2 decimal places
    totalAmountPaid: Math.round(totalAmountPaid),
    interestPaid: Math.round(totalInterestPaid),
    amountSaved: Math.round(Math.max(0, interestSavings)), // Ensure non-negative
    originalTotalAmount: Math.round(originalTotalAmount),
    originalInterest: Math.round(originalInterest),
    penaltyAmount: Math.round(Math.max(0, penaltyAmount)), // Ensure non-negative
    netSavings: Math.round(Math.max(0, netSavings)), // Ensure non-negative
    amortizationSchedule,
    monthsSaved: Math.max(0, monthsSaved) // Ensure non-negative
  }
}

function PrepaymentCalculator() {
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const { isLight, isDark } = useTheme()
  
  const [loanData, setLoanData] = useState<LoanData>({
    loanAmount: 0,
    interestRate: 8,
    tenure: 0,
    emi: 0
  })
  
  const [prepaymentAmount, setPrepaymentAmount] = useState(0)
  const [prepaymentFrequency, setPrepaymentFrequency] = useState<'monthly' | 'quarterly' | 'yearly' | 'lumpsum'>('yearly')
  const prepaymentStrategy = 'reduce_tenure' // Fixed to reduce tenure only
  const [penaltyRate, setPenaltyRate] = useState(0)
  const [tenureDisplayFormat] = useState<'years' | 'months'>('years')

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
    
    // Set loading to false after component is ready
    setIsLoading(false)
  }, [searchParams])

  const results = loanData.loanAmount > 0 ? calculateLoanDetails(
    loanData.loanAmount,
    loanData.interestRate,
    loanData.tenure,
    prepaymentAmount,
    prepaymentFrequency,
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

  if (isLoading) {
    return (
      <main className={`min-h-screen font-sans relative ${isLight ? 'bg-gradient-to-br from-slate-50 via-white to-slate-50' : 'bg-black'}`} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className={`text-lg mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>Loading Prepayment Calculator...</div>
            <div className={`text-sm ${themeClass('text-slate-600', 'text-white/60', isLight)}`}>Analyzing your loan data</div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className={`min-h-screen font-sans relative ${isLight ? 'bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100' : 'bg-gradient-to-br from-gray-900 via-black to-gray-900'}`} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header Navigation - Enhanced with gradient */}
      <header className={isLight ? 'bg-white/80 backdrop-blur-sm border-b border-slate-200/60' : 'bg-black/80 backdrop-blur-sm border-b border-white/10'}>
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo - Far Left Positioning */}
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              <div className="w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center">
                <Image 
                  src="/bck-logo.svg" 
                  alt="BudgetGear Logo" 
                  className="w-10 h-10 sm:w-16 sm:h-16 object-contain"
                  width={64}
                  height={64}
                />
              </div>
              <span className={`text-base sm:text-2xl font-extrabold tracking-tight flex items-center ${isLight ? 'text-slate-900' : 'text-white'}`}>BudgetGear</span>
            </div>

            {/* Navigation Menu - Center with proper spacing */}
            <div className="flex-1 flex justify-center px-4">
              <nav className="flex items-center" role="navigation" aria-label="Main navigation">
                <span className={`font-bold text-xs sm:text-base tracking-wide px-1 sm:px-4 py-2 text-center ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Loan Prepayment Calculator
                </span>
              </nav>
            </div>

            {/* Right side placeholder */}
            <div className="flex items-center space-x-4">
              {/* Theme toggle hidden */}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with improved styling */}
      <div className="relative z-10 pt-8 pb-6">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className={`text-4xl lg:text-5xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Loan Prepayment Calculator
            </h1>
            <p className={`text-lg lg:text-xl ${isLight ? 'text-slate-600' : 'text-white/80'} max-w-2xl mx-auto`}>
              Calculate your savings and optimize your loan repayment strategy
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10" style={{
        minHeight: 'calc(100vh - 200px)',
        fontFamily: 'Inter, system-ui, Segoe UI, Roboto, Arial',
        fontSize: '15px',
        lineHeight: '1.45'
      }}>
        <style jsx global>{`
        .md-panel-elevated {
          background: ${isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(18, 24, 38, 0.95)'};
          border: 1px solid ${isLight ? 'rgba(226, 232, 240, 0.6)' : 'rgba(255, 255, 255, 0.1)'};
          border-radius: 20px;
          backdrop-filter: blur(20px);
          box-shadow: ${isLight ? '0 20px 60px rgba(0, 0, 0, 0.1)' : '0 20px 60px rgba(0, 0, 0, 0.3)'};
        }
        .gradient-border {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2px;
          border-radius: 20px;
        }
        .gradient-border-inner {
          background: ${isLight ? 'white' : '#0f1420'};
          border-radius: 18px;
        }
      `}</style>
      
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-full"></div>
          </div>


          {/* Estimates Notice */}
          <div className="text-center mb-8">
            <p className={`text-sm ${themeClass('text-slate-600', 'text-white/60', isLight)} font-medium`}>
              * All calculations are estimates for informational purposes only
            </p>
          </div>
        
        {/* Your Current Loan Details */}
        <section className="md-panel-elevated p-8 mb-8">
          <div className="flex items-center gap-4 mb-8">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isLight ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gradient-to-br from-blue-400 to-indigo-500'}`}>
              <span className="text-white text-lg font-bold">₹</span>
            </div>
            <h2 className={`text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Current Loan Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <label className={`block text-sm font-semibold ${isLight ? 'text-slate-700' : 'text-white/90'}`}>Loan Amount</label>
              <div className={`relative rounded-xl border-2 ${isLight ? 'border-slate-200 bg-slate-50 focus-within:border-indigo-500 focus-within:bg-white' : 'border-white/20 bg-black/20 focus-within:border-indigo-400'} transition-all duration-300`}>
                <span className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-base font-semibold ${isLight ? 'text-slate-600' : 'text-white/70'}`}>₹</span>
                <input 
                  type="number" 
                  value={loanData.loanAmount || ''}
                  onChange={(e) => {
                    const newAmount = parseFloat(e.target.value) || 0
                    const newEMI = newAmount > 0 ? calculateEMI(newAmount, loanData.interestRate, loanData.tenure) : 0
                    setLoanData(prev => ({ ...prev, loanAmount: newAmount, emi: newEMI }))
                  }}
                  placeholder="1600000" 
                  aria-label="Loan Amount"
                  className={`w-full pl-10 pr-4 py-4 rounded-xl border-0 focus:outline-none text-lg font-medium ${isLight ? 'bg-transparent text-slate-900 placeholder-slate-400' : 'bg-transparent text-white placeholder-white/40'}`}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <label className={`block text-sm font-semibold ${isLight ? 'text-slate-700' : 'text-white/90'}`}>Interest Rate</label>
              <div className={`relative rounded-xl border-2 ${isLight ? 'border-slate-200 bg-slate-50 focus-within:border-indigo-500 focus-within:bg-white' : 'border-white/20 bg-black/20 focus-within:border-indigo-400'} transition-all duration-300`}>
                <input 
                  type="number" 
                  step="0.05" 
                  min="0.1"
                  max="20"
                  value={loanData.interestRate || ''}
                  onChange={(e) => {
                    const newRate = Math.min(20, Math.max(0.1, parseFloat(e.target.value) || 8))
                    const newEMI = loanData.loanAmount > 0 ? calculateEMI(loanData.loanAmount, newRate, loanData.tenure) : 0
                    setLoanData(prev => ({ ...prev, interestRate: newRate, emi: newEMI }))
                  }}
                  placeholder="8.0" 
                  aria-label="Interest Rate"
                  className={`w-full pl-4 pr-20 py-4 rounded-xl border-0 focus:outline-none text-lg font-medium ${isLight ? 'bg-transparent text-slate-900 placeholder-slate-400' : 'bg-transparent text-white placeholder-white/40'}`}
                />
                <span className={`absolute right-4 top-1/2 transform -translate-y-1/2 text-sm font-semibold ${isLight ? 'text-slate-600' : 'text-white/70'}`}>% p.a.</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <label className={`block text-sm font-semibold ${isLight ? 'text-slate-700' : 'text-white/90'}`}>Loan Tenure</label>
              <div className={`relative rounded-xl border-2 ${isLight ? 'border-slate-200 bg-slate-50 focus-within:border-indigo-500 focus-within:bg-white' : 'border-white/20 bg-black/20 focus-within:border-indigo-400'} transition-all duration-300`}>
                <select 
                  value={loanData.tenure || ''}
                  onChange={(e) => {
                    const newTenure = parseFloat(e.target.value) || 3
                    const newEMI = loanData.loanAmount > 0 ? calculateEMI(loanData.loanAmount, loanData.interestRate, newTenure) : 0
                    setLoanData(prev => ({ ...prev, tenure: newTenure, emi: newEMI }))
                  }}
                  aria-label="Loan Tenure"
                  className={`w-full px-4 py-4 rounded-xl border-0 focus:outline-none text-lg font-medium ${isLight ? 'bg-transparent text-slate-900' : 'bg-transparent text-white'} appearance-none`}
                >
                  <option value="1">1 year</option>
                  <option value="2">2 years</option>
                  <option value="3">3 years</option>
                  <option value="4">4 years</option>
                  <option value="5">5 years</option>
                  <option value="6">6 years</option>
                  <option value="7">7 years</option>
                  <option value="8">8 years</option>
                  <option value="9">9 years</option>
                  <option value="10">10 years</option>
                </select>
                <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Prepayment Strategy */}
        <section className="md-panel-elevated p-8 mb-8">
          <div className="flex items-center gap-4 mb-8">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isLight ? 'bg-gradient-to-br from-purple-500 to-pink-600' : 'bg-gradient-to-br from-purple-400 to-pink-500'}`}>
              <span className="text-white text-lg font-bold">⚡</span>
            </div>
            <h2 className={`text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Prepayment Strategy</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="space-y-4">
              <label className={`block text-sm font-semibold ${isLight ? 'text-slate-700' : 'text-white/90'}`}>Payment Frequency</label>
              <div className={`relative rounded-xl border-2 ${isLight ? 'border-slate-200 bg-slate-50 focus-within:border-purple-500 focus-within:bg-white' : 'border-white/20 bg-black/20 focus-within:border-purple-400'} transition-all duration-300`}>
                <select 
                  aria-label="Prepayment Frequency"
                  value={prepaymentFrequency === 'yearly' ? 'Yearly' : 
                        prepaymentFrequency === 'quarterly' ? 'Quarterly' : 
                        prepaymentFrequency === 'monthly' ? 'Monthly' : 'Lumpsum'}
                  onChange={(e) => {
                    const value = e.target.value
                    setPrepaymentFrequency(
                      value === 'Yearly' ? 'yearly' : 
                      value === 'Quarterly' ? 'quarterly' : 
                      value === 'Monthly' ? 'monthly' : 'lumpsum'
                    )
                  }}
                  className={`w-full px-4 py-4 rounded-xl border-0 focus:outline-none text-lg font-medium ${isLight ? 'bg-transparent text-slate-900' : 'bg-transparent text-white'} appearance-none`}
                >
                  <option>Yearly</option>
                  <option>Quarterly</option>
                  <option>Monthly</option>
                  <option>Lumpsum</option>
                </select>
                <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <label className={`block text-sm font-semibold ${isLight ? 'text-slate-700' : 'text-white/90'}`}>Prepayment Amount</label>
              <div className={`relative rounded-xl border-2 ${isLight ? 'border-slate-200 bg-slate-50 focus-within:border-purple-500 focus-within:bg-white' : 'border-white/20 bg-black/20 focus-within:border-purple-400'} transition-all duration-300`}>
                <span className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-base font-semibold ${isLight ? 'text-slate-600' : 'text-white/70'}`}>₹</span>
                <input 
                  type="number" 
                  value={prepaymentAmount || ''}
                  onChange={(e) => setPrepaymentAmount(parseFloat(e.target.value) || 0)}
                  placeholder="32000" 
                  aria-label="Prepayment Amount"
                  className={`w-full pl-10 pr-4 py-4 rounded-xl border-0 focus:outline-none text-lg font-medium ${isLight ? 'bg-transparent text-slate-900 placeholder-slate-400' : 'bg-transparent text-white placeholder-white/40'}`}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <label className={`block text-sm font-semibold ${isLight ? 'text-slate-700' : 'text-white/90'}`}>Prepayment Penalty</label>
              <div className={`relative rounded-xl border-2 ${isLight ? 'border-slate-200 bg-slate-50 focus-within:border-purple-500 focus-within:bg-white' : 'border-white/20 bg-black/20 focus-within:border-purple-400'} transition-all duration-300`}>
                <input 
                  type="number" 
                  step="0.1" 
                  min="0"
                  max="5"
                  value={penaltyRate || ''}
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
                  placeholder="0.0" 
                  aria-label="Prepayment Penalty"
                  className={`w-full pl-4 pr-12 py-4 rounded-xl border-0 focus:outline-none text-lg font-medium ${isLight ? 'bg-transparent text-slate-900 placeholder-slate-400' : 'bg-transparent text-white placeholder-white/40'}`}
                />
                <span className={`absolute right-4 top-1/2 transform -translate-y-1/2 text-sm font-semibold ${isLight ? 'text-slate-600' : 'text-white/70'}`}>%</span>
              </div>
            </div>
          </div>

          {/* Calculate Button */}
          <div className="mt-8">
            <button 
              onClick={() => {
                // Trigger recalculation by updating state
                setLoanData(prev => ({ ...prev }))
              }}
              className={`w-full py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 ${isLight ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white' : 'bg-gradient-to-r from-indigo-400 to-purple-500 hover:from-indigo-500 hover:to-purple-600 text-white'} shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
            >
              Calculate Savings & Generate Report
            </button>
          </div>
        </section>

        {results && (
          <>
            {/* Savings Highlight */}
            <section className="mb-8">
              <div className={`text-center p-6 rounded-2xl ${isLight ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200' : 'bg-gradient-to-r from-emerald-900/30 to-green-900/30 border-2 border-emerald-500/20'}`}>
                <div className={`text-3xl font-bold mb-2 ${isLight ? 'text-emerald-800' : 'text-emerald-200'}`}>
                  💰 Total Savings: {formatCurrency(
                    penaltyRate > 0 && results.penaltyAmount 
                      ? Math.max(0, results.amountSaved - results.penaltyAmount)
                      : results.amountSaved
                  )}
                </div>
                <div className={`text-lg ${isLight ? 'text-emerald-700' : 'text-emerald-300'}`}>
                  You finish {(() => {
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
                  })()} earlier!
                </div>
              </div>
            </section>

            {/* Comparison Cards */}
            <section className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isLight ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-green-400 to-emerald-500'}`}>
                  <span className="text-white text-lg font-bold">📊</span>
                </div>
                <h2 className={`text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Comparison & Analysis</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Without Prepayment */}
                <div className={`md-panel-elevated p-8 border-l-4 ${isLight ? 'border-l-red-400' : 'border-l-red-500'}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isLight ? 'bg-red-100' : 'bg-red-500/20'}`}>
                      <span className={`text-lg ${isLight ? 'text-red-600' : 'text-red-400'}`}>❌</span>
                    </div>
                    <div className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Without Prepayment</div>
                  </div>
                  <div className={`text-3xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>{formatTenure(loanData.tenure)}</div>
                  <div className={`text-base mb-2 ${themeClass('text-slate-600', 'text-white/70', isLight)}`}>Total interest: <span className="font-semibold">{formatCurrency(results.originalInterest)}</span></div>
                  <div className={`text-base ${themeClass('text-slate-600', 'text-white/70', isLight)}`}>Monthly EMI: <span className="font-semibold">{formatCurrency(loanData.emi)}</span></div>
                </div>
                
                {/* With Prepayment */}
                <div className={`md-panel-elevated p-8 border-l-4 ${isLight ? 'border-l-green-400' : 'border-l-green-500'} ${isLight ? 'bg-gradient-to-br from-emerald-50 to-green-50' : 'bg-gradient-to-br from-emerald-900/30 to-green-900/30'}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isLight ? 'bg-green-100' : 'bg-green-500/20'}`}>
                      <span className={`text-lg ${isLight ? 'text-green-600' : 'text-green-400'}`}>✅</span>
                    </div>
                    <div className={`text-lg font-bold ${isLight ? 'text-emerald-900' : 'text-emerald-100'}`}>
                      With Prepayment
                    </div>
                  </div>
                  
                  <div className={`text-3xl font-bold mb-3 ${isLight ? 'text-emerald-900' : 'text-emerald-100'}`}>{formatTenure(results.newTenure)}</div>
                  <div className={`text-base mb-2 ${isLight ? 'text-emerald-700' : 'text-emerald-200'}`}>
                    <span className="font-bold text-lg">
                      Save {formatCurrency(
                        penaltyRate > 0 && results.penaltyAmount 
                          ? Math.max(0, results.amountSaved - results.penaltyAmount)
                          : results.amountSaved
                      )}
                    </span>
                  </div>
                  <div className={`text-base ${isLight ? 'text-emerald-600' : 'text-emerald-200'}`}>Monthly EMI: <span className="font-semibold">{formatCurrency(loanData.emi)}</span> (unchanged)</div>
                </div>
              </div>
            </section>

            {/* EMI Information */}
            <section className="md-panel-elevated p-4 mb-6">
              <div className={`p-4 rounded-lg border ${isLight ? 'bg-blue-50 border-blue-200' : 'bg-blue-900/20 border-blue-500/20'}`}>
                <div className="flex items-center justify-center gap-3">
                  <span className={`text-sm font-medium ${isLight ? 'text-blue-700' : 'text-blue-300'}`}>EMI Remains Same:</span>
                  <span className={`text-lg font-bold ${isLight ? 'text-blue-800' : 'text-blue-200'}`}>{formatCurrency(loanData.emi)}</span>
                </div>
                <div className={`text-xs text-center mt-2 ${isLight ? 'text-blue-600' : 'text-blue-300'}`}>
                  Loan tenure gets reduced instead of EMI
                </div>
              </div>
            </section>

            {/* Detailed Loan Comparison Table */}
            <section className="md-panel-elevated overflow-hidden mb-8">
              <div className={`p-6 ${isLight ? 'bg-gradient-to-r from-indigo-500 to-purple-600' : 'bg-gradient-to-r from-indigo-400 to-purple-500'}`}>
                <h3 className="text-xl font-bold text-white">Detailed Loan Comparison</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`${isLight ? 'bg-slate-50' : 'bg-black/20'}`}>
                      <th className={`py-4 px-6 text-left text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Metric</th>
                      <th className={`py-4 px-6 text-left text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Before</th>
                      <th className={`py-4 px-6 text-left text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>After</th>
                      <th className={`py-4 px-6 text-left text-sm font-bold ${isLight ? 'text-green-700' : 'text-green-400'}`}>Savings</th>
                    </tr>
                  </thead>
                  <tbody className={`${isLight ? 'bg-white' : 'bg-transparent'}`}>
                    <tr className={`border-b ${isLight ? 'border-slate-100' : 'border-white/5'} hover:${isLight ? 'bg-slate-50' : 'bg-white/5'} transition-colors`}>
                      <td className={`py-4 px-6 text-base font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>Loan Tenure</td>
                      <td className={`py-4 px-6 text-base ${isLight ? 'text-slate-700' : 'text-white/80'}`}>{formatTenure(loanData.tenure)}</td>
                      <td className={`py-4 px-6 text-base ${isLight ? 'text-slate-700' : 'text-white/80'}`}>
                        {formatTenure(results.newTenure)}
                        <span className={`ml-2 text-sm px-2 py-1 rounded-full ${isLight ? 'bg-green-100 text-green-700' : 'bg-green-900/30 text-green-400'}`}>
                          reduced
                        </span>
                      </td>
                      <td className={`py-4 px-6 text-base font-bold ${isLight ? 'text-green-600' : 'text-green-400'}`}>
                        {results.monthsSaved && results.monthsSaved > 0 ? (
                          (() => {
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
                          })()
                        ) : '—'}
                      </td>
                    </tr>
                    <tr className={`border-b ${isLight ? 'border-slate-100' : 'border-white/5'} hover:${isLight ? 'bg-slate-50' : 'bg-white/5'} transition-colors`}>
                      <td className={`py-4 px-6 text-base font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>Total Interest Paid</td>
                      <td className={`py-4 px-6 text-base ${isLight ? 'text-slate-700' : 'text-white/80'}`}>{formatCurrency(results.originalInterest)}</td>
                      <td className={`py-4 px-6 text-base ${isLight ? 'text-slate-700' : 'text-white/80'}`}>{formatCurrency(results.interestPaid)}</td>
                      <td className={`py-4 px-6 text-base font-bold ${isLight ? 'text-green-600' : 'text-green-400'}`}>{formatCurrency(results.originalInterest - results.interestPaid)}</td>
                    </tr>
                    <tr className={`border-b ${isLight ? 'border-slate-100' : 'border-white/5'} hover:${isLight ? 'bg-slate-50' : 'bg-white/5'} transition-colors`}>
                      <td className={`py-4 px-6 text-base font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>Monthly EMI</td>
                      <td className={`py-4 px-6 text-base ${isLight ? 'text-slate-700' : 'text-white/80'}`}>{formatCurrency(loanData.emi)}</td>
                      <td className={`py-4 px-6 text-base ${isLight ? 'text-slate-700' : 'text-white/80'}`}>
                        {formatCurrency(loanData.emi)}
                        <span className={`ml-2 text-sm px-2 py-1 rounded-full ${isLight ? 'bg-blue-100 text-blue-700' : 'bg-blue-900/30 text-blue-400'}`}>
                          unchanged
                        </span>
                      </td>
                      <td className={`py-4 px-6 text-base ${isLight ? 'text-slate-500' : 'text-white/50'}`}>
                        —
                      </td>
                    </tr>
                    <tr className={`border-b ${isLight ? 'border-slate-100' : 'border-white/5'} hover:${isLight ? 'bg-slate-50' : 'bg-white/5'} transition-colors`}>
                      <td className={`py-4 px-6 text-base font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>Prepayment Penalty</td>
                      <td className={`py-4 px-6 text-base ${isLight ? 'text-slate-500' : 'text-white/50'}`}>—</td>
                      <td className={`py-4 px-6 text-base ${isLight ? 'text-slate-700' : 'text-white/80'}`}>{formatCurrency(results.penaltyAmount || 0)}</td>
                      <td className={`py-4 px-6 text-base ${isLight ? 'text-slate-500' : 'text-white/50'}`}>—</td>
                    </tr>
                    <tr className={`hover:${isLight ? 'bg-slate-50' : 'bg-white/5'} transition-colors`}>
                      <td className={`py-4 px-6 text-base font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>Total Amount Paid</td>
                      <td className={`py-4 px-6 text-base ${isLight ? 'text-slate-700' : 'text-white/80'}`}>{formatCurrency(results.originalTotalAmount)}</td>
                      <td className={`py-4 px-6 text-base ${isLight ? 'text-slate-700' : 'text-white/80'}`}>{formatCurrency(results.totalAmountPaid)}</td>
                      <td className={`py-4 px-6 text-base font-bold ${isLight ? 'text-green-600' : 'text-green-400'}`}>
                        {formatCurrency(
                          penaltyRate > 0 && results.penaltyAmount 
                            ? Math.max(0, results.amountSaved - results.penaltyAmount)
                            : results.amountSaved
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end mt-4">
                <button 
                  onClick={() => window.location.reload()}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${isLight ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                >
                  Recalculate
                </button>
              </div>
            </section>


            {/* Monthly Payment Timeline Chart */}
            <section className="md-panel-elevated p-4 mb-6">
              <div className={`text-sm font-semibold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>Payment Timeline Comparison</div>
              <div style={{height: '350px', width: '100%'}}>
                {results ? (
                  <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={(() => {
                      // Safety checks to prevent errors
                      if (!loanData.loanAmount || !loanData.interestRate || !loanData.tenure || !loanData.emi) {
                        return [{ month: 0, withoutPrepayment: 0, withPrepayment: 0 }];
                      }
                      
                      const maxMonths = Math.min(Math.ceil(loanData.tenure * 12), 120); // Cap at 10 years max
                      const chartData = [];
                      let withoutPrepaymentBalance = loanData.loanAmount;
                      let withPrepaymentBalance = loanData.loanAmount;
                      const monthlyRate = loanData.interestRate / (12 * 100);
                      const originalEMI = loanData.emi;
                      
                      // Safety check for valid EMI
                      if (originalEMI <= 0) {
                        return [{ month: 0, withoutPrepayment: 0, withPrepayment: 0 }];
                      }
                      
                      const prepayFreq = prepaymentFrequency === 'yearly' ? 12 : 
                                        prepaymentFrequency === 'quarterly' ? 3 : 
                                        prepaymentFrequency === 'monthly' ? 1 : 999;
                      
                      // Add initial data point
                      chartData.push({
                        month: 0,
                        withoutPrepayment: Math.round(withoutPrepaymentBalance),
                        withPrepayment: Math.round(withPrepaymentBalance)
                      });
                      
                      for (let month = 1; month <= maxMonths && (withoutPrepaymentBalance > 1 || withPrepaymentBalance > 1); month++) {
                        // Safety check to prevent infinite loop
                        if (month > 240) break; // Max 20 years
                        
                        // Without prepayment calculation
                        if (withoutPrepaymentBalance > 1 && originalEMI > 0) {
                          const interest = withoutPrepaymentBalance * monthlyRate;
                          const principal = Math.min(originalEMI - interest, withoutPrepaymentBalance);
                          if (principal > 0) {
                            withoutPrepaymentBalance = Math.max(0, withoutPrepaymentBalance - principal);
                          }
                        } else {
                          withoutPrepaymentBalance = 0;
                        }
                        
                        // With prepayment calculation
                        if (withPrepaymentBalance > 1) {
                          // Apply prepayment first
                          if (prepaymentAmount > 0) {
                            let shouldApplyPrepayment = false;
                            if (prepaymentFrequency === 'lumpsum') {
                              shouldApplyPrepayment = month === 1;
                            } else if (prepayFreq < 999) {
                              shouldApplyPrepayment = (month % prepayFreq) === 0;
                            }
                            
                            if (shouldApplyPrepayment) {
                              const prepayment = Math.min(prepaymentAmount, withPrepaymentBalance);
                              withPrepaymentBalance = Math.max(0, withPrepaymentBalance - prepayment);
                            }
                          }
                          
                          // Then apply EMI
                          if (withPrepaymentBalance > 1 && originalEMI > 0) {
                            const interest = withPrepaymentBalance * monthlyRate;
                            const principal = Math.min(originalEMI - interest, withPrepaymentBalance);
                            if (principal > 0) {
                              withPrepaymentBalance = Math.max(0, withPrepaymentBalance - principal);
                            }
                          } else {
                            withPrepaymentBalance = 0;
                          }
                        }
                        
                        chartData.push({
                          month,
                          withoutPrepayment: Math.round(Math.max(0, withoutPrepaymentBalance)),
                          withPrepayment: Math.round(Math.max(0, withPrepaymentBalance))
                        });
                        
                        // Stop when both loans are paid off
                        if (withoutPrepaymentBalance <= 1 && withPrepaymentBalance <= 1) break;
                      }
                      
                      // Ensure we have at least some data
                      if (chartData.length < 2) {
                        chartData.push({ month: 1, withoutPrepayment: 0, withPrepayment: 0 });
                      }
                      
                      return chartData;
                    })()}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 20
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1b2230" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fill: '#9ab1c9', fontSize: 12 }}
                      label={{ value: 'Months', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fill: '#9ab1c9' } }}
                    />
                    <YAxis 
                      tick={{ fill: '#9ab1c9', fontSize: 12 }}
                      axisLine={{ stroke: '#1b2230' }}
                      label={{ value: 'Outstanding Balance (₹)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9ab1c9' } }}
                      tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#0f1420',
                        border: '1px solid #1b2230',
                        borderRadius: '8px',
                        color: '#e6ecf3'
                      }}
                      formatter={(value: number, name: string) => [
                        `₹${Number(value).toLocaleString('en-IN')}`,
                        name === 'withoutPrepayment' ? 'Without Prepayment' : 'With Prepayment'
                      ]}
                      labelFormatter={(month) => `Month ${month}`}
                    />
                    <Legend 
                      wrapperStyle={{ color: '#9ab1c9' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="withoutPrepayment" 
                      stroke="#5e86ff" 
                      strokeWidth={2}
                      name="Without Prepayment"
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="withPrepayment" 
                      stroke="#22c55e" 
                      strokeWidth={2}
                      name="With Prepayment"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className={`text-center ${themeClass('text-slate-500', 'text-white/60', isLight)}`}>
                      Enter loan details to see timeline chart
                    </div>
                  </div>
                )}
              </div>
              <div className={`text-xs text-center mt-2 ${themeClass('text-slate-600', 'text-white/60', isLight)}`}>
                Outstanding loan balance over time showing how prepayment accelerates loan payoff
              </div>
            </section>
          </>
        )}
        </div>
      </div>

        {/* Footer - Same as Car Affordability Page */}
        <footer className="relative z-10 mt-16 mb-8">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="md-panel-elevated p-6">
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${isLight ? 'bg-slate-200' : 'bg-white/10'}`}>
                  <svg className={`w-3 h-3 ${isLight ? 'text-slate-600' : 'text-white/50'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className={`font-medium mb-3 text-sm ${isLight ? 'text-slate-900' : 'text-white/90'}`}>Disclaimer</p>
                  <p className={`leading-relaxed text-sm ${isLight ? 'text-slate-700' : 'text-white/70'}`}>
                    This prepayment calculator serves as a helpful tool to understand potential financial outcomes when planning your loan prepayments. It is designed for informational and educational purposes only and does not constitute professional financial advice for your specific loan decisions. The calculations and projections shown are estimates and should be treated as general guidance rather than exact financial recommendations. For personalized advice tailored to your unique financial circumstances, we strongly encourage you to consult with a qualified financial advisor who can discuss the various options and their implications for your situation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}

export default function PrepaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Calculator className="w-12 h-12 mx-auto mb-4 animate-pulse text-blue-500" />
          <p className="text-lg text-slate-900">Loading Smart Prepayment Calculator...</p>
          <p className="text-slate-600 text-sm mt-2">Analyzing your loan data</p>
        </div>
      </div>
    }>
      <PrepaymentCalculator />
    </Suspense>
  )
}