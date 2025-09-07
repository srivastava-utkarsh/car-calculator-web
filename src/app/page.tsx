'use client'

import { useState, useRef, useEffect, lazy, Suspense } from 'react'
import { PiggyBank, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useTheme } from '@/contexts/ThemeContext'
import { themeClass } from '@/utils/themeStyles'
import Script from 'next/script'
// Import Version 2 components
import CarDetailsFormV2 from '@/components/v2/CarDetailsFormV2'
import FinancialFormV2 from '@/components/v2/FinancialFormV2'
// ResultsDisplayV2 now lazy loaded above
import TotalCostDisplayV2 from '@/components/v2/TotalCostDisplayV2'

// Import FAQ data directly
import { carCalculatorFAQs } from '@/data/faqData'

// Lazy load heavy components with dynamic imports to reduce bundle size
const CostDistributionChart = lazy(() => import('@/components/v2/CostDistributionChart'))
const EducationalSummary = lazy(() => import('@/components/v2/EducationalSummary'))
const FAQ = lazy(() => import('@/components/FAQ'))
const ResultsDisplayV2 = lazy(() => import('@/components/v2/ResultsDisplayV2'))

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
  const [useMaterialUI] = useState(false) // Toggle Material UI - disabled for performance
  const [imageOpacity, setImageOpacity] = useState(1) // Image fade opacity
  const [activeSection, setActiveSection] = useState('what-is-calculator') // Active navigation section
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
      const fadeStart = 50 // Start fading after 50px
      const fadeEnd = 300 // Completely faded at 300px
      
      if (scrollPosition <= fadeStart) {
        setImageOpacity(1)
      } else if (scrollPosition >= fadeEnd) {
        setImageOpacity(0)
      } else {
        // Calculate opacity between fadeStart and fadeEnd
        const fadeProgress = (scrollPosition - fadeStart) / (fadeEnd - fadeStart)
        const newOpacity = 1 - fadeProgress
        setImageOpacity(Math.max(0, Math.min(1, newOpacity)))
      }
    }

    // Add initial call to set correct opacity on mount
    handleScroll()
    
    // Add scroll listener with passive option for better performance
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Scroll effect for navigation highlighting using Intersection Observer
  useEffect(() => {
    const sections = [
      'what-is-calculator',
      'factors-affect', 
      'how-calculator-works',
      'emi-formula',
      'tips-calculator'
    ]

    // Use Intersection Observer for better performance and accuracy
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry that's most visible
        let mostVisibleEntry = entries[0]
        let maxIntersectionRatio = 0

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxIntersectionRatio) {
            maxIntersectionRatio = entry.intersectionRatio
            mostVisibleEntry = entry
          }
        })

        // If we have a visible entry, update the active section
        if (mostVisibleEntry && mostVisibleEntry.isIntersecting) {
          const sectionId = mostVisibleEntry.target.id
          setActiveSection(sectionId)
          console.log('Active section changed to:', sectionId)
        }
      },
      {
        // Trigger when 30% of the section is visible
        threshold: [0.1, 0.3, 0.5],
        // Use some margin to trigger earlier
        rootMargin: '-20% 0px -70% 0px'
      }
    )

    // Observe all sections
    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      observer.disconnect()
    }
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


  // Render Version 2 - Modern fluid design with theme support
  return (
      <main className={`min-h-screen font-sans relative ${isLight ? 'bg-gradient-to-br from-slate-50 via-white to-slate-50' : 'bg-black'}`} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        {/* AdSense Script */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-XXXXXXXXXXXXXXXXX"}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* Header Navigation */}
        <header className={isLight ? 'bg-white border-b border-slate-200/60' : 'bg-black border-b border-white/5'}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-20">
              {/* Logo - Far Left Positioning */}
              <div className="flex items-center space-x-1.5 sm:space-x-3 flex-shrink-0">
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
              </div>

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
        
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Car Affordability Calculator",
              "description": "Calculate car loan EMI with proven 20/4/10 rule. Free budget calculator with prepayment analysis, eligibility check & professional calculations.",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "INR"
              },
              "featureList": [
                "Car loan EMI calculation",
                "20/4/10 rule analysis", 
                "Prepayment analysis",
                "Eligibility check",
                "Professional calculations"
              ]
            })
          }}
        />

        {/* Main Content Section - Fluid Layout */}
        <section className="relative z-10 pt-4" id="calculator" aria-labelledby="main-heading" itemScope itemType="https://schema.org/WebApplication">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Mobile-optimized heading */}
              <div className="block md:hidden text-center mb-4">
                <h1 className={`text-base font-semibold mb-2 ${isLight ? 'text-slate-800' : 'text-white/90'}`} itemProp="name">
                  Car Affordability Calculator
                </h1>
                <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                  Check how much car you can afford
                </p>
                <div className={`text-xs mt-2 ${isLight ? 'text-slate-500' : 'text-white/70'}`} itemProp="description">
                  Free EMI calculator with 20/4/10 rule & prepayment analysis
                </div>
              </div>

              {/* Desktop heading */}
              <div className="hidden md:block text-center mb-6">
                <h1 id="main-heading" className={`text-xl lg:text-2xl font-semibold mb-3 ${isLight ? 'text-slate-800' : 'text-white/90'}`} itemProp="name">
                  Car Affordability Calculator | Check How Much Car You Can Afford
                </h1>
                <p className="text-base lg:text-lg font-medium" itemProp="description">
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

                {/* Mobile version - Compact with same text as desktop */}
                <div className={`md:hidden ${themeClass('bg-slate-50 border border-slate-200', 'bg-slate-800/50 border border-slate-600/30', isLight)} rounded-lg p-3 mx-2`}>
                  {/* Compact header */}
                  <div className="text-center mb-2">
                    <p className={`text-xs font-medium ${themeClass('text-slate-600', 'text-white/70', isLight)}`}>
                      🎯 Smart car buying guidelines
                    </p>
                  </div>

                  {/* Compact rules grid */}
                  <div className="space-y-2">
                    {/* Rule 1 - Pay 20% Down */}
                    <div className="text-center">
                      <div className={`text-lg font-bold mb-1 ${themeClass('text-green-600', 'text-green-400', isLight)}`}>
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
                      <div className={`text-lg font-bold mb-1 ${themeClass('text-blue-600', 'text-blue-400', isLight)}`}>
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
                      <div className={`text-lg font-bold mb-1 ${themeClass('text-orange-600', 'text-orange-400', isLight)}`}>
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

                  {/* Cost Distribution Chart - Lazy loaded only when needed */}
                  {!isLeftCollapsed && carData.carPrice > 0 && carData.tenure > 0 && (
                    <div className="md-panel-elevated p-4">
                      <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>}>
                        <div className="opacity-0 animate-fadeIn">
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
                    <div className="md-panel-elevated p-3 sm:p-4 lg:p-5 opacity-0 animate-slideIn">
                      <h3 id="results-heading" className="sr-only">Loan Calculation Results</h3>
                      <TotalCostDisplayV2 carData={carData} updateCarData={updateCarData} />
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </section>

        {/* Advertisement - Between Summary and Chart (Mobile) */}
        <section className="relative z-10 block lg:hidden">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Mobile Ad - 320x100 Banner */}
              <EnhancedAdSpace 
                width="320px" 
                height="100px" 
                label="320 x 100 Mobile Banner Ad"
                className="my-6"
              />
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


        {/* Car Affordability Education Section with Navigation */}
        <section className="relative z-10 mt-16" id="education-section">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-8">
                
                {/* Left Navigation Panel */}
                <aside className={`lg:w-1/4 ${isLight ? 'bg-slate-900' : 'bg-slate-900'} rounded-lg p-6`}>
                  <nav className="space-y-2 sticky top-8">
                    {[
                      { id: 'what-is-calculator', label: 'What is a car affordability calculator' },
                      { id: 'factors-affect', label: 'What Factors Affect Car Affordability?' },
                      { id: 'how-calculator-works', label: 'How Car Affordability Calculator Work' },
                      { id: 'emi-formula', label: 'EMI Calculation Formula' },
                      { id: 'tips-calculator', label: 'Tips for Car Affordability' }
                    ].map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={(e) => {
                          e.preventDefault()
                          const element = document.getElementById(item.id)
                          if (element) {
                            // Calculate offset to account for any fixed headers
                            const yOffset = -100 // Adjust this value based on your header height
                            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
                            
                            window.scrollTo({
                              top: y,
                              behavior: 'smooth'
                            })
                            
                            // Also update active section immediately for instant feedback
                            setActiveSection(item.id)
                          }
                        }}
                        className={`block py-2 px-3 rounded text-sm font-medium transition-colors cursor-pointer ${
                          activeSection === item.id
                            ? 'text-white hover:bg-slate-800 border-l-4 border-yellow-500'
                            : 'text-white/70 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        {item.label}
                      </a>
                    ))}
                  </nav>
                </aside>

                {/* Right Content Panel */}
                <main className="lg:w-3/4 space-y-8">
                  
                  {/* What is a Car Affordability Calculator */}
                  <div id="what-is-calculator" className="p-8">
                    <h2 className={`text-2xl font-bold mb-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      What is a car affordability calculator
                    </h2>
                    <p className={`leading-relaxed ${isLight ? 'text-slate-700' : 'text-white/80'}`}>
                      This calculator helps you check if you can afford your <strong>dream car with your current salary</strong> by 
                      determining if your <strong>income and expenses</strong> align with the cost of owning a car. By considering 
                      <strong>income, loan terms, and operational cost</strong>, it provides a realistic budget estimate, ensuring you 
                      make a <strong>financially stable</strong> car purchase without overextending your finances.
                    </p>
                  </div>

                  {/* What Factors Affect Car Affordability */}
                  <div id="factors-affect" className="p-8">
                    <h2 className={`text-2xl font-bold mb-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      What Factors Affect Car Affordability?
                    </h2>
                    <ul className={`space-y-3 ${isLight ? 'text-slate-700' : 'text-white/80'}`}>
                      <li>
                        <strong className={isLight ? 'text-slate-900' : 'text-white'}>Monthly Income</strong> — Higher income allows for a larger car budget.
                      </li>
                      <li>
                        <strong className={isLight ? 'text-slate-900' : 'text-white'}>Down Payment</strong> — Reduces loan amount and monthly payments.
                      </li>
                      <li>
                        <strong className={isLight ? 'text-slate-900' : 'text-white'}>Interest Rate</strong> — Impacts overall loan cost and EMI.
                      </li>
                      <li>
                        <strong className={isLight ? 'text-slate-900' : 'text-white'}>Loan Tenure</strong> — Longer loans lower EMI but increase total interest.
                      </li>
                      <li>
                        <strong className={isLight ? 'text-slate-900' : 'text-white'}>Operational Costs</strong> — Fuel, maintenance, and insurance expenses.
                      </li>
                    </ul>
                  </div>


                  {/* How Car Affordability Calculator Works */}
                  <div id="how-calculator-works" className="p-8">
                    <h2 className={`text-2xl font-bold mb-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      How Car Affordability Calculator Work
                    </h2>
                    <p className={`mb-4 ${isLight ? 'text-slate-700' : 'text-white/80'}`}>
                      This calculator analyzes your financial situation and car costs to determine affordability based on income, loan terms, and ongoing expenses.
                    </p>
                  </div>

                  {/* EMI Calculation Formula */}
                  <div id="emi-formula" className="p-8">
                    <h2 className={`text-2xl font-bold mb-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      EMI Calculation Formula
                    </h2>
                    <p className={`mb-4 ${isLight ? 'text-slate-700' : 'text-white/80'}`}>
                      This calculator use this formula to calculate monthly EMI:
                    </p>
                    <div className={`p-4 rounded-lg font-mono text-center mb-6 ${isLight ? 'bg-slate-100 border border-slate-300' : 'bg-slate-800'}`}>
                      <code className={`text-lg ${isLight ? 'text-slate-800' : 'text-white'}`}>
                        EMI=P*r*(1+r)^n/((1+r)^n-1)
                      </code>
                    </div>
                    <div className={isLight ? 'text-slate-700' : 'text-white/80'}>
                      <p className={`font-semibold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>Where:</p>
                      <ol className="space-y-2 list-decimal list-inside">
                        <li><strong className={isLight ? 'text-slate-900' : 'text-white'}>EMI</strong> = Equated Monthly Instalment (monthly loan payment)</li>
                        <li><strong className={isLight ? 'text-slate-900' : 'text-white'}>P</strong> = Loan Principal Amount (total loan borrowed)</li>
                        <li><strong className={isLight ? 'text-slate-900' : 'text-white'}>r</strong> = Monthly Interest Rate (Annual interest rate ÷ 12 ÷ 100)</li>
                        <li><strong className={isLight ? 'text-slate-900' : 'text-white'}>n</strong> = Loan Tenure (total number of months)</li>
                      </ol>
                    </div>
                  </div>

                  {/* Tips for Car Affordability */}
                  <div id="tips-calculator" className="p-8">
                    <h2 className={`text-2xl font-bold mb-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Tips for Car Affordability
                    </h2>
                    <ul className={`space-y-3 ${isLight ? 'text-slate-700' : 'text-white/80'}`}>
                      <li>
                        <strong className={isLight ? 'text-slate-900' : 'text-white'}>Include All Expenses:</strong> Don&apos;t overlook insurance, fuel, and maintenance.
                      </li>
                      <li>
                        <strong className={isLight ? 'text-slate-900' : 'text-white'}>Adjust Loan Terms:</strong> Compare different tenures for optimal EMI.
                      </li>
                      <li>
                        <strong className={isLight ? 'text-slate-900' : 'text-white'}>Check Your Credit Score:</strong> A good score helps secure better interest rates.
                      </li>
                      <li>
                        <strong className={isLight ? 'text-slate-900' : 'text-white'}>Keep a Financial Cushion:</strong> Avoid maxing out your affordability range to stay financially flexible.
                      </li>
                    </ul>
                  </div>

                </main>
              </div>
            </div>
          </div>
        </section>

        {/* Educational Summary Section */}
        <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-lg mt-12"></div>}>
          <EducationalSummary carData={carData} />
        </Suspense>

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

        {/* FAQ Section */}
        <section className="relative z-10 mt-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>}>
              <FAQ title="Frequently Asked Questions" faqs={carCalculatorFAQs} />
            </Suspense>
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

        {/* Final Mobile Ad - 320x50 Static */}
        <section className="relative z-10 mt-8 block md:hidden">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <EnhancedAdSpace 
                width="320px" 
                height="50px" 
                label="320 x 50 Mobile Banner Ad"
              />
            </div>
          </div>
        </section>
      </main>
    )
}