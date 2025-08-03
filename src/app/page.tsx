'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Car, CreditCard, PiggyBank, HelpCircle, ChevronDown } from 'lucide-react'
// Import Version 2 components
import CarDetailsFormV2 from '@/components/v2/CarDetailsFormV2'
import FinancialFormV2 from '@/components/v2/FinancialFormV2'
import ResultsDisplayV2 from '@/components/v2/ResultsDisplayV2'
import TotalCostDisplayV2 from '@/components/v2/TotalCostDisplayV2'

export interface CarData {
  carPrice: number
  downPayment: number
  interestRate: number
  tenure: number
  processingFee: number
  kmPerMonth: number
  fuelCostPerLiter: number
  monthlyIncome: number
  insuranceAndMaintenance?: number
  monthlySavings?: number
  includeFuelInAffordability?: boolean
}


export default function HomePage() {
  const [step, setStep] = useState(1) // Start directly at step 1
  const [selectedVersion, setSelectedVersion] = useState('v2') // Version selector
  const [carData, setCarData] = useState<CarData>({
    carPrice: 0,
    downPayment: 0,
    interestRate: 8,
    tenure: 0,
    processingFee: 0,
    kmPerMonth: 0,
    fuelCostPerLiter: 0,
    monthlyIncome: 0,
    includeFuelInAffordability: false
  })

  const versions = [
    { id: 'v2', name: 'Version 2 - Modern Cards', description: 'Card-based design with glassmorphism' }
  ]

  const emiSteps = [
    { title: 'Car & Loan Details', component: CarDetailsFormV2 },
    { title: 'Loan Terms', component: FinancialFormV2 },
    { title: 'Your EMI Plan', component: ResultsDisplayV2 }
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
      tenure: 0,
      processingFee: 0,
      kmPerMonth: 0,
      fuelCostPerLiter: 0,
      monthlyIncome: 0,
      includeFuelInAffordability: false
    })
  }

  const [showHelp, setShowHelp] = useState(false)

  // Reset state when switching versions
  const handleVersionChange = (versionId: string) => {
    setSelectedVersion(versionId)
    setStep(1)
    setCarData({
      carPrice: 0,
      downPayment: 0,
      interestRate: 8,
      tenure: 0,
      processingFee: 0,
      kmPerMonth: 0,
      fuelCostPerLiter: 0,
      monthlyIncome: 0,
      includeFuelInAffordability: false
    })
  }

  // Render Version 2 - CRED-inspired fluid design
  return (
      <div className="min-h-screen bg-black font-sans relative" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        {/* Header Navigation */}
        <header className="bg-black/95 backdrop-blur-md border-b border-white/10">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/20">
                  <img 
                    src="/budgetgear_tranparent.png" 
                    alt="BudgetGear Logo" 
                    className="w-5 h-5 object-contain opacity-90"
                  />
                </div>
                <span className="text-lg font-bold text-white opacity-95">BudgetGear</span>
              </div>

              {/* Navigation Links */}
              <nav className="hidden md:flex items-center space-x-8">
                <a href="#" className="text-white/90 hover:text-white transition-colors text-sm font-medium">
                  Car Affordability Calculator
                </a>
              </nav>

              {/* Version Selector */}
              <div className="relative">
                <select
                  value={selectedVersion}
                  onChange={(e) => handleVersionChange(e.target.value)}
                  className="appearance-none bg-white/5 backdrop-blur-md border border-white/10 rounded-lg px-4 py-2 text-white/80 text-sm cursor-pointer hover:bg-white/10 transition-all"
                >
                  {versions.map((version) => (
                    <option key={version.id} value={version.id} className="bg-black text-white">
                      {version.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-white/50 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </header>

        {/* Immersive Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-black to-gray-900/30 pointer-events-none"></div>
        
        {/* Hero Section with 20/4/10 Rule */}
        <div className="relative pt-12 pb-8">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto text-center">
              {/* Main Heading */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-8"
              >
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
                  <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    Car Finance Calculator
                  </span>
                </h1>
                <p className="text-lg text-white/70 max-w-2xl mx-auto">
                  Buy Smart: 20% Down Payment, 4-Year or less Loan, and Monthly Car Costs Under 10% of Your Monthly Income
                </p>
              </motion.div>

            </div>
          </div>
        </div>

        {/* Main Content Section - Fluid Layout */}
        <div className="relative">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto">
              
              {/* Mobile Navigation Pills */}
              <div className="lg:hidden mb-8">
                <div className="flex justify-center">
                  <div className="inline-flex bg-white/5 backdrop-blur-md rounded-full border border-white/10 p-1">
                    <button
                      className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${step === 1 ? 'bg-white/20 text-white shadow-lg' : 'text-white/60 hover:text-white/80'}`}
                      onClick={() => setStep(1)}
                    >
                      Car Details
                    </button>
                    <button
                      className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${step === 2 ? 'bg-white/20 text-white shadow-lg' : 'text-white/60 hover:text-white/80'} disabled:opacity-30`}
                      onClick={() => setStep(2)}
                      disabled={!carData.carPrice || carData.carPrice <= 0}
                    >
                      Financial Details
                    </button>
                  </div>
                </div>
              </div>

              {/* Content Grid - Fluid and Responsive */}
              <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
                
                {/* Main Form Section */}
                <div className="lg:col-span-3">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 lg:p-10 shadow-2xl"
                    >
                      {/* Desktop View - Show all forms stacked */}
                      <div className="hidden lg:block space-y-12">
                        <CarDetailsFormV2 
                          carData={carData} 
                          updateCarData={updateCarData}
                          onNext={nextStep}
                          step={step}
                          totalSteps={3}
                          standalone={false}
                        />
                        <div className="border-t border-white/10 pt-12">
                          <FinancialFormV2 
                            carData={carData} 
                            updateCarData={updateCarData}
                            onNext={nextStep}
                            onBack={prevStep}
                            standalone={false}
                          />
                        </div>
                      </div>
                      
                      {/* Mobile View - Show one form at a time */}
                      <div className="lg:hidden">
                        {step === 1 && (
                          <CarDetailsFormV2 
                            carData={carData} 
                            updateCarData={updateCarData}
                            onNext={nextStep}
                            step={step}
                            totalSteps={3}
                            standalone={true}
                          />
                        )}
                        {step === 2 && (
                          <FinancialFormV2 
                            carData={carData} 
                            updateCarData={updateCarData}
                            onNext={nextStep}
                            onBack={prevStep}
                            standalone={true}
                          />
                        )}
                      </div>
                      
                      {/* Results View */}
                      {step === 3 && (
                        <ResultsDisplayV2 
                          carData={carData}
                          onBack={prevStep}
                          onRestart={restart}
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Live Preview Panel - Sticky on Desktop */}
                {step !== 3 && (
                  <div className="lg:col-span-2">
                    <div className="lg:sticky lg:top-8">
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 lg:p-8 shadow-2xl"
                      >
                        <TotalCostDisplayV2 carData={carData} updateCarData={updateCarData} />
                      </motion.div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Spacing */}
        <div className="h-20 lg:h-32"></div>
      </div>
    )
}