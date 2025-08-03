'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Zap, DollarSign, TrendingUp, Clock, Calculator } from 'lucide-react'
import { CarData } from '@/app/page'
import {
  LoanDetails,
  calculatePrepaymentImpact,
  calculateStepUpEMIImpact,
  calculateShorterTenureEMI,
  formatCurrency,
  formatTenure
} from '@/utils/loanCalculations'

interface FastPayoffPopupProps {
  isOpen: boolean
  onClose: () => void
  carData: CarData
}

type CalculatorTab = 'prepayment' | 'stepup' | 'tenure'

export default function FastPayoffPopup({ isOpen, onClose, carData }: FastPayoffPopupProps) {
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

  // Initialize newEMI if not set using useEffect
  useEffect(() => {
    if (newEMI === 0 && currentEMI > 0) {
      setNewEMI(Math.round(currentEMI * 1.2)) // 20% higher as default
    }
  }, [currentEMI, newEMI])

  // Calculate results for each option
  const prepaymentResult = calculatePrepaymentImpact(loanDetails, prepaymentAmount)
  const stepUpResult = calculateStepUpEMIImpact(loanDetails, newEMI)
  const shorterTenureResult = calculateShorterTenureEMI(loanDetails, newTenure)

  const tabs = [
    {
      id: 'prepayment' as CalculatorTab,
      title: 'Part Prepayment',
      icon: DollarSign,
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

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-900 rounded-2xl shadow-2xl border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Pay Off Loan Faster</h2>
                <p className="text-white/60 text-sm">Choose your preferred payoff strategy</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Loan Summary */}
          <div className="p-6 bg-white/5 border-b border-white/10">
            <h3 className="text-white font-semibold mb-3">Current Loan Details</h3>
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

          {/* Tab Navigation */}
          <div className="flex border-b border-white/10">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 p-4 text-left transition-all hover:bg-white/5 ${
                    activeTab === tab.id
                      ? 'bg-white/10 border-b-2 border-emerald-400'
                      : ''
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

          {/* Tab Content */}
          <div className="p-6 overflow-y-auto max-h-96">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Prepayment Calculator */}
                {activeTab === 'prepayment' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-white font-medium mb-3">
                        🚀 Lump Sum Prepayment Amount
                      </label>
                      
                      {/* Quick Amount Buttons */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
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

                    {/* Results */}
                    <div className="bg-white/5 rounded-lg p-4 space-y-3">
                      <h4 className="text-white font-semibold mb-3">Result:</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-white/60">New Tenure</span>
                          <div className="text-emerald-400 font-semibold">
                            {formatTenure(prepaymentResult.newTenureMonths)}
                          </div>
                        </div>
                        <div>
                          <span className="text-white/60">Months Reduced</span>
                          <div className="text-emerald-400 font-semibold">
                            {prepaymentResult.monthsReduced} months
                          </div>
                        </div>
                        <div>
                          <span className="text-white/60">Interest Saved</span>
                          <div className="text-green-400 font-semibold">
                            {formatCurrency(prepaymentResult.interestSaved)}
                          </div>
                        </div>
                        <div>
                          <span className="text-white/60">Total Savings</span>
                          <div className="text-green-400 font-semibold">
                            {formatCurrency(prepaymentResult.totalSavings)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step Up EMI Calculator */}
                {activeTab === 'stepup' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-white font-medium mb-3">
                        📈 New Monthly EMI Amount
                      </label>
                      <p className="text-white/60 text-sm mb-4">
                        Current EMI: {formatCurrency(currentEMI)}
                      </p>
                      
                      <div className="relative">
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
                      <div className="mt-4">
                        <input
                          type="range"
                          min={currentEMI}
                          max={currentEMI * 2}
                          step="500"
                          value={newEMI}
                          onChange={(e) => setNewEMI(Number(e.target.value))}
                          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-white/60 mt-2">
                          <span>{formatCurrency(currentEMI)}</span>
                          <span>{formatCurrency(currentEMI * 2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Results */}
                    <div className="bg-white/5 rounded-lg p-4 space-y-3">
                      <h4 className="text-white font-semibold mb-3">Result:</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-white/60">New Tenure</span>
                          <div className="text-cyan-400 font-semibold">
                            {formatTenure(stepUpResult.newTenureMonths)}
                          </div>
                        </div>
                        <div>
                          <span className="text-white/60">Months Reduced</span>
                          <div className="text-cyan-400 font-semibold">
                            {stepUpResult.monthsReduced} months
                          </div>
                        </div>
                        <div>
                          <span className="text-white/60">Additional EMI</span>
                          <div className="text-yellow-400 font-semibold">
                            +{formatCurrency(stepUpResult.additionalEMIPerMonth)}
                          </div>
                        </div>
                        <div>
                          <span className="text-white/60">Interest Saved</span>
                          <div className="text-green-400 font-semibold">
                            {formatCurrency(stepUpResult.interestSaved)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Shorter Tenure Calculator */}
                {activeTab === 'tenure' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-white font-medium mb-3">
                        🕓 Select New Loan Tenure
                      </label>
                      <p className="text-white/60 text-sm mb-4">
                        Current Tenure: {formatTenure(remainingTenure)}
                      </p>
                      
                      {/* Tenure Slider */}
                      <div className="space-y-4">
                        <input
                          type="range"
                          min="12"
                          max={remainingTenure - 1}
                          step="6"
                          value={newTenure}
                          onChange={(e) => setNewTenure(Number(e.target.value))}
                          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-white/60">
                          <span>12 months</span>
                          <span className="text-white font-semibold">{formatTenure(newTenure)}</span>
                          <span>{formatTenure(remainingTenure)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Results */}
                    <div className="bg-white/5 rounded-lg p-4 space-y-3">
                      <h4 className="text-white font-semibold mb-3">Result:</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-white/60">Required EMI</span>
                          <div className="text-purple-400 font-semibold">
                            {formatCurrency(shorterTenureResult.newEMI)}
                          </div>
                        </div>
                        <div>
                          <span className="text-white/60">EMI Increase</span>
                          <div className="text-yellow-400 font-semibold">
                            +{formatCurrency(shorterTenureResult.emiIncrease)}
                          </div>
                        </div>
                        <div>
                          <span className="text-white/60">Months Saved</span>
                          <div className="text-purple-400 font-semibold">
                            {remainingTenure - newTenure} months
                          </div>
                        </div>
                        <div>
                          <span className="text-white/60">Interest Saved</span>
                          <div className="text-green-400 font-semibold">
                            {formatCurrency(shorterTenureResult.interestSaved)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}