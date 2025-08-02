'use client'

import { motion } from 'framer-motion'
import { Car, ArrowRight } from 'lucide-react'
import { CarData } from '@/app/page'

interface CarDetailsFormV4Props {
  carData: CarData
  updateCarData: (updates: Partial<CarData>) => void
  onNext: () => void
}

export default function CarDetailsFormV4({
  carData,
  updateCarData,
  onNext
}: CarDetailsFormV4Props) {
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto bg-blue-600 rounded-2xl flex items-center justify-center mb-4">
          <Car className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900">Car Details</h2>
        <p className="text-gray-600">Enter your car information to get started</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Car Price */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Car Price
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
            <input
              type="number"
              value="1200000"
              className="w-full pl-8 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter car price"
              readOnly
            />
          </div>
          <p className="text-xs text-gray-500">₹12,00,000 (dummy value)</p>
        </div>

        {/* Down Payment */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Down Payment
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
            <input
              type="number"
              value="240000"
              className="w-full pl-8 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter down payment"
              readOnly
            />
          </div>
          <p className="text-xs text-gray-500">₹2,40,000 (20% of car price)</p>
        </div>

        {/* Interest Rate */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Interest Rate (Annual)
          </label>
          <div className="relative">
            <input
              type="number"
              value="8.5"
              step="0.1"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter interest rate"
              readOnly
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">%</span>
          </div>
          <p className="text-xs text-gray-500">8.5% per annum (typical rate)</p>
        </div>

        {/* Loan Tenure */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Loan Tenure
          </label>
          <div className="relative">
            <input
              type="number"
              value="5"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter tenure"
              readOnly
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">years</span>
          </div>
          <p className="text-xs text-gray-500">5 years (60 months)</p>
        </div>

        {/* Monthly Income */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Monthly Income
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
            <input
              type="number"
              value="75000"
              className="w-full pl-8 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter monthly income"
              readOnly
            />
          </div>
          <p className="text-xs text-gray-500">₹75,000 per month</p>
        </div>

        {/* Quick Stats Card */}
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <h3 className="font-medium text-gray-900">Quick Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Loan Amount</p>
              <p className="text-lg font-semibold text-gray-900">₹9,60,000</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Est. EMI</p>
              <p className="text-lg font-semibold text-blue-600">₹19,457</p>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
        >
          <span>Continue</span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </form>
    </div>
  )
}