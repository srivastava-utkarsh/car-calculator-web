'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Zap, TrendingUp, Clock, Calculator, CheckCircle } from 'lucide-react'
import { CarData } from '@/app/page'
import {
  LoanDetails,
  calculatePrepaymentImpact,
  calculateStepUpEMIImpact,
  calculateShorterTenureEMI,
  formatCurrency,
  formatTenure
} from '@/utils/loanCalculations'

interface FastPayoffPageProps {
  carData: CarData
  onBack: () => void
}

type CalculatorTab = 'prepayment' | 'stepup' | 'tenure'

// Custom Indian Rupee Icon Component
const RupeeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 3h12"/>
    <path d="M6 8h12"/>
    <path d="m6 13 8.5 8"/>
    <path d="M6 13h3"/>
    <path d="M9 13c6.667 0 6.667-10 0-10"/>
  </svg>
)

interface ComparisonData {
  original: {
    emi: number
    tenure: number
    totalInterest: number
    totalPayment: number
  }
  new: {
    emi: number
    tenure: number
    totalInterest: number
    totalPayment: number
    savings: number
    monthsReduced: number
  }
}

export default function FastPayoffPage({ carData, onBack }: FastPayoffPageProps) {
  const [activeTab, setActiveTab] = useState<CalculatorTab>('prepayment')
  const [prepaymentAmount, setPrepaymentAmount] = useState<number>(100000)
  const [newEMI, setNewEMI] = useState<number>(0)
  const [newTenure, setNewTenure] = useState<number>(36)

  // Calculate loan details
  const calculateEMI = (principal: number, rate: number, years: number) => {
    if (principal <= 0 || rate <= 0 || years <= 0) return 0
    const monthlyRate = rate / (12 * 100)
    const months = years * 12
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
           (Math.pow(1 + monthlyRate, months) - 1)
  }

  const loanAmount = carData.carPrice - carData.downPayment
  const currentEMI = calculateEMI(loanAmount, carData.interestRate, carData.tenure)
  const monthlyRate = carData.interestRate / (12 * 100)
  const remainingTenure = carData.tenure * 12

  const loanDetails: LoanDetails = {
    principal: loanAmount,
    monthlyEMI: currentEMI,
    monthlyRate,
    remainingTenure
  }

  // Initialize newEMI and newTenure if not set
  useEffect(() => {
    if (newEMI === 0 && currentEMI > 0) {
      const initialEMI = Math.ceil(currentEMI * 1.2 / 1000) * 1000 // Round to nearest 1000
      setNewEMI(initialEMI)
    }
    
    // Initialize newTenure to be shorter than current tenure
    if (remainingTenure > 0 && (newTenure >= remainingTenure || newTenure === 36)) {
      const maxAllowedTenure = Math.max(6, remainingTenure - 6) // At least 6 months shorter
      const initialTenure = Math.max(6, Math.min(remainingTenure - 12, maxAllowedTenure)) // 1 year shorter, minimum 6 months
      setNewTenure(initialTenure)
    }
  }, [currentEMI, newEMI, remainingTenure, newTenure])

  // Calculate results for each option
  const prepaymentResult = calculatePrepaymentImpact(loanDetails, prepaymentAmount)
  const stepUpResult = calculateStepUpEMIImpact(loanDetails, newEMI)
  // Ensure newTenure is valid (less than remaining tenure)
  const validNewTenure = Math.min(newTenure, Math.max(6, remainingTenure - 6))
  const shorterTenureResult = calculateShorterTenureEMI(loanDetails, validNewTenure)

  // Original loan data
  const originalData = {
    emi: currentEMI,
    tenure: remainingTenure,
    totalInterest: (currentEMI * remainingTenure) - loanAmount,
    totalPayment: currentEMI * remainingTenure
  }

  // Get comparison data based on active tab
  const getComparisonData = (): ComparisonData => {
    const original = originalData

    switch (activeTab) {
      case 'prepayment':
        // For prepayment: Total payment = EMI * new tenure + prepayment amount
        const newTotalPaymentPrepayment = (currentEMI * Math.max(0, prepaymentResult.newTenureMonths)) + prepaymentAmount
        const newTotalInterestPrepayment = Math.max(0, (currentEMI * Math.max(0, prepaymentResult.newTenureMonths)) - Math.max(0, loanAmount - prepaymentAmount))
        
        return {
          original,
          new: {
            emi: currentEMI,
            tenure: prepaymentResult.newTenureMonths,
            totalInterest: newTotalInterestPrepayment,
            totalPayment: newTotalPaymentPrepayment,
            savings: original.totalPayment - newTotalPaymentPrepayment,
            monthsReduced: prepaymentResult.monthsReduced
          }
        }
      
      case 'stepup':
        // For step-up EMI: Total payment = new EMI * new tenure
        const newTotalPaymentStepup = Math.max(0, newEMI * Math.max(0, stepUpResult.newTenureMonths))
        const newTotalInterestStepup = Math.max(0, newTotalPaymentStepup - loanAmount)
        
        return {
          original,
          new: {
            emi: newEMI,
            tenure: stepUpResult.newTenureMonths,
            totalInterest: newTotalInterestStepup,
            totalPayment: newTotalPaymentStepup,
            savings: original.totalPayment - newTotalPaymentStepup,
            monthsReduced: stepUpResult.monthsReduced
          }
        }
      
      case 'tenure':
        // For shorter tenure: Total payment = new EMI * new tenure
        const newTotalPaymentTenure = Math.max(0, shorterTenureResult.newEMI * Math.max(0, validNewTenure))
        const newTotalInterestTenure = Math.max(0, newTotalPaymentTenure - loanAmount)
        
        return {
          original,
          new: {
            emi: shorterTenureResult.newEMI,
            tenure: validNewTenure,
            totalInterest: newTotalInterestTenure,
            totalPayment: newTotalPaymentTenure,
            savings: original.totalPayment - newTotalPaymentTenure,
            monthsReduced: remainingTenure - validNewTenure
          }
        }
      
      default:
        return {
          original,
          new: { ...original, savings: 0, monthsReduced: 0 }
        }
    }
  }

  const comparisonData = getComparisonData()

  const tabs = [
    {
      id: 'prepayment' as CalculatorTab,
      title: 'Part Prepayment',
      icon: RupeeIcon,
      description: 'Reduce tenure with lump sum'
    },
    {
      id: 'stepup' as CalculatorTab,
      title: 'Increase EMI',
      icon: TrendingUp,
      description: 'Step up monthly payments'
    },
    {
      id: 'tenure' as CalculatorTab,
      title: 'Shorter Tenure',
      icon: Clock,
      description: 'Select new loan duration'
    }
  ]

  // Quick amount buttons for prepayment
  const quickAmounts = [50000, 100000, 200000, 300000]

  return (
    <div className="min-h-screen bg-black font-sans relative" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header */}
      <header className="bg-black/95 backdrop-blur-md border-b border-white/10 sticky top-0 z-10">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Back Button */}
            <button
              onClick={onBack}
              className="flex items-center space-x-3 text-white/80 hover:text-white transition-colors group"
            >
              <div className="p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </div>
              <span className="font-medium">Back to Calculator</span>
            </button>

            {/* Title */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-bold text-white">Pay Off Loan Faster</h1>
            </div>

            <div className="w-24"></div> {/* Spacer for center alignment */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Current Loan Summary */}
          <div className="mb-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <h2 className="text-white font-semibold mb-4">Current Loan Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-white/60">Loan Amount</span>
                <div className="text-white font-semibold">{formatCurrency(loanAmount)}</div>
              </div>
              <div>
                <span className="text-white/60">Monthly EMI</span>
                <div className="text-white font-semibold">{formatCurrency(currentEMI)}</div>
              </div>
              <div>
                <span className="text-white/60">Tenure</span>
                <div className="text-white font-semibold">{formatTenure(remainingTenure)}</div>
              </div>
              <div>
                <span className="text-white/60">Interest Rate</span>
                <div className="text-white font-semibold">{carData.interestRate}% p.a.</div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            
            {/* Left Panel - Calculator Options */}
            <div className="lg:col-span-2">
              {/* Tab Navigation */}
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-4">Choose Your Strategy</h3>
                <div className="space-y-3">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full p-4 text-left rounded-xl transition-all border ${
                          activeTab === tab.id
                            ? 'bg-white/10 border-emerald-400/50 shadow-lg'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-emerald-400' : 'text-white/60'}`} />
                          <div>
                            <div className={`font-medium ${activeTab === tab.id ? 'text-white' : 'text-white/80'}`}>
                              {tab.title}
                            </div>
                            <div className="text-xs text-white/50">{tab.description}</div>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Calculator Inputs */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                <h4 className="text-white font-semibold mb-4">Configure Your Strategy</h4>
                
                {/* Prepayment Calculator */}
                {activeTab === 'prepayment' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white font-medium mb-3">
                        Lump Sum Amount
                      </label>
                      
                      {/* Quick Amount Buttons */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {quickAmounts.map((amount) => (
                          <button
                            key={amount}
                            onClick={() => setPrepaymentAmount(amount)}
                            className={`p-3 rounded-lg text-sm font-medium transition-all ${
                              prepaymentAmount === amount
                                ? 'bg-emerald-500 text-white'
                                : 'bg-white/10 text-white/80 hover:bg-white/20'
                            }`}
                          >
                            {formatCurrency(amount)}
                          </button>
                        ))}
                      </div>
                      
                      {/* Custom Amount Input */}
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 font-semibold">₹</span>
                        <input
                          type="number"
                          value={prepaymentAmount}
                          onChange={(e) => setPrepaymentAmount(Number(e.target.value) || 0)}
                          className="w-full pl-8 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                          placeholder="Enter custom amount"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step Up EMI Calculator */}
                {activeTab === 'stepup' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white font-medium mb-3">
                        New Monthly EMI
                      </label>
                      <p className="text-white/60 text-sm mb-4">
                        Current EMI: {formatCurrency(currentEMI)}
                      </p>
                      
                      <div className="relative mb-4">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 font-semibold">₹</span>
                        <input
                          type="number"
                          value={newEMI}
                          onChange={(e) => setNewEMI(Number(e.target.value) || 0)}
                          className="w-full pl-8 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                          placeholder="Enter new EMI amount"
                        />
                      </div>
                      
                      {/* EMI Slider */}
                      <input
                        type="range"
                        min={Math.ceil(currentEMI / 1000) * 1000}
                        max={Math.min(loanAmount, currentEMI * 3)}
                        step="1000"
                        value={newEMI}
                        onChange={(e) => setNewEMI(Number(e.target.value))}
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-white/60 mt-2">
                        <span>{formatCurrency(Math.ceil(currentEMI / 1000) * 1000)}</span>
                        <span>{formatCurrency(Math.min(loanAmount, currentEMI * 3))}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Shorter Tenure Calculator */}
                {activeTab === 'tenure' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white font-medium mb-3">
                        New Loan Tenure
                      </label>
                      <p className="text-white/60 text-sm mb-4">
                        Current Tenure: {formatTenure(remainingTenure)}
                      </p>
                      
                      {/* Tenure Slider */}
                      <div className="space-y-4">
                        <input
                          type="range"
                          min="6"
                          max={Math.max(6, remainingTenure - 6)}
                          step="6"
                          value={Math.min(newTenure, Math.max(6, remainingTenure - 6))}
                          onChange={(e) => setNewTenure(Number(e.target.value))}
                          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-white/60">
                          <span>6 months</span>
                          <span className="text-white font-semibold">{formatTenure(newTenure)}</span>
                          <span>{formatTenure(Math.max(6, remainingTenure - 6))}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel - Comparison View */}
            <div className="lg:col-span-3">
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                <h3 className="text-white font-semibold mb-6 flex items-center">
                  <Calculator className="w-5 h-5 mr-2 text-emerald-400" />
                  Loan Comparison: Original vs New
                </h3>

                {/* Comparison Cards */}
                <div className="grid md:grid-cols-2 gap-6">
                  
                  {/* Original Loan Card */}
                  <div className="bg-white/5 rounded-xl border border-white/10 p-5">
                    <h4 className="text-white font-semibold mb-4 flex items-center">
                      <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                      Current Loan
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/60">Monthly EMI</span>
                        <span className="text-white font-semibold">{formatCurrency(comparisonData.original.emi)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Tenure</span>
                        <span className="text-white font-semibold">{formatTenure(comparisonData.original.tenure)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Total Interest</span>
                        <span className="text-white font-semibold">{formatCurrency(comparisonData.original.totalInterest)}</span>
                      </div>
                      <div className="flex justify-between border-t border-white/20 pt-3">
                        <span className="text-white/60">Total Payment</span>
                        <span className="text-white font-bold">{formatCurrency(comparisonData.original.totalPayment)}</span>
                      </div>
                    </div>
                  </div>

                  {/* New Loan Card */}
                  <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-xl border border-emerald-400/30 p-5">
                    <h4 className="text-white font-semibold mb-4 flex items-center">
                      <div className="w-3 h-3 bg-emerald-400 rounded-full mr-2"></div>
                      Optimized Loan
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/60">Monthly EMI</span>
                        <span className="text-emerald-300 font-semibold">{formatCurrency(comparisonData.new.emi)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Tenure</span>
                        <span className="text-emerald-300 font-semibold">{formatTenure(comparisonData.new.tenure)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Total Interest</span>
                        <span className="text-emerald-300 font-semibold">{formatCurrency(comparisonData.new.totalInterest)}</span>
                      </div>
                      <div className="flex justify-between border-t border-emerald-400/30 pt-3">
                        <span className="text-white/60">Total Payment</span>
                        <span className="text-emerald-300 font-bold">{formatCurrency(comparisonData.new.totalPayment)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Savings Summary */}
                <div className="mt-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/30 p-5">
                  <h4 className="text-white font-semibold mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                    Your Savings
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Interest Saved</span>
                      <span className="text-green-400 font-bold text-base">{formatCurrency(comparisonData.new.savings)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Time Saved</span>
                      <span className="text-green-400 font-bold text-base">{formatTenure(comparisonData.new.monthsReduced)}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}