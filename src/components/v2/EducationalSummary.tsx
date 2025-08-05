'use client'

import { motion } from 'framer-motion'
import { CarData } from '@/app/page'

interface EducationalSummaryProps {
  carData: CarData
}

export default function EducationalSummary({ carData }: EducationalSummaryProps) {
  // Calculate user's financial position against 20/4/10 rule
  const calculateEMI = (principal: number, rate: number, years: number) => {
    try {
      if (principal <= 0 || rate <= 0 || years <= 0) return 0
      const monthlyRate = rate / (12 * 100)
      const months = years * 12
      const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
      return isNaN(emi) || !isFinite(emi) ? 0 : emi
    } catch (error) {
      return 0
    }
  }

  const loanAmount = Math.max(0, (carData.carPrice || 0) - (carData.downPayment || 0))
  const emi = carData.tenure > 0 ? calculateEMI(loanAmount, carData.interestRate || 8, carData.tenure || 0) : 0
  const monthlyIncome = carData.monthlyIncome || 0
  const downPaymentPercentage = carData.carPrice > 0 ? ((carData.downPayment || 0) / carData.carPrice) * 100 : 0
  const monthlyFuelCost = carData.monthlyFuelExpense || 0
  const totalTransportationCost = emi + monthlyFuelCost + ((carData.insuranceAndMaintenance || 0) / 12)
  const transportationPercentage = monthlyIncome > 0 ? (totalTransportationCost / monthlyIncome) * 100 : 0

  const formatCurrency = (value: number) => {
    if (isNaN(value) || !isFinite(value) || value < 0) return '₹0'
    return `₹${Math.round(value).toLocaleString('en-IN')}`
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative z-10 mt-12"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
            
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">💡 Smart Car Buying Guide</h2>
              <p className="text-white/70">Learn the 20/4/10 rule and make informed decisions</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              
              {/* 20/4/10 Rule Explanation */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white mb-4">🎯 The 20/4/10 Rule</h3>
                
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">20% Down Payment</h4>
                      <span className={`text-sm px-2 py-1 rounded ${
                        downPaymentPercentage >= 20 ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
                      }`}>
                        currently at {downPaymentPercentage.toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-white/70 text-sm">Pay at least 20% upfront to reduce loan amount and interest</p>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">4 Year Max Loan</h4>
                      <span className={`text-sm px-2 py-1 rounded ${
                        (carData.tenure || 0) <= 4 ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
                      }`}>
                        {carData.tenure || 0} years
                      </span>
                    </div>
                    <p className="text-white/70 text-sm">Keep loan term ≤ 4 years to avoid excessive interest</p>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">10% of Income</h4>
                      <span className={`text-sm px-2 py-1 rounded ${
                        transportationPercentage <= 10 ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
                      }`}>
                        currently at {transportationPercentage.toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-white/70 text-sm">Total transport costs should not exceed 10% of monthly income</p>
                  </div>
                </div>
              </div>

              {/* Calculator Benefits */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white mb-4">🚗 How This Calculator Helps</h3>
                
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="font-semibold text-white mb-2">📊 Complete Cost Visibility</h4>
                    <p className="text-white/70 text-sm">
                      See all costs including EMI, fuel, insurance, and processing fees in one place
                    </p>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="font-semibold text-white mb-2">💰 Affordability Check</h4>
                    <p className="text-white/70 text-sm">
                      Instantly know if the car fits your budget based on your monthly income
                    </p>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="font-semibold text-white mb-2">⚖️ Smart Comparisons</h4>
                    <p className="text-white/70 text-sm">
                      Compare different scenarios by adjusting down payment, tenure, and car price
                    </p>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="font-semibold text-white mb-2">🎯 Rational Decisions</h4>
                    <p className="text-white/70 text-sm">
                      Avoid emotional purchases with data-driven insights and financial health checks
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            {monthlyIncome > 0 && (
              <div className="mt-8 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-white/20">
                <div className="text-center">
                  <h4 className="font-semibold text-white mb-2">Your Financial Summary</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-white/60">Monthly Cost</p>
                      <p className="text-white font-semibold">{formatCurrency(totalTransportationCost)}</p>
                    </div>
                    <div>
                      <p className="text-white/60">% of Income</p>
                      <p className={`font-semibold ${
                        transportationPercentage <= 10 ? 'text-green-400' : 'text-orange-400'
                      }`}>
                        {transportationPercentage.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-white/60">20/4/10 Compliance</p>
                      <p className={`font-semibold ${
                        downPaymentPercentage >= 20 && (carData.tenure || 0) <= 4 && transportationPercentage <= 10
                          ? 'text-green-400' 
                          : 'text-orange-400'
                      }`}>
                        {downPaymentPercentage >= 20 && (carData.tenure || 0) <= 4 && transportationPercentage <= 10
                          ? '✅ Good' 
                          : '⚠️ Review'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  )
}