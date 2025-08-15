'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { CarData } from '@/app/page'
import { motion } from 'framer-motion'
import { useState } from 'react'

interface CostDistributionChartProps {
  carData: CarData
}

interface ChartDataItem {
  name: string
  value: number
  color: string
  percentage: number
  description: string
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{
    payload: ChartDataItem
  }>
}

interface LegendProps {
  payload?: Array<{
    value: string
    color: string
    payload: ChartDataItem
  }>
}

export default function CostDistributionChart({ carData }: CostDistributionChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [showOneYear, setShowOneYear] = useState(false)
  
  try {
    // Ensure carData exists and has default values
    if (!carData) {
      return (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-4">Cost Breakdown</h3>
            <p className="text-white/60">No data available</p>
          </div>
        </div>
      )
    }
    
    const safeCarData = {
    ...carData,
    carPrice: carData.carPrice || 0,
    downPayment: carData.downPayment || 0,
    interestRate: carData.interestRate || 8,
    tenure: carData.tenure || 0,
    processingFee: carData.processingFee || 0,
    kmPerMonth: carData.kmPerMonth || 0,
    fuelCostPerLiter: carData.fuelCostPerLiter || 0,
    monthlyIncome: carData.monthlyIncome || 0,
    insuranceAndMaintenance: carData.insuranceAndMaintenance || 0,
    monthlySavings: carData.monthlySavings || 0,
    includeFuelInAffordability: carData.includeFuelInAffordability || false,
    monthlyFuelExpense: carData.monthlyFuelExpense || 0
  }
  
  const calculateEMI = (principal: number, rate: number, years: number) => {
    try {
      if (principal <= 0 || rate <= 0 || years <= 0) return 0
      const monthlyRate = rate / (12 * 100)
      const months = years * 12
      const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
      return isNaN(emi) || !isFinite(emi) ? 0 : emi
    } catch (error) {
      console.error('Error calculating EMI:', error)
      return 0
    }
  }

  const loanAmount = Math.max(0, safeCarData.carPrice - safeCarData.downPayment)
  const emi = safeCarData.tenure > 0 ? calculateEMI(loanAmount, safeCarData.interestRate, safeCarData.tenure) : 0
  const totalInterest = safeCarData.tenure > 0 && emi > 0 ? (emi * safeCarData.tenure * 12) - loanAmount : 0
  
  // Calculate monthly fuel cost consistently with other components
  const fuelEfficiency = 15 // km per liter, consistent with ResultsDisplayV2
  const monthlyFuelCostFromKm = safeCarData.kmPerMonth > 0 && safeCarData.fuelCostPerLiter > 0 
    ? (safeCarData.kmPerMonth / fuelEfficiency) * safeCarData.fuelCostPerLiter 
    : 0
  const monthlyFuelCostFromInput = safeCarData.monthlyFuelExpense || 0
  const monthlyFuelCost = monthlyFuelCostFromInput > 0 ? monthlyFuelCostFromInput : monthlyFuelCostFromKm
  
  // Calculate total costs based on selected period
  const yearsToShow = showOneYear ? 1 : safeCarData.tenure
  const totalFuelCost = yearsToShow > 0 ? monthlyFuelCost * yearsToShow * 12 : 0
  const insuranceAndMaintenance = safeCarData.insuranceAndMaintenance || 0
  const processingFee = safeCarData.processingFee || 0

  // Calculate principal and interest breakdown for both views
  const calculateLoanBreakdown = () => {
    if (showOneYear) {
      // For 1 year view, calculate actual principal and interest for first year
      const monthlyInterestRate = safeCarData.interestRate / (12 * 100)
      let remainingPrincipal = loanAmount
      let yearlyPrincipal = 0
      let yearlyInterest = 0
      
      for (let month = 1; month <= 12; month++) {
        const monthlyInterest = remainingPrincipal * monthlyInterestRate
        const monthlyPrincipal = emi - monthlyInterest
        yearlyPrincipal += monthlyPrincipal
        yearlyInterest += monthlyInterest
        remainingPrincipal -= monthlyPrincipal
      }
      
      return {
        principal: yearlyPrincipal,
        interest: yearlyInterest,
        totalEMI: emi * 12
      }
    } else {
      // Full tenure view
      return {
        principal: loanAmount,
        interest: totalInterest,
        totalEMI: emi * safeCarData.tenure * 12
      }
    }
  }
  
  const loanBreakdown = calculateLoanBreakdown()

  // Calculate data for donut chart - Always include all filled inputs
  const getChartData = () => {
    try {
      const chartItems = []
      
      // Always show principal amount (for both views)
      if (loanBreakdown.principal > 0) {
        chartItems.push({
          name: showOneYear ? 'Principal (1Y)' : 'Principal Amount',
          value: Number(loanBreakdown.principal) || 0,
          color: '#10B981', // emerald-500
          percentage: 0,
          description: showOneYear 
            ? 'Principal payment in first year' 
            : 'Total loan amount financed'
        })
      }
      
      // Always show interest cost (for both views)
      if (loanBreakdown.interest > 0) {
        chartItems.push({
          name: showOneYear ? 'Interest (1Y)' : 'Interest Cost',
          value: Number(loanBreakdown.interest) || 0,
          color: '#F59E0B', // amber-500
          percentage: 0,
          description: showOneYear 
            ? 'Interest payment in first year' 
            : 'Total interest over loan tenure'
        })
      }
      
      // Always show down payment (applies to both views)
      if (safeCarData.downPayment > 0) {
        chartItems.push({
          name: 'Down Payment',
          value: Number(safeCarData.downPayment) || 0,
          color: '#3B82F6', // blue-500
          percentage: 0,
          description: 'Initial payment made upfront'
        })
      }
      
      // Show fuel cost if calculated
      if (totalFuelCost > 0) {
        chartItems.push({
          name: showOneYear ? 'Fuel Cost (1Y)' : 'Fuel Cost',
          value: Number(totalFuelCost) || 0,
          color: '#EF4444', // red-500
          percentage: 0,
          description: showOneYear 
            ? 'Estimated fuel cost for 1 year' 
            : `Total fuel cost over ${safeCarData.tenure || 0} years`
        })
      }
      
      // Show insurance & maintenance if provided
      if (insuranceAndMaintenance > 0) {
        chartItems.push({
          name: 'Insurance & Others',
          value: Number(insuranceAndMaintenance) || 0,
          color: '#8B5CF6', // violet-500
          percentage: 0,
          description: showOneYear 
            ? 'Annual insurance & maintenance' 
            : 'Total insurance & maintenance costs'
        })
      }
      
      // Show processing fee if provided
      if (processingFee > 0) {
        chartItems.push({
          name: 'Processing Fee',
          value: Number(processingFee) || 0,
          color: '#F97316', // orange-500
          percentage: 0,
          description: 'One-time loan processing charges'
        })
      }
      
      // Show monthly income if provided (for reference)
      if (safeCarData.monthlyIncome > 0 && showOneYear) {
        const yearlyIncome = safeCarData.monthlyIncome * 12
        chartItems.push({
          name: 'Annual Income',
          value: Number(yearlyIncome) || 0,
          color: '#06B6D4', // cyan-500
          percentage: 0,
          description: 'Total annual income for reference'
        })
      }
      
      // Show monthly savings if provided (for reference)
      if (safeCarData.monthlySavings > 0) {
        const savingsAmount = showOneYear 
          ? safeCarData.monthlySavings * 12 
          : safeCarData.monthlySavings * 12 * safeCarData.tenure
        chartItems.push({
          name: showOneYear ? 'Annual Savings' : 'Total Savings',
          value: Number(savingsAmount) || 0,
          color: '#84CC16', // lime-500
          percentage: 0,
          description: showOneYear 
            ? 'Potential annual savings' 
            : `Total savings over ${safeCarData.tenure} years`
        })
      }
      
      return chartItems.filter(item => item.value > 0 && isFinite(item.value))
    } catch (error) {
      console.error('Error generating chart data:', error)
      return []
    }
  }

  const chartData = getChartData()

  const totalCost = chartData.reduce((sum, item) => sum + (item.value || 0), 0)
  
  // Calculate percentages safely
  chartData.forEach(item => {
    item.percentage = totalCost > 0 && item.value > 0 ? (item.value / totalCost) * 100 : 0
  })

  const formatCurrency = (value: number) => {
    if (isNaN(value) || !isFinite(value) || value < 0) return '₹0'
    return `₹${Math.round(value).toLocaleString('en-IN')}`
  }

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload
      if (!data) return null
      
      return (
        <div className="bg-black/95 backdrop-blur-xl border border-white/30 rounded-lg p-3 shadow-2xl max-w-xs">
          <div className="flex items-center space-x-2 mb-1">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: data.color || '#fff' }}
            />
            <p className="text-white font-semibold text-sm">{data.name || 'Unknown'}</p>
          </div>
          <p className="text-white/90 text-lg font-bold mb-1">{formatCurrency(data.value || 0)}</p>
          <p className="text-white/70 text-xs mb-1">{(data.percentage || 0).toFixed(1)}% of total</p>
          <p className="text-white/60 text-xs">{data.description || ''}</p>
        </div>
      )
    }
    return null
  }

  const CustomLegend = ({ payload }: LegendProps) => {
    if (!payload || !Array.isArray(payload)) return null
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
        {payload.map((entry, index: number) => {
          const safeEntry = entry || {}
          const safePayload = safeEntry.payload || {}
          
          return (
            <div key={`legend-${index}`} className="flex items-center justify-between bg-white/5 rounded-lg p-2 border border-white/10">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: safeEntry.color || '#fff' }}
                />
                <span className="text-white/80 text-sm font-medium">{safeEntry.value || 'Unknown'}</span>
              </div>
              <div className="text-right">
                <div className="text-white font-bold text-sm">
                  {formatCurrency(safePayload.value || 0)}
                </div>
                <div className="text-white/60 text-xs">
                  {(safePayload.percentage || 0).toFixed(1)}%
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const hasValidData = chartData.length > 0 && totalCost > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl"
    >
      <div className="text-center mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Cost Breakdown</h3>
          
          {/* Toggle Button */}
          <div className="flex items-center bg-white/10 rounded-xl p-1 border border-white/20">
            <button
              onClick={() => setShowOneYear(false)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                !showOneYear 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {safeCarData.tenure}Y
            </button>
            <button
              onClick={() => setShowOneYear(true)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                showOneYear 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              1Y
            </button>
          </div>
        </div>
        
        {hasValidData && (
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <p className="text-white/70 font-medium text-sm mb-2">
              Total Cost of Ownership
            </p>
            
            <div className="text-3xl font-bold text-white mb-2">
              {formatCurrency(totalCost)}
            </div>
            
            <p className="text-white/60 text-sm">
              Over {showOneYear ? '1 year' : `${safeCarData.tenure} years`}
            </p>
          </div>
        )}
      </div>

      {hasValidData ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="h-80 mb-4 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                  onMouseEnter={(_, index) => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {chartData.map((entry, index) => {
                    const isHovered = hoveredIndex === index
                    const isOtherHovered = hoveredIndex !== null && hoveredIndex !== index
                    
                    return (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        stroke={isHovered ? '#ffffff' : entry.color}
                        strokeWidth={isHovered ? 3 : 2}
                        style={{
                          filter: isHovered 
                            ? 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3)) brightness(1.1)' 
                            : isOtherHovered 
                              ? 'brightness(0.7) opacity(0.6)' 
                              : 'none',
                          transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                          transformOrigin: 'center',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          cursor: 'pointer'
                        }}
                      />
                    )
                  })}
                </Pie>
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={false}
                  wrapperStyle={{ 
                    outline: 'none',
                    pointerEvents: 'none'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
            {chartData.map((entry, index) => {
              const isHovered = hoveredIndex === index
              const isOtherHovered = hoveredIndex !== null && hoveredIndex !== index
              
              return (
                <motion.div 
                  key={`legend-${index}`} 
                  className={`flex items-center justify-between rounded-lg p-2 border cursor-pointer transition-all duration-300 ${
                    isHovered 
                      ? 'bg-white/15 border-white/30 shadow-lg' 
                      : isOtherHovered 
                        ? 'bg-white/3 border-white/5 opacity-60' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-2">
                    <motion.div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                      animate={{
                        scale: isHovered ? 1.2 : 1,
                        boxShadow: isHovered ? `0 0 8px ${entry.color}80` : 'none'
                      }}
                      transition={{ duration: 0.2 }}
                    />
                    <span className={`text-sm font-medium transition-colors duration-200 ${
                      isHovered ? 'text-white' : 'text-white/80'
                    }`}>
                      {entry.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold text-sm transition-colors duration-200 ${
                      isHovered ? 'text-white' : 'text-white/90'
                    }`}>
                      {formatCurrency(entry.value)}
                    </div>
                    <div className={`text-xs transition-colors duration-200 ${
                      isHovered ? 'text-white/80' : 'text-white/60'
                    }`}>
                      {entry.percentage.toFixed(1)}%
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h4 className="text-white/60 font-medium mb-2">No Data Available</h4>
          <p className="text-white/40 text-sm max-w-md mx-auto">
            Complete the car details and financial information above to see your cost distribution
          </p>
        </div>
      )}
    </motion.div>
  )
  } catch (error) {
    console.error('Error in CostDistributionChart:', error)
    return (
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-4">Cost Breakdown</h3>
          <p className="text-white/60">Unable to load chart. Please try again.</p>
        </div>
      </div>
    )
  }
}