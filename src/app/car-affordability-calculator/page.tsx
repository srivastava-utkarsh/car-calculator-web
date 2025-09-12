'use client'

import { useState, useRef, useEffect, lazy, Suspense } from 'react'
import { PiggyBank, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'
import { themeClass } from '@/utils/themeStyles'
import Script from 'next/script'
// Import Version 2 components
import CarDetailsFormV2 from '@/components/v2/CarDetailsFormV2'
import FinancialFormV2 from '@/components/v2/FinancialFormV2'
// ResultsDisplayV2 now lazy loaded above
import TotalCostDisplayV2 from '@/components/v2/TotalCostDisplayV2'
import AdSenseAd from '@/components/AdSenseAd'

// Import FAQ data directly
import { carCalculatorFAQs } from '@/data/faqData'

// Lazy load heavy components with dynamic imports to reduce bundle size
const CostDistributionChart = lazy(() => import('@/components/v2/CostDistributionChart'))
const EducationalSummary = lazy(() => import('@/components/v2/EducationalSummary'))
const FAQ = lazy(() => import('@/components/FAQ'))
const ResultsDisplayV2 = lazy(() => import('@/components/v2/ResultsDisplayV2'))

import { CarData } from '@/types/CarData'


export default function CarAffordabilityCalculatorPage() {
  // Structured data specific to car affordability calculator
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Car Affordability Calculator",
    "applicationCategory": "FinanceApplication",
    "description": "Calculate exactly how much car you can afford with professional 20/4/10 rule calculator. Check EMI, down payment, and total costs for smart car financing.",
    "url": "https://budgetgear.in/car-affordability-calculator",
    "author": {
      "@type": "Organization",
      "name": "BudgetGear",
      "logo": {
        "@type": "ImageObject",
        "url": "https://budgetgear.in/bck-logo.svg"
      }
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "featureList": [
      "Car Affordability Calculation",
      "20/4/10 Rule Analysis",
      "EMI Calculator",
      "Down Payment Calculator", 
      "Total Cost Analysis",
      "Monthly Budget Planning",
      "Loan Eligibility Check",
      "Real-time Calculations"
    ],
    "operatingSystem": "Any",
    "browserRequirements": "Requires JavaScript"
  };
  const [showResults, setShowResults] = useState(false)
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false)
  const [useMaterialUI] = useState(false)
  const [imageOpacity, setImageOpacity] = useState(1)
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

  // Scroll effect for image fade
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const fadeStart = 50
      const fadeEnd = 300
      
      if (scrollPosition <= fadeStart) {
        setImageOpacity(1)
      } else if (scrollPosition >= fadeEnd) {
        setImageOpacity(0)
      } else {
        const fadeProgress = (scrollPosition - fadeStart) / (fadeEnd - fadeStart)
        const newOpacity = 1 - fadeProgress
        setImageOpacity(Math.max(0, Math.min(1, newOpacity)))
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])


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

  return (
    <main className={`min-h-screen font-sans relative ${isLight ? 'bg-gradient-to-br from-slate-50 via-white to-slate-50' : 'bg-black'}`} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* AdSense Script */}
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      
      {/* Header Navigation */}
      <header className={isLight ? 'bg-white border-b border-slate-200/60' : 'bg-black border-b border-white/5'}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo - Far Left Positioning */}
            <Link href="/" className="flex items-center space-x-1.5 sm:space-x-3 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 sm:w-16 sm:h-16 flex items-center justify-center">
                <Image 
                  src="/bck-logo.svg" 
                  alt="BudgetGear Car Affordability Calculator Logo - Free EMI Calculator" 
                  className="w-8 h-8 sm:w-16 sm:h-16 object-contain"
                  width={64}
                  height={64}
                />
              </div>
              <span className={`text-base sm:text-xl md:text-2xl font-extrabold tracking-tight flex items-center ${isLight ? 'text-slate-900' : 'text-white'}`}>BudgetGear</span>
            </Link>

            {/* Navigation Menu - Mobile optimized */}
            <div className="flex-1 flex justify-center px-2">
              <nav className="flex items-center gap-2 sm:gap-4" role="navigation" aria-label="Main navigation">
                <span className={`font-semibold text-xs sm:text-sm tracking-wide px-1 sm:px-3 py-1 sm:py-2 text-center rounded-md min-h-[32px] sm:min-h-[44px] flex items-center ${isLight ? 'text-white bg-blue-600' : 'text-black bg-white'}`}>
                  Car Affordability Calculator
                </span>
                <a 
                  href="/car-loan-prepayment-calculator" 
                  className={`font-semibold text-xs sm:text-sm tracking-wide px-1 sm:px-3 py-1 sm:py-2 text-center rounded-md transition-colors duration-200 hover:scale-105 min-h-[32px] sm:min-h-[44px] flex items-center touch-manipulation ${isLight ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100' : 'text-white/80 hover:text-white hover:bg-white/10'}`}
                  title="Car Loan Prepayment Calculator - Calculate Interest Savings"
                >
                  Loan Prepayment Calculator
                </a>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Immersive Background Gradient - exclude header */}
      {isDark && <div className="absolute left-0 right-0 bottom-0 bg-gradient-to-br from-gray-900/50 via-black to-gray-900/30 pointer-events-none" style={{ top: '100px' }}></div>}
      
      {/* Main Content Section - Fluid Layout */}
      <section className="relative z-10 pt-4" id="calculator" aria-labelledby="main-heading">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Mobile-optimized heading */}
            <div className="block md:hidden text-center mb-4">
              <h1 className={`text-base font-semibold mb-2 ${isLight ? 'text-slate-800' : 'text-white/90'}`}>
                Car Loan EMI Calculator India
              </h1>
              <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                Check how much car you can afford
              </p>
              <div className={`text-xs mt-2 ${isLight ? 'text-slate-500' : 'text-white/70'}`}>
                Free EMI calculator with 20/4/10 rule & prepayment analysis
              </div>
            </div>

            {/* Desktop heading */}
            <div className="hidden md:block text-center mb-6">
              <h1 id="main-heading" className={`text-xl lg:text-2xl font-semibold mb-3 ${isLight ? 'text-slate-800' : 'text-white/90'}`}>
                Car Loan EMI Calculator India | Best Car Affordability Calculator Online
              </h1>
              <p className="text-base lg:text-lg font-medium">
                Calculate car loan EMI with proven 20/4/10 rule • Free budget calculator with prepayment analysis, eligibility check & professional calculations
              </p>
            </div>
            
            {/* 20/4/10 Rule Info - Desktop: SVG image, Mobile: Compact cards */}
            <div className="mb-4">
              {/* Desktop version - Optimized compact design */}
              <div 
                className="hidden md:block transition-opacity duration-300 ease-out"
                style={{ opacity: imageOpacity }}
              >
                <div className={`${themeClass('bg-slate-50 border border-slate-200', 'bg-slate-800/50 border border-slate-600/30', isLight)} rounded-xl p-4 mx-4`}>
                  {/* Header */}
                  <div className="text-center mb-3">
                    <p className={`text-sm font-medium ${themeClass('text-slate-600', 'text-white/70', isLight)}`}>
                      Smart car buying guidelines
                    </p>
                  </div>

                  {/* Horizontal Rules */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Rule 1 - Pay 20% Down */}
                    <div className="text-center">
                      <div className={`text-xl font-bold mb-1 ${themeClass('text-green-600', 'text-green-400', isLight)}`}>
                        Pay 20% Down
                      </div>
                      <div className={`text-xs font-medium mb-1 ${themeClass('text-slate-700', 'text-white/90', isLight)}`}>
                        Lower EMI, less total interest
                      </div>
                      <div className={`text-xs ${themeClass('text-slate-600', 'text-white/70', isLight)}`}>
                        Example: ₹20L car → ₹4L down payment
                      </div>
                    </div>

                    {/* Rule 2 - Max 4 Years */}
                    <div className="text-center">
                      <div className={`text-xl font-bold mb-1 ${themeClass('text-blue-600', 'text-blue-400', isLight)}`}>
                        Max 4 Years
                      </div>
                      <div className={`text-xs font-medium mb-1 ${themeClass('text-slate-700', 'text-white/90', isLight)}`}>
                        Shorter loans = less interest
                      </div>
                      <div className={`text-xs ${themeClass('text-slate-600', 'text-white/70', isLight)}`}>
                        Example: 3 years is even better!
                      </div>
                    </div>

                    {/* Rule 3 - Max 10% Income */}
                    <div className="text-center">
                      <div className={`text-xl font-bold mb-1 ${themeClass('text-orange-600', 'text-orange-400', isLight)}`}>
                        Max 10% Income
                      </div>
                      <div className={`text-xs font-medium mb-1 ${themeClass('text-slate-700', 'text-white/90', isLight)}`}>
                        Keep expenses under 10% of income
                      </div>
                      <div className={`text-xs ${themeClass('text-slate-600', 'text-white/70', isLight)}`}>
                        Example: ₹50K income → ₹5K max EMI
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile version - Simple compact layout */}
              <div className={`md:hidden ${themeClass('bg-slate-50 border border-slate-200', 'bg-slate-800/50 border border-slate-600/30', isLight)} rounded-lg p-3 mx-2`}>
                {/* Compact header */}
                <div className="text-center mb-3">
                  <p className={`text-xs font-semibold ${themeClass('text-slate-600', 'text-white/70', isLight)}`}>
                    🎯 Smart Car Buying: 20/4/10 Rule
                  </p>
                </div>

                {/* Horizontal layout */}
                <div className="flex justify-center items-center gap-6 text-center">
                  <div>
                    <div className={`text-lg font-bold ${themeClass('text-green-600', 'text-green-400', isLight)}`}>20%</div>
                    <div className={`text-xs font-medium ${themeClass('text-slate-700', 'text-white/90', isLight)}`}>Down Payment</div>
                    <div className={`text-xs ${themeClass('text-slate-500', 'text-white/60', isLight)}`}>Lower EMI</div>
                  </div>

                  <div>
                    <div className={`text-lg font-bold ${themeClass('text-blue-600', 'text-blue-400', isLight)}`}>4yr</div>
                    <div className={`text-xs font-medium ${themeClass('text-slate-700', 'text-white/90', isLight)}`}>Max Tenure</div>
                    <div className={`text-xs ${themeClass('text-slate-500', 'text-white/60', isLight)}`}>Less interest</div>
                  </div>

                  <div>
                    <div className={`text-lg font-bold ${themeClass('text-orange-600', 'text-orange-400', isLight)}`}>10%</div>
                    <div className={`text-xs font-medium ${themeClass('text-slate-700', 'text-white/90', isLight)}`}>Of Income</div>
                    <div className={`text-xs ${themeClass('text-slate-500', 'text-white/60', isLight)}`}>EMI limit</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Estimates Notice */}
            <div className="text-left mb-4">
              <p className={`text-sm ${themeClass('text-slate-600', 'text-white/60', isLight)} font-medium`}>
                * All calculations are estimates for informational purposes only
              </p>
            </div>

            {/* Content Layout - Mobile first responsive design */}
            <div className="flex flex-col sm:flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-12 relative">
              
              {/* Left Column - Calculator Form Panel */}
              <div className={`transition-all duration-500 ease-in-out ${isLeftCollapsed ? 'w-16 lg:w-16' : 'w-full lg:w-1/2 lg:flex-shrink-0'} space-y-4 sm:space-y-6 order-1 lg:order-1`}>
                {/* Calculator Form Panel */}
                <div className="md-panel-elevated p-4">
                  <div className="transition-all duration-500 ease-in-out">
                  {isLeftCollapsed ? (
                    // Collapsed State - Small Label
                    <div className="h-full md-panel-elevated p-3 flex flex-col items-center justify-center space-y-6 min-h-[400px]">
                      <button
                        onClick={() => setIsLeftCollapsed(false)}
                        className={`p-4 rounded-xl transition-all duration-200 hover:scale-110 shadow-lg min-h-[48px] min-w-[48px] touch-manipulation ${isLight ? 'bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200' : 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-400/30'}`}
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
                      {!showResults ? (
                          <div key="form" className="md-panel-elevated p-3 sm:p-4 lg:p-5 transition-all duration-400 ease-out">
                            {/* Collapse Button */}
                            <div className="flex justify-between items-center mb-4">
                              <div className="flex items-center space-x-3">
                                <h3 className="text-lg font-semibold text-blue-400">
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
                                      <div className="w-5 h-5 bg-blue-600 rounded"></div>
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
                          </div>
                        ) : (
                          <div key="results" className="md-panel-elevated p-3 sm:p-4 lg:p-5 transition-all duration-400 ease-out">
                            {/* Collapse Button */}
                            <div className="flex justify-between items-center mb-4">
                              <h3 className={`text-lg font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                                Calculation Results
                              </h3>
                            </div>
                            
                            <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>}>
                              <ResultsDisplayV2 
                                carData={carData}
                                onBack={hideResultsView}
                                onRestart={restart}
                              />
                            </Suspense>
                          </div>
                        )}
                    </div>
                  )}
                  </div>
                </div>

                {/* Cost Distribution Chart - Desktop only (hidden on mobile) */}
                {!isLeftCollapsed && carData.carPrice > 0 && carData.tenure > 0 && (
                  <div className="hidden lg:block md-panel-elevated p-4">
                    <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>}>
                      <div className="animate-fadeIn">
                        <CostDistributionChart carData={carData} />
                      </div>
                    </Suspense>
                  </div>
                )}
              </div>

              {/* Live Preview Panel - Expands when left is collapsed */}
              <aside 
                className={`transition-all duration-500 ease-in-out ${isLeftCollapsed ? 'flex-1' : 'w-full lg:w-1/2 lg:flex-1'} md-panel-elevated p-4 order-2 lg:order-2`}
                aria-labelledby="results-heading"
              >
                <div className="lg:sticky lg:top-8 space-y-4">
                  <div className="md-panel-elevated p-3 sm:p-4 lg:p-5 animate-slideIn">
                    <h3 id="results-heading" className="sr-only">Loan Calculation Results</h3>
                    <TotalCostDisplayV2 carData={carData} updateCarData={updateCarData} />
                  </div>
                </div>
              </aside>
            </div>

            {/* Cost Distribution Chart - Mobile only (after Summary) */}
            {!isLeftCollapsed && carData.carPrice > 0 && carData.tenure > 0 && (
              <div className="block lg:hidden mt-6">
                <div className="md-panel-elevated p-4">
                  <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>}>
                    <div className="animate-fadeIn">
                      <CostDistributionChart carData={carData} />
                    </div>
                  </Suspense>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Advertisement - Between Summary and Chart (Mobile) */}
      <section className="relative z-10 block lg:hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Mobile Ad - 320x100 Banner */}
            <div style={{ textAlign: 'center', margin: '24px 0' }}>
              <AdSenseAd slot="1234567890" style={{ margin: "24px 0" }} />
            </div>
          </div>
        </div>
      </section>

      {/* Smart Prepayment Section */}
      {carData.carPrice > 0 && (
        <section className="relative z-10 mt-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-blue-600/15 backdrop-blur-xl rounded-3xl border border-blue-400/20 p-8 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 opacity-0 animate-slideUp">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center">
                      <PiggyBank className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-white font-bold text-2xl mb-3">Ready to Pay Off Your Loan Faster?</h3>
                  <p className="text-white/70 text-lg mb-6 max-w-2xl mx-auto">
                    Use our <a href="/car-loan-prepayment-calculator" className="text-blue-300 hover:text-blue-200 underline">car loan prepayment calculator</a> to discover how strategic prepayments help you pay off your loan faster and save lakhs in interest
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
                      window.open(`/car-loan-prepayment-calculator?${params.toString()}`, '_blank')
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
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Educational Summary Section */}
      <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-lg mt-12"></div>}>
        <EducationalSummary carData={carData} />
      </Suspense>

      {/* FAQ Section */}
      <section className="relative z-10 mt-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>}>
            <FAQ title="Frequently Asked Questions" faqs={carCalculatorFAQs} />
          </Suspense>
        </div>
      </section>
    </main>
  )
}