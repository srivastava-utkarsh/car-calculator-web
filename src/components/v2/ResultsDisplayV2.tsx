'use client'

import { motion } from 'framer-motion'
import { CarData } from '@/types/CarData'
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
import { validateCarData, checkAffordabilityRules } from '@/utils/safeCalculations'

interface ResultsDisplayV2Props {
  carData: CarData
  onBack: () => void
  onRestart: () => void
}

export default function ResultsDisplayV2({ carData, onBack, onRestart }: ResultsDisplayV2Props) {
  // Use safe validation and calculations
  const validatedData = validateCarData(carData)
  const affordabilityResults = checkAffordabilityRules(validatedData)
  
  // Calculate values using safe functions
  const loanAmount = affordabilityResults.loanAmount
  const emi = affordabilityResults.emi
  const totalInterest = Math.max(0, (emi * validatedData.tenure * 12) - loanAmount)
  const totalPayment = emi * validatedData.tenure * 12
  
  // Monthly running cost calculation (assuming 15 km/liter average)
  const fuelEfficiency = 15
  const monthlyFuelCost = validatedData.kmPerMonth > 0 && validatedData.fuelCostPerLiter > 0 
    ? (validatedData.kmPerMonth / fuelEfficiency) * validatedData.fuelCostPerLiter 
    : 0
  
  // Total monthly cost using safe calculations
  const totalMonthlyCost = affordabilityResults.totalMonthlyCost
  
  // Affordability checks with exact boundary handling
  const downPaymentPercentage = affordabilityResults.downPaymentPercentage
  const isDownPaymentOk = affordabilityResults.downPaymentOk
  const isTenureOk = affordabilityResults.tenureOk
  const isAffordable = affordabilityResults.isAffordable

  // Calculate completion date using validated data
  const currentDate = new Date()
  const completionDate = new Date(currentDate.getFullYear() + validatedData.tenure, currentDate.getMonth(), currentDate.getDate())
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
              {/* Ultra-Enhanced Loan Details Section */}
              <div className="mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-center mb-6 relative"
                >
                  {/* Animated background orbs */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="w-32 h-32 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl"
                    />
                  </div>
                  
                  <motion.h3 
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      delay: 0.4,
                      type: "spring",
                      stiffness: 200,
                      damping: 10
                    }}
                    className="text-2xl font-bold text-white mb-2 flex items-center justify-center space-x-3 relative z-10"
                  >
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ 
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      <Sparkles className="w-6 h-6 text-cyan-300" />
                    </motion.div>
                    
                    <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                      Your Loan Journey
                    </span>
                    
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, -10, 10, 0]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <span className="text-2xl">🚗</span>
                    </motion.div>
                  </motion.h3>
                  
                  {/* Floating particles */}
                  <motion.div
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-0 left-1/4 w-2 h-2 bg-cyan-400/60 rounded-full blur-sm"
                  />
                  <motion.div
                    animate={{ y: [10, -10, 10] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute top-2 right-1/4 w-1 h-1 bg-blue-400/60 rounded-full blur-sm"
                  />
                  <motion.div
                    animate={{ y: [-5, 15, -5] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute top-4 left-3/4 w-1.5 h-1.5 bg-purple-400/60 rounded-full blur-sm"
                  />
                </motion.div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* Completion Date Card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                    whileHover={{ 
                      scale: 1.05, 
                      rotateY: 5,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="relative bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-2xl p-4 border border-purple-400/40 shadow-lg hover:shadow-purple-500/25 transition-all duration-300 overflow-hidden cursor-pointer group"
                    style={{
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                    }}
                  >
                    {/* Animated background gradient */}
                    <motion.div
                      animate={{
                        background: [
                          "linear-gradient(45deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)",
                          "linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)",
                          "linear-gradient(45deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)"
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute inset-0 rounded-2xl"
                    />
                    
                    {/* Floating icon animation */}
                    <div className="flex items-center space-x-2 mb-2 relative z-10">
                      <motion.div
                        animate={{ 
                          y: [0, -3, 0],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ 
                          duration: 2.5, 
                          repeat: Infinity, 
                          ease: "easeInOut" 
                        }}
                        className="p-1 rounded-lg bg-purple-400/20 group-hover:bg-purple-400/30 transition-colors duration-300"
                      >
                        <Calendar className="w-4 h-4 text-purple-300" />
                      </motion.div>
                      <p className="text-xs font-medium text-purple-200 group-hover:text-purple-100 transition-colors duration-300">Completion Date</p>
                    </div>
                    
                    <motion.p 
                      className="text-lg font-bold text-white relative z-10"
                      whileHover={{ scale: 1.02 }}
                    >
                      {formatDate(completionDate)}
                    </motion.p>
                    
                    {/* Shimmer effect on hover */}
                    <motion.div
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                      className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12 group-hover:block hidden"
                    />
                  </motion.div>

                  {/* Loan Period Card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
                    whileHover={{ 
                      scale: 1.05, 
                      rotateY: -5,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="relative bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-2xl p-4 border border-blue-400/40 shadow-lg hover:shadow-blue-500/25 transition-all duration-300 overflow-hidden cursor-pointer group"
                    style={{
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                    }}
                  >
                    {/* Pulsing background */}
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.1, 0.2, 0.1]
                      }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-2xl"
                    />
                    
                    <div className="flex items-center space-x-2 mb-2 relative z-10">
                      <motion.span 
                        animate={{ 
                          scale: [1, 1.2, 1],
                          rotate: [0, 10, -10, 0]
                        }}
                        transition={{ 
                          duration: 3, 
                          repeat: Infinity, 
                          ease: "easeInOut" 
                        }}
                        className="text-blue-300 text-sm bg-blue-400/20 p-1 rounded-lg group-hover:bg-blue-400/30 transition-colors duration-300"
                      >
                        ⏱️
                      </motion.span>
                      <p className="text-xs font-medium text-blue-200 group-hover:text-blue-100 transition-colors duration-300">Loan Period</p>
                    </div>
                    <motion.p 
                      className="text-lg font-bold text-white relative z-10"
                      whileHover={{ scale: 1.02 }}
                    >
                      {carData.tenure} Years
                    </motion.p>
                    
                    {/* Progress indicator */}
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(carData.tenure / 7) * 100}%` }}
                      transition={{ delay: 0.8, duration: 1 }}
                      className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
                    />
                  </motion.div>

                  {/* Loan Amount Card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, rotateX: -15 }}
                    animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                    transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
                    whileHover={{ 
                      scale: 1.05, 
                      rotateX: 5,
                      y: -2,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="relative bg-gradient-to-br from-emerald-500/30 to-green-500/30 rounded-2xl p-4 border border-emerald-400/40 shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 overflow-hidden cursor-pointer group"
                    style={{
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                    }}
                  >
                    {/* Money flow animation */}
                    <motion.div
                      animate={{ 
                        x: [-100, 100],
                        opacity: [0, 1, 0]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        ease: "easeInOut",
                        repeatDelay: 2
                      }}
                      className="absolute top-1/2 w-2 h-2 bg-emerald-300/70 rounded-full blur-sm"
                    />
                    
                    <div className="flex items-center space-x-2 mb-2 relative z-10">
                      <motion.div
                        animate={{ 
                          y: [0, -2, 0],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity, 
                          ease: "easeInOut" 
                        }}
                        className="p-1 rounded-lg bg-emerald-400/20 group-hover:bg-emerald-400/30 transition-colors duration-300"
                      >
                        <TrendingUp className="w-4 h-4 text-emerald-300" />
                      </motion.div>
                      <p className="text-xs font-medium text-emerald-200 group-hover:text-emerald-100 transition-colors duration-300">Loan Amount</p>
                    </div>
                    <motion.p 
                      className="text-lg font-bold text-white relative z-10"
                      whileHover={{ scale: 1.02 }}
                    >
                      ₹{loanAmount.toLocaleString('en-IN')}
                    </motion.p>
                  </motion.div>

                  {/* Down Payment Card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, rotateZ: -10 }}
                    animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
                    whileHover={{ 
                      scale: 1.05, 
                      rotateZ: 2,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="relative bg-gradient-to-br from-orange-500/30 to-red-500/30 rounded-2xl p-4 border border-orange-400/40 shadow-lg hover:shadow-orange-500/25 transition-all duration-300 overflow-hidden cursor-pointer group"
                    style={{
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                    }}
                  >
                    {/* Coin drop animation */}
                    <motion.div
                      animate={{ 
                        y: [-20, 20, -20],
                        rotate: [0, 180, 360]
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                      className="absolute top-2 right-2 w-3 h-3 bg-yellow-400/60 rounded-full"
                    />
                    
                    <div className="flex items-center space-x-2 mb-2 relative z-10">
                      <motion.span 
                        animate={{ 
                          scale: [1, 1.3, 1],
                          rotate: [0, 20, -20, 0]
                        }}
                        transition={{ 
                          duration: 2.5, 
                          repeat: Infinity, 
                          ease: "easeInOut" 
                        }}
                        className="text-orange-300 font-bold text-sm bg-orange-400/20 p-1 rounded-lg group-hover:bg-orange-400/30 transition-colors duration-300"
                      >
                        💰
                      </motion.span>
                      <p className="text-xs font-medium text-orange-200 group-hover:text-orange-100 transition-colors duration-300">Down Payment</p>
                    </div>
                    <motion.p 
                      className="text-lg font-bold text-white relative z-10"
                      whileHover={{ scale: 1.02 }}
                    >
                      ₹{carData.downPayment.toLocaleString('en-IN')}
                    </motion.p>
                    
                    {/* Percentage badge */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1 }}
                      className="absolute top-1 right-1 bg-orange-500/30 text-orange-200 text-xs px-2 py-1 rounded-full border border-orange-400/40"
                    >
                      {((carData.downPayment / carData.carPrice) * 100).toFixed(0)}%
                    </motion.div>
                  </motion.div>
                </div>

                {/* Total Interest Amount Card - Enhanced */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.85, type: "spring", stiffness: 150 }}
                  whileHover={{ 
                    scale: 1.03, 
                    y: -3,
                    boxShadow: "0 20px 40px rgba(251, 191, 36, 0.4)",
                    transition: { duration: 0.3 }
                  }}
                  whileTap={{ scale: 0.97 }}
                  className="relative bg-gradient-to-br from-yellow-500/30 to-amber-500/30 rounded-3xl p-6 border-2 border-yellow-400/40 shadow-lg hover:shadow-yellow-500/25 transition-all duration-300 mb-4 max-w-sm mx-auto overflow-hidden cursor-pointer group"
                  style={{
                    backdropFilter: 'blur(25px)',
                    WebkitBackdropFilter: 'blur(25px)',
                  }}
                >
                  {/* Animated money particles */}
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        x: [Math.random() * 200 - 100, Math.random() * 200 - 100],
                        y: [Math.random() * 100 - 50, Math.random() * 100 - 50],
                        opacity: [0, 0.6, 0],
                        scale: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 4 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                        ease: "easeInOut"
                      }}
                      className="absolute w-1 h-1 bg-yellow-300/60 rounded-full blur-sm"
                    />
                  ))}
                  
                  <div className="flex items-center space-x-3 mb-3 justify-center relative z-10">
                    <motion.div
                      animate={{ 
                        rotate: [0, 15, -15, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                      className="bg-yellow-400/30 p-2 rounded-full group-hover:bg-yellow-400/40 transition-colors duration-300"
                    >
                      <span className="text-yellow-200 text-lg">💰</span>
                    </motion.div>
                    <p className="text-sm font-bold text-yellow-100 tracking-wide">Total Interest</p>
                  </div>
                  
                  {/* Animated number counter effect */}
                  <motion.p 
                    className="text-2xl font-black text-white text-center relative z-10 mb-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.span
                      animate={{ 
                        textShadow: [
                          "0 0 10px rgba(251, 191, 36, 0.5)",
                          "0 0 20px rgba(251, 191, 36, 0.8)",
                          "0 0 10px rgba(251, 191, 36, 0.5)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      ₹{totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </motion.span>
                  </motion.p>
                  
                  <motion.p 
                    className="text-yellow-200/80 text-xs text-center relative z-10"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    over {carData.tenure} years
                  </motion.p>
                  
                  {/* Glowing border effect */}
                  <motion.div
                    animate={{
                      opacity: [0.5, 1, 0.5],
                      scale: [0.98, 1.02, 0.98]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-3xl border-2 border-yellow-300/40 pointer-events-none"
                  />
                </motion.div>

                {/* Interest Rate Badge - Ultra Enhanced */}
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
                  whileHover={{ 
                    scale: 1.05,
                    rotate: [0, -1, 1, 0],
                    transition: { duration: 0.3 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center bg-gradient-to-r from-yellow-500/30 to-amber-500/30 border-2 border-yellow-400/50 rounded-full px-6 py-3 mx-auto relative overflow-hidden cursor-pointer group"
                  style={{
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                  }}
                >
                  {/* Animated background pulse */}
                  <motion.div
                    animate={{
                      scale: [0.5, 2, 0.5],
                      opacity: [0, 0.3, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-amber-400/30 rounded-full"
                  />
                  
                  <motion.span 
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="text-yellow-300 text-base mr-3 relative z-10"
                  >
                    📊
                  </motion.span>
                  
                  <span className="text-yellow-200 text-sm font-semibold mr-2 relative z-10 group-hover:text-yellow-100 transition-colors duration-300">
                    Interest Rate:
                  </span>
                  
                  <motion.span 
                    className="text-white font-black text-lg relative z-10"
                    animate={{ 
                      textShadow: [
                        "0 0 5px rgba(255, 255, 255, 0.5)",
                        "0 0 15px rgba(255, 255, 255, 0.8)",
                        "0 0 5px rgba(255, 255, 255, 0.5)"
                      ]
                    }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    {carData.interestRate}%
                  </motion.span>
                  
                  {/* Sparkle effects */}
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                      scale: [0, 1, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                    className="absolute top-1 right-2 w-1 h-1 bg-yellow-200 rounded-full"
                  />
                  
                  <motion.div
                    animate={{
                      rotate: [0, -360],
                      scale: [0, 1, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                    className="absolute bottom-1 left-2 w-1 h-1 bg-yellow-200 rounded-full"
                  />
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