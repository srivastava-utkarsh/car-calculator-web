'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { themeClass } from '@/utils/themeStyles'

export interface FAQItem {
  question: string
  answer: string
}

interface FAQProps {
  title: string
  faqs: FAQItem[]
  className?: string
}

export default function FAQ({ title, faqs, className = "" }: FAQProps) {
  const [openItems, setOpenItems] = useState<number[]>([])
  const { isLight } = useTheme()

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  return (
    <section className={`${className}`} aria-labelledby="faq-heading">
      <div className={`${themeClass('bg-white/5', 'bg-slate-900/20', isLight)} backdrop-blur-xl rounded-2xl border ${themeClass('border-slate-200', 'border-white/10', isLight)} p-6 shadow-2xl`}>
        <h2 
          id="faq-heading" 
          className={`text-2xl font-bold mb-6 ${themeClass('text-slate-900', 'text-white', isLight)} text-center`}
        >
          {title}
        </h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openItems.includes(index)
            
            return (
              <div 
                key={index}
                className={`${themeClass('bg-slate-50/50', 'bg-white/5', isLight)} rounded-lg border ${themeClass('border-slate-200', 'border-white/10', isLight)} transition-all duration-200 hover:shadow-md`}
              >
                <button
                  className="w-full px-4 py-4 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-lg"
                  onClick={() => toggleItem(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <h3 className={`font-semibold ${themeClass('text-slate-900', 'text-white', isLight)} text-sm sm:text-base pr-4`}>
                    {faq.question}
                  </h3>
                  <div className={`flex-shrink-0 ${themeClass('text-slate-600', 'text-white/70', isLight)} transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </button>
                
                {isOpen && (
                  <div 
                    id={`faq-answer-${index}`}
                    className="px-4 pb-4 pt-0"
                    role="region"
                    aria-labelledby={`faq-question-${index}`}
                  >
                    <div className={`${themeClass('text-slate-700', 'text-white/80', isLight)} text-sm leading-relaxed whitespace-pre-wrap`}>
                      {faq.answer}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        
        <div className={`mt-6 pt-4 border-t ${themeClass('border-slate-200', 'border-white/10', isLight)} text-center`}>
          <p className={`text-xs ${themeClass('text-slate-500', 'text-white/60', isLight)}`}>
            Have more questions? These calculators are for informational purposes. Consult a financial advisor for personalized advice.
          </p>
        </div>
      </div>
    </section>
  )
}