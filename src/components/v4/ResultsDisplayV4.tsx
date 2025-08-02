'use client'

import { motion } from 'framer-motion'
import { CheckCircle, ArrowLeft, RotateCcw, Download, Share2, TrendingUp } from 'lucide-react'
import { CarData } from '@/app/page'

interface ResultsDisplayV4Props {
  carData: CarData
  onBack: () => void
  onRestart: () => void
}

export default function ResultsDisplayV4({
  carData,
  onBack,
  onRestart
}: ResultsDisplayV4Props) {

  return (
    <div className="space-y-8">
      {/* Success Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="w-20 h-20 mx-auto bg-green-500 rounded-full flex items-center justify-center"
        >
          <CheckCircle className="w-10 h-10 text-white" />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900">Your Car Finance Plan</h2>
        <p className="text-gray-600">Here's your complete financial breakdown</p>
      </div>

      {/* Main Results Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* EMI Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="space-y-2">
            <p className="text-blue-100 text-sm font-medium">Monthly EMI</p>
            <p className="text-4xl font-bold">₹19,457</p>
            <p className="text-blue-100 text-sm">for 60 months</p>
          </div>
        </div>

        {/* Total Amount Card */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="space-y-2">
            <p className="text-purple-100 text-sm font-medium">Total Amount Payable</p>
            <p className="text-4xl font-bold">₹11,67,420</p>
            <p className="text-purple-100 text-sm">including interest</p>
          </div>
        </div>

        {/* Interest Card */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
          <div className="space-y-2">
            <p className="text-orange-100 text-sm font-medium">Total Interest</p>
            <p className="text-4xl font-bold">₹2,07,420</p>
            <p className="text-orange-100 text-sm">over loan tenure</p>
          </div>
        </div>

        {/* Affordability Card */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="space-y-2">
            <p className="text-green-100 text-sm font-medium">Income Utilization</p>
            <p className="text-4xl font-bold">38%</p>
            <p className="text-green-100 text-sm">of monthly income</p>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="bg-gray-50 rounded-2xl p-6 space-y-6">
        <div className="flex items-center space-x-3">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900">Detailed Breakdown</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Loan Details */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Loan Information</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Car Price</span>
                <span className="font-medium text-gray-900">₹12,00,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Down Payment</span>
                <span className="font-medium text-gray-900">₹2,40,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Loan Amount</span>
                <span className="font-medium text-gray-900">₹9,60,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Processing Fee</span>
                <span className="font-medium text-gray-900">₹15,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Interest Rate</span>
                <span className="font-medium text-gray-900">8.5% p.a.</span>
              </div>
            </div>
          </div>

          {/* Monthly Costs */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Monthly Expenses</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">EMI Payment</span>
                <span className="font-medium text-gray-900">₹19,457</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fuel Cost (1,200 km)</span>
                <span className="font-medium text-gray-900">₹6,800</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Insurance</span>
                <span className="font-medium text-gray-900">₹1,500</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Maintenance</span>
                <span className="font-medium text-gray-900">₹1,000</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">Total Monthly Cost</span>
                  <span className="font-bold text-blue-600">₹28,757</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        {/* Share and Download */}
        <div className="flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Download PDF</span>
          </motion.button>
        </div>

        {/* Navigation */}
        <div className="flex space-x-4">
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </motion.button>
          
          <motion.button
            onClick={onRestart}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-green-600 text-white py-4 px-6 rounded-xl font-medium hover:bg-green-700 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Start Over</span>
          </motion.button>
        </div>
      </div>
    </div>
  )
}