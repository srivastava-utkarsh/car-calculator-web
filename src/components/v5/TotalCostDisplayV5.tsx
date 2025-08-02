'use client'

import { motion } from 'framer-motion'
import { CarData } from '@/app/page'
import { DollarSign, TrendingUp, Car, Fuel, CheckCircle, XCircle, Calendar, BarChart, Target, Info } from 'lucide-react'

interface TotalCostDisplayProps {
  carData: CarData
}

export default function TotalCostDisplayV5({ carData }: TotalCostDisplayProps) {
  const calculateEMI = (principal: number, rate: number, years: number) => {
    if (principal <= 0 || rate <= 0 || years <= 0) return 0
    const monthlyRate = rate / (12 * 100)
    const months = years * 12
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
    return isNaN(emi) ? 0 : emi
  }

  const loanAmount = carData.carPrice - carData.downPayment
  const emi = calculateEMI(loanAmount, carData.interestRate, carData.tenure)
  const totalInterest = (emi * carData.tenure * 12) - loanAmount
  const monthlyFuelCost = carData.kmPerMonth && carData.fuelCostPerLiter ? (carData.kmPerMonth / 15) * carData.fuelCostPerLiter : 0
  const totalMonthlyCost = emi + monthlyFuelCost + (carData.insuranceAndMaintenance || 0)
  const incomeUtilization = carData.monthlyIncome ? (totalMonthlyCost / carData.monthlyIncome) * 100 : 0

  const formatCurrency = (value: number) => `₹${Math.round(value).toLocaleString('en-IN')}`

  return (
    <div className="w-full lg:w-2/5 bg-white p-6 rounded-lg shadow-lg h-full sticky top-10">

      <h4 className="font-semibold text-gray-800 mb-3">Key Metrics</h4>
      <div className="space-y-3">
        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
          <span className="text-sm text-gray-600 flex items-center"><TrendingUp size={16} className="mr-2"/>Loan Amount</span>
          <span className="font-semibold text-gray-800">{formatCurrency(loanAmount)}</span>
        </div>
        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
          <span className="text-sm text-gray-600 flex items-center"><BarChart size={16} className="mr-2"/>Total Interest</span>
          <span className="font-semibold text-gray-800">{formatCurrency(totalInterest)}</span>
        </div>
      </div>

      <div className="bg-gray-800 text-white p-4 rounded-lg mt-6">
        <p className="text-sm text-gray-300">Total Monthly Cost</p>
        <p className="text-2xl font-bold">{formatCurrency(totalMonthlyCost)}</p>
      </div>

      <h4 className="font-semibold text-gray-800 mt-6 mb-2">Affordability</h4>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${Math.min(incomeUtilization, 100)}%` }}></div>
      </div>
      <p className="text-xs text-gray-500 mt-1">Income Utilization: {incomeUtilization.toFixed(1)}%</p>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700 flex items-center">
        <Info size={16} className="mr-2 flex-shrink-0" />
        <span>Your car expenses are looking good!</span>
      </div>
    </div>
  )
}
