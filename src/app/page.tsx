'use client'

import { Calculator, TrendingUp, Shield } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'



export default function HomePage() {
  const { isLight } = useTheme()

  // FAQ structured data for rich snippets
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the 20/4/10 rule for car buying?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The 20/4/10 rule is a smart car buying guideline: Pay at least 20% down payment, keep loan tenure under 4 years maximum, and ensure total car expenses do not exceed 10% of your monthly income."
        }
      },
      {
        "@type": "Question",
        "name": "How do car affordability calculators work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Car affordability calculators analyze your income, expenses, down payment, and loan terms to determine how much car you can comfortably afford without straining your finances."
        }
      },
      {
        "@type": "Question",
        "name": "Should I prepay my car loan?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Prepaying car loans can save significant interest, especially if you have surplus funds and the loan has a high interest rate. Use a prepayment calculator to compare scenarios."
        }
      },
      {
        "@type": "Question",
        "name": "What factors affect car affordability?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Key factors include monthly income, existing EMIs, down payment amount, interest rates, loan tenure, and ongoing car expenses like insurance, fuel, and maintenance."
        }
      }
    ]
  }

  return (
    <main className={`min-h-screen ${isLight ? 'bg-gradient-to-br from-slate-50 via-white to-slate-50' : 'bg-black'}`}>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      {/* Header */}
      <header className={`${isLight ? 'bg-white border-b border-slate-200/60' : 'bg-black border-b border-white/5'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16 sm:h-20">
            <div className="flex items-center space-x-3">
              <Image 
                src="/bck-logo.svg" 
                alt="BudgetGear Logo" 
                className="w-10 h-10 sm:w-12 sm:h-12"
                width={48}
                height={48}
              />
              <span className={`text-xl sm:text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                BudgetGear
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Main Heading */}
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Car Loan EMI Calculator India
            </h1>
            
            {/* Subtitle */}
            <p className={`text-lg sm:text-xl mb-12 font-medium max-w-3xl mx-auto ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
              Best car loan EMI calculator online India. Calculate car affordability, interest rate, and prepayment savings with proven 20/4/10 rule for smart car financing decisions.
            </p>

            {/* Features Grid - More Prominent */}
            <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
              {/* Car Affordability */}
              <div className={`text-center p-10 rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-lg hover:shadow-xl' : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800/60'} transition-all duration-300 hover:scale-105`}>
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 ${isLight ? 'bg-blue-100' : 'bg-blue-500/20'}`}>
                  <Calculator className={`w-10 h-10 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
                </div>
                <h2 className={`text-2xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Best Car Affordability Calculator India
                </h2>
                <p className={`text-lg mb-6 leading-relaxed ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                  Budget car EMI calculator with 20/4/10 rule. Calculate how much car you can afford with our car purchase loan eligibility calculator.
                </p>
                <Link 
                  href="/car-affordability-calculator"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-10 py-4 rounded-full transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Calculate Affordability
                </Link>
              </div>

              {/* Prepayment Calculator */}
              <div className={`text-center p-10 rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-lg hover:shadow-xl' : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800/60'} transition-all duration-300 hover:scale-105`}>
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 ${isLight ? 'bg-green-100' : 'bg-green-500/20'}`}>
                  <TrendingUp className={`w-10 h-10 ${isLight ? 'text-green-600' : 'text-green-400'}`} />
                </div>
                <h2 className={`text-2xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Car Loan Prepayment Calculator India
                </h2>
                <p className={`text-lg mb-6 leading-relaxed ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                  Calculate prepayment interest savings with our car loan part payment calculator. Zero prepayment penalty analysis included.
                </p>
                <Link 
                  href="/car-loan-prepayment-calculator"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold text-lg px-10 py-4 rounded-full transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Plan Prepayments
                </Link>
              </div>
            </div>

            {/* 20/4/10 Rule Section - Compact */}
            <div className="max-w-3xl mx-auto">
              <h3 className={`text-2xl font-bold mb-8 ${isLight ? 'text-slate-900' : 'text-white'} text-center`}>
                <Shield className={`inline-block w-6 h-6 mr-2 ${isLight ? 'text-slate-400' : 'text-white/40'}`} />
                Smart 20/4/10 Rule
              </h3>
              
              {/* Rule Items - Compact Grid */}
              <div className="grid grid-cols-3 gap-6 text-center">
                <div className={`p-4 rounded-2xl ${isLight ? 'bg-green-50 border border-green-200' : 'bg-green-900/20 border border-green-700/50'}`}>
                  <div className={`text-3xl font-bold mb-1 ${isLight ? 'text-green-600' : 'text-green-400'}`}>20%</div>
                  <div className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Down Payment</div>
                </div>
                <div className={`p-4 rounded-2xl ${isLight ? 'bg-blue-50 border border-blue-200' : 'bg-blue-900/20 border border-blue-700/50'}`}>
                  <div className={`text-3xl font-bold mb-1 ${isLight ? 'text-blue-600' : 'text-blue-400'}`}>4</div>
                  <div className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Years Max</div>
                </div>
                <div className={`p-4 rounded-2xl ${isLight ? 'bg-orange-50 border border-orange-200' : 'bg-orange-900/20 border border-orange-700/50'}`}>
                  <div className={`text-3xl font-bold mb-1 ${isLight ? 'text-orange-600' : 'text-orange-400'}`}>10%</div>
                  <div className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>of Income</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={`py-12 ${isLight ? 'bg-white' : 'bg-slate-900/20'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className={`text-3xl font-bold text-center mb-10 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              {/* FAQ 1 */}
              <div className={`p-6 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/30 border-slate-700'}`}>
                <h3 className={`text-xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  What is the 20/4/10 rule for car buying?
                </h3>
                <p className={`text-lg ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                  The 20/4/10 rule is a smart car buying guideline: Pay at least 20% down payment, keep loan tenure under 4 years maximum, and ensure total car expenses don&apos;t exceed 10% of your monthly income.
                </p>
              </div>

              {/* FAQ 2 */}
              <div className={`p-6 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/30 border-slate-700'}`}>
                <h3 className={`text-xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  How do car affordability calculators work?
                </h3>
                <p className={`text-lg ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                  Car affordability calculators analyze your income, expenses, down payment, and loan terms to determine how much car you can comfortably afford without straining your finances.
                </p>
              </div>

              {/* FAQ 3 */}
              <div className={`p-6 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/30 border-slate-700'}`}>
                <h3 className={`text-xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Should I prepay my car loan?
                </h3>
                <p className={`text-lg ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                  Prepaying car loans can save significant interest, especially if you have surplus funds and the loan has a high interest rate. Use a prepayment calculator to compare scenarios.
                </p>
              </div>

              {/* FAQ 4 */}
              <div className={`p-6 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/30 border-slate-700'}`}>
                <h3 className={`text-xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  What factors affect car affordability?
                </h3>
                <p className={`text-lg ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                  Key factors include monthly income, existing EMIs, down payment amount, interest rates, loan tenure, and ongoing car expenses like insurance, fuel, and maintenance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
        
      {/* Footer */}
      <footer className={`py-12 ${isLight ? 'bg-slate-50 border-t border-slate-200' : 'bg-slate-800/50 border-t border-slate-700'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Image 
                src="/bck-logo.svg" 
                alt="BudgetGear Logo" 
                className="w-8 h-8"
                width={32}
                height={32}
              />
              <span className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                BudgetGear
              </span>
            </div>
            <p className={`text-sm mb-4 ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
              Making car purchase decisions easier with smart financial tools
            </p>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-white/60'}`}>
              All calculations are estimates for informational purposes only. Consult with financial advisors for personalized advice.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
