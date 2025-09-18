'use client'

import { Users, Target, Shield, Calculator } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import { useTheme } from '@/contexts/ThemeContext'
import AdSenseAd from '@/components/AdSenseAd'
import Breadcrumbs from '@/components/Breadcrumbs'
import Footer from '@/components/Footer'

export default function AboutPage() {
  const { isLight } = useTheme()

  return (
    <main className={`min-h-screen ${isLight ? 'bg-gradient-to-br from-slate-50 via-white to-slate-50' : 'bg-black'}`}>
      {/* AdSense Script */}
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
        crossOrigin="anonymous"
      />

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
            <p className={`text-xl mb-12 font-medium max-w-3xl mx-auto ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
              Empowering smart car financing decisions through accurate calculations and financial education
            </p>
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
                  BudgetGear was created to help individuals make informed car financing decisions. We believe that purchasing a vehicle is one of the largest financial commitments people make, and having the right tools and knowledge is crucial for long-term financial health.
                </p>
                <p className={`text-lg ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                  Our comprehensive calculators follow industry-standard practices used by major Indian banks and financial institutions, ensuring accurate and reliable calculations for EMI, loan affordability, and prepayment scenarios.
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

      {/* AdSense Ad */}
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <AdSenseAd slot="2345678901" style={{ margin: "24px 0" }} />
      </div>

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

      {/* Team Section */}
      <section className={`py-16 ${isLight ? 'bg-white' : 'bg-slate-900/20'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className={`text-3xl font-bold text-center mb-12 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              About Our Team
            </h2>
            <div className={`p-8 rounded-2xl ${isLight ? 'bg-slate-50' : 'bg-slate-800/30'}`}>
              <p className={`text-lg mb-6 ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                BudgetGear was founded by financial technology enthusiasts who recognized the need for better car financing tools in India. Our team combines expertise in finance, technology, and user experience design to create tools that are both powerful and easy to use.
              </p>
              <p className={`text-lg mb-6 ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                We continuously research industry best practices, study regulatory guidelines, and gather user feedback to improve our calculators and ensure they remain relevant and accurate.
              </p>
              <p className={`text-lg ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                Our commitment is to provide reliable, free tools that help thousands of users across India make smarter car financing decisions every month.
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
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-8 py-4 rounded-full transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
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