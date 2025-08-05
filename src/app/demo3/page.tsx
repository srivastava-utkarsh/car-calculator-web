'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Settings } from 'lucide-react'
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
}

export default function Demo3Page() {
  const [showResults, setShowResults] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState('v2')
  const monthlyIncomeInputRef = useRef<HTMLInputElement>(null)
  
  // Layout control states
  const [layoutMode, setLayoutMode] = useState<'grid' | 'flex' | 'percentage'>('grid')
  const [gridCols, setGridCols] = useState(5) // Default grid columns
  const [leftSpan, setLeftSpan] = useState(3) // Left panel span
  const [rightSpan, setRightSpan] = useState(2) // Right panel span
  const [gap, setGap] = useState(8) // Gap between panels
  
  // Percentage-based layout controls
  const [leftPercentage, setLeftPercentage] = useState(30)
  const [rightPercentage, setRightPercentage] = useState(30)
  const [showLayoutControls, setShowLayoutControls] = useState(true)

  // Handle scroll effect for background image
  useEffect(() => {
    const handleScroll = () => {
      const educationBg = document.getElementById('education-bg')
      if (educationBg) {
        const scrollRatio = Math.min(window.scrollY / 400, 1)
        const opacity = Math.max(0, 0.4 - (scrollRatio * 0.4))
        educationBg.style.opacity = opacity.toString()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Dummy car data with realistic values
  const [carData, setCarData] = useState<CarData>({
    carPrice: 800000, // 8 Lakhs
    downPayment: 160000, // 1.6 Lakhs (20%)
    interestRate: 8.5,
    tenure: 4,
    processingFee: 15000,
    kmPerMonth: 1200,
    fuelCostPerLiter: 105,
    monthlyIncome: 60000, // 60k monthly income
    insuranceAndMaintenance: 8000,
    includeFuelInAffordability: true
  })

  const versions = [
    { id: 'v2', name: 'Demo 3 - Layout Experimenter', description: 'Experiment with dynamic layouts' }
  ]

  const updateCarData = (updates: Partial<CarData>) => {
    setCarData(prev => ({ ...prev, ...updates }))
  }

  const hideResultsView = () => setShowResults(false)

  const restart = () => {
    setShowResults(false)
    // Keep dummy data intact for demo purposes
  }

  const handleVersionChange = (versionId: string) => {
    setSelectedVersion(versionId)
    setShowResults(false)
  }

  // Calculate dynamic classes based on layout mode
  const getLayoutClasses = () => {
    const gapClass = gap < 8 ? 'gap-6' : gap > 8 ? 'gap-12' : 'gap-8'
    
    switch (layoutMode) {
      case 'flex':
        return {
          containerClass: `flex flex-col lg:flex-row ${gapClass}`,
          leftPanelClass: `lg:w-[${leftPercentage}%]`,
          rightPanelClass: `lg:w-[${rightPercentage}%]`,
          centerSpace: `lg:flex-1` // Takes remaining space
        }
      case 'percentage':
        const centerPercentage = 100 - leftPercentage - rightPercentage
        return {
          containerClass: `grid grid-cols-1 lg:[grid-template-columns:${leftPercentage}%_${centerPercentage}%_${rightPercentage}%] ${gapClass}`,
          leftPanelClass: '',
          rightPanelClass: '',
          centerSpace: ''
        }
      default: // 'grid'
        return {
          containerClass: `grid lg:grid-cols-${gridCols} ${gapClass} lg:gap-${gap}`,
          leftPanelClass: `lg:col-span-${leftSpan}`,
          rightPanelClass: `lg:col-span-${rightSpan}`,
          centerSpace: ''
        }
    }
  }

  const layoutClasses = getLayoutClasses()
  const centerPercentage = 100 - leftPercentage - rightPercentage

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
              <span className="text-lg font-bold text-white opacity-95">BudgetGear Demo 3</span>
            </div>

            {/* Layout Controls Toggle */}
            <button
              onClick={() => setShowLayoutControls(!showLayoutControls)}
              className="flex items-center space-x-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg px-4 py-2 text-white/80 text-sm cursor-pointer hover:bg-white/10 transition-all"
            >
              <Settings className="w-4 h-4" />
              <span>Layout Controls</span>
            </button>

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

      {/* Layout Controls Panel */}
      <AnimatePresence>
        {showLayoutControls && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/10 p-4"
          >
            <div className="container mx-auto">
              {/* Layout Mode Selector */}
              <div className="mb-4 text-center">
                <div className="inline-flex bg-white/10 rounded-lg p-1">
                  <button
                    onClick={() => setLayoutMode('grid')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      layoutMode === 'grid' ? 'bg-white text-black' : 'text-white hover:bg-white/20'
                    }`}
                  >
                    Grid Layout
                  </button>
                  <button
                    onClick={() => setLayoutMode('flex')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      layoutMode === 'flex' ? 'bg-white text-black' : 'text-white hover:bg-white/20'
                    }`}
                  >
                    Flex Layout
                  </button>
                  <button
                    onClick={() => setLayoutMode('percentage')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      layoutMode === 'percentage' ? 'bg-white text-black' : 'text-white hover:bg-white/20'
                    }`}
                  >
                    Percentage Grid
                  </button>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="mb-4 text-center">
                <div className="text-sm text-white/70 mb-2">Quick Presets:</div>
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => {
                      setLayoutMode('percentage')
                      setLeftPercentage(30)
                      setRightPercentage(30)
                    }}
                    className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 rounded-md text-xs transition-all"
                  >
                    30/40/30 Split
                  </button>
                  <button
                    onClick={() => {
                      setLayoutMode('flex')
                      setLeftPercentage(25)
                      setRightPercentage(25)
                    }}
                    className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-200 rounded-md text-xs transition-all"
                  >
                    25/50/25 Split
                  </button>
                  <button
                    onClick={() => {
                      setLayoutMode('percentage')
                      setLeftPercentage(40)
                      setRightPercentage(20)
                    }}
                    className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 rounded-md text-xs transition-all"
                  >
                    40/40/20 Split
                  </button>
                </div>
              </div>

              {/* Dynamic Controls Based on Layout Mode */}
              {layoutMode === 'grid' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
                {/* Grid Columns */}
                <div>
                  <label className="block text-sm font-medium mb-2">Grid Columns: {gridCols}</label>
                  <input
                    type="range"
                    min="4"
                    max="8"
                    value={gridCols}
                    onChange={(e) => setGridCols(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                {/* Left Panel Span */}
                <div>
                  <label className="block text-sm font-medium mb-2">Left Span: {leftSpan}</label>
                  <input
                    type="range"
                    min="2"
                    max={Math.min(gridCols - 1, 5)}
                    value={leftSpan}
                    onChange={(e) => setLeftSpan(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                {/* Right Panel Span */}
                <div>
                  <label className="block text-sm font-medium mb-2">Right Span: {rightSpan}</label>
                  <input
                    type="range"
                    min="1"
                    max={Math.min(gridCols - leftSpan, 3)}
                    value={rightSpan}
                    onChange={(e) => setRightSpan(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                {/* Gap */}
                <div>
                  <label className="block text-sm font-medium mb-2">Gap: {gap}</label>
                  <input
                    type="range"
                    min="4"
                    max="16"
                    value={gap}
                    onChange={(e) => setGap(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                </div>
              )}

              {/* Flex Layout Controls */}
              {layoutMode === 'flex' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
                  <div>
                    <label className="block text-sm font-medium mb-2">Left Panel: {leftPercentage}%</label>
                    <input
                      type="range"
                      min="20"
                      max="50"
                      value={leftPercentage}
                      onChange={(e) => setLeftPercentage(parseInt(e.target.value))}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Right Panel: {rightPercentage}%</label>
                    <input
                      type="range"
                      min="20"
                      max="50"
                      value={rightPercentage}
                      onChange={(e) => setRightPercentage(parseInt(e.target.value))}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Gap: {gap}</label>
                    <input
                      type="range"
                      min="4"
                      max="16"
                      value={gap}
                      onChange={(e) => setGap(parseInt(e.target.value))}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                </div>
              )}

              {/* Percentage Grid Controls */}
              {layoutMode === 'percentage' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
                  <div>
                    <label className="block text-sm font-medium mb-2">Left Panel: {leftPercentage}%</label>
                    <input
                      type="range"
                      min="20"
                      max="50"
                      value={leftPercentage}
                      onChange={(e) => setLeftPercentage(parseInt(e.target.value))}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Right Panel: {rightPercentage}%</label>
                    <input
                      type="range"
                      min="20"
                      max="50"
                      value={rightPercentage}
                      onChange={(e) => setRightPercentage(parseInt(e.target.value))}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Gap: {gap}</label>
                    <input
                      type="range"
                      min="4"
                      max="16"
                      value={gap}
                      onChange={(e) => setGap(parseInt(e.target.value))}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                </div>
              )}
              
              {/* Layout Info */}
              <div className="mt-3 text-center text-sm text-white/70">
                {layoutMode === 'grid' && (
                  <>Current Layout: {gridCols} columns | Left: {leftSpan}/{gridCols} | Right: {rightSpan}/{gridCols} | Gap: {gap} | Space: {gridCols - leftSpan - rightSpan}/{gridCols}</>
                )}
                {(layoutMode === 'flex' || layoutMode === 'percentage') && (
                  <>Current Layout: Left {leftPercentage}% | Center {centerPercentage}% | Right {rightPercentage}% | Gap: {gap}</>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Immersive Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-black to-gray-900/30 pointer-events-none"></div>
      
      {/* Background Education Image */}
      <div className="absolute top-0 left-0 right-0 z-0 pointer-events-none" style={{ height: '60vh' }}>
        <div 
          id="education-bg"
          className="absolute inset-0 bg-[url('/education_blk.png')] bg-cover bg-center bg-no-repeat opacity-40 transition-opacity duration-500 ease-out"
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black"></div>
      </div>

      {/* Main Content Section */}
      <section className={`relative z-10 ${showLayoutControls ? 'pt-32' : 'pt-16'} transition-all duration-300`} id="calculator">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="sr-only">Car Finance Calculator Tool - Demo 3</h2>
            
            {/* Dynamic Content Grid */}
            <div className={layoutClasses.containerClass}>
              
              {/* Main Form Section */}
              <div className={layoutClasses.leftPanelClass}>
                <AnimatePresence mode="wait">
                  {!showResults ? (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sm:p-8 lg:p-10 shadow-2xl"
                    >
                      <div className="space-y-8">
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
                      className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sm:p-8 lg:p-10 shadow-2xl"
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

              {/* Center Space (for percentage grid) */}
              {layoutMode === 'percentage' && (
                <div className="hidden lg:block"></div>
              )}

              {/* Live Preview Panel */}
              <aside className={layoutClasses.rightPanelClass}>
                <div className="lg:sticky lg:top-8">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 lg:p-8 shadow-2xl"
                  >
                    <h3 className="sr-only">Loan Calculation Results</h3>
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

      {/* Custom Slider Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </main>
  )
}