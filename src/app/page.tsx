'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PiggyBank, TrendingUp, Clock } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'
import { getThemeStyles, themeClass } from '@/utils/themeStyles'
import ThemeToggle from '@/components/ThemeToggle'
// Import Version 2 components
import CarDetailsFormV2 from '@/components/v2/CarDetailsFormV2'
import FinancialFormV2 from '@/components/v2/FinancialFormV2'
import ResultsDisplayV2 from '@/components/v2/ResultsDisplayV2'
import TotalCostDisplayV2 from '@/components/v2/TotalCostDisplayV2'
import CostDistributionChart from '@/components/v2/CostDistributionChart'
import EducationalSummary from '@/components/v2/EducationalSummary'

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
  loanType?: 'fixed' | 'floating'
  prepaymentPenaltyRate?: number
}


export default function HomePage() {
  const [showResults, setShowResults] = useState(false) // Toggle results view
  const monthlyIncomeInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { theme, isLight, isDark } = useTheme()
  const themeStyles = getThemeStyles(theme)

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


  // Render Version 2 - CRED-inspired fluid design with theme support
  return (
      <main className={`min-h-screen font-sans relative ${isLight ? 'bg-gradient-to-br from-slate-50 via-white to-slate-50' : 'bg-black'}`} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        {/* Header Navigation */}
        <header className={isLight ? 'bg-white border-b border-slate-200/60' : 'bg-black border-b border-white/5'}>
          <div className="container mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Logo - Far Left Positioning */}
              <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                <div className="w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center">
                  <Image 
                    src="/bck-logo.svg" 
                    alt="BudgetGear Logo" 
                    className="w-10 h-10 sm:w-16 sm:h-16 object-contain"
                    width={64}
                    height={64}
                  />
                </div>
                <span className={`text-base sm:text-2xl font-extrabold tracking-tight flex items-center ${isLight ? 'text-slate-900' : 'text-white'}`}>BudgetGear</span>
              </div>

              {/* Navigation Menu - Center with proper spacing */}
              <div className="flex-1 flex justify-center px-4">
                <nav className="flex items-center" role="navigation" aria-label="Main navigation">
                  <a href="#calculator" className={`font-bold text-xs sm:text-base tracking-wide transition-colors duration-200 px-1 sm:px-4 py-2 text-center ${isLight ? 'text-slate-900 hover:text-slate-600' : 'text-white hover:text-white/80'}`}>
                    Car Affordability Calculator
                  </a>
                </nav>
              </div>

              {/* Theme Toggle - Right side */}
              <div className="flex items-center space-x-4">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        {/* Immersive Background Gradient - exclude header */}
        {isDark && <div className="absolute top-20 left-0 right-0 bottom-0 bg-gradient-to-br from-gray-900/50 via-black to-gray-900/30 pointer-events-none"></div>}
        
        
        {/* Main Content Section - Fluid Layout */}
        <section className="relative z-10 pt-4" id="calculator" aria-labelledby="calculator-heading">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 id="calculator-heading" className="sr-only">Car Finance Calculator Tool</h2>
              
              {/* Estimates Notice */}
              <div className="text-left mb-4">
                <p className={`text-xs ${themeClass('text-slate-600', 'text-white/60', isLight)} font-medium`}>
                  * All calculations are estimates for informational purposes only
                </p>
              </div>

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
                        className={`rounded-2xl p-3 sm:p-4 lg:p-5 ${isLight ? 'bg-white border border-slate-200/60 shadow-sm' : 'bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl'}`}
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
                        className={`rounded-2xl p-3 sm:p-4 lg:p-5 ${isLight ? 'bg-white border border-slate-200/60 shadow-sm' : 'bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl'}`}
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
                      className={`rounded-2xl p-3 lg:p-4 ${isLight ? 'bg-white border border-slate-200/60 shadow-sm' : 'bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl'}`}
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

        {/* Smart Prepayment Section */}
        {carData.carPrice > 0 && carData.downPayment >= 0 && carData.tenure > 0 && (
          <section className="relative z-10 mt-12">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="bg-gradient-to-r from-emerald-500/10 via-green-500/5 to-emerald-600/10 backdrop-blur-xl rounded-3xl border border-emerald-400/20 p-8 shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500"
                >
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
                        <PiggyBank className="w-8 h-8 text-emerald-400" />
                      </div>
                    </div>
                    <h3 className="text-white font-bold text-2xl mb-3">Ready to Save on Interest?</h3>
                    <p className="text-white/70 text-lg mb-6 max-w-2xl mx-auto">
                      Discover how strategic prepayments can reduce your loan tenure by years and save lakhs in interest payments
                    </p>
                    
                    {/* Benefits Preview */}
                    <div className="grid md:grid-cols-2 gap-4 mb-8">
                      <div className="bg-white/5 rounded-2xl p-4 border border-emerald-400/20">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                            <Clock className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div className="text-left">
                            <div className="text-emerald-300 font-semibold text-sm">Reduce Tenure</div>
                            <div className="text-white/70 text-xs">Finish loan 3-5 years earlier</div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-2xl p-4 border border-emerald-400/20">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div className="text-left">
                            <div className="text-emerald-300 font-semibold text-sm">Massive Savings</div>
                            <div className="text-white/70 text-xs">Save ₹10L+ in interest</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const params = new URLSearchParams({
                          carPrice: (carData.carPrice || 0).toString(),
                          downPayment: (carData.downPayment || 0).toString(),
                          interestRate: (carData.interestRate || 8).toString(),
                          tenure: (carData.tenure || 0).toString()
                        })
                        window.open(`/prepayment?${params.toString()}`, '_blank')
                      }}
                      className="group inline-flex items-center space-x-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105 hover:-translate-y-1"
                    >
                      <PiggyBank className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                      <span className="text-lg">Calculate Smart Prepayment</span>
                      <div className="w-2 h-2 bg-white/30 rounded-full group-hover:w-8 group-hover:h-2 transition-all duration-300"></div>
                    </button>
                    
                    <p className="text-emerald-200/60 text-sm mt-4">
                      Free analysis • No hidden charges • Instant results
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        )}

        {/* Cost Distribution Chart Section */}
        <section className="relative z-10 mt-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <CostDistributionChart carData={carData} />
            </div>
          </div>
        </section>

        {/* Educational Summary Section */}
        <EducationalSummary carData={carData} />

        {/* Footer - Disclaimer - Static at page end */}
        <footer className="relative z-10 mt-16 mb-8">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className={`rounded-xl p-6 shadow-lg ${isLight ? 'bg-white border border-slate-200/60' : 'bg-white/5 backdrop-blur-xl border border-white/10'}`}>
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${isLight ? 'bg-slate-200' : 'bg-white/10'}`}>
                  <svg className={`w-3 h-3 ${isLight ? 'text-slate-600' : 'text-white/50'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className={`font-medium mb-3 text-sm ${isLight ? 'text-slate-900' : 'text-white/90'}`}>Disclaimer</p>
                  <p className={`leading-relaxed text-sm ${isLight ? 'text-slate-700' : 'text-white/70'}`}>
                    This car affordability calculator serves as a helpful tool to understand potential financial outcomes when planning your vehicle purchase. It is designed for informational and educational purposes only and does not constitute professional financial advice for your specific loan decisions. The calculations and projections shown are estimates and should be treated as general guidance rather than exact financial recommendations. For personalized advice tailored to your unique financial circumstances, we strongly encourage you to consult with a qualified financial advisor who can discuss the various options and their implications for your situation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    )
}