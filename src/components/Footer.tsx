'use client'

import Image from 'next/image'
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
          <p className={`text-xs ${themeClass('text-slate-500', 'text-white/60', isLight)}`}>
            All calculations are estimates for informational purposes only. Consult with financial advisors for personalized advice. Last updated: {new Date().getFullYear()}.
          </p>
          <p className={`text-xs mt-2 ${themeClass('text-slate-500', 'text-white/60', isLight)}`}>
            Trusted by thousands of users across India for accurate car loan calculations.
          </p>
        </div>
      </div>
    </footer>
  )
}