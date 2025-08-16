'use client'

import { motion } from 'framer-motion'
import { CarData } from '@/app/page'
import { 
  ArrowLeft, 
  RotateCcw, 
  TrendingUp, 
  Calendar, 
  PieChart,
  Download,
  Share2,
  CheckCircle,
  XCircle,
  Sparkles,
  Target,
  Award
} from 'lucide-react'

interface ResultsDisplayV2Props {
  carData: CarData
  onBack: () => void
  onRestart: () => void
}

export default function ResultsDisplayV2({ carData, onBack, onRestart }: ResultsDisplayV2Props) {
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
  const totalPayment = emi * carData.tenure * 12
  
  // Monthly running cost calculation (assuming 15 km/liter average)
  const fuelEfficiency = 15
  const monthlyFuelCost = carData.kmPerMonth > 0 && carData.fuelCostPerLiter > 0 
    ? (carData.kmPerMonth / fuelEfficiency) * carData.fuelCostPerLiter 
    : 0
  
  // Total monthly cost
  const totalMonthlyCost = emi + monthlyFuelCost
  
  // Affordability checks
  const downPaymentPercentage = (carData.downPayment / carData.carPrice) * 100
  const isDownPaymentOk = downPaymentPercentage >= 20
  const isTenureOk = carData.tenure <= 4
  const isAffordable = isDownPaymentOk && isTenureOk

  // Calculate completion date
  const currentDate = new Date()
  const completionDate = new Date(currentDate.getFullYear() + carData.tenure, currentDate.getMonth(), currentDate.getDate())
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', { 
      month: 'short', 
      year: 'numeric' 
    })
  }

  // Create payment breakdown data for visualization
  const paymentBreakdown = [
    { label: 'Principal', value: loanAmount, color: 'from-blue-400 to-cyan-400', percentage: (loanAmount / totalPayment) * 100 },
    { label: 'Interest', value: totalInterest, color: 'from-red-400 to-pink-400', percentage: (totalInterest / totalPayment) * 100 }
  ]

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Success Animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-3 mb-6">
            {isAffordable ? (
              <>
                <Award className="w-6 h-6 text-green-300" />
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                  🎉 Your EMI Plan is Ready!
                </h1>
                <Sparkles className="w-6 h-6 text-yellow-300" />
              </>
            ) : (
              <>
                <Target className="w-6 h-6 text-yellow-300" />
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                  Your EMI Plan
                </h1>
                <PieChart className="w-6 h-6 text-blue-300" />
              </>
            )}
          </div>
          
          {/* Overall Affordability Status */}
          <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${
            isAffordable 
              ? 'bg-green-500/20 border border-green-400/30 text-green-300' 
              : 'bg-yellow-500/20 border border-yellow-400/30 text-yellow-300'
          }`}>
            {isAffordable ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Financially Smart Choice!</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5" />
                <span className="font-semibold">Consider Optimizing Your Plan</span>
              </>
            )}
          </div>
        </motion.div>

        {/* Main Results Dashboard */}
        <div className="grid lg:grid-cols-4 gap-6">
          
          {/* EMI Hero Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 backdrop-blur-md border border-emerald-400/30 rounded-3xl p-8 shadow-2xl"
          >
            <div className="text-center">
              {/* Enhanced Loan Details Section */}
              <div className="mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-center mb-6"
                >
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-center space-x-2">
                    <Sparkles className="w-5 h-5 text-cyan-300" />
                    <span>Loan Details</span>
                    <Sparkles className="w-5 h-5 text-cyan-300" />
                  </h3>
                </motion.div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* Completion Date Card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-2xl p-4 border border-purple-400/40 shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-4 h-4 text-purple-300" />
                      <p className="text-xs font-medium text-purple-200">Completion Date</p>
                    </div>
                    <p className="text-lg font-bold text-white">{formatDate(completionDate)}</p>
                  </motion.div>

                  {/* Loan Period Card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-2xl p-4 border border-blue-400/40 shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-blue-300 text-sm">⏱️</span>
                      <p className="text-xs font-medium text-blue-200">Loan Period</p>
                    </div>
                    <p className="text-lg font-bold text-white">{carData.tenure} Years</p>
                  </motion.div>

                  {/* Loan Amount Card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-emerald-500/30 to-green-500/30 rounded-2xl p-4 border border-emerald-400/40 shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-emerald-300" />
                      <p className="text-xs font-medium text-emerald-200">Loan Amount</p>
                    </div>
                    <p className="text-lg font-bold text-white">₹{loanAmount.toLocaleString('en-IN')}</p>
                  </motion.div>

                  {/* Down Payment Card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-orange-500/30 to-red-500/30 rounded-2xl p-4 border border-orange-400/40 shadow-lg hover:shadow-orange-500/25 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-orange-300 font-bold text-sm">💰</span>
                      <p className="text-xs font-medium text-orange-200">Down Payment</p>
                    </div>
                    <p className="text-lg font-bold text-white">₹{carData.downPayment.toLocaleString('en-IN')}</p>
                  </motion.div>
                </div>

                {/* Interest Rate Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="inline-flex items-center justify-center bg-gradient-to-r from-yellow-500/30 to-amber-500/30 border border-yellow-400/40 rounded-full px-4 py-2 mx-auto"
                >
                  <span className="text-yellow-300 text-sm mr-2">📊</span>
                  <span className="text-yellow-200 text-sm font-medium">Interest Rate:</span>
                  <span className="text-white font-bold ml-2">{carData.interestRate}%</span>
                </motion.div>
              </div>

              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">₹</span>
                </div>
                <h3 className="text-xl font-bold text-white">Monthly EMI</h3>
              </div>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="mb-4"
              >
                <p className="text-5xl sm:text-6xl font-bold text-white mb-2">
                  ₹{emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </p>
                <p className="text-emerald-300 text-lg">per month for {carData.tenure} years</p>
              </motion.div>

              {monthlyFuelCost > 0 && (
                <div className="bg-white/10 rounded-2xl p-4 mt-4">
                  <p className="text-white/70 text-sm">Total Monthly Cost (with fuel)</p>
                  <p className="text-2xl font-bold text-yellow-300">
                    ₹{totalMonthlyCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick Stats Cards - Reduced spacing */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-xl"
            >
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <h4 className="font-semibold text-white text-sm">Total Interest</h4>
              </div>
              <p className="text-xl font-bold text-blue-300">
                ₹{totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-xl"
            >
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                <h4 className="font-semibold text-white text-sm">Total Payment</h4>
              </div>
              <p className="text-xl font-bold text-purple-300">
                ₹{totalPayment.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-green-600/30 to-green-500/20 backdrop-blur-md border-2 border-green-400/40 rounded-2xl p-5 shadow-xl"
            >
              <div className="flex items-center space-x-2 mb-2">
                <PieChart className="w-5 h-5 text-green-200" />
                <h4 className="font-semibold text-green-100 text-sm">Loan Amount</h4>
              </div>
              <p className="text-xl font-bold text-green-100">
                ₹{loanAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-xl"
            >
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-orange-400 font-bold text-xl">₹</span>
                <h4 className="font-semibold text-white text-sm">Down Payment</h4>
              </div>
              <p className="text-xl font-bold text-orange-300">
                ₹{carData.downPayment.toLocaleString('en-IN')}
              </p>
              <p className="text-orange-300/70 text-xs">
                {downPaymentPercentage.toFixed(1)}% of car price
              </p>
            </motion.div>
          </div>
        </div>

        {/* Payment Breakdown Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl"
        >
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
            <PieChart className="w-6 h-6 text-blue-400" />
            <span>Payment Breakdown</span>
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Visual Breakdown */}
            <div className="space-y-4">
              {paymentBreakdown.map((item, index) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">{item.label}</span>
                    <span className="text-white/70">
                      ₹{item.value.toLocaleString('en-IN', { maximumFractionDigits: 0 })} ({item.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-4 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ delay: 0.8 + index * 0.2, duration: 1 }}
                      className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Smart Finance Check */}
            <div className="bg-white/10 rounded-2xl p-6">
              <h4 className="text-white font-semibold mb-4 flex items-center space-x-2">
                <Target className="w-5 h-5 text-yellow-400" />
                <span>Smart Finance Check</span>
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">20% Down Payment</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white text-sm">{downPaymentPercentage.toFixed(1)}%</span>
                    {isDownPaymentOk ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Max 4 Year Tenure</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white text-sm">{carData.tenure}y</span>
                    {isTenureOk ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              {!isAffordable && (
                <div className="mt-4 p-4 bg-yellow-500/20 border border-yellow-400/30 rounded-xl">
                  <p className="text-yellow-300 text-sm font-semibold mb-2">💡 Recommendations:</p>
                  <ul className="text-yellow-300/80 text-xs space-y-1">
                    {!isDownPaymentOk && <li>• Increase down payment to 20% or more</li>}
                    {!isTenureOk && <li>• Reduce loan tenure to 4 years or less</li>}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6"
        >
          <button
            onClick={onBack}
            className="flex items-center justify-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-2xl font-semibold transition-all backdrop-blur-md border border-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Modify Plan</span>
          </button>

          <button
            onClick={onRestart}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all shadow-lg shadow-purple-500/25"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Start Over</span>
          </button>

          <button
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all shadow-lg shadow-emerald-500/25"
          >
            <Download className="w-5 h-5" />
            <span>Download Report</span>
          </button>

          <button
            className="flex items-center justify-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-2xl font-semibold transition-all backdrop-blur-md border border-white/20"
          >
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </button>
        </motion.div>

        {/* Monetization Section - Native Ad Spaces */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mt-12 grid md:grid-cols-2 gap-6"
        >
          {/* Car Insurance Ad Space */}
          <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-md border border-blue-400/30 rounded-2xl p-6">
            <h4 className="text-white font-semibold mb-3">🛡️ Protect Your Investment</h4>
            <p className="text-white/70 text-sm mb-4">
              Get comprehensive car insurance starting from ₹2,500/year
            </p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all">
              Get Quote
            </button>
          </div>

          {/* Car Loan Offers Ad Space */}
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-md border border-green-400/30 rounded-2xl p-6">
            <h4 className="text-white font-semibold mb-3">💰 Better Loan Rates Available</h4>
            <p className="text-white/70 text-sm mb-4">
              Compare rates from top banks. Save up to ₹50,000 in interest
            </p>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all">
              Compare Now
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}