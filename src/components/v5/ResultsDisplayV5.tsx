'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, RotateCcw, CheckCircle, XCircle, DollarSign, TrendingUp, Calendar, Car, Fuel, ChevronDown, ChevronUp, PiggyBank, Target, Download, Share2 } from 'lucide-react'
import { CarData } from '@/app/page'
import TotalCostDisplayV5 from './TotalCostDisplayV5'

interface ResultsDisplayV5Props {
  carData: CarData
  onBack: () => void
  onRestart: () => void
}

export default function ResultsDisplayV5({ carData, onBack, onRestart }: ResultsDisplayV5Props) {
  const [showOptimization, setShowOptimization] = useState(false)
  const [prepaymentAmount, setPrepaymentAmount] = useState(50000)
  const [prepaymentType, setPrepaymentType] = useState<'reduce-emi' | 'reduce-tenure'>('reduce-emi')

  const calculateEMI = (principal: number, rate: number, years: number) => {
    if (principal <= 0 || rate <= 0 || years <= 0) return 0
    const monthlyRate = rate / (12 * 100)
    const months = years * 12
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
           (Math.pow(1 + monthlyRate, months) - 1)
  }

  const loanAmount = carData.carPrice - carData.downPayment
  const emi = calculateEMI(loanAmount, carData.interestRate, carData.tenure)
  const totalInterest = (emi * carData.tenure * 12) - loanAmount
  const totalPayment = loanAmount + totalInterest
  const hasProcessingFee = carData.processingFee > 0
  const hasFuelData = carData.kmPerMonth > 0 && carData.fuelCostPerLiter > 0
  const hasMonthlyIncome = carData.monthlyIncome > 0
  const fuelEfficiency = 15
  const monthlyFuelCost = hasFuelData ? (carData.kmPerMonth / fuelEfficiency) * carData.fuelCostPerLiter : 0

  const downPaymentPercentage = (carData.downPayment / carData.carPrice) * 100
  const isDownPaymentOk = downPaymentPercentage >= 20
  const isTenureOk = carData.tenure <= 4
  const totalMonthlyExpense = emi + monthlyFuelCost
  const expensePercentage = hasMonthlyIncome ? (totalMonthlyExpense / carData.monthlyIncome) * 100 : 0
  const isExpenseOk = hasMonthlyIncome ? expensePercentage <= 10 : true
  const isAffordable = isDownPaymentOk && isTenureOk && isExpenseOk

  const calculateWithPrepayment = () => {
    const reducedPrincipal = loanAmount - prepaymentAmount
    if (prepaymentType === 'reduce-emi') {
      const newEmi = calculateEMI(reducedPrincipal, carData.interestRate, carData.tenure)
      return { emi: newEmi, tenure: carData.tenure, interestSaved: totalInterest - ((newEmi * carData.tenure * 12) - reducedPrincipal) }
    } else {
      const monthlyRate = carData.interestRate / (12 * 100)
      const newMonths = Math.log((emi) / (emi - reducedPrincipal * monthlyRate)) / Math.log(1 + monthlyRate)
      const newTenure = newMonths / 12
      return { emi: emi, tenure: newTenure, interestSaved: totalInterest - ((emi * newMonths) - reducedPrincipal) }
    }
  }

  const prepaymentResult = calculateWithPrepayment()

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="mr-2" /> Back to Calculator
        </button>
        <div className="flex items-center space-x-2">
          <button onClick={onRestart} className="flex items-center text-gray-600 hover:text-gray-800">
            <RotateCcw className="mr-2" /> Start New
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-800"><Share2 /></button>
          <button className="p-2 text-gray-600 hover:text-gray-800"><Download /></button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3 bg-white p-6 rounded-lg shadow-lg">
          <div className={`flex items-center p-4 rounded-lg mb-6 ${isAffordable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isAffordable ? <CheckCircle size={24} className="mr-3" /> : <XCircle size={24} className="mr-3" />}
            <h2 className="text-xl font-bold">
              {isAffordable ? 'Congratulations! This car looks affordable for you.' : 'Heads up! This car might be a stretch for your budget.'}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center mb-6">
            {/* EMI, Total Interest, Total Payment cards will go here */}
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 text-gray-800">Loan Breakdown</h3>
            {/* Breakdown details will go here */}
          </div>

          <div className="mt-6">
            <button onClick={() => setShowOptimization(!showOptimization)} className="flex justify-between items-center w-full text-left font-bold text-lg text-blue-700">
              Loan Optimization
              {showOptimization ? <ChevronUp /> : <ChevronDown />}
            </button>
            <AnimatePresence>
              {showOptimization && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 overflow-hidden">
                  {/* Optimization form and results will go here */}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <TotalCostDisplayV5 carData={carData} />

      </div>
    </motion.div>
  )
}
