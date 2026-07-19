'use client'

import { Users, Target, Shield, Calculator } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'
import Breadcrumbs from '@/components/Breadcrumbs'
import Footer from '@/components/Footer'

export default function AboutPage() {
  const { isLight } = useTheme()

  return (
    <main className={`min-h-screen ${isLight ? 'bg-[#F4F5F8]' : 'bg-black'}`}>

      {/* Header */}
      <header className={`${isLight ? 'bg-white border-b border-slate-200/60' : 'bg-black border-b border-white/5'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
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
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className={`font-medium hover:text-blue-600 transition-colors ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                Home
              </Link>
              <Link href="/about" className={`font-medium text-blue-600`}>
                About
              </Link>
              <Link href="/car-affordability-calculator" className={`font-medium hover:text-blue-600 transition-colors ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                Calculators
              </Link>
              <Link href="/contact" className={`font-medium hover:text-blue-600 transition-colors ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Breadcrumbs */}
            <div className="mb-8">
              <Breadcrumbs
                items={[
                  { label: 'Home', href: '/' },
                  { label: 'About' }
                ]}
              />
            </div>
            <h1 className={`text-4xl sm:text-5xl font-bold mb-6 tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              About BudgetGear
            </h1>
            <p className={`text-xl mb-8 font-medium max-w-3xl mx-auto ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
              Empowering smart car financing decisions through accurate calculations and financial education
            </p>
            <div className={`max-w-2xl mx-auto p-4 rounded-lg ${isLight ? 'bg-blue-50 border border-blue-200' : 'bg-blue-900/20 border border-blue-700/50'}`}>
              <p className={`text-sm ${isLight ? 'text-blue-900' : 'text-blue-200'}`}>
                <strong>Free and independent</strong> | No sign-up required | Calculations follow the standard reducing-balance formulas used by major Indian banks
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className={`py-16 ${isLight ? 'bg-white' : 'bg-slate-900/20'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className={`text-3xl font-bold mb-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Our Mission
                </h2>
                <p className={`text-lg mb-6 ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                  BudgetGear was created in 2024 by Utkarsh Srivastava, a software engineer who saw a gap in the Indian market: accessible, accurate, and unbiased car financing tools. Purchasing a vehicle is one of the largest financial commitments most people make, and having the right tools and knowledge is crucial for long-term financial health.
                </p>
                <p className={`text-lg mb-6 ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                  Our calculators follow the industry-standard reducing-balance formulas used by major Indian banks including State Bank of India, HDFC Bank, ICICI Bank, and Axis Bank, and the results are cross-checked against the EMI schedules those banks publish. We update our tools to reflect current interest rates, RBI guidelines, and market conditions.
                </p>
                <p className={`text-lg ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                  What sets us apart is our commitment to financial education. Beyond calculators, we publish in-depth guides on car loans, EMI planning, and ownership costs, researched from official sources such as RBI publications and bank websites, and updated regularly to keep the information current and relevant.
                </p>
              </div>
              <div className={`p-8 rounded-3xl ${isLight ? 'bg-gradient-to-br from-blue-50 to-slate-50' : 'bg-gradient-to-br from-slate-800/50 to-slate-700/30'}`}>
                <Target className={`w-16 h-16 mb-6 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
                <h3 className={`text-2xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Financial Empowerment
                </h3>
                <p className={`text-lg ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                  We provide free, accessible tools that help you understand the true cost of car ownership and make budget-conscious decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className={`text-3xl font-bold text-center mb-12 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Our Core Values
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className={`p-8 rounded-2xl text-center ${isLight ? 'bg-slate-50 border border-slate-200' : 'bg-slate-800/30 border border-slate-700'}`}>
                <Calculator className={`w-12 h-12 mx-auto mb-6 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
                <h3 className={`text-xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Accuracy
                </h3>
                <p className={`${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                  Our calculations follow industry-standard formulas used by major banks and financial institutions for maximum accuracy.
                </p>
              </div>

              <div className={`p-8 rounded-2xl text-center ${isLight ? 'bg-slate-50 border border-slate-200' : 'bg-slate-800/30 border border-slate-700'}`}>
                <Shield className={`w-12 h-12 mx-auto mb-6 ${isLight ? 'text-green-600' : 'text-green-400'}`} />
                <h3 className={`text-xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Transparency
                </h3>
                <p className={`${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                  No hidden agendas or biased recommendations. We provide clear, honest information to help you make informed decisions.
                </p>
              </div>

              <div className={`p-8 rounded-2xl text-center ${isLight ? 'bg-slate-50 border border-slate-200' : 'bg-slate-800/30 border border-slate-700'}`}>
                <Users className={`w-12 h-12 mx-auto mb-6 ${isLight ? 'text-purple-600' : 'text-purple-400'}`} />
                <h3 className={`text-xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Accessibility
                </h3>
                <p className={`${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                  Our tools are completely free and designed to be user-friendly for everyone, regardless of their financial expertise.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className={`text-3xl font-bold text-center mb-12 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Our Calculation Methodology
            </h2>
            <div className={`p-8 rounded-2xl mb-8 ${isLight ? 'bg-slate-50 border border-slate-200' : 'bg-slate-800/30 border border-slate-700'}`}>
              <h3 className={`text-xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Industry-Standard EMI Formula
              </h3>
              <p className={`text-lg mb-4 ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                Our EMI calculator uses the reducing balance method with the formula: EMI = P × r × (1+r)^n / [(1+r)^n - 1], where P is principal, r is monthly interest rate, and n is tenure in months. This is the exact formula used by all major Indian banks and is mandated by the Reserve Bank of India for transparent lending practices.
              </p>
              <h3 className={`text-xl font-bold mb-4 mt-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                20/4/10 Rule Implementation
              </h3>
              <p className={`text-lg mb-4 ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                Our affordability calculator implements the proven 20/4/10 rule: 20% minimum down payment, maximum 4-year loan tenure, and total car expenses not exceeding 10% of gross monthly income. This rule is recommended by financial advisors globally and helps prevent over-leveraging.
              </p>
              <h3 className={`text-xl font-bold mb-4 mt-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Prepayment Calculations
              </h3>
              <p className={`text-lg ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                Our prepayment calculator accounts for the reducing principal balance and recalculates interest savings based on the actual outstanding amount at the time of prepayment. We also factor in prepayment penalties as per RBI guidelines (0% for floating rate loans, up to 5% for fixed rate loans).
              </p>
            </div>
            <div className={`p-6 rounded-lg ${isLight ? 'bg-green-50 border border-green-200' : 'bg-green-900/20 border border-green-700/50'}`}>
              <p className={`text-sm ${isLight ? 'text-green-900' : 'text-green-200'}`}>
                <strong>Verification Process:</strong> Our calculations are cross-checked against the publicly available EMI schedules and calculators of major banks such as SBI, HDFC, ICICI, and Axis Bank, and reviewed periodically to stay in line with current banking practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className={`py-16 ${isLight ? 'bg-white' : 'bg-slate-900/20'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className={`text-3xl font-bold text-center mb-12 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              About the Creator
            </h2>
            <div className={`p-8 rounded-2xl ${isLight ? 'bg-slate-50' : 'bg-slate-800/30'}`}>
              <p className={`text-lg mb-6 ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                BudgetGear is built and maintained by <strong>Utkarsh Srivastava</strong>, a software engineer with a strong interest in personal finance. He designs the calculators, writes the guides, and keeps the tools up to date — combining an engineer&apos;s attention to correctness with a car buyer&apos;s practical questions about EMIs, down payments, and total ownership costs.
              </p>
              <p className={`text-lg mb-6 ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                All content is researched from official and publicly available sources, including Reserve Bank of India guidelines, bank websites, and automotive industry publications. Calculations are checked against the EMI schedules and calculators published by major Indian banks.
              </p>
              <p className={`text-lg ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                Our commitment is to provide reliable, unbiased, and free tools that help car buyers across India make smarter financing decisions. We don&apos;t accept payments from banks or car dealers, so our recommendations remain completely independent and in your best interest.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className={`text-3xl font-bold mb-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Questions or Feedback?
            </h2>
            <p className={`text-xl mb-8 ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
              We&apos;re always looking to improve our tools and help more people make better financial decisions.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-[#E8542F] hover:bg-[#D64A28] text-white font-semibold text-lg px-8 py-4 rounded-full transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  )
}