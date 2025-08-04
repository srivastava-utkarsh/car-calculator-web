'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, ArrowLeft, ToggleLeft, ToggleRight } from 'lucide-react'
import Link from 'next/link'

// Dummy data for demonstration
const dummyCarData = {
  carPrice: 1200000,
  downPayment: 240000,
  interestRate: 8,
  tenure: 3,
  processingFee: 15000,
  kmPerMonth: 1000,
  fuelCostPerLiter: 100,
  monthlyIncome: 150000,
  insuranceAndMaintenance: 12000,
  includeFuelInAffordability: true
}

export default function DemoPage() {
  const [durationToggle, setDurationToggle] = useState<'months' | 'years'>('months')
  const [showComparison, setShowComparison] = useState(false)

  // Calculate values using dummy data
  const calculateEMI = (principal: number, rate: number, years: number) => {
    if (principal <= 0 || rate <= 0 || years <= 0) return 0
    const monthlyRate = rate / (12 * 100)
    const months = years * 12
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
    return isNaN(emi) ? 0 : emi
  }

  const loanAmount = Math.max(0, dummyCarData.carPrice - dummyCarData.downPayment)
  const emi = calculateEMI(loanAmount, dummyCarData.interestRate, dummyCarData.tenure)
  const totalInterest = (emi * dummyCarData.tenure * 12) - loanAmount
  const totalPayment = loanAmount + totalInterest
  const monthlyFuelCost = (dummyCarData.kmPerMonth / 15) * dummyCarData.fuelCostPerLiter
  const totalMonthlyExpenses = emi + (dummyCarData.includeFuelInAffordability ? monthlyFuelCost : 0)
  const expensePercentage = (totalMonthlyExpenses / dummyCarData.monthlyIncome) * 100

  const formatCurrency = (value: number) => {
    if (isNaN(value) || !isFinite(value) || value < 0) return '₹0'
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`
    return `₹${Math.round(value).toLocaleString('en-IN')}`
  }

  const formatPercentage = (value: number) => {
    if (isNaN(value) || !isFinite(value)) return '0.0'
    return value.toFixed(1)
  }

  const getLastEMIDate = () => {
    const today = new Date()
    const lastEMIDate = new Date(today.getFullYear(), today.getMonth() + (dummyCarData.tenure * 12), today.getDate())
    return lastEMIDate.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })
  }

  return (
    <main className="min-h-screen bg-black font-mono relative">
      {/* Compact Header */}
      <header className="bg-black/95 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            <Link href="/" className="flex items-center space-x-2 text-white hover:text-cyan-300 transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Link>
            <h1 className="text-sm font-bold text-white">Compact Financial Summary Demo</h1>
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="text-xs text-white/70 hover:text-white transition-colors"
            >
              {showComparison ? 'Hide' : 'Show'} Comparison
            </button>
          </div>
        </div>
      </header>

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/30 via-black to-gray-900/20 pointer-events-none"></div>

      {/* Main Content */}
      <section className="relative z-10 p-4">
        <div className="max-w-4xl mx-auto">
            
          {/* Compact Financial Summary */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden"
          >
            {/* Compact Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
              <h3 className="text-sm font-bold text-white">Financial Summary</h3>
              <div className="flex items-center space-x-3">
                <div className={`text-xs px-2 py-1 rounded-full flex items-center space-x-1 ${
                  expensePercentage <= 10 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                }`}>
                  {expensePercentage <= 10 ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                  <span>{expensePercentage <= 10 ? 'Affordable' : 'Review'}</span>
                </div>
              </div>
            </div>

            {/* Compact Main Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <tbody className="divide-y divide-white/5">
                  {/* Car & Loan Details */}
                  <tr className="hover:bg-white/5">
                    <td className="py-2 px-4 text-white/80 font-medium">Car Price</td>
                    <td className="py-2 px-2 text-right text-white font-mono">{formatCurrency(dummyCarData.carPrice)}</td>
                    <td className="py-2 px-4 text-right text-white/60">Base</td>
                  </tr>
                  <tr className="hover:bg-white/5">
                    <td className="py-2 px-4 text-white/80 font-medium">Down Payment</td>
                    <td className="py-2 px-2 text-right text-white font-mono">{formatCurrency(dummyCarData.downPayment)}</td>
                    <td className="py-2 px-4 text-right text-white/60">{((dummyCarData.downPayment / dummyCarData.carPrice) * 100).toFixed(0)}%</td>
                  </tr>
                  <tr className="hover:bg-white/5">
                    <td className="py-2 px-4 text-white/80 font-medium">Loan Amount</td>
                    <td className="py-2 px-2 text-right text-white font-mono">{formatCurrency(loanAmount)}</td>
                    <td className="py-2 px-4 text-right text-white/60">{dummyCarData.interestRate}% × {dummyCarData.tenure}y</td>
                  </tr>
                  
                  {/* Monthly Expenses - Highlighted Section */}
                  <tr className="bg-white/10">
                    <td colSpan={3} className="py-1 px-4 text-center">
                      <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">Monthly</span>
                    </td>
                  </tr>
                  
                  <tr className="hover:bg-white/5 bg-cyan-500/10">
                    <td className="py-3 px-4 text-cyan-200 font-bold">EMI</td>
                    <td className="py-3 px-2 text-right text-cyan-300 font-mono text-lg font-bold">{formatCurrency(emi)}</td>
                    <td className="py-3 px-4 text-right text-cyan-200/80">→ {getLastEMIDate()}</td>
                  </tr>
                  
                  <tr className="hover:bg-white/5">
                    <td className="py-2 px-4 text-white/80 font-medium">
                      <div className="flex items-center space-x-2">
                        <span>Fuel Cost</span>
                        <div className={`w-2 h-2 rounded-full ${dummyCarData.includeFuelInAffordability ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                      </div>
                    </td>
                    <td className="py-2 px-2 text-right text-emerald-300 font-mono">{formatCurrency(monthlyFuelCost)}</td>
                    <td className="py-2 px-4 text-right text-white/60">{dummyCarData.kmPerMonth}km</td>
                  </tr>
                  
                  <tr className="hover:bg-white/5 bg-yellow-500/10 border-t border-white/20">
                    <td className="py-3 px-4 text-yellow-200 font-bold">Total Monthly</td>
                    <td className="py-3 px-2 text-right text-yellow-300 font-mono text-lg font-bold">{formatCurrency(totalMonthlyExpenses)}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`font-semibold ${expensePercentage <= 10 ? 'text-green-300' : 'text-red-300'}`}>
                        {formatPercentage(expensePercentage)}%
                      </span>
                    </td>
                  </tr>
                  
                  {/* Loan Summary */}
                  <tr className="bg-white/10">
                    <td colSpan={3} className="py-1 px-4 text-center">
                      <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">Total</span>
                    </td>
                  </tr>
                  
                  <tr className="hover:bg-white/5">
                    <td className="py-2 px-4 text-white/80 font-medium">Interest Cost</td>
                    <td className="py-2 px-2 text-right text-orange-300 font-mono">{formatCurrency(totalInterest)}</td>
                    <td className="py-2 px-4 text-right text-white/60">{durationToggle === 'years' ? `${dummyCarData.tenure}y` : `${dummyCarData.tenure * 12}m`}</td>
                  </tr>
                  
                  <tr className="hover:bg-white/5">
                    <td className="py-2 px-4 text-white font-bold">Total Payment</td>
                    <td className="py-2 px-2 text-right text-purple-300 font-mono text-base font-bold">{formatCurrency(totalPayment)}</td>
                    <td className="py-2 px-4 text-right text-white/60">P+I</td>
                  </tr>
                  
                  {/* One-time costs */}
                  {dummyCarData.processingFee > 0 && (
                    <tr className="hover:bg-white/5 border-t border-white/10">
                      <td className="py-2 px-4 text-white/80 font-medium">
                        <div className="flex items-center space-x-1">
                          <span>Processing Fee</span>
                          <span className="text-xs px-1 py-0.5 rounded bg-orange-500/20 text-orange-300">1x</span>
                        </div>
                      </td>
                      <td className="py-2 px-2 text-right text-orange-300 font-mono">{formatCurrency(dummyCarData.processingFee)}</td>
                      <td className="py-2 px-4 text-right text-white/60">Upfront</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Compact Controls */}
            <div className="flex justify-between items-center px-4 py-3 bg-white/5 border-t border-white/10">
              <button
                onClick={() => setDurationToggle(durationToggle === 'years' ? 'months' : 'years')}
                className="flex items-center space-x-2 text-xs text-white/70 hover:text-white transition-colors"
              >
                {durationToggle === 'years' ? <ToggleLeft className="w-4 h-4" /> : <ToggleRight className="w-4 h-4" />}
                <span>{durationToggle === 'years' ? 'Years' : 'Months'}</span>
              </button>
              
              <div className="text-xs text-white/60">
                Monthly Income: {formatCurrency(dummyCarData.monthlyIncome)}
              </div>
            </div>
          </motion.div>

          {/* Compact Comparison (Collapsible) */}
          {showComparison && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 grid md:grid-cols-2 gap-4"
            >
              <div className="bg-white/5 backdrop-blur-xl rounded-lg border border-white/10 p-4">
                <h4 className="text-sm font-bold text-red-300 mb-3">❌ Current: Card Layout</h4>
                <ul className="space-y-1 text-xs text-white/70">
                  <li>• Scattered information</li>
                  <li>• Hard to compare values</li>
                  <li>• More visual clutter</li>
                  <li>• Takes more space</li>
                </ul>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-lg border border-white/10 p-4">
                <h4 className="text-sm font-bold text-green-300 mb-3">✅ New: Compact Table</h4>
                <ul className="space-y-1 text-xs text-white/70">
                  <li>• All data in one view</li>
                  <li>• Easy value comparison</li>
                  <li>• Clean, minimal design</li>
                  <li>• Space-efficient layout</li>
                </ul>
              </div>
            </motion.div>
          )}

          {/* Key Benefits */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 bg-blue-500/10 border border-blue-400/20 rounded-lg p-4"
          >
            <h4 className="text-sm font-bold text-blue-300 mb-2">Compact Design Benefits</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="text-center">
                <div className="text-lg mb-1">📊</div>
                <div className="text-blue-200">Better Scanning</div>
              </div>
              <div className="text-center">
                <div className="text-lg mb-1">⚡</div>
                <div className="text-blue-200">Faster Reading</div>
              </div>
              <div className="text-center">
                <div className="text-lg mb-1">📱</div>
                <div className="text-blue-200">Mobile Friendly</div>
              </div>
              <div className="text-center">
                <div className="text-lg mb-1">🎯</div>
                <div className="text-blue-200">Less Clutter</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}