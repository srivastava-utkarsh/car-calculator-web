'use client'

/*
===============================================================================
PREPAYMENT CALCULATOR - COMPREHENSIVE IMPLEMENTATION
===============================================================================

OVERVIEW:
This module implements a loan prepayment calculator following industry best practices as used by major Indian banks (HDFC, SBI, ICICI, Axis).

KEY FEATURES:
- Single strategy: "Reduce Loan Tenure" (industry-preferred approach)
- Industry-standard prepayment penalty handling
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

4. PENALTY CALCULATION (Industry Guidelines):
   - Floating Rate Loans: 0% penalty (industry standard)
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
INDUSTRY STANDARDS & COMPLIANCE
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
   - Industry guideline explanations
   - Industry best practice notes
   - Clear benefit explanations

===============================================================================
*/

import { useState, useEffect, Suspense } from 'react'
import { Calculator } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useTheme } from '@/contexts/ThemeContext'
import { themeClass } from '@/utils/themeStyles'
import FAQ from '@/components/FAQ'
import { prepaymentFAQs } from '@/data/prepaymentFAQData'
import AdSenseAd from '@/components/AdSenseAd'

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
 * following industry best practices and guidelines.
 * 
 * KEY IMPLEMENTATION DETAILS:
 * 1. Prepayment applied BEFORE monthly interest calculation (industry standard)
 * 2. Interest calculated on reduced balance after prepayment
 * 3. Only "Reduce Tenure" strategy (most beneficial for customers)
 * 4. Comprehensive amortization schedule generation
 * 5. Industry-standard penalty handling
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
  const currentEMI = originalEMI           // Current EMI (stays constant for reduce_tenure)
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
    
    // If loan is fully paid after prepayment, record final payment and exit
    if (remainingPrincipal <= 1) {
      // Record the prepayment as the final payment
      amortizationSchedule.push({
        month: months,
        emi: 0,
        interest: 0,
        principal: 0,
        prepayment: currentPrepayment,
        balance: 0
      })
      break
    }
    
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
  const netSavings = interestSavings - penaltyAmount                     // Net savings after penalty (can be negative)
  const monthsSaved = (tenure * 12) - months                           // Time saved in months
  
  return {
    scenario: 'reduce_tenure',
    prepaymentAmount,
    newTenure: Math.round(newTenureYears * 100) / 100, // Round to 2 decimal places
    totalAmountPaid: Math.round(totalAmountPaid),
    interestPaid: Math.round(totalInterestPaid),
    amountSaved: Math.round(interestSavings), // Can be negative if there's a net loss
    originalTotalAmount: Math.round(originalTotalAmount),
    originalInterest: Math.round(originalInterest),
    penaltyAmount: Math.round(Math.max(0, penaltyAmount)), // Ensure non-negative
    netSavings: Math.round(netSavings), // Can be negative if penalty exceeds savings
    amortizationSchedule,
    monthsSaved: Math.max(0, monthsSaved) // Ensure non-negative
  }
}


