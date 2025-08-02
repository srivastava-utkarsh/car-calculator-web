'use client'

import { motion } from 'framer-motion'
import { CarData } from '@/app/page'
import { ArrowLeft, RotateCcw } from 'lucide-react'

interface ResultsDisplayV3Props {
  carData: CarData
  onBack: () => void
  onRestart: () => void
}

export default function ResultsDisplayV3({ carData, onBack, onRestart }: ResultsDisplayV3Props) {
  const calculateEMI = (principal: number, rate: number, years: number) => {
    if (principal <= 0 || rate <= 0 || years <= 0) return 0
    const monthlyRate = rate / (12 * 100)
    const months = years * 12
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
           (Math.pow(1 + monthlyRate, months) - 1)
  }

  // Calculate values
  const loanAmount = carData.carPrice - carData.downPayment
  const emi = calculateEMI(loanAmount, carData.interestRate, carData.tenure)
  const totalInterest = (emi * carData.tenure * 12) - loanAmount
  const totalPayment = emi * carData.tenure * 12
  
  // Monthly running cost calculation (assuming 15 km/liter average)
  const fuelEfficiency = 15
  const monthlyFuelCost = carData.kmPerMonth > 0 && carData.fuelCostPerLiter > 0 
    ? (carData.kmPerMonth / fuelEfficiency) * carData.fuelCostPerLiter 
    : 0
  
  // Total monthly cost
  const totalMonthlyCost = emi + monthlyFuelCost
  
  // Affordability checks
  const downPaymentPercentage = (carData.downPayment / carData.carPrice) * 100
  const isDownPaymentOk = downPaymentPercentage >= 20
  const isTenureOk = carData.tenure <= 4
  const isAffordable = isDownPaymentOk && isTenureOk

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Main EMI Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center bg-white border-4 border-black p-8"
        style={{ boxShadow: '12px 12px 0px 0px #000000' }}
      >
        <h2 className="text-2xl sm:text-3xl font-black text-black mb-4 uppercase tracking-tight">
          Your EMI Plan
        </h2>
        
        <div className="bg-yellow-400 border-4 border-black p-8 shadow-neo-lg mb-6">
          <p className="text-black text-lg font-bold mb-2 uppercase tracking-tight">Monthly EMI</p>
          <p className="text-4xl sm:text-6xl font-black text-black mb-2">
            ₹{emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
          <p className="text-black text-lg font-bold uppercase tracking-tight">
            per month for {carData.tenure} years
          </p>
        </div>

        {monthlyFuelCost > 0 && (
          <div className="bg-orange-200 border-4 border-black p-4 shadow-neo">
            <p className="text-black text-sm font-bold uppercase tracking-tight">Total Monthly Cost (with fuel)</p>
            <p className="text-2xl font-black text-black">
              ₹{totalMonthlyCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </p>
          </div>
        )}
      </motion.div>

      {/* Financial Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <div className="neo-card">
          <h4 className="font-black text-black text-sm uppercase tracking-tight mb-2">Total Interest</h4>
          <p className="text-2xl font-black text-red-600">
            ₹{totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
        </div>

        <div className="neo-card">
          <h4 className="font-black text-black text-sm uppercase tracking-tight mb-2">Total Payment</h4>
          <p className="text-2xl font-black text-black">
            ₹{totalPayment.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
        </div>

        <div className="neo-card">
          <h4 className="font-black text-black text-sm uppercase tracking-tight mb-2">Loan Amount</h4>
          <p className="text-2xl font-black text-blue-600">
            ₹{loanAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
        </div>

        <div className="neo-card">
          <h4 className="font-black text-black text-sm uppercase tracking-tight mb-2">Down Payment</h4>
          <p className="text-2xl font-black text-green-600">
            ₹{carData.downPayment.toLocaleString('en-IN')}
          </p>
          <p className="text-black text-xs font-bold">
            {downPaymentPercentage.toFixed(1)}% of car price
          </p>
        </div>
      </motion.div>

      {/* 20/4/10 Rule Check */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white border-4 border-black p-6"
        style={{ boxShadow: '8px 8px 0px 0px #000000' }}
      >
        <h3 className="font-black text-black text-lg uppercase tracking-tight mb-4">20/4/10 Rule Check</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-black font-semibold">20% Down Payment</span>
            <div className="flex items-center space-x-2">
              <span className="text-black font-bold">{downPaymentPercentage.toFixed(1)}%</span>
              <div className={`w-6 h-6 border-2 border-black flex items-center justify-center font-bold ${
                isDownPaymentOk ? 'bg-green-400' : 'bg-red-400'
              }`}>
                {isDownPaymentOk ? '✓' : '✗'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-black font-semibold">Max 4 Year Tenure</span>
            <div className="flex items-center space-x-2">
              <span className="text-black font-bold">{carData.tenure}y</span>
              <div className={`w-6 h-6 border-2 border-black flex items-center justify-center font-bold ${
                isTenureOk ? 'bg-green-400' : 'bg-red-400'
              }`}>
                {isTenureOk ? '✓' : '✗'}
              </div>
            </div>
          </div>
        </div>

        {/* Overall affordability */}
        <div className={`mt-4 p-4 border-4 border-black shadow-neo ${
          isAffordable ? 'bg-green-200' : 'bg-red-200'
        }`}>
          <p className={`font-black uppercase tracking-tight ${
            isAffordable ? 'text-green-800' : 'text-red-800'
          }`}>
            {isAffordable ? '✅ Car is Affordable!' : '⚠️ Car may be too expensive'}
          </p>
          {!isAffordable && (
            <p className="text-red-800 text-sm font-bold mt-1">
              Consider adjusting your budget or loan terms
            </p>
          )}
        </div>
      </motion.div>

      {/* Detailed Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white border-4 border-black p-6"
        style={{ boxShadow: '8px 8px 0px 0px #000000' }}
      >
        <h4 className="font-black text-black text-lg uppercase tracking-tight mb-4">Loan Details</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-black font-semibold">Interest Rate:</span>
            <span className="text-black font-bold">{carData.interestRate}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-black font-semibold">Tenure:</span>
            <span className="text-black font-bold">{carData.tenure} years</span>
          </div>
          <div className="flex justify-between">
            <span className="text-black font-semibold">Total Interest:</span>
            <span className="text-black font-bold">₹{totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
      >
        <button
          onClick={onBack}
          className="flex-1 bg-gray-200 hover:bg-gray-100 text-black py-4 px-6 border-4 border-black font-black text-lg flex items-center justify-center space-x-2 transition-all uppercase tracking-tight"
          style={{ boxShadow: '8px 8px 0px 0px #000000' }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        
        <button
          onClick={onRestart}
          className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-black py-4 px-6 border-4 border-black font-black text-lg flex items-center justify-center space-x-2 transition-all uppercase tracking-tight"
          style={{ boxShadow: '8px 8px 0px 0px #000000' }}
        >
          <RotateCcw className="w-5 h-5" />
          <span>Start Over</span>
        </button>
      </motion.div>
    </div>
  )
}