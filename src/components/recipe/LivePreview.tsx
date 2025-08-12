'use client'

import React from 'react'
import { CarData } from '@/app/demo-new/page'

interface LivePreviewProps {
  carData: CarData
}

// Simple EMI calculation function
const calculateEMI = (principal: number, rate: number, tenure: number) => {
  if (principal <= 0 || rate <= 0 || tenure <= 0) {
    return { monthlyEMI: 0, totalInterest: 0, totalAmount: 0 }
  }
  
  const monthlyRate = rate / (12 * 100)
  const tenureMonths = tenure * 12
  
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths) / 
              (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  
  const totalAmount = emi * tenureMonths
  const totalInterest = totalAmount - principal
  
  return {
    monthlyEMI: Math.round(emi),
    totalInterest: Math.round(totalInterest),
    totalAmount: Math.round(totalAmount)
  }
}

export default function LivePreview({ carData }: LivePreviewProps) {
  const loanAmount = carData.carPrice - carData.downPayment
  const results = calculateEMI(loanAmount, carData.interestRate, carData.tenure)

  const affordabilityRatio = carData.monthlyIncome > 0 
    ? ((results.monthlyEMI / carData.monthlyIncome) * 100)
    : 0

  const getAffordabilityColor = (ratio: number) => {
    if (ratio <= 30) return 'text-green-600'
    if (ratio <= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getAffordabilityStatus = (ratio: number) => {
    if (ratio <= 30) return 'Excellent'
    if (ratio <= 40) return 'Good'
    return 'Risky'
  }

  return (
    <div className="space-y-4">
      {/* Monthly EMI */}
      <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
        <div className="text-sm text-slate-600 mb-1">Monthly EMI</div>
        <div className="text-3xl font-bold text-slate-900">
          ₹{results.monthlyEMI.toLocaleString()}
        </div>
      </div>

      {/* Loan Details */}
      <div className="space-y-3">
        <h4 className="font-semibold text-slate-900 pb-2 border-b border-slate-200">
          Loan Details
        </h4>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-slate-50 p-3 rounded-lg">
            <div className="text-slate-600">Loan Duration</div>
            <div className="font-semibold text-slate-900">
              {carData.tenure} years
            </div>
          </div>
          
          <div className="bg-slate-50 p-3 rounded-lg">
            <div className="text-slate-600">Interest Rate</div>
            <div className="font-semibold text-slate-900">
              {carData.interestRate}%
            </div>
          </div>
        </div>
      </div>

      {/* Overall EMI Details */}
      <div className="space-y-3">
        <h4 className="font-semibold text-slate-900 pb-2 border-b border-slate-200">
          Cost Breakdown
        </h4>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
            <span className="text-slate-600">Principal Amount</span>
            <span className="font-semibold text-slate-900">
              ₹{loanAmount.toLocaleString()}
            </span>
          </div>
          
          <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
            <span className="text-slate-600">Total Interest</span>
            <span className="font-semibold text-slate-900">
              ₹{results.totalInterest.toLocaleString()}
            </span>
          </div>
          
          <div className="flex justify-between items-center p-2 bg-blue-50 rounded border border-blue-200">
            <span className="font-medium text-slate-900">Total Payment</span>
            <span className="font-bold text-blue-700">
              ₹{results.totalAmount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Affordability Check */}
      {carData.monthlyIncome > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-slate-900 pb-2 border-b border-slate-200">
            Affordability Check
          </h4>
          
          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-600 text-sm">EMI to Income Ratio</span>
              <span className={`font-bold ${getAffordabilityColor(affordabilityRatio)}`}>
                {affordabilityRatio.toFixed(1)}%
              </span>
            </div>
            
            <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  affordabilityRatio <= 30 
                    ? 'bg-green-500' 
                    : affordabilityRatio <= 40 
                    ? 'bg-yellow-500' 
                    : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(affordabilityRatio, 100)}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">Recommended: ≤30%</span>
              <span className={`text-xs font-medium ${getAffordabilityColor(affordabilityRatio)}`}>
                {getAffordabilityStatus(affordabilityRatio)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Tips */}
      <div className="space-y-3">
        <h4 className="font-semibold text-slate-900 pb-2 border-b border-slate-200">
          Quick Tips
        </h4>
        
        <div className="space-y-2 text-xs text-slate-600">
          <div className="flex items-start space-x-2">
            <span className="text-green-500">•</span>
            <span>Keep EMI under 30% of income for comfortable repayment</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-blue-500">•</span>
            <span>Higher down payment reduces monthly EMI burden</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-purple-500">•</span>
            <span>Shorter tenure saves on total interest paid</span>
          </div>
        </div>
      </div>
    </div>
  )
}