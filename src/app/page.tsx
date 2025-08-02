'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Car, CreditCard, PiggyBank, HelpCircle } from 'lucide-react'
import CarDetailsForm from '@/components/CarDetailsForm'
import FinancialForm from '@/components/FinancialForm'
import ResultsDisplay from '@/components/ResultsDisplay'
import ResultsDisplayNew from '@/components/ResultsDisplayNew'
import TotalCostDisplay from '@/components/TotalCostDisplay'

export interface CarData {
  carPrice: number
  downPayment: number
  interestRate: number
  tenure: number
  processingFee: number
  kmPerMonth: number
  fuelCostPerLiter: number
  monthlyIncome: number
  monthlySavings?: number
}


export default function HomePage() {
  const [step, setStep] = useState(1) // Start directly at step 1
  const [carData, setCarData] = useState<CarData>({
    carPrice: 0,
    downPayment: 0,
    interestRate: 8,
    tenure: 4,
    processingFee: 0,
    kmPerMonth: 0,
    fuelCostPerLiter: 0,
    monthlyIncome: 0
  })

  const emiSteps = [
    { title: 'Car & Loan Details', component: CarDetailsForm },
    { title: 'Loan Terms', component: FinancialForm },
    { title: 'Your EMI Plan', component: ResultsDisplay }
  ]

  const updateCarData = (updates: Partial<CarData>) => {
    setCarData(prev => ({ ...prev, ...updates }))
  }

  const nextStep = () => setStep(prev => Math.min(prev + 1, emiSteps.length))
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1))

  const restart = () => {
    setStep(1)
    setCarData({
      carPrice: 0,
      downPayment: 0,
      interestRate: 8,
      tenure: 4,
      processingFee: 0,
      kmPerMonth: 0,
      fuelCostPerLiter: 0,
      monthlyIncome: 0
    })
  }

  // Landing Page Component
  const LandingPage = () => (
    <div className="text-center space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center">
          <Car className="w-16 h-16 text-white" />
        </div>
        
        <h1 className="text-5xl font-bold text-white">
          Find Your Perfect Car Plan
        </h1>
        
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Choose your preferred approach to car financing
        </p>
      </motion.div>

      {/* Path Selection Cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* EMI Purchase Option */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => handlePathSelection('emi')}
          className="relative cursor-pointer group"
        >
          <div className="bg-gradient-to-br from-emerald-600 to-cyan-600 p-8 rounded-2xl shadow-2xl transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-emerald-500/25">
            <div className="absolute top-4 right-4">
              <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-semibold">
                ⭐ Most Popular
              </span>
            </div>
            
            <CreditCard className="w-16 h-16 text-white mb-6" />
            
            <h3 className="text-2xl font-bold text-white mb-4">
              💳 EMI Purchase
            </h3>
            
            <p className="text-white/80 text-lg mb-6">
              Take a loan & pay monthly EMIs
            </p>
            
            <div className="text-left space-y-2 text-white/70">
              <p>• Get your car now</p>
              <p>• Manageable monthly payments</p>
              <p>• Build credit history</p>
            </div>
          </div>
        </motion.div>

        {/* Cash Purchase Option */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => handlePathSelection('cash')}
          className="cursor-pointer group"
        >
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-8 rounded-2xl shadow-2xl transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-purple-500/25">
            <PiggyBank className="w-16 h-16 text-white mb-6" />
            
            <h3 className="text-2xl font-bold text-white mb-4">
              💰 Cash Purchase
            </h3>
            
            <p className="text-white/80 text-lg mb-6">
              Save monthly & buy outright
            </p>
            
            <div className="text-left space-y-2 text-white/70">
              <p>• No interest costs</p>
              <p>• Full ownership from day 1</p>
              <p>• Better negotiation power</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Help Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="pt-8"
      >
        <button
          onClick={() => setShowHelp(true)}
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
        >
          <HelpCircle className="w-5 h-5" />
          <span>💡 Need help deciding?</span>
        </button>
      </motion.div>
    </div>
  )

  // Cash Flow Component (Placeholder)
  const CashFlow = () => (
    <div className="text-center space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="w-24 h-24 mx-auto bg-purple-600 rounded-full flex items-center justify-center">
          <PiggyBank className="w-12 h-12 text-white" />
        </div>
        
        <h2 className="text-3xl font-bold text-white">Cash Purchase Planner</h2>
        <p className="text-gray-400">Coming soon! This feature is under development.</p>
        
        <button
          onClick={restart}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          ← Back to Options
        </button>
      </motion.div>
    </div>
  )

  const [showHelp, setShowHelp] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
      <div className="flex flex-col lg:flex-row">
        {/* Main Content */}
        <div className={`w-full ${step === 3 ? "lg:w-full" : "lg:w-3/5"}`}>
          <main className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              {/* App Title */}
              <div className="text-center mb-8 lg:mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center items-center"
                >
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent text-center">
                    Calculate your CAR BUDGET
                  </h1>
                </motion.div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6 lg:mb-8">
                <div className="bg-gray-800 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-full transition-all duration-500"
                    style={{ width: `${(step / emiSteps.length) * 100}%` }}
                  />
                </div>
                <p className="text-center text-gray-400 mt-2 text-sm lg:text-base">Step {step} of {emiSteps.length}</p>
              </div>

              {/* Step Title */}
              <div className="text-center mb-6 lg:mb-8">
                <motion.h2 
                  key={step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xl sm:text-2xl font-bold text-white mb-2"
                >
                  {emiSteps[step - 1]?.title}
                </motion.h2>
              </div>

              {/* Step Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700/50 p-4 sm:p-6 lg:p-8"
                >
                  {step === 1 && (
                    <CarDetailsForm 
                      carData={carData} 
                      updateCarData={updateCarData}
                      onNext={nextStep}
                    />
                  )}
                  {step === 2 && (
                    <FinancialForm 
                      carData={carData} 
                      updateCarData={updateCarData}
                      onNext={nextStep}
                      onBack={prevStep}
                    />
                  )}
                  {step === 3 && (
                    <ResultsDisplayNew 
                      carData={carData}
                      onBack={prevStep}
                      onRestart={restart}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>

        {/* Results Panel - Show below form on mobile, sidebar on desktop */}
        {step !== 3 && (
          <motion.div 
            className={`w-full lg:w-2/5 ${step === 3 ? "lg:hidden" : ""} lg:h-screen bg-gray-800/30 backdrop-blur-md lg:border-l border-gray-700/50`}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.5 }}
          >
            <TotalCostDisplay carData={carData} />
          </motion.div>
        )}
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Which option is right for me?</h3>
            
            <div className="space-y-6 text-gray-300">
              <div>
                <h4 className="font-semibold text-emerald-400 mb-2">💳 Choose EMI if:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>You want to buy a car now</li>
                  <li>You prefer smaller monthly payments</li>
                  <li>You have steady monthly income</li>
                  <li>You want to build credit history</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-purple-400 mb-2">💰 Choose Cash if:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>You can wait to buy</li>
                  <li>You want to avoid interest costs</li>
                  <li>You prefer full ownership from day 1</li>
                  <li>You have disciplined saving habits</li>
                </ul>
              </div>
            </div>
            
            <button
              onClick={() => setShowHelp(false)}
              className="w-full mt-6 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white py-3 rounded-lg hover:from-emerald-700 hover:to-cyan-700 transition-all"
            >
              Got it!
            </button>
          </motion.div>
        </div>
      )}

    </div>
  )
}
