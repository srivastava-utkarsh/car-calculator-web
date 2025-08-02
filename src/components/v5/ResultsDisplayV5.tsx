'use client'

import { useState } from 'react'
import { CheckCircle, ArrowLeft, RotateCcw, Download, Share2, TrendingUp, XCircle, DollarSign, Calendar, Car, Fuel, ChevronDown, ChevronUp, PiggyBank, Target } from 'lucide-react'
import { CarData } from '@/app/page'

interface ResultsDisplayV5Props {
  carData: CarData
  onBack: () => void
  onRestart: () => void
}

export default function ResultsDisplayV5({
  carData,
  onBack,
  onRestart
}: ResultsDisplayV5Props) {
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
    <div className="space-y-8">
      {/* Success Header */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 mx-auto bg-green-500 rounded-full flex items-center justify-center animate-pulse">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Your Car Finance Plan</h2>
        <p className="text-gray-600">Here's your complete financial breakdown</p>
      </div>

      {/* Main Results Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* EMI Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="space-y-2">
            <p className="text-blue-100 text-sm font-medium">Monthly EMI</p>
            <p className="text-4xl font-bold">₹{emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
            <p className="text-blue-100 text-sm">for {carData.tenure * 12} months</p>
          </div>
        </div>

        {/* Total Amount Card */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="space-y-2">
            <p className="text-purple-100 text-sm font-medium">Total Amount Payable</p>
            <p className="text-4xl font-bold">₹{(totalPayment + carData.downPayment).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
            <p className="text-purple-100 text-sm">including down payment</p>
          </div>
        </div>

        {/* Interest Card */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
          <div className="space-y-2">
            <p className="text-orange-100 text-sm font-medium">Total Interest</p>
            <p className="text-4xl font-bold">₹{totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
            <p className="text-orange-100 text-sm">over loan tenure</p>
          </div>
        </div>

        {/* Affordability Card */}
        <div className={`bg-gradient-to-br rounded-2xl p-6 text-white ${
          isAffordable && hasMonthlyIncome 
            ? 'from-green-500 to-green-600' 
            : hasMonthlyIncome 
              ? 'from-red-500 to-red-600' 
              : 'from-gray-500 to-gray-600'
        }`}>
          <div className="space-y-2">
            <p className={`text-sm font-medium ${
              isAffordable && hasMonthlyIncome 
                ? 'text-green-100' 
                : hasMonthlyIncome 
                  ? 'text-red-100' 
                  : 'text-gray-100'
            }`}>
              {hasMonthlyIncome ? 'Affordability Status' : 'Income Data'}
            </p>
            <p className="text-4xl font-bold">
              {hasMonthlyIncome 
                ? (isAffordable ? '✓' : '⚠') 
                : '?'
              }
            </p>
            <p className={`text-sm ${
              isAffordable && hasMonthlyIncome 
                ? 'text-green-100' 
                : hasMonthlyIncome 
                  ? 'text-red-100' 
                  : 'text-gray-100'
            }`}>
              {hasMonthlyIncome 
                ? (isAffordable ? 'within budget' : 'review needed')
                : 'not provided'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Prepayment Optimization Section */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
        <button
          onClick={() => setShowOptimization(!showOptimization)}
          className="w-full p-6 text-left hover:bg-gray-100 transition-colors flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <PiggyBank className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Prepayment Optimization</h3>
              <p className="text-gray-600 text-sm">Make lump-sum prepayment to reduce interest (Optional)</p>
            </div>
          </div>
          {showOptimization ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>

        {showOptimization && (
          <div className="border-t border-gray-200 p-6 space-y-6">
          
            {/* Prepayment Amount */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Prepayment Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="number"
                  value={prepaymentAmount}
                  onChange={(e) => setPrepaymentAmount(Number(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    ₹{amount.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>

            {/* Optimization Type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Choose Impact
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setPrepaymentType('reduce-emi')}
                  className={`p-4 rounded-lg border transition-colors ${
                    prepaymentType === 'reduce-emi'
                      ? 'border-blue-500 bg-blue-50 text-gray-900'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <Target className="w-5 h-5 mb-2 text-blue-600" />
                  <p className="font-medium">Reduce EMI</p>
                  <p className="text-xs text-gray-500">Keep tenure same</p>
                </button>
                <button
                  onClick={() => setPrepaymentType('reduce-tenure')}
                  className={`p-4 rounded-lg border transition-colors ${
                    prepaymentType === 'reduce-tenure'
                      ? 'border-blue-500 bg-blue-50 text-gray-900'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <Calendar className="w-5 h-5 mb-2 text-blue-600" />
                  <p className="font-medium">Reduce Tenure</p>
                  <p className="text-xs text-gray-500">Keep EMI same</p>
                </button>
              </div>
            </div>

            {/* Optimization Results */}
            {prepaymentAmount > 0 && prepaymentAmount < loanAmount && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">After Prepayment of ₹{prepaymentAmount.toLocaleString('en-IN')}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">New EMI:</span>
                      <span className="font-semibold text-blue-600">
                        ₹{optimizedLoan.emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">New Tenure:</span>
                      <span className="font-semibold text-gray-900">
                        {optimizedLoan.tenure.toFixed(1)} years
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Interest Saved:</span>
                      <span className="font-semibold text-green-600">
                        ₹{optimizedLoan.savings.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">New Total Payment:</span>
                      <span className="font-semibold text-gray-900">
                        ₹{(optimizedLoan.totalPayment + prepaymentAmount).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detailed Breakdown */}
      <div className="bg-gray-50 rounded-2xl p-6 space-y-6">
        <div className="flex items-center space-x-3">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900">Detailed Breakdown</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Loan Details */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Loan Information</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Car Price</span>
                <span className="font-medium text-gray-900">₹{carData.carPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Down Payment</span>
                <span className="font-medium text-gray-900">₹{carData.downPayment.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Loan Amount</span>
                <span className="font-medium text-gray-900">₹{loanAmount.toLocaleString('en-IN')}</span>
              </div>
              {hasProcessingFee && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing Fee</span>
                  <span className="font-medium text-gray-900">₹{carData.processingFee.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Interest Rate</span>
                <span className="font-medium text-gray-900">{carData.interestRate}% p.a.</span>
              </div>
            </div>
          </div>

          {/* Monthly Costs */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Monthly Expenses</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">EMI Payment</span>
                <span className="font-medium text-gray-900">₹{emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </div>
              {hasFuelData && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fuel Cost ({carData.kmPerMonth} km)</span>
                    <span className="font-medium text-gray-900">₹{monthlyFuelCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Insurance (est.)</span>
                    <span className="font-medium text-gray-900">₹1,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Maintenance (est.)</span>
                    <span className="font-medium text-gray-900">₹1,000</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-900">Total Monthly Cost</span>
                      <span className="font-bold text-blue-600">₹{(totalMonthlyExpense + 2500).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 20/4/10 Rule Check */}
        {carData.carPrice > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h4 className="font-medium text-gray-900 mb-4">20/4/10 Rule Check</h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">20% Down Payment</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-900">{downPaymentPercentage.toFixed(1)}%</span>
                  {isDownPaymentOk ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Max 4 Year Tenure</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-900">{carData.tenure}y</span>
                  {isTenureOk ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>
              
              {/* Income check - only if monthly income provided */}
              {hasMonthlyIncome && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Max 10% of Income</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-900">{expensePercentage.toFixed(1)}%</span>
                    {isExpenseOk ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Overall affordability - only if all data available */}
            {hasMonthlyIncome && (
              <div className={`mt-4 p-3 rounded-lg ${isAffordable ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <p className={`text-sm font-semibold ${isAffordable ? 'text-green-700' : 'text-red-700'}`}>
                  {isAffordable ? '✅ Car is Affordable!' : '⚠️ Car may be too expensive'}
                </p>
                {!isAffordable && (
                  <p className="text-red-600 text-xs mt-1">
                    Consider adjusting your budget or loan terms
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        {/* Share and Download */}
        <div className="flex space-x-4">
          <button className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-[0.98]">
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </button>
          
          <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-[0.98]">
            <Download className="w-5 h-5" />
            <span>Download PDF</span>
          </button>
        </div>

        {/* Navigation */}
        <div className="flex space-x-4">
          <button
            onClick={onBack}
            className="flex-1 bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Modify Terms</span>
          </button>
          
          <button
            onClick={onRestart}
            className="flex-1 bg-green-600 text-white py-4 px-6 rounded-xl font-medium hover:bg-green-700 transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Start Over</span>
          </button>
        </div>
      </div>
    </div>
  )
}