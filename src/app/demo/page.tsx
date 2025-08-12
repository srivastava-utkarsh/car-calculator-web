'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PiggyBank, TrendingUp, Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useTheme } from '@/contexts/ThemeContext'
import { themeClass } from '@/utils/themeStyles'
import Script from 'next/script'
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


// AdSense Component
const AdSenseAd = ({ slot, format, style, responsive = true }: {
  slot: string;
  format?: string;
  style?: React.CSSProperties;
  responsive?: boolean;
}) => {
  useEffect(() => {
    try {
      // @ts-expect-error - AdSense global not typed
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div className="text-center my-4">
      <div className="text-xs text-gray-500 mb-2">Advertisement</div>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXXX" // Replace with your AdSense client ID
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
};

export default function DemoPage() {
  const [showResults, setShowResults] = useState(false) // Toggle results view
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false) // Collapsible state
  const monthlyIncomeInputRef = useRef<HTMLInputElement>(null)
  const { isLight, isDark } = useTheme()

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


  // Render Version 2 - Finology-inspired clean design with vibrant accents
  return (
      <main className={`min-h-screen font-sans relative ${isLight ? 'bg-gradient-to-br from-blue-50 via-white to-purple-50' : 'bg-gradient-to-br from-gray-900 via-black to-purple-900'}`} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        {/* AdSense Script */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* Header Navigation - Finology Style */}
        <header className={`${isLight ? 'bg-white/95 backdrop-blur-lg border-b border-blue-100/60 shadow-sm' : 'bg-black/95 backdrop-blur-lg border-b border-purple-500/20 shadow-2xl'} sticky top-0 z-50`}>
          <div className="container mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Logo - Enhanced with gradient accent */}
              <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                <div className="w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-2">
                  <Image 
                    src="/bck-logo.svg" 
                    alt="BudgetGear Logo" 
                    className="w-full h-full object-contain filter brightness-0 invert"
                    width={64}
                    height={64}
                  />
                </div>
                <span className={`text-base sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent`}>BudgetGear</span>
              </div>

              {/* Navigation Menu - Modern style */}
              <div className="flex-1 flex justify-center px-4">
                <nav className="flex items-center" role="navigation" aria-label="Main navigation">
                  <a href="#calculator" className={`font-semibold text-sm sm:text-base tracking-wide transition-all duration-300 px-4 sm:px-6 py-3 rounded-full hover:scale-105 ${isLight ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50' : 'text-white/90 hover:text-blue-400 hover:bg-white/10'}`}>
                    Car Affordability Calculator
                  </a>
                </nav>
              </div>

              {/* Right side - Call to action button */}
              <div className="flex items-center space-x-4">
                <button className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 shadow-lg">
                  <span>Get Started</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute inset-0 ${isLight ? 'bg-gradient-to-br from-blue-50 via-white to-purple-50' : 'bg-gradient-to-br from-gray-900 via-black to-purple-900'}`}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
        </div>
        
        
        {/* Hero Section - Finology Style */}
        <section className="relative z-10 pt-8 pb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <h1 className={`text-4xl sm:text-5xl font-bold mb-6 ${isLight ? 'text-gray-900' : 'text-white'}`}>
                  Smart Car Finance{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Calculator
                  </span>
                </h1>
                <p className={`text-xl leading-relaxed max-w-2xl mx-auto ${isLight ? 'text-gray-600' : 'text-white/80'}`}>
                  Make informed decisions with our comprehensive car affordability calculator. 
                  Get instant insights on EMI, total costs, and smart prepayment strategies.
                </p>
              </motion.div>
              
              {/* Key Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid md:grid-cols-3 gap-6 mb-12"
              >
                <div className={`p-6 rounded-2xl ${isLight ? 'bg-white/80 backdrop-blur-sm border border-blue-100' : 'bg-white/10 backdrop-blur-sm border border-white/20'} shadow-lg`}>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <PiggyBank className="w-6 h-6 text-white" />
                  </div>
                  <h3 className={`font-semibold text-lg mb-2 ${isLight ? 'text-gray-900' : 'text-white'}`}>
                    Smart Savings
                  </h3>
                  <p className={`text-sm ${isLight ? 'text-gray-600' : 'text-white/70'}`}>
                    Optimize your budget with detailed cost analysis
                  </p>
                </div>
                
                <div className={`p-6 rounded-2xl ${isLight ? 'bg-white/80 backdrop-blur-sm border border-purple-100' : 'bg-white/10 backdrop-blur-sm border border-white/20'} shadow-lg`}>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className={`font-semibold text-lg mb-2 ${isLight ? 'text-gray-900' : 'text-white'}`}>
                    Real-time Results
                  </h3>
                  <p className={`text-sm ${isLight ? 'text-gray-600' : 'text-white/70'}`}>
                    Instant calculations as you adjust parameters
                  </p>
                </div>
                
                <div className={`p-6 rounded-2xl ${isLight ? 'bg-white/80 backdrop-blur-sm border border-green-100' : 'bg-white/10 backdrop-blur-sm border border-white/20'} shadow-lg`}>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h3 className={`font-semibold text-lg mb-2 ${isLight ? 'text-gray-900' : 'text-white'}`}>
                    Time Saving
                  </h3>
                  <p className={`text-sm ${isLight ? 'text-gray-600' : 'text-white/70'}`}>
                    Quick analysis without complex paperwork
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Main Calculator Section */}
        <section className="relative z-10 pb-8" id="calculator" aria-labelledby="calculator-heading">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 id="calculator-heading" className="sr-only">Car Finance Calculator Tool</h2>
              
              {/* Estimates Notice */}
              <div className="text-center mb-6">
                <p className={`text-sm ${themeClass('text-gray-500', 'text-white/60', isLight)} font-medium bg-yellow-50/50 dark:bg-yellow-900/20 px-4 py-2 rounded-full inline-block border border-yellow-200/60 dark:border-yellow-700/60`}>
                  💡 All calculations are estimates for informational purposes only
                </p>
              </div>

              {/* Content Layout - Collapsible design */}
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 relative">
                
                {/* Main Form Section - Collapsible */}
                <motion.div 
                  className={`transition-all duration-500 ease-in-out ${isLeftCollapsed ? 'w-16 lg:w-16' : 'w-full lg:flex-1 lg:max-w-2xl'}`}
                  animate={{ width: isLeftCollapsed ? 64 : 'auto' }}
                >
                  {isLeftCollapsed ? (
                    // Collapsed State - Finology Style
                    <div className={`h-full rounded-2xl p-3 ${isLight ? 'bg-white/90 backdrop-blur-lg border border-blue-200/60 shadow-xl' : 'bg-white/10 backdrop-blur-xl border border-purple-400/20 shadow-2xl'} flex flex-col items-center justify-center space-y-6 min-h-[400px]`}>
                      <button
                        onClick={() => setIsLeftCollapsed(false)}
                        className="p-3 rounded-xl transition-all duration-300 hover:scale-110 shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
                        aria-label="Show calculator panel"
                        title="Show Calculator"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                      <div className={`text-xs font-bold tracking-wider transform -rotate-90 whitespace-nowrap ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
                        CALCULATOR
                      </div>
                    </div>
                  ) : (
                    // Expanded State - Full Form
                    <div className="relative">
                      <AnimatePresence mode="wait">
                        {!showResults ? (
                          <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className={`rounded-2xl p-3 sm:p-4 lg:p-5 ${isLight ? 'bg-white/90 backdrop-blur-lg border border-blue-200/60 shadow-xl' : 'bg-white/10 backdrop-blur-xl border border-purple-400/20 shadow-2xl'}`}
                          >
                            {/* Collapse Button */}
                            <div className="flex justify-between items-center mb-4">
                              <h3 className={`text-lg font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                                Car Finance Calculator
                              </h3>
                              <button
                                onClick={() => setIsLeftCollapsed(true)}
                                className={`hidden lg:flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 font-medium text-sm ${isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900' : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white'}`}
                                aria-label="Hide form panel"
                              >
                                <span>Hide</span>
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                            </div>
                            
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
                            className={`rounded-2xl p-3 sm:p-4 lg:p-5 ${isLight ? 'bg-white/90 backdrop-blur-lg border border-blue-200/60 shadow-xl' : 'bg-white/10 backdrop-blur-xl border border-purple-400/20 shadow-2xl'}`}
                          >
                            {/* Collapse Button */}
                            <div className="flex justify-between items-center mb-4">
                              <h3 className={`text-lg font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                                Calculation Results
                              </h3>
                              <button
                                onClick={() => setIsLeftCollapsed(true)}
                                className={`hidden lg:flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 font-medium text-sm ${isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900' : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white'}`}
                                aria-label="Hide results panel"
                              >
                                <span>Hide</span>
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <ResultsDisplayV2 
                              carData={carData}
                              onBack={hideResultsView}
                              onRestart={restart}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>

                {/* Live Preview Panel - Expands when left is collapsed */}
                <motion.aside 
                  className={`transition-all duration-500 ease-in-out ${isLeftCollapsed ? 'flex-1' : 'w-full lg:w-80 lg:w-96'}`}
                  aria-labelledby="results-heading"
                  animate={{ width: isLeftCollapsed ? '100%' : 'auto' }}
                >
                  <div className="lg:sticky lg:top-8 space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className={`rounded-2xl p-3 lg:p-4 ${isLight ? 'bg-white/90 backdrop-blur-lg border border-blue-200/60 shadow-xl' : 'bg-white/10 backdrop-blur-xl border border-purple-400/20 shadow-2xl'}`}
                    >
                      <h3 id="results-heading" className="sr-only">Loan Calculation Results</h3>
                      <TotalCostDisplayV2 carData={carData} updateCarData={updateCarData} />
                    </motion.div>
                    
                    {/* Desktop Sidebar Ad - 300x250 Medium Rectangle */}
                    <div className="hidden lg:block">
                      <AdSenseAd 
                        slot="1234567892" 
                        format="auto"
                        style={{ width: '300px', height: '250px' }}
                      />
                    </div>
                  </div>
                </motion.aside>
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
                  className={`${isLight ? 'bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-blue-600/10 backdrop-blur-xl' : 'bg-gradient-to-r from-emerald-500/10 via-green-500/5 to-emerald-600/10 backdrop-blur-xl'} rounded-3xl border ${isLight ? 'border-blue-400/20' : 'border-emerald-400/20'} p-8 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500`}
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

        {/* In-Content Ad - 300x250 Medium Rectangle */}
        <section className="relative z-10 mt-8">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <AdSenseAd 
                slot="1234567893" 
                format="auto"
                style={{ width: '300px', height: '250px', margin: '0 auto' }}
              />
            </div>
          </div>
        </section>

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

        {/* Footer Ad - 728x90 Leaderboard */}
        <section className="relative z-10 mt-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="hidden md:block">
                <AdSenseAd 
                  slot="1234567894" 
                  format="auto"
                  style={{ width: '728px', height: '90px', margin: '0 auto' }}
                />
              </div>
              <div className="block md:hidden">
                <AdSenseAd 
                  slot="1234567895" 
                  format="auto"
                  style={{ width: '320px', height: '50px', margin: '0 auto' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Footer - Disclaimer - Modern Finology Style */}
        <footer className="relative z-10 mt-16 mb-8">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className={`rounded-2xl p-6 shadow-xl ${isLight ? 'bg-white/90 backdrop-blur-lg border border-blue-200/60' : 'bg-white/10 backdrop-blur-xl border border-purple-400/20'}`}>
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

        {/* Sticky Bottom Mobile Ad - 320x50 Mobile Leaderboard */}
        <div className="fixed bottom-0 left-0 right-0 z-50 block md:hidden bg-white shadow-lg border-t">
          <div className="flex justify-between items-center p-2">
            <AdSenseAd 
              slot="1234567896" 
              format="auto"
              style={{ width: '320px', height: '50px', margin: '0 auto' }}
            />
            <button 
              onClick={(e) => {
                const stickyAd = e.currentTarget.parentElement?.parentElement;
                if (stickyAd) stickyAd.style.display = 'none';
              }}
              className="text-gray-400 hover:text-gray-600 p-1 ml-2"
              aria-label="Close ad"
            >
              ×
            </button>
          </div>
        </div>
      </main>
    )
}