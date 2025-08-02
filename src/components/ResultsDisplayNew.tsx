'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, RotateCcw, CheckCircle, XCircle, DollarSign, TrendingUp, Calendar, Car, Fuel, ChevronDown, ChevronUp, PiggyBank, Target } from 'lucide-react'
import { CarData } from '@/app/page'

interface ResultsDisplayProps {
  carData: CarData
  onBack: () => void
  onRestart: () => void
}

export default function ResultsDisplayNew({ carData, onBack, onRestart }: ResultsDisplayProps) {
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
  
  // Check if optional fields are filled
  const hasProcessingFee = carData.processingFee > 0
  const hasFuelData = carData.kmPerMonth > 0 && carData.fuelCostPerLiter > 0
  const hasMonthlyIncome = carData.monthlyIncome > 0
  
  // Monthly running cost calculation (assuming 15 km/liter average)
  const fuelEfficiency = 15 // km per liter
  const monthlyFuelCost = hasFuelData ? (carData.kmPerMonth / fuelEfficiency) * carData.fuelCostPerLiter : 0
  
  // 20/4/10 rule check
  const downPaymentPercentage = (carData.downPayment / carData.carPrice) * 100
  const isDownPaymentOk = downPaymentPercentage >= 20
  const isTenureOk = carData.tenure <= 4
  const totalMonthlyExpense = emi + monthlyFuelCost
  const expensePercentage = hasMonthlyIncome ? (totalMonthlyExpense / carData.monthlyIncome) * 100 : 0
  const isExpenseOk = hasMonthlyIncome ? expensePercentage <= 10 : true
  const isAffordable = isDownPaymentOk && isTenureOk && isExpenseOk

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

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      {/* Main Content - Takes 3/5 of the space */}
      <div className="lg:col-span-3 space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h3 className="text-xl text-gray-300 mb-2">Your EMI Plan</h3>
          <p className="text-gray-400">Complete loan summary and optimization options</p>
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
            onClick={onRestart}
            className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Start Over</span>
          </button>
        </motion.div>
      </div>

      {/* Right Panel Content - Animated from sidebar */}
      <motion.div 
        className="lg:col-span-2 space-y-6"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        <h3 className="text-xl font-semibold text-white mb-6">Financial Summary</h3>
        
        {/* Summary Cards */}
        <div className="space-y-4">
          {/* Car Price */}
          <motion.div 
            className="bg-gray-800/40 rounded-lg p-4 border border-gray-700/30"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Car className="w-5 h-5 text-emerald-400" />
                <span className="text-gray-400">Car Price</span>
              </div>
              <span className="font-bold text-emerald-400 text-lg">
                ₹{carData.carPrice.toLocaleString('en-IN')}
              </span>
            </div>
          </motion.div>

          {/* Down Payment */}
          <motion.div 
            className="bg-gray-800/40 rounded-lg p-4 border border-gray-700/30"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-cyan-400" />
                <span className="text-gray-400">Down Payment</span>
              </div>
              <span className="font-bold text-cyan-400 text-lg">
                ₹{carData.downPayment.toLocaleString('en-IN')}
              </span>
            </div>
          </motion.div>

          {/* Loan Amount */}
          <motion.div 
            className="bg-gray-800/40 rounded-lg p-4 border border-gray-700/30"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <span className="text-gray-400">Loan Amount</span>
              </div>
              <span className="font-bold text-purple-400 text-lg">
                ₹{loanAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </motion.div>

          {/* Processing Fee - Only if filled */}
          {hasProcessingFee && (
            <motion.div 
              className="bg-gray-800/40 rounded-lg p-4 border border-gray-700/30"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Processing Fee</span>
                <span className="font-bold text-yellow-400">
                  ₹{carData.processingFee.toLocaleString('en-IN')}
                </span>
              </div>
            </motion.div>
          )}

          {/* Total Monthly Expense - Only if fuel data provided */}
          {hasFuelData && (
            <motion.div 
              className="bg-gray-700/40 rounded-lg p-4 border border-gray-600/50"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold">Total Monthly Cost</span>
                <span className="font-bold text-xl text-yellow-400">
                  ₹{totalMonthlyExpense.toLocaleString('en-IN', { maximumFractionDigits: 0 })}/mo
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* 20/4/10 Rule Check - Only show after car price is filled */}
        {carData.carPrice > 0 && (
          <motion.div 
            className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
          >
            <h4 className="text-white font-semibold mb-4">20/4/10 Rule Check</h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">20% Down Payment</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-white">{downPaymentPercentage.toFixed(1)}%</span>
                  {isDownPaymentOk ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Max 4 Year Tenure</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-white">{carData.tenure}y</span>
                  {isTenureOk ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                </div>
              </div>
              
              {/* Income check - only if monthly income provided */}
              {hasMonthlyIncome && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Max 10% of Income</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-white">{expensePercentage.toFixed(1)}%</span>
                    {isExpenseOk ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Overall affordability - only if all data available */}
            {hasMonthlyIncome && (
              <div className={`mt-4 p-3 rounded-lg ${isAffordable ? 'bg-green-900/30 border border-green-700/50' : 'bg-red-900/30 border border-red-700/50'}`}>
                <p className={`text-sm font-semibold ${isAffordable ? 'text-green-400' : 'text-red-400'}`}>
                  {isAffordable ? '✅ Car is Affordable!' : '⚠️ Car may be too expensive'}
                </p>
                {!isAffordable && (
                  <p className="text-red-300 text-xs mt-1">
                    Consider adjusting your budget or loan terms
                  </p>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Detailed Breakdown */}
        <motion.div 
          className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.0 }}
        >
          <h4 className="text-white font-semibold mb-3">Loan Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Interest Rate:</span>
              <span className="text-white">{carData.interestRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Tenure:</span>
              <span className="text-white">{carData.tenure} years</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Interest:</span>
              <span className="text-white">₹{totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}