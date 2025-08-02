'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Calculator, CreditCard, Fuel } from 'lucide-react'
import { CarData } from '@/app/page'

interface TotalCostDisplayV4Props {
  carData: CarData
}

export default function TotalCostDisplayV4({ carData }: TotalCostDisplayV4Props) {
  
  return (
    <div className="h-full bg-white border-l border-gray-200">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
          </div>
          <p className="text-sm text-gray-600">Real-time calculations based on your inputs</p>
        </div>

        {/* Main EMI Display */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center">
          <div className="space-y-2">
            <p className="text-blue-600 text-sm font-medium">Monthly EMI</p>
            <p className="text-3xl font-bold text-blue-900">₹19,457</p>
            <p className="text-blue-700 text-sm">for 60 months</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Key Metrics</h4>
          
          <div className="space-y-3">
            {/* Loan Amount */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Loan Amount</p>
                  <p className="text-xs text-gray-500">Principal amount</p>
                </div>
              </div>
              <p className="font-semibold text-gray-900">₹9,60,000</p>
            </div>

            {/* Total Interest */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Total Interest</p>
                  <p className="text-xs text-gray-500">Over 5 years</p>
                </div>
              </div>
              <p className="font-semibold text-gray-900">₹2,07,420</p>
            </div>

            {/* Monthly Fuel */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Fuel className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Monthly Fuel</p>
                  <p className="text-xs text-gray-500">1,200 km @ ₹102/L</p>
                </div>
              </div>
              <p className="font-semibold text-gray-900">₹6,800</p>
            </div>
          </div>
        </div>

        {/* Total Monthly Cost */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
          <div className="space-y-3">
            <p className="text-gray-300 text-sm font-medium">Total Monthly Cost</p>
            <p className="text-2xl font-bold">₹28,757</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">EMI</span>
                <span>₹19,457</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Fuel</span>
                <span>₹6,800</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Insurance & Maintenance</span>
                <span>₹2,500</span>
              </div>
            </div>
          </div>
        </div>

        {/* Affordability Indicator */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Affordability</h4>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Income Utilization</span>
              <span className="font-medium text-green-600">38%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '38%' }}></div>
            </div>
            <p className="text-xs text-gray-500">
              Within recommended 40% limit
            </p>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h5 className="font-medium text-blue-900 mb-2">💡 Quick Tip</h5>
          <p className="text-sm text-blue-700">
            Your car expenses are well within the recommended range. Consider setting up automatic EMI payments to avoid any missed payments.
          </p>
        </div>
      </div>
    </div>
  )
}