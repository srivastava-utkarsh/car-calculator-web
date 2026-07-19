'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'
import Breadcrumbs from '@/components/Breadcrumbs'
import Footer from '@/components/Footer'
import { Calculator, TrendingUp, Shield, CheckCircle } from 'lucide-react'

export default function HowItWorksPage() {
  const { isLight } = useTheme()

  return (
    <main className={`min-h-screen ${isLight ? 'bg-[#F4F5F8]' : 'bg-black'}`}>
      <header className={`${isLight ? 'bg-white border-b border-slate-200/60' : 'bg-black border-b border-white/5'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link href="/" className="flex items-center space-x-3">
              <Image src="/bck-logo.svg" alt="BudgetGear Logo" className="w-10 h-10 sm:w-12 sm:h-12" width={48} height={48} />
              <span className={`text-xl sm:text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>BudgetGear</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className={`font-medium hover:text-blue-600 transition-colors ${isLight ? 'text-slate-600' : 'text-white/80'}`}>Home</Link>
              <Link href="/blog" className={`font-medium hover:text-blue-600 transition-colors ${isLight ? 'text-slate-600' : 'text-white/80'}`}>Blog</Link>
              <Link href="/about" className={`font-medium hover:text-blue-600 transition-colors ${isLight ? 'text-slate-600' : 'text-white/80'}`}>About</Link>
              <Link href="/how-it-works" className="font-medium text-blue-600">How It Works</Link>
              <Link href="/contact" className={`font-medium hover:text-blue-600 transition-colors ${isLight ? 'text-slate-600' : 'text-white/80'}`}>Contact</Link>
            </nav>
          </div>
        </div>
      </header>

      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'How It Works' }]} />
            
            <h1 className={`text-4xl sm:text-5xl font-bold mb-6 mt-8 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              How Our Calculators Work
            </h1>
            <p className={`text-xl mb-12 ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
              Understanding the methodology behind BudgetGear&apos;s car finance calculators
            </p>

            {/* Car Affordability Calculator */}
            <div className={`mb-12 p-8 rounded-2xl ${isLight ? 'bg-white border border-slate-200' : 'bg-slate-800/40 border border-slate-700'}`}>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <Calculator className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className={`text-3xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Car Affordability Calculator
                </h2>
              </div>
              
              <h3 className={`text-xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                The 20/4/10 Rule Methodology
              </h3>
              <p className={`mb-4 ${isLight ? 'text-slate-700' : 'text-white/90'}`}>
                Our car affordability calculator is based on the proven 20/4/10 rule, a financial guideline used by banks and financial advisors worldwide:
              </p>
              
              <div className="space-y-4 mb-6">
                <div className={`p-4 rounded-lg ${isLight ? 'bg-blue-50' : 'bg-blue-900/20'}`}>
                  <h4 className={`font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>20% Down Payment</h4>
                  <p className={`text-sm ${isLight ? 'text-slate-700' : 'text-white/80'}`}>
                    You should pay at least 20% of the car&apos;s on-road price upfront. This reduces your loan burden, gets you better interest rates, and ensures positive equity from day one.
                  </p>
                </div>
                
                <div className={`p-4 rounded-lg ${isLight ? 'bg-green-50' : 'bg-green-900/20'}`}>
                  <h4 className={`font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>4-Year Maximum Tenure</h4>
                  <p className={`text-sm ${isLight ? 'text-slate-700' : 'text-white/80'}`}>
                    Limit your car loan to 4 years (48 months) to minimize interest costs and avoid being underwater on your loan as the car depreciates.
                  </p>
                </div>
                
                <div className={`p-4 rounded-lg ${isLight ? 'bg-purple-50' : 'bg-purple-900/20'}`}>
                  <h4 className={`font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>10% of Gross Income</h4>
                  <p className={`text-sm ${isLight ? 'text-slate-700' : 'text-white/80'}`}>
                    Total monthly car expenses (EMI + fuel + insurance + maintenance) should not exceed 10% of your gross monthly income.
                  </p>
                </div>
              </div>

              <h3 className={`text-xl font-bold mb-4 mt-8 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Calculation Formula
              </h3>
              <div className={`p-6 rounded-lg font-mono text-sm mb-4 ${isLight ? 'bg-slate-100' : 'bg-slate-900'}`}>
                <p className={isLight ? 'text-slate-900' : 'text-white'}>
                  Maximum Car Price = (Monthly Income × 0.10 - Non-EMI Costs) × Loan Multiplier ÷ 0.80
                </p>
              </div>
              
              <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
                Where Loan Multiplier is calculated based on the interest rate and 48-month tenure using the standard EMI formula.
              </p>
            </div>

            {/* EMI Calculator */}
            <div className={`mb-12 p-8 rounded-2xl ${isLight ? 'bg-white border border-slate-200' : 'bg-slate-800/40 border border-slate-700'}`}>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                  <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h2 className={`text-3xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  EMI Calculator
                </h2>
              </div>
              
              <h3 className={`text-xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Standard EMI Formula
              </h3>
              <p className={`mb-4 ${isLight ? 'text-slate-700' : 'text-white/90'}`}>
                We use the industry-standard EMI calculation formula used by all major Indian banks including SBI, HDFC, ICICI, and Axis Bank:
              </p>
              
              <div className={`p-6 rounded-lg font-mono text-sm mb-4 ${isLight ? 'bg-slate-100' : 'bg-slate-900'}`}>
                <p className={`mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  EMI = [P × R × (1+R)^N] / [(1+R)^N - 1]
                </p>
                <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
                  Where: P = Principal loan amount, R = Monthly interest rate, N = Loan tenure in months
                </p>
              </div>

              <h3 className={`text-xl font-bold mb-4 mt-8 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                What We Calculate
              </h3>
              <ul className="space-y-3">
                {[
                  'Monthly EMI payment',
                  'Total interest payable over loan tenure',
                  'Total amount payable (principal + interest)',
                  'Month-by-month amortization schedule',
                  'Principal vs interest breakdown for each payment'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isLight ? 'text-green-600' : 'text-green-400'}`} />
                    <span className={isLight ? 'text-slate-700' : 'text-white/90'}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Prepayment Calculator */}
            <div className={`mb-12 p-8 rounded-2xl ${isLight ? 'bg-white border border-slate-200' : 'bg-slate-800/40 border border-slate-700'}`}>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                  <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className={`text-3xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Prepayment Calculator
                </h2>
              </div>
              
              <h3 className={`text-xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Prepayment Impact Analysis
              </h3>
              <p className={`mb-4 ${isLight ? 'text-slate-700' : 'text-white/90'}`}>
                Our prepayment calculator shows you exactly how making additional payments affects your loan:
              </p>
              
              <ul className="space-y-3 mb-6">
                {[
                  'Interest savings from prepayment',
                  'Reduced loan tenure',
                  'New EMI amount (if you choose to reduce EMI)',
                  'Comparison of different prepayment strategies',
                  'Break-even analysis including prepayment penalties'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isLight ? 'text-purple-600' : 'text-purple-400'}`} />
                    <span className={isLight ? 'text-slate-700' : 'text-white/90'}>{item}</span>
                  </li>
                ))}
              </ul>

              <div className={`p-4 rounded-lg ${isLight ? 'bg-yellow-50 border border-yellow-200' : 'bg-yellow-900/20 border border-yellow-700/50'}`}>
                <p className={`text-sm ${isLight ? 'text-yellow-800' : 'text-yellow-200'}`}>
                  <strong>Note:</strong> We factor in prepayment penalties charged by banks (typically 2-5% of prepayment amount) to give you accurate savings calculations.
                </p>
              </div>
            </div>

            {/* Data Sources */}
            <div className={`mb-12 p-8 rounded-2xl ${isLight ? 'bg-white border border-slate-200' : 'bg-slate-800/40 border border-slate-700'}`}>
              <h2 className={`text-3xl font-bold mb-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Data Sources & Accuracy
              </h2>
              
              <p className={`mb-4 ${isLight ? 'text-slate-700' : 'text-white/90'}`}>
                Our calculators use current market data from reliable sources:
              </p>
              
              <ul className="space-y-3">
                {[
                  'Interest rates: Updated monthly from official bank websites (SBI, HDFC, ICICI, Axis Bank)',
                  'Insurance costs: Based on IRDAI guidelines and major insurer rates',
                  'Fuel prices: Current retail prices from Indian Oil, Bharat Petroleum, Hindustan Petroleum',
                  'Depreciation rates: Industry standard rates verified by automotive associations',
                  'Maintenance costs: Average costs from authorized service centers'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
                    <span className={isLight ? 'text-slate-700' : 'text-white/90'}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Privacy & Security */}
            <div className={`p-8 rounded-2xl ${isLight ? 'bg-blue-50 border border-blue-200' : 'bg-blue-900/20 border border-blue-700/50'}`}>
              <h2 className={`text-2xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Your Privacy Matters
              </h2>
              <p className={`mb-4 ${isLight ? 'text-slate-700' : 'text-white/90'}`}>
                All calculations are performed locally in your browser. We do not store, transmit, or share any of your financial information. Your data never leaves your device.
              </p>
              <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
                Our calculators are 100% free to use with no registration required.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
