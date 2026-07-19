'use client'

import { HelpCircle, Calculator, TrendingUp, DollarSign, FileText } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'
import Breadcrumbs from '@/components/Breadcrumbs'
import Footer from '@/components/Footer'
import { faqPageCategories } from '@/data/faqPageData'

export default function FAQPage() {
  const { isLight } = useTheme()

  const categoryIcons = [Calculator, DollarSign, TrendingUp, FileText]
  const faqCategories = faqPageCategories.map((category, index) => ({
    ...category,
    icon: categoryIcons[index] ?? HelpCircle,
  }))

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
              <Link href="/about" className={`font-medium hover:text-blue-600 transition-colors ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                About
              </Link>
              <Link href="/faq" className={`font-medium text-blue-600`}>
                FAQ
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
                  { label: 'FAQ' }
                ]}
              />
            </div>
            <HelpCircle className={`w-16 h-16 mx-auto mb-6 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
            <h1 className={`text-4xl sm:text-5xl font-bold mb-6 tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Frequently Asked Questions
            </h1>
            <p className={`text-xl mb-12 font-medium max-w-3xl mx-auto ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
              Everything you need to know about car financing, EMI calculations, loan affordability, and smart car buying decisions
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      {faqCategories.map((category, categoryIndex) => (
        <section key={categoryIndex} className={`py-16 ${categoryIndex % 2 === 0 ? (isLight ? 'bg-white' : 'bg-slate-900/20') : ''}`}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center mb-12">
                <category.icon className={`w-10 h-10 mr-4 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
                <h2 className={`text-3xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {category.title}
                </h2>
              </div>

              <div className="space-y-6">
                {category.questions.map((faq, index) => (
                  <div key={index} className={`p-8 rounded-2xl ${isLight ? 'bg-slate-50 border border-slate-200' : 'bg-slate-800/30 border border-slate-700'}`}>
                    <h3 className={`text-xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {faq.question}
                    </h3>
                    <p className={`text-lg leading-relaxed ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>

              {/* AdSense Ad after each category */}
            </div>
          </div>
        </section>
      ))}

      {/* Calculator CTA */}
      <section className={`py-16 ${isLight ? 'bg-blue-50' : 'bg-blue-900/20'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className={`text-3xl font-bold mb-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Ready to Calculate Your Car Budget?
            </h2>
            <p className={`text-xl mb-8 ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
              Use our free calculators to make informed car financing decisions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/car-affordability-calculator"
                className="inline-block bg-[#E8542F] hover:bg-[#D64A28] text-white font-semibold text-lg px-8 py-4 rounded-full transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Car Affordability Calculator
              </Link>
              <Link
                href="/car-loan-prepayment-calculator"
                className="inline-block bg-slate-800 hover:bg-slate-900 text-white font-semibold text-lg px-8 py-4 rounded-full transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Prepayment Calculator
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className={`text-3xl font-bold mb-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Didn&apos;t Find Your Answer?
            </h2>
            <p className={`text-xl mb-8 ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
              Have a specific question about car financing or our calculators? We&apos;re here to help!
            </p>
            <Link
              href="/contact"
              className="inline-block bg-slate-600 hover:bg-slate-700 text-white font-semibold text-lg px-8 py-4 rounded-full transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
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