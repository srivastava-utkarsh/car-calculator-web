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

  // Handle scroll effect for background image
  useEffect(() => {
    const handleScroll = () => {
      const educationBg = document.getElementById('education-bg')
      if (educationBg) {
        // Fade out as user scrolls down to calculator section
        const scrollRatio = Math.min(window.scrollY / 400, 1)
        const opacity = Math.max(0, 0.4 - (scrollRatio * 0.4))
        educationBg.style.opacity = opacity.toString()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
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
        <header className="bg-black/95 backdrop-blur-md border-b border-white/10">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/20">
                  <Image 
                    src="/budgetgear_tranparent.png" 
                    alt="BudgetGear - Car Finance Calculator Logo" 
                    className="w-5 h-5 object-contain opacity-90"
                    width={20}
                    height={20}
                  />
                </div>
                <span className="text-lg font-bold text-white opacity-95">BudgetGear</span>
              </div>

              {/* Navigation Links */}
              <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
                <a href="#calculator" className="text-white/90 hover:text-white transition-colors text-sm font-medium">
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
        
        {/* Background Education Image - Only until calculator starts */}
        <div className="absolute top-0 left-0 right-0 z-0 pointer-events-none" style={{ height: '60vh' }}>
          <div 
            id="education-bg"
            className="absolute inset-0 bg-[url('/education_blk.png')] bg-cover bg-center bg-no-repeat opacity-40 transition-opacity duration-500 ease-out"
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black"></div>
        </div>

        {/* Main Content Section - Fluid Layout */}
        <section className="relative z-10 pt-16" id="calculator" aria-labelledby="calculator-heading">
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

        {/* Bottom Spacing */}
        <div className="h-20 lg:h-32"></div>
      </main>
    )
}