'use client'

import { motion } from 'framer-motion'
import { Calculator, ArrowRight, ArrowLeft } from 'lucide-react'
import { CarData } from '@/app/page'

interface FinancialFormV4Props {
  carData: CarData
  updateCarData: (updates: Partial<CarData>) => void
  onNext: () => void
  onBack: () => void
}

export default function FinancialFormV4({
  carData,
  updateCarData,
  onNext,
  onBack
}: FinancialFormV4Props) {
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto bg-blue-600 rounded-2xl flex items-center justify-center mb-4">
          <Calculator className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900">Financial Details</h2>
        <p className="text-gray-600">Additional costs and usage information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Processing Fee */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Processing Fee
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
            <input
              type="number"
              value="15000"
              className="w-full pl-8 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter processing fee"
              readOnly
            />
          </div>
          <p className="text-xs text-gray-500">₹15,000 (bank processing charges)</p>
        </div>

        {/* Monthly Distance */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Monthly Distance
          </label>
          <div className="relative">
            <input
              type="number"
              value="1200"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter monthly distance"
              readOnly
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">km</span>
          </div>
          <p className="text-xs text-gray-500">1,200 km per month (average usage)</p>
        </div>

        {/* Fuel Cost */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Fuel Cost per Liter
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
            <input
              type="number"
              value="102"
              step="0.1"
              className="w-full pl-8 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter fuel cost"
              readOnly
            />
          </div>
          <p className="text-xs text-gray-500">₹102 per liter (current market rate)</p>
        </div>

        {/* Cost Breakdown Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 space-y-4">
          <h3 className="font-medium text-gray-900">Monthly Cost Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">EMI Payment</span>
              <span className="font-semibold text-gray-900">₹19,457</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Est. Fuel Cost</span>
              <span className="font-semibold text-gray-900">₹6,800</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Insurance & Maintenance</span>
              <span className="font-semibold text-gray-900">₹2,500</span>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between">
                <span className="font-medium text-gray-900">Total Monthly Cost</span>
                <span className="font-bold text-blue-600 text-lg">₹28,757</span>
              </div>
            </div>
          </div>
        </div>

        {/* Affordability Check */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="font-medium text-green-800">Affordability Check</span>
          </div>
          <p className="text-green-700 mt-2 text-sm">
            Your car costs are 38% of your monthly income. This is within the recommended 40% limit.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <motion.button
            type="button"
            onClick={onBack}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </motion.button>
          
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
          >
            <span>View Results</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </form>
    </div>
  )
}