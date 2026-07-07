'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'
import { themeClass } from '@/utils/themeStyles'

export default function Footer() {
  const { isLight } = useTheme()

  return (
    <footer className={`py-12 ${themeClass('bg-slate-50 border-t border-slate-200', 'bg-slate-800/50 border-t border-slate-700', isLight)}`}>
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
            <span className={`text-xl font-bold ${themeClass('text-slate-900', 'text-white', isLight)}`}>
              BudgetGear
            </span>
          </div>
          <p className={`text-sm mb-4 ${themeClass('text-slate-600', 'text-white/70', isLight)}`}>
            Making car purchase decisions easier with smart financial tools
          </p>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-4">
            <Link href="/about" className={`text-sm font-medium hover:text-blue-600 transition-colors ${themeClass('text-slate-600', 'text-white/80', isLight)}`}>
              About Us
            </Link>
            <Link href="/blog" className={`text-sm font-medium hover:text-blue-600 transition-colors ${themeClass('text-slate-600', 'text-white/80', isLight)}`}>
              Blog
            </Link>
            <Link href="/how-it-works" className={`text-sm font-medium hover:text-blue-600 transition-colors ${themeClass('text-slate-600', 'text-white/80', isLight)}`}>
              How It Works
            </Link>
            <Link href="/contact" className={`text-sm font-medium hover:text-blue-600 transition-colors ${themeClass('text-slate-600', 'text-white/80', isLight)}`}>
              Contact
            </Link>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-6">
            <Link href="/privacy" className={`text-xs font-medium hover:text-blue-600 transition-colors ${themeClass('text-slate-500', 'text-white/60', isLight)}`}>
              Privacy Policy
            </Link>
            <Link href="/terms" className={`text-xs font-medium hover:text-blue-600 transition-colors ${themeClass('text-slate-500', 'text-white/60', isLight)}`}>
              Terms & Conditions
            </Link>
            <Link href="/disclaimer" className={`text-xs font-medium hover:text-blue-600 transition-colors ${themeClass('text-slate-500', 'text-white/60', isLight)}`}>
              Disclaimer
            </Link>
          </div>

          <p className={`text-xs ${themeClass('text-slate-500', 'text-white/60', isLight)}`}>
            All calculations are estimates for informational purposes only. Consult with financial advisors for personalized advice. Last updated: {new Date().getFullYear()}.
          </p>
          <p className={`text-xs mt-2 ${themeClass('text-slate-500', 'text-white/60', isLight)}`}>
            Free, accurate car loan calculators built for car buyers across India.
          </p>
        </div>
      </div>
    </footer>
  )
}