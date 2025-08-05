'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Calculator, TrendingDown, Clock, DollarSign } from 'lucide-react'
import Link from 'next/link'

interface LoanData {
  principal: number
  interestRate: number
  tenure: number
  prepaymentAmount: number
  prepaymentFrequency: number // in months (12 = yearly, 6 = half-yearly)
}

interface ScenarioResult {
  totalPaid: number
  totalInterest: number
  principal: number
  saved: number
  actualTenure: number // in years
  emi: number
}

export default function Demo2Page() {
  const [loanData, setLoanData] = useState<LoanData>({
    principal: 5000000, // 50 lakhs
    interestRate: 8.5,
    tenure: 25, // years
    prepaymentAmount: 50000, // 50k prepayment
    prepaymentFrequency: 12 // yearly
  })

  // EMI Calculation Formula: EMI = [P × r × (1 + r)^n] / [(1 + r)^n - 1]
  const calculateEMI = (principal: number, rate: number, tenureMonths: number): number => {
    if (principal <= 0 || rate <= 0 || tenureMonths <= 0) return 0
    const monthlyRate = rate / (12 * 100)
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / 
                 (Math.pow(1 + monthlyRate, tenureMonths) - 1)
    return isNaN(emi) ? 0 : emi
  }

  // Calculate new tenure after prepayment (keeping EMI same)
  const calculateNewTenure = (remainingPrincipal: number, emi: number, rate: number): number => {
    if (remainingPrincipal <= 0 || emi <= 0 || rate <= 0) return 0
    const monthlyRate = rate / (12 * 100)
    if (emi <= monthlyRate * remainingPrincipal) return 999 // Invalid case
    const newTenure = Math.log(emi / (emi - monthlyRate * remainingPrincipal)) / Math.log(1 + monthlyRate)
    return isNaN(newTenure) ? 0 : newTenure
  }

  // No Prepayment Scenario
  const calculateNoPrepayment = (): ScenarioResult => {
    const tenureMonths = loanData.tenure * 12
    const emi = calculateEMI(loanData.principal, loanData.interestRate, tenureMonths)
    const totalPaid = emi * tenureMonths
    const totalInterest = totalPaid - loanData.principal
    
    return {
      totalPaid,
      totalInterest,
      principal: loanData.principal,
      saved: 0,
      actualTenure: loanData.tenure,
      emi
    }
  }

  // Reduce Term Scenario (same EMI, shorter tenure)
  const calculateReduceTerm = (): ScenarioResult => {
    const originalEMI = calculateEMI(loanData.principal, loanData.interestRate, loanData.tenure * 12)
    const monthlyRate = loanData.interestRate / (12 * 100)
    
    let remainingPrincipal = loanData.principal
    let totalPaid = 0
    let totalPrepayments = 0
    let currentMonth = 0
    
    while (remainingPrincipal > 0 && currentMonth < loanData.tenure * 12) {
      // Pay EMI
      const interestComponent = remainingPrincipal * monthlyRate
      const principalComponent = originalEMI - interestComponent
      
      if (principalComponent <= 0) break
      
      remainingPrincipal -= principalComponent
      totalPaid += originalEMI
      currentMonth++
      
      // Apply prepayment if it's time
      if (currentMonth % loanData.prepaymentFrequency === 0 && remainingPrincipal > 0) {
        const prepayment = Math.min(loanData.prepaymentAmount, remainingPrincipal)
        remainingPrincipal -= prepayment
        totalPaid += prepayment
        totalPrepayments += prepayment
      }
      
      if (remainingPrincipal <= 1) break // Loan is essentially paid off
    }
    
    const totalInterest = totalPaid - loanData.principal
    const noPrepaymentResult = calculateNoPrepayment()
    const saved = noPrepaymentResult.totalPaid - totalPaid
    
    return {
      totalPaid,
      totalInterest,
      principal: loanData.principal,
      saved,
      actualTenure: currentMonth / 12,
      emi: originalEMI
    }
  }

  // Reduce EMI Scenario (same tenure, lower EMI after prepayment)
  const calculateReduceEMI = (): ScenarioResult => {
    const tenureMonths = loanData.tenure * 12
    const originalEMI = calculateEMI(loanData.principal, loanData.interestRate, tenureMonths)
    const monthlyRate = loanData.interestRate / (12 * 100)
    
    let remainingPrincipal = loanData.principal
    let remainingTenure = tenureMonths
    let totalPaid = 0
    let currentEMI = originalEMI
    
    for (let month = 1; month <= tenureMonths; month++) {
      if (remainingPrincipal <= 0) break
      
      // Pay current EMI
      const interestComponent = remainingPrincipal * monthlyRate
      const principalComponent = Math.min(currentEMI - interestComponent, remainingPrincipal)
      
      remainingPrincipal -= principalComponent
      totalPaid += currentEMI
      remainingTenure--
      
      // Apply prepayment if it's time
      if (month % loanData.prepaymentFrequency === 0 && remainingPrincipal > 0) {
        const prepayment = Math.min(loanData.prepaymentAmount, remainingPrincipal)
        remainingPrincipal -= prepayment
        totalPaid += prepayment
        
        // Recalculate EMI for remaining tenure
        if (remainingTenure > 0 && remainingPrincipal > 0) {
          currentEMI = calculateEMI(remainingPrincipal, loanData.interestRate, remainingTenure)
        }
      }
    }
    
    const totalInterest = totalPaid - loanData.principal
    const noPrepaymentResult = calculateNoPrepayment()
    const saved = noPrepaymentResult.totalPaid - totalPaid
    
    return {
      totalPaid,
      totalInterest,
      principal: loanData.principal,
      saved,
      actualTenure: loanData.tenure,
      emi: currentEMI
    }
  }

  const formatCurrency = (value: number): string => {
    if (isNaN(value) || !isFinite(value)) return '₹0'
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)} Cr`
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)} L`
    return `₹${Math.round(value).toLocaleString('en-IN')}`
  }

  const updateLoanData = (field: keyof LoanData, value: number) => {
    setLoanData(prev => ({ ...prev, [field]: value }))
  }

  const scenarios = {
    noPrepayment: calculateNoPrepayment(),
    reduceTerm: calculateReduceTerm(),
    reduceEMI: calculateReduceEMI()
  }

  return (
    <main className="min-h-screen bg-black font-sans relative">
      {/* Header */}
      <header className="bg-black/95 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3 text-white hover:text-cyan-300 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Calculator</span>
            </Link>
            <h1 className="text-xl font-bold text-white flex items-center space-x-2">
              <Calculator className="w-6 h-6" />
              <span>Loan Prepayment Analysis Demo</span>
            </h1>
            <div className="w-32"></div> {/* Spacer for balance */}
          </div>
        </div>
      </header>

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/30 via-black to-gray-900/20 pointer-events-none"></div>

      {/* Main Content */}
      <section className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Input Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-8"
          >
            <h2 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
              <DollarSign className="w-5 h-5" />
              <span>Loan Parameters</span>
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Loan Amount
                </label>
                <input
                  type="number"
                  value={loanData.principal}
                  onChange={(e) => updateLoanData('principal', Number(e.target.value))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Enter loan amount"
                />
                <p className="text-xs text-white/60 mt-1">{formatCurrency(loanData.principal)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Interest Rate (% p.a.)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={loanData.interestRate}
                  onChange={(e) => updateLoanData('interestRate', Number(e.target.value))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="8.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Tenure (Years)
                </label>
                <input
                  type="number"
                  value={loanData.tenure}
                  onChange={(e) => updateLoanData('tenure', Number(e.target.value))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="25"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Prepayment Amount
                </label>
                <input
                  type="number"
                  value={loanData.prepaymentAmount}
                  onChange={(e) => updateLoanData('prepaymentAmount', Number(e.target.value))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="50000"
                />
                <p className="text-xs text-white/60 mt-1">{formatCurrency(loanData.prepaymentAmount)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Prepayment Frequency
                </label>
                <select
                  value={loanData.prepaymentFrequency}
                  onChange={(e) => updateLoanData('prepaymentFrequency', Number(e.target.value))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value={12} className="bg-black">Yearly</option>
                  <option value={6} className="bg-black">Half-yearly</option>
                  <option value={3} className="bg-black">Quarterly</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Results Comparison Table */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
          >
            <div className="px-6 py-4 bg-white/5 border-b border-white/10">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <TrendingDown className="w-5 h-5" />
                <span>Prepayment Scenarios Comparison</span>
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/10 border-b border-white/10">
                    <th className="text-left py-4 px-6 text-white/80 font-medium">Scenario</th>
                    <th className="text-right py-4 px-4 text-white/80 font-medium">Total Paid</th>
                    <th className="text-right py-4 px-4 text-white/80 font-medium">Principal</th>
                    <th className="text-right py-4 px-4 text-white/80 font-medium">Interest</th>
                    <th className="text-right py-4 px-4 text-white/80 font-medium">Amount Saved</th>
                    <th className="text-right py-4 px-4 text-white/80 font-medium">Tenure</th>
                    <th className="text-right py-4 px-4 text-white/80 font-medium">EMI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-white/5">
                    <td className="py-4 px-6 text-white font-medium">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                        <span>No Prepayment</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right text-white font-mono">{formatCurrency(scenarios.noPrepayment.totalPaid)}</td>
                    <td className="py-4 px-4 text-right text-white font-mono">{formatCurrency(scenarios.noPrepayment.principal)}</td>
                    <td className="py-4 px-4 text-right text-orange-300 font-mono">{formatCurrency(scenarios.noPrepayment.totalInterest)}</td>
                    <td className="py-4 px-4 text-right text-white/60">–</td>
                    <td className="py-4 px-4 text-right text-white">{scenarios.noPrepayment.actualTenure} years</td>
                    <td className="py-4 px-4 text-right text-cyan-300 font-mono">{formatCurrency(scenarios.noPrepayment.emi)}</td>
                  </tr>

                  <tr className="hover:bg-white/5 bg-green-500/10">
                    <td className="py-4 px-6 text-white font-medium">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        <span>Reduce Term (Same EMI)</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right text-white font-mono">{formatCurrency(scenarios.reduceTerm.totalPaid)}</td>
                    <td className="py-4 px-4 text-right text-white font-mono">{formatCurrency(scenarios.reduceTerm.principal)}</td>
                    <td className="py-4 px-4 text-right text-orange-300 font-mono">{formatCurrency(scenarios.reduceTerm.totalInterest)}</td>
                    <td className="py-4 px-4 text-right text-green-300 font-mono font-bold">{formatCurrency(scenarios.reduceTerm.saved)}</td>
                    <td className="py-4 px-4 text-right text-green-300 font-bold">{scenarios.reduceTerm.actualTenure.toFixed(1)} years</td>
                    <td className="py-4 px-4 text-right text-cyan-300 font-mono">{formatCurrency(scenarios.reduceTerm.emi)}</td>
                  </tr>

                  <tr className="hover:bg-white/5 bg-blue-500/10">
                    <td className="py-4 px-6 text-white font-medium">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                        <span>Reduce EMI (Same Tenure)</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right text-white font-mono">{formatCurrency(scenarios.reduceEMI.totalPaid)}</td>
                    <td className="py-4 px-4 text-right text-white font-mono">{formatCurrency(scenarios.reduceEMI.principal)}</td>
                    <td className="py-4 px-4 text-right text-orange-300 font-mono">{formatCurrency(scenarios.reduceEMI.totalInterest)}</td>
                    <td className="py-4 px-4 text-right text-blue-300 font-mono font-bold">{formatCurrency(scenarios.reduceEMI.saved)}</td>
                    <td className="py-4 px-4 text-right text-white">{scenarios.reduceEMI.actualTenure} years</td>
                    <td className="py-4 px-4 text-right text-blue-300 font-mono">{formatCurrency(scenarios.reduceEMI.emi)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Key Insights */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 grid md:grid-cols-2 gap-6"
          >
            <div className="bg-green-500/10 border border-green-400/20 rounded-xl p-6">
              <h4 className="text-lg font-bold text-green-300 mb-4 flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Reduce Term Strategy</span>
              </h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li>• <strong>Higher Savings:</strong> {formatCurrency(scenarios.reduceTerm.saved)} total saved</li>
                <li>• <strong>Faster Freedom:</strong> Loan closes in {scenarios.reduceTerm.actualTenure.toFixed(1)} years</li>
                <li>• <strong>Same EMI:</strong> No change in monthly budget</li>
                <li>• <strong>Best For:</strong> Stable income, want to be debt-free sooner</li>
              </ul>
            </div>

            <div className="bg-blue-500/10 border border-blue-400/20 rounded-xl p-6">
              <h4 className="text-lg font-bold text-blue-300 mb-4 flex items-center space-x-2">
                <TrendingDown className="w-5 h-5" />
                <span>Reduce EMI Strategy</span>
              </h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li>• <strong>Lower Savings:</strong> {formatCurrency(scenarios.reduceEMI.saved)} total saved</li>
                <li>• <strong>Same Duration:</strong> {scenarios.reduceEMI.actualTenure} years tenure maintained</li>
                <li>• <strong>Reduced EMI:</strong> Lower monthly burden</li>
                <li>• <strong>Best For:</strong> Variable income, need cash flow relief</li>
              </ul>
            </div>
          </motion.div>

          {/* Formula Information */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6"
          >
            <h4 className="text-lg font-bold text-white mb-4">📐 Mathematical Formulas Used</h4>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-white/80">
              <div>
                <h5 className="font-semibold text-white mb-2">EMI Calculation:</h5>
                <p className="font-mono bg-black/30 p-3 rounded">
                  EMI = [P × r × (1 + r)^n] / [(1 + r)^n - 1]
                </p>
                <p className="mt-2 text-xs">Where P = Principal, r = monthly rate, n = tenure in months</p>
              </div>
              <div>
                <h5 className="font-semibold text-white mb-2">New Tenure (Reduce Term):</h5>
                <p className="font-mono bg-black/30 p-3 rounded">
                  n = ln(EMI / (EMI - r × Outstanding)) / ln(1 + r)
                </p>
                <p className="mt-2 text-xs">Calculates remaining months when EMI stays constant</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}