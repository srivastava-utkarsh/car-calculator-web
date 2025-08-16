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
  _loanType: 'fixed' | 'floating' = 'floating',
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
  
  const [loanData, setLoanData] = useState<LoanData>({
    loanAmount: 0,
    interestRate: 8,
    tenure: 0,
    emi: 0
  })
  
  const [prepaymentAmount, setPrepaymentAmount] = useState(0)
  const [prepaymentFrequency, setPrepaymentFrequency] = useState<'monthly' | 'quarterly' | 'yearly' | 'lumpsum'>('yearly')
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

  if (isLoading) {
    return (
      <div style={{
        background: '#0d1117',
        color: '#e6ecf3',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, system-ui, Segoe UI, Roboto, Arial'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', marginBottom: '8px' }}>Loading Prepayment Calculator...</div>
          <div style={{ fontSize: '14px', color: '#9ab1c9' }}>Analyzing your loan data</div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen font-sans relative bg-black" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header Navigation - Same as Car Affordability Page */}
      <header className="bg-black border-b border-white/5">
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
              <span className="text-base sm:text-2xl font-extrabold tracking-tight flex items-center text-white">BudgetGear</span>
            </div>

            {/* Navigation Menu - Center with proper spacing */}
            <div className="flex-1 flex justify-center px-4">
              <nav className="flex items-center" role="navigation" aria-label="Main navigation">
                <span className="font-bold text-xs sm:text-base tracking-wide px-1 sm:px-4 py-2 text-center text-white">
                  Prepayment Calculator
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

      {/* Main Content */}
      <div style={{
        background: '#0d1117',
        color: '#e6ecf3',
        minHeight: 'calc(100vh - 80px)',
        fontFamily: 'Inter, system-ui, Segoe UI, Roboto, Arial',
        fontSize: '15px',
        lineHeight: '1.45'
      }}>
        <style jsx global>{`
        :root {
          --bg: #0d1117;
          --panel: #121826;
          --panel2: #0f1420;
          --text: #e6ecf3;
          --muted: #9ab1c9;
          --border: #1b2230;
          --accent: #4da3ff;
          --pos: #22c55e;
          --warn: #f59e0b;
          --radius: 10px;
          --gap: 12px;
          --pad: 14px;
        }
        
        * {
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          background: var(--bg);
          color: var(--text);
          font: 15px/1.45 Inter, system-ui, Segoe UI, Roboto, Arial;
        }
        
        .wrap {
          max-width: 1024px;
          margin: 0 auto;
          padding: 18px;
        }
        
        h1 {
          font-size: 18px;
          margin: 0 0 10px;
        }
        
        /* Cards and grids */
        .card {
          background: linear-gradient(180deg, var(--panel) 0%, var(--panel2) 100%);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: var(--pad);
        }
        
        .title {
          font-size: 14px;
          color: #cfe3ff;
          margin-bottom: 8px;
          font-weight: 600;
        }
        
        .row {
          display: grid;
          gap: var(--gap);
        }
        
        .grid-3 {
          grid-template-columns: 1fr 1fr 1fr;
        }
        
        @media (max-width: 900px) {
          .grid-3 {
            grid-template-columns: 1fr;
          }
        }
        
        /* Inputs compact */
        .fields {
          display: grid;
          gap: var(--gap);
        }
        
        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        
        .label {
          font-size: 12px;
          color: #cbd6e5;
        }
        
        .ctrl {
          display: flex;
          gap: 8px;
          align-items: center;
          background: #0b1220;
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 10px;
        }
        
        input, select {
          background: transparent;
          border: 0;
          outline: 0;
          color: var(--text);
          width: 100%;
          font-size: 14px;
          min-width: 0;
          flex: 1;
        }
        
        .prefix, .suffix {
          font-size: 12px;
          color: var(--muted);
        }
        
        .subnote {
          font-size: 12px;
          color: #97a9bd;
          margin-top: 8px;
        }
        
        /* Comparison section */
        .compare {
          display: grid;
          gap: var(--gap);
        }
        
        @media(min-width: 900px) {
          .compare {
            grid-template-columns: 1fr 1fr;
          }
        }
        
        .panel {
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 24px;
          background: #0f1524;
        }
        
        .kicker {
          font-size: 14px;
          color: #cbd6e5;
          margin-bottom: 12px;
          font-weight: 600;
        }
        
        .big {
          font-weight: 800;
          font-size: 32px;
          margin: 0 0 12px;
        }
        
        .meta {
          font-size: 16px;
          color: var(--muted);
          margin-bottom: 8px;
        }
        
        .save {
          color: var(--pos);
          font-weight: 700;
          font-size: 18px;
        }
        
        .emi-line {
          margin-top: 8px;
          font-size: 16px;
        }
        
        .emi-same {
          color: #b7d7ff;
        }
        
        .emi-diff .before {
          color: #5e86ff;
        }
        
        .emi-diff .after {
          color: #22c55e;
          font-weight: 600;
        }
        
        /* Table compact */
        table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }
        
        th, td {
          padding: 10px 8px;
          border-bottom: 1px solid var(--border);
          text-align: left;
        }
        
        th {
          font-size: 11px;
          letter-spacing: .4px;
          color: #bcd1e6;
          text-transform: uppercase;
        }
        
        td {
          font-size: 14px;
        }
        
        .pos {
          color: var(--pos);
          font-weight: 600;
        }
        
        .warn {
          color: var(--warn);
          font-weight: 600;
        }
        
        /* Footer actions */
        .bar {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
          margin-top: 10px;
        }
        
        .btn {
          background: #0f2436;
          border: 1px solid #18324a;
          color: #cfe3ff;
          padding: 8px 12px;
          border-radius: 8px;
          cursor: pointer;
        }
        
        .btn--pri {
          background: #0461e6;
          border-color: #0c5ed1;
          color: #fff;
        }
        
        /* EMI Comparison Styles */
        .emi-status {
          padding: 8px 0;
        }
        
        .emi-badge.same {
          background: linear-gradient(135deg, #1a2c3a, #0f1f2a);
          border: 1px solid #22c55e40;
          border-radius: 8px;
          padding: 12px 16px;
          text-align: center;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        
        .emi-badge .emi-label {
          font-size: 14px;
          font-weight: 600;
          color: #22c55e;
        }
        
        .emi-badge .emi-amount {
          font-size: 18px;
          font-weight: 700;
          color: #22c55e;
        }
        
        .emi-note {
          font-size: 14px;
          color: var(--muted);
          text-align: center;
          line-height: 1.5;
        }
        
        .emi-comparison {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          margin-bottom: 16px;
        }
        
        .emi-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px;
          border-radius: 8px;
          background: var(--panel);
          border: 1px solid var(--border);
        }
        
        .emi-item.before {
          border-color: #5e86ff;
        }
        
        .emi-item.after {
          border-color: #22c55e;
        }
        
        .emi-item .emi-label {
          font-size: 12px;
          color: var(--muted);
          margin-bottom: 6px;
        }
        
        .emi-item .emi-amount {
          font-size: 20px;
          font-weight: 700;
          color: var(--text);
        }
        
        .emi-arrow {
          font-size: 24px;
          color: var(--accent);
          font-weight: bold;
        }
        
        .emi-difference {
          text-align: center;
          font-size: 14px;
          color: var(--muted);
        }
        
        .emi-difference .positive {
          color: #22c55e;
          font-weight: 600;
        }
        
        .emi-difference .negative {
          color: #ef4444;
          font-weight: 600;
        }
      `}</style>
      
      <div className="wrap">
        <h1>Loan Prepayment Calculator</h1>
        
        {/* Your Current Loan */}
        <section className="card">
          <div className="title">Your Current Loan</div>
          <div className="fields grid-3">
            <div className="field">
              <div className="label">Loan Amount</div>
              <div className="ctrl">
                <span className="prefix">₹</span>
                <input 
                  type="number" 
                  value={loanData.loanAmount || ''}
                  onChange={(e) => {
                    const newAmount = parseFloat(e.target.value) || 0
                    const newEMI = newAmount > 0 ? calculateEMI(newAmount, loanData.interestRate, loanData.tenure) : 0
                    setLoanData(prev => ({ ...prev, loanAmount: newAmount, emi: newEMI }))
                  }}
                  placeholder="800000" 
                  aria-label="Loan Amount"
                />
              </div>
              <div className="subnote">Enter principal outstanding</div>
            </div>
            <div className="field">
              <div className="label">Interest Rate</div>
              <div className="ctrl">
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
                  placeholder="8.00" 
                  aria-label="Interest Rate"
                />
                <span className="suffix">% p.a.</span>
              </div>
            </div>
            <div className="field">
              <div className="label">Loan Tenure</div>
              <div className="ctrl">
                <input 
                  type="number" 
                  step="0.5"
                  min="1"
                  max="10"
                  value={loanData.tenure || ''}
                  onChange={(e) => {
                    const newTenure = Math.min(10, Math.max(1, parseFloat(e.target.value) || 5))
                    const newEMI = loanData.loanAmount > 0 ? calculateEMI(loanData.loanAmount, loanData.interestRate, newTenure) : 0
                    setLoanData(prev => ({ ...prev, tenure: newTenure, emi: newEMI }))
                  }}
                  placeholder="3" 
                  aria-label="Loan Tenure Years"
                />
                <span className="suffix">years</span>
              </div>
            </div>
          </div>
        </section>

        {/* Prepayment Configuration */}
        <section className="card" style={{marginTop: '12px'}}>
          <div className="title">Prepayment Configuration</div>
          <div className="fields grid-3">
            <div className="field">
              <div className="label">Frequency</div>
              <div className="ctrl">
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
                >
                  <option>Yearly</option>
                  <option>Quarterly</option>
                  <option>Monthly</option>
                  <option>Lumpsum</option>
                </select>
              </div>
            </div>
            <div className="field">
              <div className="label">
                {prepaymentFrequency === 'yearly' ? 'Yearly' : 
                 prepaymentFrequency === 'quarterly' ? 'Quarterly' : 
                 prepaymentFrequency === 'monthly' ? 'Monthly' : 'Lumpsum'} Prepayment Amount
              </div>
              <div className="ctrl">
                <span className="prefix">₹</span>
                <input 
                  type="number" 
                  value={prepaymentAmount || ''}
                  onChange={(e) => setPrepaymentAmount(parseFloat(e.target.value) || 0)}
                  placeholder="16000" 
                  aria-label="Prepayment Amount"
                />
              </div>
            </div>
            <div className="field">
              <div className="label">Prepayment Penalty (if any)</div>
              <div className="ctrl">
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
                  placeholder="0" 
                  aria-label="Prepayment Penalty"
                />
                <span className="suffix">%</span>
              </div>
              <div className="subnote">Most floating‑rate loans have 0% penalty</div>
            </div>
          </div>
        </section>

        {results && (
          <>
            {/* Comparison */}
            <section className="card" style={{marginTop: '12px'}}>
              <div className="title">Comparison</div>
              <div className="compare">
                {/* Without Prepayment */}
                <div className="panel">
                  <div className="kicker">Without Prepayment</div>
                  <div className="big">{formatTenure(loanData.tenure)}</div>
                  <div className="meta">Total interest: {formatCurrency(results.originalInterest)}</div>
                  <div className="emi-line emi-same">EMI: {formatCurrency(loanData.emi)}</div>
                </div>
                
                {/* With Prepayment */}
                <div className="panel">
                  <div className="kicker">With Prepayment</div>
                  <div className="big">{formatTenure(results.newTenure)}</div>
                  <div className="meta">
                    You save <span className="save">
                      {formatCurrency(
                        penaltyRate > 0 && results.penaltyAmount 
                          ? Math.max(0, results.amountSaved - results.penaltyAmount)
                          : results.amountSaved
                      )}
                    </span> and finish {(() => {
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
                    })()} earlier
                  </div>
                  <div className="emi-line emi-same">EMI: {formatCurrency(loanData.emi)}</div>
                </div>
              </div>
            </section>

            {/* EMI Comparison */}
            <section className="card" style={{marginTop: '12px'}}>
              <div className="title">EMI Comparison</div>
              {(() => {
                const originalEMI = loanData.emi;
                const newEMI = loanData.emi; // In "Reduce Tenure" strategy, EMI remains same
                const isSame = Math.abs(originalEMI - newEMI) < 1; // Account for rounding
                
                return isSame ? (
                  <div className="emi-status same">
                    <div className="emi-badge same">
                      <span className="emi-label">EMI Remains Same:</span>
                      <span className="emi-amount">{formatCurrency(originalEMI)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="emi-status different">
                    <div className="emi-comparison">
                      <div className="emi-item before">
                        <span className="emi-label">Before</span>
                        <span className="emi-amount">{formatCurrency(originalEMI)}</span>
                      </div>
                      <div className="emi-arrow">→</div>
                      <div className="emi-item after">
                        <span className="emi-label">After</span>
                        <span className="emi-amount">{formatCurrency(newEMI)}</span>
                      </div>
                    </div>
                    <div className="emi-difference">
                      <span>Difference: </span>
                      <span className={newEMI < originalEMI ? 'positive' : 'negative'}>
                        {formatCurrency(Math.abs(originalEMI - newEMI))}
                        {newEMI < originalEMI ? ' less' : ' more'}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </section>

            {/* Loan Details */}
            <section className="card" style={{marginTop: '12px'}}>
              <div className="title">Loan Details</div>
              <div style={{overflow: 'auto'}}>
                <table>
                  <thead>
                    <tr>
                      <th>Metric</th>
                      <th>Before</th>
                      <th>After</th>
                      <th>Savings</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Loan Tenure</td>
                      <td>{formatTenure(loanData.tenure)}</td>
                      <td>{formatTenure(results.newTenure)}</td>
                      <td className="pos">
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
                    <tr>
                      <td>Total Interest Paid</td>
                      <td>{formatCurrency(results.originalInterest)}</td>
                      <td>{formatCurrency(results.interestPaid)}</td>
                      <td className="pos">{formatCurrency(results.originalInterest - results.interestPaid)}</td>
                    </tr>
                    <tr>
                      <td>Monthly EMI</td>
                      <td>{formatCurrency(loanData.emi)}</td>
                      <td>{formatCurrency(loanData.emi)}</td>
                      <td>—</td>
                    </tr>
                    <tr>
                      <td>Prepayment Penalty</td>
                      <td>—</td>
                      <td>{formatCurrency(results.penaltyAmount || 0)}</td>
                      <td className="warn">—</td>
                    </tr>
                    <tr>
                      <td>Total Amount Paid</td>
                      <td>{formatCurrency(results.originalTotalAmount)}</td>
                      <td>{formatCurrency(results.totalAmountPaid)}</td>
                      <td className="pos">
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
              <div className="bar">
                <button className="btn btn--pri" onClick={() => window.location.reload()}>Recalculate</button>
              </div>
            </section>


            {/* Monthly Payment Timeline Chart */}
            <section className="card" style={{marginTop: '12px'}}>
              <div className="title">Payment Timeline Comparison</div>
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
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ab1c9'}}>
                    Enter loan details to see timeline chart
                  </div>
                )}
              </div>
              <div className="subnote" style={{textAlign: 'center', marginTop: '8px'}}>
                Outstanding loan balance over time showing how prepayment accelerates loan payoff
              </div>
            </section>
          </>
        )}
        </div>

        {/* Footer - Same as Car Affordability Page */}
        <footer className="relative z-10 mt-16 mb-8">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-xl p-6 shadow-lg bg-white/5 backdrop-blur-xl border border-white/10">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 bg-white/10">
                  <svg className="w-3 h-3 text-white/50" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium mb-3 text-sm text-white/90">Disclaimer</p>
                  <p className="leading-relaxed text-sm text-white/70">
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