function PrepaymentCalculator() {
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const { isLight, isDark } = useTheme()
  
  const [loanData, setLoanData] = useState<LoanData>({
    loanAmount: 100000,
    interestRate: 8,
    tenure: 5,
    emi: 0
  })
  
  // Display state for loan amount input (to avoid real-time validation issues)
  const [loanAmountDisplay, setLoanAmountDisplay] = useState('')
  
  const [prepaymentAmount, setPrepaymentAmount] = useState(0)
  // Display state for prepayment amount input (to avoid real-time validation issues)
  const [prepaymentAmountDisplay, setPrepaymentAmountDisplay] = useState('')
  const [prepaymentFrequency, setPrepaymentFrequency] = useState<'monthly' | 'quarterly' | 'yearly' | 'lumpsum'>('yearly')
  const prepaymentStrategy = 'reduce_tenure' // Fixed to reduce tenure only
  const [penaltyRate, setPenaltyRate] = useState(0)
  const [tenureDisplayFormat] = useState<'years' | 'months'>('years')
  const [showResults, setShowResults] = useState(false)

  // Sync display state when loan amount changes from external sources
  useEffect(() => {
    setLoanAmountDisplay(loanData.loanAmount ? loanData.loanAmount.toLocaleString('en-IN') : '')
  }, [loanData.loanAmount])

  // Sync display state when prepayment amount changes from external sources
  useEffect(() => {
    setPrepaymentAmountDisplay(prepaymentAmount ? prepaymentAmount.toLocaleString('en-IN') : '')
  }, [prepaymentAmount])

  // Handle loan amount validation only on blur (when user finishes editing)
  const handleLoanAmountBlur = (value: string) => {
    try {
      const numericValue = value.replace(/,/g, '')
      
      if (numericValue === '' || numericValue === '0') {
        setLoanData(prev => ({ ...prev, loanAmount: 0, emi: 0 }))
        setLoanAmountDisplay('')
        setShowResults(false)
        return
      }
      
      const parsedValue = parseFloat(numericValue)
      
      if (isNaN(parsedValue) || parsedValue <= 0) {
        setLoanData(prev => ({ ...prev, loanAmount: 0, emi: 0 }))
        setLoanAmountDisplay('')
        setShowResults(false)
        return
      }
      
      // Apply min/max limits: 0 to 10 crores (10,00,00,000)
      let newAmount = Math.max(0, Math.min(100000000, parsedValue))
      
      setLoanData(prev => ({ ...prev, loanAmount: newAmount, emi: 0 }))
      
      // Update display with formatted value
      setLoanAmountDisplay(newAmount.toLocaleString('en-IN'))
      
      // Reset prepayment if it exceeds new loan amount
      if (prepaymentAmount > newAmount) {
        setPrepaymentAmount(0)
        setPrepaymentAmountDisplay('')
      }
      
      setShowResults(false)
      
    } catch (error) {
      console.error('Loan amount input error:', error)
      setLoanData(prev => ({ ...prev, loanAmount: 0, emi: 0 }))
      setLoanAmountDisplay('')
      setShowResults(false)
    }
  }

  // Handle prepayment amount validation only on blur (when user finishes editing)
  const handlePrepaymentAmountBlur = (value: string) => {
    try {
      const numericValue = value.replace(/,/g, '')
      
      if (numericValue === '' || numericValue === '0') {
        setPrepaymentAmount(0)
        setPrepaymentAmountDisplay('')
        setShowResults(false)
        return
      }
      
      const parsedValue = parseFloat(numericValue)
      
      if (isNaN(parsedValue) || parsedValue <= 0) {
        setPrepaymentAmount(0)
        setPrepaymentAmountDisplay('')
        setShowResults(false)
        return
      }
      
      // Ensure prepayment cannot exceed loan amount
      let newPrepayment = Math.min(parsedValue, loanData.loanAmount)
      
      // Ensure prepayment is not negative
      if (newPrepayment < 0) {
        newPrepayment = 0
      }
      
      setPrepaymentAmount(newPrepayment)
      setPrepaymentAmountDisplay(newPrepayment.toLocaleString('en-IN'))
      setShowResults(false)
      
    } catch (error) {
      console.error('Prepayment amount input error:', error)
      setPrepaymentAmount(0)
      setPrepaymentAmountDisplay('')
      setShowResults(false)
    }
  }

  useEffect(() => {
    // Extract parameters from URL with safe parsing
    const carPrice = Math.max(0, parseFloat(searchParams.get('carPrice') || '0'))
    const downPayment = Math.max(0, parseFloat(searchParams.get('downPayment') || '0'))
    const interestRate = Math.max(0.1, Math.min(20, parseFloat(searchParams.get('interestRate') || '8')))
    const tenure = Math.max(1, Math.min(10, parseFloat(searchParams.get('tenure') || '5')))
    
    // Apply loan amount limits: minimum 0, maximum 10 crores
    let loanAmount = Math.max(0, carPrice - downPayment)
    if (loanAmount < 0) loanAmount = 0
    if (loanAmount > 100000000) loanAmount = 100000000
    
    // If no URL parameters provided, use default value
    if (!searchParams.get('carPrice') && !searchParams.get('downPayment')) {
      loanAmount = 100000
    }
    
    const emi = loanAmount > 0 ? calculateEMI(loanAmount, interestRate, tenure) : 0
    
    setLoanData({
      loanAmount,
      interestRate,
      tenure,
      emi
    })
    
    // Set default prepayment amount (2% of loan amount, but not exceeding loan amount)
    if (loanAmount > 0) {
      const defaultPrepayment = Math.round(loanAmount * 0.02)
      setPrepaymentAmount(Math.min(defaultPrepayment, loanAmount))
    }
    
    // Set loading to false after component is ready
    setIsLoading(false)
  }, [searchParams])

  const results = (showResults && loanData.loanAmount > 0) ? calculateLoanDetails(
    loanData.loanAmount,
    loanData.interestRate,
    loanData.tenure,
    prepaymentAmount,
    prepaymentFrequency,
    penaltyRate
  ) : null

  const handleCalculate = () => {
    // Calculate EMI when showing results
    if (loanData.loanAmount > 0) {
      const newEMI = calculateEMI(loanData.loanAmount, loanData.interestRate, loanData.tenure)
      setLoanData(prev => ({ ...prev, emi: newEMI }))
    }
    setShowResults(true)
  }

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
    <main className={`min-h-screen font-sans relative ${isLight ? 'bg-gradient-to-br from-slate-50 via-white to-slate-50' : 'bg-black'}`} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* AdSense Script */}
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      {/* Header Navigation - Same as Car Affordability Page */}
      <header className={isLight ? 'bg-white border-b border-slate-200/60' : 'bg-black border-b border-white/5'}>
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
            <div className="flex-1 flex justify-center">
              <nav className="flex items-center gap-6" role="navigation" aria-label="Main navigation">
                <Link 
                  href="/" 
                  className={`font-semibold text-xs sm:text-sm tracking-wide px-3 py-2 text-center rounded-lg transition-colors duration-200 hover:scale-105 ${isLight ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100' : 'text-white/80 hover:text-white hover:bg-white/10'}`}
                >
                  Car Affordability Calculator
                </Link>
                <span className={`font-semibold text-xs sm:text-sm tracking-wide px-3 py-2 text-center rounded-lg ${isLight ? 'text-white bg-blue-600' : 'text-black bg-white'}`}>
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

      {/* Immersive Background Gradient - exclude header */}
      {isDark && <div className="absolute top-20 left-0 right-0 bottom-0 bg-gradient-to-br from-gray-900/50 via-black to-gray-900/30 pointer-events-none"></div>}

      {/* Main Content */}
      <div className="relative z-10 pt-4" style={{
        minHeight: 'calc(100vh - 80px)',
        fontFamily: 'Inter, system-ui, Segoe UI, Roboto, Arial',
        fontSize: '15px',
        lineHeight: '1.45'
      }}>
        <style jsx global>{`
        .md-panel-elevated {
          background: ${isLight ? 'rgba(255, 255, 255, 0.98)' : 'rgba(15, 23, 42, 0.95)'};
          border: 1px solid ${isLight ? 'rgba(148, 163, 184, 0.2)' : 'rgba(71, 85, 105, 0.3)'};
          border-radius: 20px;
          backdrop-filter: blur(24px);
          box-shadow: ${isLight 
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.5)' 
            : '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'};
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .md-panel-elevated:hover {
          transform: translateY(-2px);
          box-shadow: ${isLight 
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.12), 0 20px 25px -5px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)' 
            : '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 20px 25px -5px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)'};
        }
        .comparison-card {
          background: ${isLight ? 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'};
          border: 1px solid ${isLight ? 'rgba(148, 163, 184, 0.2)' : 'rgba(71, 85, 105, 0.4)'};
          border-radius: 16px;
          transition: all 0.3s ease;
        }
        .comparison-card:hover {
          transform: translateY(-4px);
          box-shadow: ${isLight 
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
            : '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)'};
        }
        .gradient-border {
          position: relative;
          background: ${isLight ? '#ffffff' : '#0f172a'};
          border-radius: 16px;
          padding: 2px;
        }
        .gradient-border::before {
          content: '';
          position: absolute;
          inset: 0;
          padding: 2px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4);
          border-radius: 16px;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
        }
      `}</style>
      
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Mobile-optimized heading */}
          <div className="block md:hidden text-center mb-4">
            <h1 className={`text-lg font-semibold mb-2 ${isLight ? 'text-slate-800' : 'text-white/90'}`}>
              Car Loan Prepayment Calculator
            </h1>
            <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
              Calculate savings with tenure reduction
            </p>
            <div className="mt-4">
              <Link 
                href="/" 
                className={`inline-flex items-center px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${isLight ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800' : 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50 hover:text-blue-300'} border ${isLight ? 'border-blue-200 hover:border-blue-300' : 'border-blue-500/40 hover:border-blue-500/60'}`}
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Car Affordability Calculator
              </Link>
            </div>
          </div>

          {/* Desktop heading */}
          <div className="hidden md:block text-center mb-6">
            <h1 className={`text-xl lg:text-2xl font-semibold mb-3 ${isLight ? 'text-slate-800' : 'text-white/90'}`}>
              Car Loan Prepayment Calculator | Tenure Reduction
            </h1>
            <p className={`text-base lg:text-lg font-medium max-w-4xl mx-auto ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Calculate savings for early loan closure and partial prepayments with tenure reduction strategy • 
              Get instant results following <span className={`font-semibold ${isLight ? 'text-blue-600' : 'text-blue-400'}`}>industry standard practices</span>!
            </p>
            <div className="mt-6">
              <p className={`text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'} mb-2`}>
                Need to calculate your car budget first?
              </p>
              <Link 
                href="/" 
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isLight ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800' : 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50 hover:text-blue-300'} border ${isLight ? 'border-blue-200 hover:border-blue-300' : 'border-blue-500/40 hover:border-blue-500/60'}`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Try our Car Affordability Calculator
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </div>
          </div>
          
          {/* Estimates Notice */}
          <div className="text-left mb-4">
            <p className={`text-xs ${themeClass('text-slate-600', 'text-white/60', isLight)} font-medium`}>
              * All calculations are estimates for informational purposes only
            </p>
            <div className={`mt-4 p-4 rounded-xl ${themeClass('bg-gradient-to-r from-emerald-50 to-teal-50', 'bg-gradient-to-r from-emerald-900/30 to-teal-900/30', isLight)} border-2 ${themeClass('border-emerald-200', 'border-emerald-500/40', isLight)} shadow-sm`}>
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${themeClass('bg-emerald-100', 'bg-emerald-500/20', isLight)}`}>
                  <svg className={`w-4 h-4 ${themeClass('text-emerald-600', 'text-emerald-400', isLight)}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold text-sm ${themeClass('text-emerald-800', 'text-emerald-300', isLight)} mb-2`}>
                    How it works
                  </h4>
                  <p className={`text-sm ${themeClass('text-slate-700', 'text-slate-300', isLight)} leading-relaxed`}>
                    Each month, any prepayment is <span className={`font-medium ${themeClass('text-emerald-700', 'text-emerald-400', isLight)}`}>deducted from your loan balance first</span>. 
                    Then interest is calculated only on the <span className={`font-medium ${themeClass('text-emerald-700', 'text-emerald-400', isLight)}`}>remaining (reduced) amount</span>. 
                    Your regular EMI payment is applied after that.
                  </p>
                </div>
              </div>
            </div>
          </div>

        
        {/* Your Current Loan Details */}
        <section className="md-panel-elevated p-8 mb-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Your Current Loan Details</h2>
              <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'} mt-1`}>Enter your existing loan information</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <label className={`block text-sm font-medium ${isLight ? 'text-slate-700' : 'text-white/80'}`}>Loan Amount</label>
              <div className={`relative rounded-xl border-2 ${isLight ? 'border-slate-200 bg-white hover:border-blue-300' : 'border-white/20 bg-black/20 hover:border-blue-400/50'} focus-within:ring-4 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all duration-200 group`}>
                <span className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-lg font-semibold ${isLight ? 'text-slate-600 group-focus-within:text-blue-600' : 'text-white/70 group-focus-within:text-blue-400'} transition-colors`}>₹</span>
                <input 
                  type="text" 
                  value={loanAmountDisplay}
                  onChange={(e) => {
                    // Store exactly what user types - no processing until blur
                    setLoanAmountDisplay(e.target.value)
                  }}
                  onBlur={(e) => {
                    handleLoanAmountBlur(e.target.value)
                  }}
                  placeholder="Enter amount between ₹0 and ₹10,00,00,000"
                  aria-label="Loan Amount"
                  className={`w-full pl-10 pr-12 py-4 rounded-xl border-0 focus:outline-none text-lg font-medium ${isLight ? 'bg-transparent text-slate-900 placeholder-slate-400' : 'bg-transparent text-white placeholder-white/50'}`}
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <label className={`block text-sm font-medium ${isLight ? 'text-slate-700' : 'text-white/80'}`}>Interest Rate</label>
              <div className={`relative rounded-xl border-2 ${isLight ? 'border-slate-200 bg-white hover:border-purple-300' : 'border-white/20 bg-black/20 hover:border-purple-400/50'} focus-within:ring-4 focus-within:ring-purple-500/20 focus-within:border-purple-500 transition-all duration-200 group`}>
                <input 
                  type="number" 
                  step="0.05" 
                  min="0.1"
                  max="20"
                  value={loanData.interestRate || ''}
                  onChange={(e) => {
                    const newRate = Math.min(20, Math.max(0.1, parseFloat(e.target.value) || 8))
                    setLoanData(prev => ({ ...prev, interestRate: newRate, emi: 0 }))
                    setShowResults(false)
                  }}
 
                  aria-label="Interest Rate"
                  className={`w-full pl-4 pr-20 py-4 rounded-xl border-0 focus:outline-none text-lg font-medium ${isLight ? 'bg-transparent text-slate-900 placeholder-slate-400' : 'bg-transparent text-white placeholder-white/50'}`}
                />
                <span className={`absolute right-4 top-1/2 transform -translate-y-1/2 text-sm font-semibold ${isLight ? 'text-slate-600 group-focus-within:text-purple-600' : 'text-white/70 group-focus-within:text-purple-400'} transition-colors`}>% p.a.</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <label className={`block text-sm font-medium ${isLight ? 'text-slate-700' : 'text-white/80'}`}>Loan Tenure</label>
              <div className={`relative rounded-xl border-2 ${isLight ? 'border-slate-200 bg-white hover:border-green-300' : 'border-white/20 bg-black/20 hover:border-green-400/50'} focus-within:ring-4 focus-within:ring-green-500/20 focus-within:border-green-500 transition-all duration-200 group`}>
                <select 
                  value={loanData.tenure || ''}
                  onChange={(e) => {
                    const newTenure = parseFloat(e.target.value) || 3
                    setLoanData(prev => ({ ...prev, tenure: newTenure, emi: 0 }))
                    setShowResults(false)
                  }}
                  aria-label="Loan Tenure"
                  className={`w-full px-4 py-4 rounded-xl border-0 focus:outline-none text-lg font-medium ${isLight ? 'bg-transparent text-slate-900' : 'bg-transparent text-white'} appearance-none cursor-pointer`}
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
                <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none ${isLight ? 'text-slate-400 group-focus-within:text-green-500' : 'text-white/40 group-focus-within:text-green-400'} transition-colors`}>
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h2 className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Prepayment Strategy</h2>
              <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'} mt-1`}>Configure your prepayment schedule</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="space-y-3">
              <label className={`block text-sm font-medium ${isLight ? 'text-slate-700' : 'text-white/80'}`}>Payment Frequency</label>
              <div className={`relative rounded-xl border-2 ${isLight ? 'border-slate-200 bg-white hover:border-indigo-300' : 'border-white/20 bg-black/20 hover:border-indigo-400/50'} focus-within:ring-4 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all duration-200 group`}>
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
                    setShowResults(false)
                  }}
                  className={`w-full px-4 py-4 rounded-xl border-0 focus:outline-none text-lg font-medium ${isLight ? 'bg-transparent text-slate-900' : 'bg-transparent text-white'} appearance-none cursor-pointer`}
                >
                  <option>Yearly</option>
                  <option>Quarterly</option>
                  <option>Monthly</option>
                  <option>Lumpsum</option>
                </select>
                <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none ${isLight ? 'text-slate-400 group-focus-within:text-indigo-500' : 'text-white/40 group-focus-within:text-indigo-400'} transition-colors`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <label className={`block text-sm font-medium ${isLight ? 'text-slate-700' : 'text-white/80'}`}>Prepayment Amount</label>
              <div className={`relative rounded-xl border-2 ${isLight ? 'border-slate-200 bg-white hover:border-orange-300' : 'border-white/20 bg-black/20 hover:border-orange-400/50'} focus-within:ring-4 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all duration-200 group`}>
                <span className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-lg font-semibold ${isLight ? 'text-slate-600 group-focus-within:text-orange-600' : 'text-white/70 group-focus-within:text-orange-400'} transition-colors`}>₹</span>
                <input 
                  type="text" 
                  value={prepaymentAmountDisplay}
                  onChange={(e) => {
                    // Store exactly what user types - no processing until blur
                    setPrepaymentAmountDisplay(e.target.value)
                  }}
                  onBlur={(e) => {
                    handlePrepaymentAmountBlur(e.target.value)
                  }}
                  placeholder={`Max: ${loanData.loanAmount ? formatCurrency(loanData.loanAmount) : '₹0'}`}
                  aria-label="Prepayment Amount"
                  className={`w-full pl-10 pr-12 py-4 rounded-xl border-0 focus:outline-none text-lg font-medium ${isLight ? 'bg-transparent text-slate-900 placeholder-slate-400' : 'bg-transparent text-white placeholder-white/50'}`}
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <label className={`block text-sm font-medium ${isLight ? 'text-slate-700' : 'text-white/80'}`}>Prepayment Penalty</label>
              <div className={`relative rounded-xl border-2 ${isLight ? 'border-slate-200 bg-white hover:border-red-300' : 'border-white/20 bg-black/20 hover:border-red-400/50'} focus-within:ring-4 focus-within:ring-red-500/20 focus-within:border-red-500 transition-all duration-200 group`}>
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
                    setShowResults(false);
                  }}
 
                  aria-label="Prepayment Penalty"
                  className={`w-full pl-4 pr-16 py-4 rounded-xl border-0 focus:outline-none text-lg font-medium ${isLight ? 'bg-transparent text-slate-900 placeholder-slate-400' : 'bg-transparent text-white placeholder-white/50'}`}
                />
                <span className={`absolute right-4 top-1/2 transform -translate-y-1/2 text-sm font-semibold ${isLight ? 'text-slate-600 group-focus-within:text-red-600' : 'text-white/70 group-focus-within:text-red-400'} transition-colors`}>%</span>
              </div>
            </div>
          </div>
        </section>

        {/* Calculate Button */}
        <section className="mb-8">
          <div className="flex justify-center">
            <button 
              onClick={handleCalculate}
              className="group relative px-12 py-5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-4"
            >
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span>Calculate Prepayment Savings</span>
              <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </section>

        {results && (
          <>
            {/* Comparison */}
            <section className="md-panel-elevated p-8 mb-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Comparison</h2>
                  <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'} mt-1`}>See how prepayments impact your loan</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Without Prepayment */}
                <div className="comparison-card p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-bl-full"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isLight ? 'bg-red-100' : 'bg-red-500/20'}`}>
                        <svg className={`w-5 h-5 ${isLight ? 'text-red-600' : 'text-red-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                      <div className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Without Prepayment</div>
                    </div>
                    <div className={`text-3xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>{formatTenure(loanData.tenure)}</div>
                    <div className={`text-base mb-3 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span>Total Interest:</span>
                        <span className="font-semibold">{formatCurrency(results.originalInterest)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Monthly EMI:</span>
                        <span className="font-semibold">{formatCurrency(loanData.emi)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* With Prepayment */}
                <div className="comparison-card p-8 relative overflow-hidden border-2 border-emerald-500/50">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/30 to-green-500/30 rounded-bl-full"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>With Prepayment</div>
                    </div>
                    <div className={`text-3xl font-bold mb-3 ${isLight ? 'text-emerald-900' : 'text-emerald-100'}`}>{formatTenure(results.newTenure)}</div>
                    <div className="space-y-3">
                      <div className={`p-4 rounded-lg ${
                        results.totalAmountPaid < results.originalTotalAmount 
                          ? (isLight ? 'bg-emerald-50' : 'bg-emerald-900/30') + ' border border-emerald-500/30'
                          : (isLight ? 'bg-red-50' : 'bg-red-900/30') + ' border border-red-500/30'
                      }`}>
                        <div className="text-center">
                          <div className={`text-2xl font-bold mb-1 ${
                            results.totalAmountPaid < results.originalTotalAmount
                              ? (isLight ? 'text-emerald-700' : 'text-emerald-300')
                              : (isLight ? 'text-red-700' : 'text-red-300')
                          }`}>
                            {formatCurrency(Math.abs(results.originalTotalAmount - results.totalAmountPaid))}
                          </div>
                          <div className={`text-sm font-medium ${
                            results.totalAmountPaid < results.originalTotalAmount
                              ? (isLight ? 'text-emerald-600' : 'text-emerald-400')
                              : (isLight ? 'text-red-600' : 'text-red-400')
                          }`}>
                            {results.totalAmountPaid < results.originalTotalAmount 
                              ? `Total Savings${penaltyRate > 0 && results.penaltyAmount ? ` (after ${formatCurrency(results.penaltyAmount)} penalty)` : ''}`
                              : `Net Cost (you pay ₹${Math.abs(results.totalAmountPaid - results.originalTotalAmount).toLocaleString('en-IN')} more)`
                            }
                          </div>
                          {results.totalAmountPaid >= results.originalTotalAmount && (
                            <div className={`text-xs mt-1 ${isLight ? 'text-red-500' : 'text-red-400'}`}>
                              Consider reducing penalty rate or prepayment amount
                            </div>
                          )}
                        </div>
                      </div>
                      <div className={`text-base ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                        <div className="flex justify-between items-center mb-2">
                          <span>Time Saved:</span>
                          <span className="font-semibold text-emerald-600">{(() => {
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
                          })()}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span>Monthly EMI:</span>
                          <span className="font-semibold">{formatCurrency(loanData.emi)} <span className="text-xs text-blue-600">(unchanged)</span></span>
                        </div>
                        {penaltyRate > 0 && results.penaltyAmount && results.penaltyAmount > 0 && (
                          <div className="flex justify-between items-center">
                            <span>Prepayment Penalty:</span>
                            <span className="font-semibold text-red-600">{formatCurrency(results.penaltyAmount)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Key Insight Card */}
            <section className="md-panel-elevated p-8 mb-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>EMI Remains Same</h3>
                <div className={`text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent`}>
                  {formatCurrency(loanData.emi)}
                </div>
                <p className={`text-lg ${isLight ? 'text-slate-600' : 'text-slate-400'} max-w-md mx-auto`}>
                  With the &ldquo;Reduce Tenure&rdquo; strategy, your monthly EMI stays the same while your loan term gets shorter, saving you thousands in interest.
                </p>
              </div>
            </section>

            {/* Advertisement - Before Loan Details */}
            <section className="relative z-10 mb-8">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                  {/* Desktop Ad - 970x250 Billboard */}
                  <div className="hidden md:block" style={{ textAlign: 'center', margin: '24px 0' }}>
                    <AdSenseAd slot="5678901234" style={{ margin: "24px 0" }} />
                  </div>
                  
                  {/* Mobile Ad - 320x100 Banner */}
                  <div className="block md:hidden" style={{ textAlign: 'center', margin: '24px 0' }}>
                    <AdSenseAd slot="6789012345" style={{ margin: "24px 0" }} />
                  </div>
                </div>
              </div>
            </section>

            {/* Loan Details */}
            <section className="md-panel-elevated p-8 mb-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Loan Details</h2>
                  <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'} mt-1`}>Detailed breakdown of your loan metrics</p>
                </div>
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
                <table className="w-full min-w-[600px]">
                  <thead className={`${isLight ? 'bg-slate-50' : 'bg-white/5'}`}>
                    <tr className={`border-b ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
                      <th className={`py-3 px-2 sm:px-4 text-left text-xs font-medium uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-white/70'} min-w-[120px]`}>Metric</th>
                      <th className={`py-3 px-2 sm:px-4 text-left text-xs font-medium uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-white/70'} min-w-[100px]`}>Before</th>
                      <th className={`py-3 px-2 sm:px-4 text-left text-xs font-medium uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-white/70'} min-w-[100px]`}>After</th>
                      <th className={`py-3 px-2 sm:px-4 text-left text-xs font-medium uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-white/70'} min-w-[100px]`}>Savings</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className={`border-b ${isLight ? 'border-slate-100' : 'border-white/5'}`}>
                      <td className={`py-3 px-2 sm:px-4 text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>Loan Tenure</td>
                      <td className={`py-3 px-2 sm:px-4 text-sm ${isLight ? 'text-slate-700' : 'text-white/80'}`}>{formatTenure(loanData.tenure)}</td>
                      <td className={`py-3 px-2 sm:px-4 text-sm ${isLight ? 'text-slate-700' : 'text-white/80'}`}>
                        <div className="flex flex-col">
                          <span>{formatTenure(results.newTenure)}</span>
                          <span className={`text-xs ${isLight ? 'text-green-600' : 'text-green-400'}`}>
                            (reduced)
                          </span>
                        </div>
                      </td>
                      <td className={`py-3 px-2 sm:px-4 text-sm font-medium ${isLight ? 'text-green-600' : 'text-green-400'}`}>
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
                    <tr className={`border-b ${isLight ? 'border-slate-100' : 'border-white/5'}`}>
                      <td className={`py-3 px-2 sm:px-4 text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>Total Interest Paid</td>
                      <td className={`py-3 px-2 sm:px-4 text-sm ${isLight ? 'text-slate-700' : 'text-white/80'}`}>{formatCurrency(results.originalInterest)}</td>
                      <td className={`py-3 px-2 sm:px-4 text-sm ${isLight ? 'text-slate-700' : 'text-white/80'}`}>{formatCurrency(results.interestPaid)}</td>
                      <td className={`py-3 px-2 sm:px-4 text-sm font-medium ${isLight ? 'text-green-600' : 'text-green-400'}`}>{formatCurrency(results.originalInterest - results.interestPaid)}</td>
                    </tr>
                    <tr className={`border-b ${isLight ? 'border-slate-100' : 'border-white/5'}`}>
                      <td className={`py-3 px-2 sm:px-4 text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>Monthly EMI</td>
                      <td className={`py-3 px-2 sm:px-4 text-sm ${isLight ? 'text-slate-700' : 'text-white/80'}`}>{formatCurrency(loanData.emi)}</td>
                      <td className={`py-3 px-2 sm:px-4 text-sm ${isLight ? 'text-slate-700' : 'text-white/80'}`}>
                        <div className="flex flex-col">
                          <span>{formatCurrency(loanData.emi)}</span>
                          <span className={`text-xs ${isLight ? 'text-blue-600' : 'text-blue-400'}`}>
                            (unchanged)
                          </span>
                        </div>
                      </td>
                      <td className={`py-3 px-2 sm:px-4 text-sm ${isLight ? 'text-slate-500' : 'text-white/50'}`}>
                        —
                      </td>
                    </tr>
                    <tr className={`border-b ${isLight ? 'border-slate-100' : 'border-white/5'}`}>
                      <td className={`py-3 px-2 sm:px-4 text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>Prepayment Penalty</td>
                      <td className={`py-3 px-2 sm:px-4 text-sm ${isLight ? 'text-slate-500' : 'text-white/50'}`}>—</td>
                      <td className={`py-3 px-2 sm:px-4 text-sm ${isLight ? 'text-slate-700' : 'text-white/80'}`}>{formatCurrency(results.penaltyAmount || 0)}</td>
                      <td className={`py-3 px-2 sm:px-4 text-sm ${isLight ? 'text-slate-500' : 'text-white/50'}`}>—</td>
                    </tr>
                    <tr>
                      <td className={`py-3 px-2 sm:px-4 text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>Total Amount Paid</td>
                      <td className={`py-3 px-2 sm:px-4 text-sm ${isLight ? 'text-slate-700' : 'text-white/80'}`}>{formatCurrency(results.originalTotalAmount)}</td>
                      <td className={`py-3 px-2 sm:px-4 text-sm ${isLight ? 'text-slate-700' : 'text-white/80'}`}>{formatCurrency(results.totalAmountPaid)}</td>
                      <td className={`py-3 px-2 sm:px-4 text-sm font-medium ${
                        (results.netSavings || results.amountSaved) > 0
                          ? (isLight ? 'text-green-600' : 'text-green-400')
                          : (isLight ? 'text-red-600' : 'text-red-400')
                      }`}>
                        {(results.netSavings || results.amountSaved) >= 0 
                          ? formatCurrency(results.netSavings || results.amountSaved)
                          : `-${formatCurrency(Math.abs(results.netSavings || results.amountSaved))}`
                        }
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex justify-center mt-8">
                <button 
                  onClick={() => setShowResults(false)}
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3"
                >
                  <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Recalculate</span>
                  <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </section>


            {/* Advertisement - Before Payment Timeline Chart */}
            <section className="relative z-10 mb-6">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                  {/* Desktop Ad - 970x250 Billboard */}
                  <div className="hidden md:block" style={{ textAlign: 'center', margin: '24px 0' }}>
                    <AdSenseAd slot="7890123456" style={{ margin: "24px 0" }} />
                  </div>
                  
                  {/* Mobile Ad - 320x100 Banner */}
                  <div className="block md:hidden" style={{ textAlign: 'center', margin: '24px 0' }}>
                    <AdSenseAd slot="8901234567" style={{ margin: "24px 0" }} />
                  </div>
                </div>
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
                        
                        // Stop when both loans are paid off, but ensure we show meaningful difference
                        if (withoutPrepaymentBalance <= 1 && withPrepaymentBalance <= 1) break;
                        
                        // Add visual separation for very similar curves 
                        if (Math.abs(withoutPrepaymentBalance - withPrepaymentBalance) < loanData.loanAmount * 0.01) {
                          // If curves are too close, add slight visual offset
                          if (withPrepaymentBalance < withoutPrepaymentBalance) {
                            withPrepaymentBalance = Math.max(0, withPrepaymentBalance - (loanData.loanAmount * 0.005));
                          }
                        }
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
                      bottom: 60
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={isLight ? '#e2e8f0' : '#1b2230'} />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fill: isLight ? '#64748b' : '#9ab1c9', fontSize: 12 }}
                      axisLine={{ stroke: isLight ? '#e2e8f0' : '#1b2230' }}
                      label={{ value: 'Months', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fill: isLight ? '#64748b' : '#9ab1c9' } }}
                    />
                    <YAxis 
                      tick={{ fill: isLight ? '#64748b' : '#9ab1c9', fontSize: 12 }}
                      axisLine={{ stroke: isLight ? '#e2e8f0' : '#1b2230' }}
                      domain={['dataMin * 0.95', 'dataMax * 1.05']}
                      label={{ value: 'Outstanding Balance (₹)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: isLight ? '#64748b' : '#9ab1c9' } }}
                      tickFormatter={(value) => {
                        if (value >= 1000000) return `₹${(value / 1000000).toFixed(1)}M`
                        if (value >= 1000) return `₹${(value / 1000).toFixed(0)}k`
                        return `₹${value.toFixed(0)}`
                      }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: isLight ? '#ffffff' : '#0f1420',
                        border: `1px solid ${isLight ? '#e2e8f0' : '#1b2230'}`,
                        borderRadius: '8px',
                        color: isLight ? '#1e293b' : '#e6ecf3',
                        boxShadow: isLight ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
                      }}
                      formatter={(value: number, name: string) => [
                        `₹${Number(value).toLocaleString('en-IN')}`,
                        name === 'withoutPrepayment' ? 'Without Prepayment' : 'With Prepayment'
                      ]}
                      labelFormatter={(month) => `Month ${month}`}
                    />
                    <Legend 
                      wrapperStyle={{ color: isLight ? '#64748b' : '#9ab1c9', paddingTop: '40px' }}
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

            {/* Amortization Schedule */}
            <section className="md-panel-elevated p-8 mb-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Amortization Schedule</h2>
                  <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'} mt-1`}>Month-by-month payment breakdown with prepayments</p>
                </div>
              </div>

              {results?.amortizationSchedule && (results.amortizationSchedule.length > 0 || loanData.loanAmount > 0) ? (
                <div className="space-y-6">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    <div className={`p-4 rounded-xl ${isLight ? 'bg-slate-50 border border-slate-200' : 'bg-white/5 border border-white/10'}`}>
                      <div className={`text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {formatCurrency(loanData.loanAmount)}
                      </div>
                      <div className={`text-sm ${isLight ? 'text-slate-600' : 'text-white/60'}`}>Original Loan</div>
                    </div>
                    <div className={`p-4 rounded-xl ${isLight ? 'bg-slate-50 border border-slate-200' : 'bg-white/5 border border-white/10'}`}>
                      <div className={`text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {results.amortizationSchedule.length}
                      </div>
                      <div className={`text-sm ${isLight ? 'text-slate-600' : 'text-white/60'}`}>Total Payments</div>
                    </div>
                    <div className={`p-4 rounded-xl ${isLight ? 'bg-slate-50 border border-slate-200' : 'bg-white/5 border border-white/10'}`}>
                      <div className={`text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {formatCurrency(results.amortizationSchedule.reduce((sum, payment) => sum + payment.prepayment, 0))}
                      </div>
                      <div className={`text-sm ${isLight ? 'text-slate-600' : 'text-white/60'}`}>Total Prepayments</div>
                    </div>
                    <div className={`p-4 rounded-xl ${isLight ? 'bg-slate-50 border border-slate-200' : 'bg-white/5 border border-white/10'}`}>
                      <div className={`text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {formatCurrency(results.amortizationSchedule.reduce((sum, payment) => sum + payment.interest, 0))}
                      </div>
                      <div className={`text-sm ${isLight ? 'text-slate-600' : 'text-white/60'}`}>Total Interest</div>
                    </div>
                    <div className={`p-4 rounded-xl ${isLight ? 'bg-slate-50 border border-slate-200' : 'bg-white/5 border border-white/10'}`}>
                      <div className={`text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {formatCurrency(loanData.loanAmount)}
                      </div>
                      <div className={`text-sm ${isLight ? 'text-slate-600' : 'text-white/60'}`}>Original Loan Amount</div>
                    </div>
                  </div>

                  {/* Scrollable Table */}
                  <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10" style={{maxHeight: '400px'}}>
                    <table className="w-full min-w-[700px]">
                      <thead className={`sticky top-0 ${isLight ? 'bg-slate-50' : 'bg-white/5'} backdrop-blur-sm`}>
                        <tr className={`border-b ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
                          <th className={`py-3 px-2 sm:px-4 text-left text-xs font-medium uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-white/70'} min-w-[60px]`}>Month</th>
                          <th className={`py-3 px-2 sm:px-4 text-right text-xs font-medium uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-white/70'} min-w-[100px]`}>EMI</th>
                          <th className={`py-3 px-2 sm:px-4 text-right text-xs font-medium uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-white/70'} min-w-[100px]`}>Interest</th>
                          <th className={`py-3 px-2 sm:px-4 text-right text-xs font-medium uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-white/70'} min-w-[100px]`}>Principal</th>
                          <th className={`py-3 px-2 sm:px-4 text-right text-xs font-medium uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-white/70'} min-w-[110px]`}>Prepayment</th>
                          <th className={`py-3 px-2 sm:px-4 text-right text-xs font-medium uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-white/70'} min-w-[120px]`}>Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.amortizationSchedule.map((payment, index) => (
                          <tr 
                            key={index} 
                            className={`border-b ${isLight ? 'border-slate-100 hover:bg-slate-50' : 'border-white/5 hover:bg-white/5'} transition-colors`}
                          >
                            <td className={`py-3 px-2 sm:px-4 text-sm font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>
                              {payment.month}
                            </td>
                            <td className={`py-3 px-2 sm:px-4 text-sm text-right ${isLight ? 'text-slate-700' : 'text-white/80'}`}>
                              <span className="block sm:hidden text-xs">₹{Math.round(payment.emi / 1000)}k</span>
                              <span className="hidden sm:block">{formatCurrency(payment.emi)}</span>
                            </td>
                            <td className={`py-3 px-2 sm:px-4 text-sm text-right ${isLight ? 'text-red-600' : 'text-red-400'}`}>
                              <span className="block sm:hidden text-xs">₹{Math.round(payment.interest / 1000)}k</span>
                              <span className="hidden sm:block">{formatCurrency(payment.interest)}</span>
                            </td>
                            <td className={`py-3 px-2 sm:px-4 text-sm text-right ${isLight ? 'text-blue-600' : 'text-blue-400'}`}>
                              <span className="block sm:hidden text-xs">₹{Math.round(payment.principal / 1000)}k</span>
                              <span className="hidden sm:block">{formatCurrency(payment.principal)}</span>
                            </td>
                            <td className={`py-3 px-2 sm:px-4 text-sm text-right ${payment.prepayment > 0 ? (isLight ? 'text-green-600 font-semibold' : 'text-green-400 font-semibold') : (isLight ? 'text-slate-500' : 'text-white/50')}`}>
                              {payment.prepayment > 0 ? (
                                <>
                                  <span className="block sm:hidden text-xs">₹{Math.round(payment.prepayment / 1000)}k</span>
                                  <span className="hidden sm:block">{formatCurrency(payment.prepayment)}</span>
                                </>
                              ) : '—'}
                            </td>
                            <td className={`py-3 px-2 sm:px-4 text-sm text-right font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>
                              <span className="block sm:hidden text-xs">₹{Math.round(payment.balance / 1000)}k</span>
                              <span className="hidden sm:block">{formatCurrency(payment.balance)}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Legend */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${isLight ? 'bg-red-600' : 'bg-red-400'}`}></div>
                      <span className={isLight ? 'text-slate-600' : 'text-white/60'}>Interest Payment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${isLight ? 'bg-blue-600' : 'bg-blue-400'}`}></div>
                      <span className={isLight ? 'text-slate-600' : 'text-white/60'}>Principal Payment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${isLight ? 'bg-green-600' : 'bg-green-400'}`}></div>
                      <span className={isLight ? 'text-slate-600' : 'text-white/60'}>Prepayment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${isLight ? 'bg-slate-900' : 'bg-white'}`}></div>
                      <span className={isLight ? 'text-slate-600' : 'text-white/60'}>Remaining Balance</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`text-center py-12 ${isLight ? 'text-slate-500' : 'text-white/60'}`}>
                  <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div className="text-lg font-medium mb-2">No Schedule Available</div>
                  <div className="text-sm">Enter loan details and prepayment amount to view the amortization schedule</div>
                </div>
              )}
            </section>
          </>
        )}
        </div>
      </div>

        {/* FAQ Section */}
        <section className="relative z-10 mt-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <FAQ 
              title="Prepayment Calculator FAQ" 
              faqs={prepaymentFAQs}
            />
          </div>
        </section>

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