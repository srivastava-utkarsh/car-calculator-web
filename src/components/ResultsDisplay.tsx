'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, RotateCcw, Download, Share, CheckCircle, XCircle, DollarSign, TrendingUp, Calendar, Car, ChevronDown, ChevronUp, PiggyBank, Target } from 'lucide-react'
import { CarData } from '@/app/page'

interface ResultsDisplayProps {
  carData: CarData
  onBack: () => void
  onRestart: () => void
}

export default function ResultsDisplay({ carData, onBack, onRestart }: ResultsDisplayProps) {
  const [showOptimization, setShowOptimization] = useState(false)
  const [prepaymentAmount, setPrepaymentAmount] = useState(50000)
  const [prepaymentType, setPrepaymentType] = useState<'reduce-emi' | 'reduce-tenure'>('reduce-emi')
  const calculateEMI = (principal: number, rate: number, years: number) => {
    if (principal <= 0 || rate <= 0 || years <= 0) return 0
    const monthlyRate = rate / (12 * 100)
    const months = years * 12
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
           (Math.pow(1 + monthlyRate, months) - 1)
  }

  // Calculate values
  const loanAmount = carData.carPrice - carData.downPayment
  const emi = calculateEMI(loanAmount, carData.interestRate, carData.tenure)
  const totalInterest = (emi * carData.tenure * 12) - loanAmount
  const totalPayment = loanAmount + totalInterest
  
  // Prepayment calculations
  const calculateWithPrepayment = () => {
    const reducedPrincipal = loanAmount - prepaymentAmount
    if (prepaymentType === 'reduce-emi') {
      const newEmi = calculateEMI(reducedPrincipal, carData.interestRate, carData.tenure)
      const newTotalPayment = newEmi * carData.tenure * 12
      const newTotalInterest = newTotalPayment - reducedPrincipal
      return {
        emi: newEmi,
        tenure: carData.tenure,
        totalInterest: newTotalInterest,
        totalPayment: newTotalPayment,
        savings: totalInterest - newTotalInterest
      }
    } else {
      // Calculate new tenure with same EMI
      let newTenure = 1
      let newEmi = 0
      for (let years = 1; years <= 7; years += 0.1) {
        newEmi = calculateEMI(reducedPrincipal, carData.interestRate, years)
        if (newEmi <= emi) {
          newTenure = years
          break
        }
      }
      const newTotalPayment = newEmi * newTenure * 12
      const newTotalInterest = newTotalPayment - reducedPrincipal
      return {
        emi: newEmi,
        tenure: newTenure,
        totalInterest: newTotalInterest,
        totalPayment: newTotalPayment,
        savings: totalInterest - newTotalInterest
      }
    }
  }

  const optimizedLoan = calculateWithPrepayment()
  const downPaymentPercentage = (carData.downPayment / carData.carPrice) * 100
  
  // Quick optimization suggestions
  const suggestedDownPaymentIncrease = 100000
  const improvedDownPayment = carData.downPayment + suggestedDownPaymentIncrease
  const improvedLoanAmount = carData.carPrice - improvedDownPayment
  const improvedEmi = calculateEMI(improvedLoanAmount, carData.interestRate, carData.tenure)
  const emiSavings = emi - improvedEmi

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-xl text-gray-300 mb-2">Step 3: Your EMI Plan</h3>
        <p className="text-gray-400">Here's your complete loan summary and optimization options</p>
      </div>

      {/* Main EMI Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white p-8 rounded-2xl text-center"
      >
        <h2 className="text-2xl font-semibold mb-4">Your Monthly EMI</h2>
        <p className="text-6xl font-bold mb-4">₹{emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
        <p className="text-white/80 text-lg">for {carData.tenure} years</p>
      </motion.div>

      {/* Cost Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
          <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
          Cost Breakdown
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Principal Amount:</span>
              <span className="font-semibold text-white">₹{loanAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Interest:</span>
              <span className="font-semibold text-white">₹{totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Processing Fee:</span>
              <span className="font-semibold text-white">₹{carData.processingFee.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Interest Rate:</span>
              <span className="font-semibold text-white">{carData.interestRate}% p.a.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Loan Tenure:</span>
              <span className="font-semibold text-white">{carData.tenure} years</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-600">
              <span className="text-white font-semibold">Total Repayment:</span>
              <span className="font-bold text-lg text-emerald-400">₹{totalPayment.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Smart Optimization Hints */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          💡 Smart Optimization Tips
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <p className="text-gray-300">• Breakeven: {(carData.tenure * 12).toFixed(0)} months</p>
            <p className="text-gray-300">• Interest per month: ₹{(totalInterest / (carData.tenure * 12)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
          </div>
          <div className="space-y-2">
            <p className="text-gray-300">• +₹1L down payment → Save ₹{emiSavings.toLocaleString('en-IN', { maximumFractionDigits: 0 })}/month</p>
            <p className="text-gray-300">• Prepayment can save significant interest</p>
          </div>
        </div>
      </motion.div>

      {/* Optional Prepayment Optimization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800/30 border border-gray-700/50 rounded-xl overflow-hidden"
      >
        <button
          onClick={() => setShowOptimization(!showOptimization)}
          className="w-full p-6 text-left hover:bg-gray-700/30 transition-colors flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <PiggyBank className="w-6 h-6 text-purple-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">Prepayment Optimization</h3>
              <p className="text-gray-400 text-sm">Make lump-sum prepayment to reduce interest (Optional)</p>
            </div>
          </div>
          {showOptimization ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {showOptimization && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-700/50 p-6 space-y-6"
          >
            {/* Prepayment Amount */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Prepayment Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
                <input
                  type="number"
                  value={prepaymentAmount}
                  onChange={(e) => setPrepaymentAmount(Number(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter prepayment amount"
                />
              </div>
              <div className="flex space-x-2 mt-2">
                {[25000, 50000, 100000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setPrepaymentAmount(amount)}
                    className={`px-3 py-1 text-xs rounded transition-colors ${
                      prepaymentAmount === amount
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    ₹{amount.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>

            {/* Optimization Type */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Choose Impact
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setPrepaymentType('reduce-emi')}
                  className={`p-4 rounded-lg border transition-colors ${
                    prepaymentType === 'reduce-emi'
                      ? 'border-purple-500 bg-purple-500/20 text-white'
                      : 'border-gray-600 hover:border-gray-500 text-gray-300'
                  }`}
                >
                  <Target className="w-5 h-5 mb-2" />
                  <p className="font-medium">Reduce EMI</p>
                  <p className="text-xs text-gray-400">Keep tenure same</p>
                </button>
                <button
                  onClick={() => setPrepaymentType('reduce-tenure')}
                  className={`p-4 rounded-lg border transition-colors ${
                    prepaymentType === 'reduce-tenure'
                      ? 'border-purple-500 bg-purple-500/20 text-white'
                      : 'border-gray-600 hover:border-gray-500 text-gray-300'
                  }`}
                >
                  <Calendar className="w-5 h-5 mb-2" />
                  <p className="font-medium">Reduce Tenure</p>
                  <p className="text-xs text-gray-400">Keep EMI same</p>
                </button>
              </div>
            </div>

            {/* Optimization Results */}
            {prepaymentAmount > 0 && prepaymentAmount < loanAmount && (
              <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3">After Prepayment of ₹{prepaymentAmount.toLocaleString('en-IN')}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">New EMI:</span>
                      <span className="font-semibold text-purple-400">
                        ₹{optimizedLoan.emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">New Tenure:</span>
                      <span className="font-semibold text-white">
                        {optimizedLoan.tenure.toFixed(1)} years
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Interest Saved:</span>
                      <span className="font-semibold text-green-400">
                        ₹{optimizedLoan.savings.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">New Total Payment:</span>
                      <span className="font-semibold text-white">
                        ₹{(optimizedLoan.totalPayment + prepaymentAmount).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Cash Purchase Alternative */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-xl p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <PiggyBank className="w-6 h-6 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Want to save and buy in one go?</h3>
        </div>
        <p className="text-gray-300 text-sm mb-4">
          Calculate how much to save monthly to buy this car with cash instead of taking a loan.
        </p>
        <button
          onClick={() => {
            // This would navigate to cash savings calculator
            alert('Cash savings calculator coming soon!')
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          Calculate Monthly Savings →
        </button>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-wrap gap-4 justify-center"
      >
        <button
          onClick={onBack}
          className="flex items-center space-x-2 bg-gray-700 text-gray-300 px-6 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Modify Terms</span>
        </button>
        
        <button
          onClick={() => window.print()}
          className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/20"
        >
          <Download className="w-5 h-5" />
          <span>Download Summary</span>
        </button>
        
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'Car Loan EMI Calculator Results',
                text: `My car loan EMI: ₹${emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}/month for ${carData.tenure} years`,
                url: window.location.href
              })
            } else {
              // Fallback for browsers without share API
              navigator.clipboard.writeText(`My car loan EMI: ₹${emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}/month for ${carData.tenure} years`)
              alert('Results copied to clipboard!')
            }
          }}
          className="flex items-center space-x-2 bg-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-cyan-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-cyan-500/20"
        >
          <Share className="w-5 h-5" />
          <span>Share</span>
        </button>
        
        <button
          onClick={onRestart}
          className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Start Over</span>
        </button>
      </motion.div>
    </div>
  )
}