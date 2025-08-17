'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CarData } from '@/app/page'
import { TrendingUp, Clock, Percent } from 'lucide-react'
// Theme context removed - using Material-UI
// Theme utils removed - using Material-UI

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

interface LoanEMIDetailsPanelProps {
  carData: CarData
  hoveredIndex?: number | null
  onHoverChange?: (index: number | null) => void
}

export default function LoanEMIDetailsPanel({ carData, hoveredIndex, onHoverChange }: LoanEMIDetailsPanelProps) {
  const [durationToggle, setDurationToggle] = useState<'months' | 'years'>('months')
  const [paymentToggle, setPaymentToggle] = useState<'1year' | 'fullloan'>('fullloan')
  const { theme, isLight } = useTheme()
  const themeStyles = getThemeStyles(theme)
  
  const calculateEMI = (principal: number, rate: number, years: number) => {
    if (principal <= 0 || rate <= 0 || years <= 0) return 0
    const monthlyRate = rate / (12 * 100)
    const months = years * 12
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
    return isNaN(emi) ? 0 : emi
  }

  const loanAmount = Math.max(0, carData.carPrice - carData.downPayment)
  const emi = carData.tenure > 0 ? calculateEMI(loanAmount, carData.interestRate, carData.tenure) : 0
  const totalInterest = carData.tenure > 0 && emi > 0 ? (emi * carData.tenure * 12) - loanAmount : 0
  
  // Calculate payment based on toggle
  const calculateTotalPayment = () => {
    if (paymentToggle === '1year') {
      return emi * 12 // Just 1 year of payments
    } else {
      return loanAmount + totalInterest // Full loan payment
    }
  }
  
  const totalPayment = calculateTotalPayment()
  
  // Calculate annual costs for legend breakdown
  const annualEMI = emi * 12
  const fuelEfficiency = 15 // km per liter
  const monthlyFuelCostFromKm = carData.kmPerMonth > 0 && carData.fuelCostPerLiter > 0 
    ? (carData.kmPerMonth / fuelEfficiency) * carData.fuelCostPerLiter 
    : 0
  const monthlyFuelCostFromInput = carData.monthlyFuelExpense || 0
  const monthlyFuelCost = monthlyFuelCostFromInput > 0 ? monthlyFuelCostFromInput : monthlyFuelCostFromKm
  const annualFuelCost = monthlyFuelCost * 12
  const monthlyParkingFee = carData.parkingFee || 0
  const annualParkingCost = monthlyParkingFee * 12
  const annualInsurance = carData.insuranceAndMaintenance || 0
  const annualMaintenanceCost = carData.maintenanceCostPerYear || 0

  // Chart data for legend
  const getChartData = () => {
    return [
      {
        name: 'EMI',
        value: Number(annualEMI) || 0,
        color: '#10B981', // emerald-500
        percentage: 0,
        description: 'Annual EMI payments'
      },
      {
        name: 'Fuel',
        value: Number(annualFuelCost) || 0,
        color: '#EF4444', // red-500
        percentage: 0,
        description: 'Annual fuel cost'
      },
      {
        name: 'Parking',
        value: Number(annualParkingCost) || 0,
        color: '#3B82F6', // blue-500
        percentage: 0,
        description: 'Annual parking cost'
      },
      {
        name: 'Insurance',
        value: Number(annualInsurance) || 0,
        color: '#8B5CF6', // violet-500
        percentage: 0,
        description: 'Annual insurance cost'
      },
      {
        name: 'Maintenance Cost',
        value: Number(annualMaintenanceCost) || 0,
        color: '#F59E0B', // amber-500
        percentage: 0,
        description: 'Annual maintenance cost'
      }
    ].filter(item => item.value > 0 && isFinite(item.value))
  }

  const chartData = getChartData()
  const totalCost = chartData.reduce((sum, item) => sum + (item.value || 0), 0)
  
  // Calculate percentages
  chartData.forEach(item => {
    item.percentage = totalCost > 0 && item.value > 0 ? (item.value / totalCost) * 100 : 0
  })
  
  const formatCurrency = (value: number) => {
    if (isNaN(value) || !isFinite(value) || value < 0) return '₹0'
    return `₹${Math.round(value).toLocaleString('en-IN')}`
  }
  
  const formatDuration = () => {
    if (carData.tenure === 0) return '--'
    return durationToggle === 'months' ? `${carData.tenure * 12} months` : `${carData.tenure} years`
  }

  const getLastEMIDate = () => {
    if (carData.tenure <= 0) return '--'
    const today = new Date()
    const lastEMIDate = new Date(today.getFullYear(), today.getMonth() + (carData.tenure * 12), today.getDate())
    return lastEMIDate.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  // Always render with empty values when data is not available
  const hasData = carData.carPrice > 0 && carData.tenure > 0

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Total Payment as Main Heading */}
      <div className="mb-4">
        <div className="text-center mb-6">
          {/* Row 1: Title */}
          <h3 className={`text-2xl font-bold mb-3 ${isLight ? 'text-slate-900' : ''}`} style={{
            color: isLight ? '' : 'var(--md-primary)'
          }}>
            Total Payment
          </h3>
          
          {/* Row 2: Amount (highlighted) */}
          <div className={`text-4xl font-bold mb-3 text-green-400`} style={{
            textShadow: '0 2px 8px rgba(74, 222, 128, 0.3)'
          }}>
            {hasData ? formatCurrency(totalPayment) : '₹--'}
          </div>
          
          {/* Row 3: Over x years with toggle */}
          <div className="flex items-center justify-center space-x-3 mb-4">
            <span className={`text-lg ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
              Over
            </span>
            {hasData && (
              <div className="flex bg-slate-700/50 rounded-lg p-1">
                <button
                  onClick={() => setPaymentToggle('1year')}
                  className={`text-sm px-3 py-1 rounded-md transition-all duration-200 font-bold ${
                    paymentToggle === '1year' 
                      ? 'bg-cyan-400 text-slate-800 shadow-sm' 
                      : 'text-gray-300 hover:bg-slate-600/50'
                  }`}
                >
                  1 Year
                </button>
                <button
                  onClick={() => setPaymentToggle('fullloan')}
                  className={`text-sm px-3 py-1 rounded-md transition-all duration-200 font-bold ${
                    paymentToggle === 'fullloan' 
                      ? 'bg-cyan-400 text-slate-800 shadow-sm' 
                      : 'text-gray-300 hover:bg-slate-600/50'
                  }`}
                >
                  {carData.tenure} Years
                </button>
              </div>
            )}
          </div>
          
        </div>
      </div>


      {/* All Details Section */}
      <div className={`p-2 rounded-lg ${themeClass('bg-slate-50/30', 'bg-white/5', isLight)}`}>
        <div className="grid grid-cols-1 gap-2">

          {/* Loan Completion Date */}
          <div className="p-1.5 rounded-lg" style={{backgroundColor: isLight ? '#f8fafc' : '#123458'}}>
            <div className="text-center">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center mx-auto mb-1 ${themeClass('bg-slate-300/50', 'bg-slate-500/20', isLight)}`}>
                <Clock size={10} className={themeClass('text-slate-600', 'text-slate-300', isLight)}/>
              </div>
              <div className={`font-medium text-xs ${themeClass('text-slate-700', 'text-slate-100', isLight)}`}>Completion Date</div>
              <div className={`text-xs font-bold mt-0.5 ${themeClass('text-slate-800', 'text-slate-100', isLight)}`}>
                {hasData ? getLastEMIDate() : '--'}
              </div>
            </div>
          </div>

          {/* Loan Period */}
          <div className="p-1.5 rounded-lg" style={{backgroundColor: isLight ? '#f0f9ff' : '#123458'}}>
            <div className="text-center">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center mx-auto mb-1 ${themeClass('bg-blue-200/50', 'bg-cyan-500/20', isLight)}`}>
                <Clock size={10} className={themeClass('text-blue-600', 'text-cyan-300', isLight)}/>
              </div>
              <div className={`font-medium text-xs ${themeClass('text-blue-700', 'text-cyan-100', isLight)}`}>Loan Period</div>
              <div className="flex items-center justify-center space-x-1 mt-0.5">
                <div className={`text-xs font-bold ${themeClass('text-blue-800', 'text-cyan-100', isLight)}`}>
                  {hasData ? (durationToggle === 'months' ? `${carData.tenure * 12}m` : `${carData.tenure}y`) : '--'}
                </div>
                {hasData && (
                  <div className="flex bg-slate-700/50 rounded-full p-0.5">
                    <button
                      onClick={() => setDurationToggle('years')}
                      className={`text-xs px-1 py-0.5 rounded-full transition-all duration-200 font-bold ${
                        durationToggle === 'years' 
                          ? 'bg-cyan-400 text-slate-800 shadow-sm' 
                          : 'text-gray-300 hover:bg-slate-600/50'
                      }`}
                    >
                      Y
                    </button>
                    <button
                      onClick={() => setDurationToggle('months')}
                      className={`text-xs px-1 py-0.5 rounded-full transition-all duration-200 font-bold ${
                        durationToggle === 'months' 
                          ? 'bg-cyan-400 text-slate-800 shadow-sm' 
                          : 'text-gray-300 hover:bg-slate-600/50'
                      }`}
                    >
                      M
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Interest Rate */}
          <div className="p-1.5 rounded-lg" style={{backgroundColor: isLight ? '#fef2f2' : '#123458'}}>
            <div className="text-center">
              <div className="w-4 h-4 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-1">
                <Percent size={10} className="text-red-300"/>
              </div>
              <div className="text-red-100 font-medium text-xs">Interest Rate</div>
              <div className="text-xs font-bold text-red-100 mt-0.5">
                {hasData ? `${carData.interestRate}%` : '--%'}
              </div>
            </div>
          </div>
        </div>
      </div>


    </motion.div>
  )
}