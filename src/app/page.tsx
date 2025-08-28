'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PiggyBank, TrendingUp, Clock, ChevronLeft, ChevronRight, Palette } from 'lucide-react'
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
// Material UI components implemented inline

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
  parkingFee?: number
  maintenanceCostPerYear?: number
  insuranceCostPerYear?: number
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

// Enhanced Ad Space Component with matching background and dotted border
const EnhancedAdSpace = ({ width, height, label, className = "" }: {
  width: string;
  height: string;
  label: string;
  className?: string;
}) => {
  const { isLight } = useTheme();
  
  return (
    <div className={`text-center my-6 ${className}`}>
      <div className={`text-xs mb-2 ${isLight ? 'text-slate-500' : 'text-white/60'}`}>Advertisement</div>
      <div 
        className={`
          border-2 border-dashed rounded-lg flex items-center justify-center mx-auto
          ${isLight 
            ? 'bg-gradient-to-br from-slate-50 via-white to-slate-50 border-slate-300' 
            : 'bg-black border-white/20'
          }
        `}
        style={{ width, height }}
      >
        <div className={`text-sm font-medium ${isLight ? 'text-slate-400' : 'text-white/40'}`}>
          {label}
        </div>
      </div>
    </div>
  );
};

export default function HomePage() {
  const [showResults, setShowResults] = useState(false) // Toggle results view
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false) // Collapsible state
  const [useMaterialUI, setUseMaterialUI] = useState(false) // Toggle Material UI
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
    monthlyFuelExpense: 0,
    parkingFee: 0,
    maintenanceCostPerYear: 0,
    insuranceCostPerYear: 0
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
      monthlyFuelExpense: 0,
      parkingFee: 0,
      maintenanceCostPerYear: 0,
      insuranceCostPerYear: 0
    })
  }


  // Render Version 2 - CRED-inspired fluid design with theme support
  return (
      <main className={`min-h-screen font-sans relative ${isLight ? 'bg-gradient-to-br from-slate-50 via-white to-slate-50' : 'bg-black'}`} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        {/* AdSense Script */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
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
              <div className="flex-1 flex justify-center">
                <nav className="flex items-center gap-6" role="navigation" aria-label="Main navigation">
                  <span className={`font-semibold text-xs sm:text-sm tracking-wide px-3 py-2 text-center rounded-lg ${isLight ? 'text-white bg-blue-600' : 'text-black bg-white'}`}>
                    Car Affordability Calculator
                  </span>
                  <a 
                    href="/prepayment" 
                    className={`font-semibold text-xs sm:text-sm tracking-wide px-3 py-2 text-center rounded-lg transition-colors duration-200 hover:scale-105 ${isLight ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100' : 'text-white/80 hover:text-white hover:bg-white/10'}`}
                  >
                    Loan Prepayment Calculator
                  </a>
                </nav>
              </div>

            </div>
          </div>
        </header>

        {/* 20/4/10 Rule Infographic */}
        <div className="py-6 flex items-center justify-center">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {/* Desktop SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="160" viewBox="0 0 920 160" className="hidden md:block max-w-full">
              <style>
                {`.bg { fill: #1c1f26; }
                .title { font: 700 24px system-ui, sans-serif; fill: #ffffff; }
                .rule { font: 700 18px system-ui, sans-serif; fill: #34e4c9; }
                .desc { font: 400 14px system-ui, sans-serif; fill: #cdd4e0; }
                .box { fill:#2a2f3a; rx:12; ry:12; }`}
              </style>
              
              {/* Background */}
              <rect className="bg" width="920" height="160" rx="12"/>
              
              {/* Title */}
              <text className="title" x="28" y="48">The 20 / 4 / 10 Rule</text>
              <text className="desc" x="28" y="74">A simple guideline to buy a car you can actually afford</text>
              
              {/* Rule 1 */}
              <g transform="translate(28,95)">
                <rect className="box" width="260" height="50"/>
                <text className="rule" x="18" y="28">20% Down Payment</text>
                <text className="desc" x="18" y="44">Pay at least 20% upfront</text>
              </g>
              
              {/* Rule 2 */}
              <g transform="translate(308,95)">
                <rect className="box" width="260" height="50"/>
                <text className="rule" x="18" y="28">≤ 4 Years Loan</text>
                <text className="desc" x="18" y="44">Keep the loan term within 4 years</text>
              </g>
              
              {/* Rule 3 */}
              <g transform="translate(588,95)">
                <rect className="box" width="304" height="50"/>
                <text className="rule" x="18" y="28">≤ 10% Income on EMI</text>
                <text className="desc" x="18" y="44">Monthly EMI ≤ 10% of income</text>
              </g>
            </svg>

            {/* Mobile/Tablet Alternative - Responsive Cards */}
            <div className="block md:hidden">
              <div className={`rounded-xl p-6 ${isLight ? 'bg-slate-900' : 'bg-gray-900/90'}`}>
                <div className="text-center mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">The 20 / 4 / 10 Rule</h2>
                  <p className="text-white/70 text-sm sm:text-base">A simple guideline to buy a car you can actually afford</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-800/60 rounded-lg p-4">
                    <h3 className="text-teal-400 font-bold text-base sm:text-lg mb-1">20% Down Payment</h3>
                    <p className="text-white/80 text-xs sm:text-sm">Pay at least 20% upfront</p>
                  </div>
                  
                  <div className="bg-gray-800/60 rounded-lg p-4">
                    <h3 className="text-teal-400 font-bold text-base sm:text-lg mb-1">≤ 4 Years Loan</h3>
                    <p className="text-white/80 text-xs sm:text-sm">Keep the loan term within 4 years</p>
                  </div>
                  
                  <div className="bg-gray-800/60 rounded-lg p-4">
                    <h3 className="text-teal-400 font-bold text-base sm:text-lg mb-1">≤ 10% Income on EMI</h3>
                    <p className="text-white/80 text-xs sm:text-sm leading-tight">Monthly EMI should not exceed 10% of income</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Immersive Background Gradient - exclude header and infographic */}
        {isDark && <div className="absolute left-0 right-0 bottom-0 bg-gradient-to-br from-gray-900/50 via-black to-gray-900/30 pointer-events-none" style={{ top: '320px' }}></div>}
        
        
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

              {/* Content Layout - Separate panels design */}
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 relative">
                
                {/* Left Column - Calculator Form Panel */}
                <div className={`transition-all duration-500 ease-in-out ${isLeftCollapsed ? 'w-16 lg:w-16' : 'w-full lg:w-1/2 lg:flex-shrink-0'} space-y-6`}>
                  {/* Calculator Form Panel */}
                  <div className="md-panel-elevated p-4">
                    <motion.div 
                      className="transition-all duration-500 ease-in-out"
                      animate={{ width: isLeftCollapsed ? 64 : 'auto' }}
                    >
                    {isLeftCollapsed ? (
                      // Collapsed State - Small Label
                      <div className="h-full md-panel-elevated p-3 flex flex-col items-center justify-center space-y-6 min-h-[400px]">
                        <button
                          onClick={() => setIsLeftCollapsed(false)}
                          className={`p-3 rounded-xl transition-all duration-200 hover:scale-110 shadow-lg ${isLight ? 'bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200' : 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-400/30'}`}
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
                              className="md-panel-elevated p-3 sm:p-4 lg:p-5"
                            >
                              {/* Collapse Button */}
                              <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center space-x-3">
                                  <h3 className="text-lg font-semibold text-white">
                                    Car Cost Details
                                  </h3>
                                  <div className={`h-px w-16 ${isLight ? 'bg-slate-300' : 'bg-white/30'}`}></div>
                                </div>
                              </div>
                              
                              {/* Unified Form View - Single responsive design for all screen sizes */}
                              <div className="space-y-6">
                                {useMaterialUI ? (
                                  <div className="space-y-4">
                                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                      <div className="flex items-center space-x-2 mb-2">
                                        <Palette className="w-5 h-5 text-blue-600" />
                                        <h3 className="text-blue-900 font-semibold">Material Design Mode</h3>
                                      </div>
                                      <p className="text-blue-700 text-sm">Material Design styling applied to form components</p>
                                    </div>
                                    
                                    <div className="bg-white p-6 rounded-lg shadow-md border">
                                      <h4 className="text-cyan-600 font-semibold mb-4">Material Design Calculator Demo</h4>
                                      
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-2">Car Price</label>
                                          <input
                                            type="text"
                                            value={carData.carPrice || ''}
                                            onChange={(e) => updateCarData({ carPrice: parseFloat(e.target.value) || 0 })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                                            placeholder="Enter car price"
                                          />
                                        </div>
                                        
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-2">Down Payment</label>
                                          <input
                                            type="text"
                                            value={carData.downPayment || ''}
                                            onChange={(e) => updateCarData({ downPayment: parseFloat(e.target.value) || 0 })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                                            placeholder="Enter down payment"
                                          />
                                        </div>
                                      </div>
                                      
                                      <div className="flex gap-2 mb-4">
                                        {[
                                          { label: '5L', value: 500000 },
                                          { label: '10L', value: 1000000 },
                                          { label: '20L', value: 2000000 }
                                        ].map((preset) => (
                                          <button
                                            key={preset.value}
                                            onClick={() => updateCarData({ carPrice: preset.value })}
                                            className={`px-3 py-1 rounded-full text-sm transition-all ${
                                              carData.carPrice === preset.value
                                                ? 'bg-cyan-500 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                          >
                                            ₹{preset.label}
                                          </button>
                                        ))}
                                      </div>
                                      
                                      <button className="bg-cyan-500 text-white px-6 py-2 rounded-md hover:bg-cyan-600 transition-colors font-medium">
                                        Calculate with Material Design
                                      </button>
                                    </div>
                                    
                                    <div className="text-gray-600 text-sm">
                                      ✓ Material Design principles applied with Tailwind CSS
                                    </div>
                                  </div>
                                ) : (
                                  <>
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
                                  </>
                                )}
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="results"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.4, ease: "easeOut" }}
                              className="md-panel-elevated p-3 sm:p-4 lg:p-5"
                            >
                              {/* Collapse Button */}
                              <div className="flex justify-between items-center mb-4">
                                <h3 className={`text-lg font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                                  Calculation Results
                                </h3>
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
                  </div>

                  {/* Horizontal Separator */}
                  {!isLeftCollapsed && (
                    <div className={`h-px w-full ${isLight ? 'bg-gradient-to-r from-transparent via-slate-300 to-transparent' : 'bg-gradient-to-r from-transparent via-white/20 to-transparent'}`}></div>
                  )}

                  {/* Cost Distribution Chart - Separate Panel */}
                  {!isLeftCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="md-panel-elevated p-4"
                    >
                      <CostDistributionChart carData={carData} />
                    </motion.div>
                  )}
                </div>

                {/* Live Preview Panel - Expands when left is collapsed */}
                <motion.aside 
                  className={`transition-all duration-500 ease-in-out ${isLeftCollapsed ? 'flex-1' : 'w-full lg:w-1/2 lg:flex-1'} md-panel-elevated p-4`}
                  aria-labelledby="results-heading"
                  animate={{ width: isLeftCollapsed ? '100%' : 'auto' }}
                >
                  <div className="lg:sticky lg:top-8 space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="md-panel-elevated p-3 sm:p-4 lg:p-5"
                    >
                      <h3 id="results-heading" className="sr-only">Loan Calculation Results</h3>
                      <TotalCostDisplayV2 carData={carData} updateCarData={updateCarData} />
                    </motion.div>
                  </div>
                </motion.aside>
              </div>
            </div>
          </div>
        </section>


        {/* Advertisement - Before Prepayment Section */}
        {carData.carPrice > 0 && carData.downPayment >= 0 && carData.tenure > 0 && (
          <section className="relative z-10 mt-12">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                {/* Desktop Ad - 970x250 Billboard */}
                <EnhancedAdSpace 
                  width="970px" 
                  height="250px" 
                  label="970 x 250 Billboard Ad"
                  className="hidden md:block"
                />
                
                {/* Mobile Ad - 320x100 Banner */}
                <EnhancedAdSpace 
                  width="320px" 
                  height="100px" 
                  label="320 x 100 Large Mobile Banner Ad"
                  className="block md:hidden"
                />
              </div>
            </div>
          </section>
        )}

        {/* Smart Prepayment Section */}
        {carData.carPrice > 0 && carData.downPayment >= 0 && carData.tenure > 0 && (
          <section className="relative z-10 mt-12">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="bg-blue-600/15 backdrop-blur-xl rounded-3xl border border-blue-400/20 p-8 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500"
                >
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center">
                        <PiggyBank className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-white font-bold text-2xl mb-3">Ready to Pay Off Your Loan Faster?</h3>
                    <p className="text-white/70 text-lg mb-6 max-w-2xl mx-auto">
                      Use our loan prepayment calculator to discover how strategic prepayments help you pay off your loan faster and save lakhs in interest
                    </p>
                    
                    {/* Centered Message */}
                    <div className="bg-blue-500/10 rounded-2xl p-6 mb-8 border border-blue-400/20">
                      <div className="text-center">
                        <div className="text-blue-300 font-bold text-lg mb-2">Smart Prepayment Strategy</div>
                        <p className="text-white/80 text-base">
                          Make additional payments towards your loan principal to pay off your loan faster and reduce overall interest burden significantly
                        </p>
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
                      className="group inline-flex items-center space-x-4 bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 hover:-translate-y-1"
                    >
                      <PiggyBank className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                      <span className="text-lg">Try Loan Prepayment Calculator</span>
                      <div className="w-2 h-2 bg-white/30 rounded-full group-hover:w-8 group-hover:h-2 transition-all duration-300"></div>
                    </button>
                    
                    <p className="text-blue-200/60 text-sm mt-4">
                      Free analysis • No hidden charges • Instant results
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        )}

        {/* Advertisement - Before Educational Summary */}
        <section className="relative z-10 mt-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <EnhancedAdSpace 
                width="100%" 
                height="120px" 
                label="Full Width Banner Ad (Responsive)"
              />
            </div>
          </div>
        </section>

        {/* Educational Summary Section */}
        <EducationalSummary carData={carData} />

        {/* Footer Ad - 728x90 Leaderboard */}
        <section className="relative z-10 mt-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Desktop Footer Ad */}
              <EnhancedAdSpace 
                width="728px" 
                height="90px" 
                label="728 x 90 Leaderboard Ad"
                className="hidden md:block"
              />
              
              {/* Mobile Footer Ad */}
              <EnhancedAdSpace 
                width="320px" 
                height="50px" 
                label="320 x 50 Mobile Banner Ad"
                className="block md:hidden"
              />
            </div>
          </div>
        </section>

        {/* Footer - Disclaimer - Static at page end */}
        <footer className="relative z-10 mt-16 mb-8">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="md-panel-elevated p-6">
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
        <div className={`fixed bottom-0 left-0 right-0 z-50 block md:hidden shadow-lg border-t ${isLight ? 'bg-white' : 'bg-black'}`}>
          <div className="flex justify-between items-center p-2">
            <div className="flex-1">
              <EnhancedAdSpace 
                width="300px" 
                height="50px" 
                label="320 x 50 Sticky Mobile Ad"
                className="my-0"
              />
            </div>
            <button 
              onClick={(e) => {
                const stickyAd = e.currentTarget.parentElement?.parentElement;
                if (stickyAd) stickyAd.style.display = 'none';
              }}
              className={`p-1 ml-2 hover:scale-110 transition-transform ${isLight ? 'text-gray-400 hover:text-gray-600' : 'text-white/40 hover:text-white/60'}`}
              aria-label="Close ad"
            >
              ×
            </button>
          </div>
        </div>
      </main>
    )
}