'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
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
  monthlyFuelExpense?: number
}


export default function HomePage() {
  const [showResults, setShowResults] = useState(false) // Toggle results view
  const [selectedVersion, setSelectedVersion] = useState('v2') // Version selector
  const monthlyIncomeInputRef = useRef<HTMLInputElement>(null)

  const [carData, setCarData] = useState<CarData>({
    carPrice: 0,
    downPayment: 0,
    interestRate: 8,
    tenure: 0,
    processingFee: 0,
    kmPerMonth: 0,
    fuelCostPerLiter: 0,
    monthlyIncome: 0,
    insuranceAndMaintenance: 0,
    includeFuelInAffordability: false,
    monthlyFuelExpense: 0
  })

  const versions = [
    { id: 'v2', name: 'Version 2 - Modern Cards', description: 'Card-based design with glassmorphism' }
  ]


  const updateCarData = (updates: Partial<CarData>) => {
    setCarData(prev => ({ ...prev, ...updates }))
  }

  const hideResultsView = () => setShowResults(false)

  const restart = () => {
    setShowResults(false)
    setCarData({
      carPrice: 0,
      downPayment: 0,
      interestRate: 8,
      tenure: 0,
      processingFee: 0,
      kmPerMonth: 0,
      fuelCostPerLiter: 0,
      monthlyIncome: 0,
      insuranceAndMaintenance: 0,
      includeFuelInAffordability: false,
      monthlyFuelExpense: 0
    })
  }


  // Reset state when switching versions
  const handleVersionChange = (versionId: string) => {
    setSelectedVersion(versionId)
    setShowResults(false)
    setCarData({
      carPrice: 0,
      downPayment: 0,
      interestRate: 8,
      tenure: 0,
      processingFee: 0,
      kmPerMonth: 0,
      fuelCostPerLiter: 0,
      monthlyIncome: 0,
      insuranceAndMaintenance: 0,
      includeFuelInAffordability: false,
      monthlyFuelExpense: 0
    })
  }


  // Render Version 2 - CRED-inspired fluid design
  return (
      <main className="min-h-screen bg-black font-sans relative" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        {/* Header Navigation */}
        <header className="bg-black border-b border-white/5">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Logo - Far Left Positioning */}
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 flex items-center justify-center">
                  <Image 
                    src="/bck-logo.svg" 
                    alt="BudgetGear Logo" 
                    className="w-16 h-16 object-contain"
                    width={64}
                    height={64}
                  />
                </div>
                <span className="text-2xl font-extrabold text-white tracking-tight">BudgetGear</span>
              </div>

              {/* Navigation Menu - Far Right */}
              <nav className="hidden md:flex items-center" role="navigation" aria-label="Main navigation">
                <a href="#calculator" className="text-white/90 hover:text-white font-semibold text-base tracking-wide transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-white/5">
                  Car Affordability Calculator
                </a>
              </nav>
            </div>
          </div>
        </header>

        {/* Immersive Background Gradient - exclude header */}
        <div className="absolute top-20 left-0 right-0 bottom-0 bg-gradient-to-br from-gray-900/50 via-black to-gray-900/30 pointer-events-none"></div>
        
        {/* Main Content Section - Fluid Layout */}
        <section className="relative z-10 pt-8" id="calculator" aria-labelledby="calculator-heading">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 id="calculator-heading" className="sr-only">Car Finance Calculator Tool</h2>
              

              {/* Content Grid - More compact layout */}
              <div className="grid lg:grid-cols-7 gap-4 lg:gap-6">
                
                {/* Main Form Section - Reduced width */}
                <div className="lg:col-span-4 max-w-2xl">
                  <AnimatePresence mode="wait">
                    {!showResults ? (
                      <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-3 sm:p-4 lg:p-5 shadow-2xl"
                      >
                        {/* Unified Form View - Single responsive design for all screen sizes */}
                        <div className="space-y-6">
                          <CarDetailsFormV2 
                            carData={carData} 
                            updateCarData={updateCarData}
                            monthlyIncomeInputRef={monthlyIncomeInputRef}
                          />
                          <FinancialFormV2 
                            carData={carData} 
                            updateCarData={updateCarData}
                            monthlyIncomeInputRef={monthlyIncomeInputRef}
                          />
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-3 sm:p-4 lg:p-5 shadow-2xl"
                      >
                        <ResultsDisplayV2 
                          carData={carData}
                          onBack={hideResultsView}
                          onRestart={restart}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Live Preview Panel - Reduced width */}
                <aside className="lg:col-span-3 max-w-md" aria-labelledby="results-heading">
                  <div className="lg:sticky lg:top-8">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-3 lg:p-4 shadow-2xl"
                    >
                      <h3 id="results-heading" className="sr-only">Loan Calculation Results</h3>
                      <TotalCostDisplayV2 carData={carData} updateCarData={updateCarData} />
                    </motion.div>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </section>

        {/* Footer - Important Note - Static at page end */}
        <footer className="relative z-10 mt-16 mb-8">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-lg">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-5 h-5 bg-white/10 rounded-full flex items-center justify-center mt-0.5">
                  <svg className="w-3 h-3 text-white/50" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white/90 mb-1 text-sm">Important Note</p>
                  <p className="text-white/70 leading-relaxed text-sm">
                    Calculations are indicative. Actual rates may vary by lender and credit profile.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    )
}