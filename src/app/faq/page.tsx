'use client'

import { HelpCircle, Calculator, TrendingUp, DollarSign, FileText } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import { useTheme } from '@/contexts/ThemeContext'
import AdSenseAd from '@/components/AdSenseAd'
import Breadcrumbs from '@/components/Breadcrumbs'
import Footer from '@/components/Footer'

export default function FAQPage() {
  const { isLight } = useTheme()

  const faqCategories = [
    {
      title: "Car Affordability & Budgeting",
      icon: Calculator,
      questions: [
        {
          question: "How much car can I afford based on my salary?",
          answer: "Use the 20/4/10 rule: 20% down payment, maximum 4-year loan, and total car expenses should not exceed 10% of your gross monthly income. For example, if you earn ₹50,000/month, your total car expenses (EMI + insurance + fuel + maintenance) should stay under ₹5,000."
        },
        {
          question: "What is the 20/4/10 rule for car buying?",
          answer: "The 20/4/10 rule is a proven car financing guideline: Pay at least 20% down payment to reduce loan amount, keep loan tenure under 4 years to minimize total interest, and ensure total monthly car expenses don't exceed 10% of your gross monthly income."
        },
        {
          question: "Should I include fuel and maintenance in my car budget?",
          answer: "Yes, absolutely. Total cost of car ownership includes EMI, insurance, fuel, regular maintenance, parking fees, and annual servicing. These recurring costs can add up to ₹3,000-8,000 per month depending on usage and car type."
        },
        {
          question: "How much down payment should I make?",
          answer: "Minimum: 10-15% (lender requirement), Recommended: 20-25% (20/4/10 rule), Optimal: 30-40% if you have surplus funds. Higher down payment reduces EMI, total interest cost, and improves loan approval chances."
        }
      ]
    },
    {
      title: "EMI Calculations & Loan Terms",
      icon: DollarSign,
      questions: [
        {
          question: "How is car loan EMI calculated?",
          answer: "EMI is calculated using the PMT formula: EMI = P × r × (1+r)^n / [(1+r)^n - 1], where P is principal loan amount (car price - down payment), r is monthly interest rate (annual rate ÷ 12 ÷ 100), and n is total number of months (tenure × 12)."
        },
        {
          question: "What factors affect my car loan interest rate?",
          answer: "Interest rates depend on: credit score (750+ gets best rates), income stability, employer type, loan amount, loan tenure, car age (new vs used), and lender policies. Rates typically range from 7-15% per annum."
        },
        {
          question: "Should I choose a longer or shorter loan tenure?",
          answer: "Shorter tenure (2-3 years): Lower total interest, higher monthly EMI, faster equity building. Longer tenure (5-7 years): Lower monthly EMI, more budget flexibility, but significantly higher total interest cost. Follow 20/4/10 rule and keep under 4 years."
        },
        {
          question: "Can I get pre-approved for a car loan?",
          answer: "Yes, many banks offer pre-approval. Benefits include knowing your budget, better negotiating power with dealers, faster processing, and confirmed interest rates. Pre-approval is typically valid for 30-90 days."
        }
      ]
    },
    {
      title: "Loan Prepayment & Savings",
      icon: TrendingUp,
      questions: [
        {
          question: "Should I prepay my car loan?",
          answer: "Consider prepaying if: you have surplus funds, loan interest rate is high (>10%), you want to reduce financial burden, or you're planning another major purchase. Compare prepayment savings vs other investment opportunities."
        },
        {
          question: "How much can I save by prepaying my car loan?",
          answer: "Savings depend on remaining tenure and interest rate. Example: ₹5 lakh loan at 9% for 5 years. Prepaying ₹50,000 in year 2 can save ₹30,000-50,000 in interest and reduce tenure by 8-12 months."
        },
        {
          question: "Are there charges for car loan prepayment?",
          answer: "Floating rate loans: Usually no charges. Fixed rate loans: May have 2-5% penalty on prepaid amount. Check your loan agreement for specific terms. Many banks waive prepayment charges after 12 months."
        },
        {
          question: "What's the best prepayment strategy?",
          answer: "Options include: lump sum prepayment (when you receive bonus/windfall), increasing EMI by 10-20% monthly, yearly prepayments, or part-prepayments to reduce tenure. Each strategy has different savings potential."
        }
      ]
    },
    {
      title: "Car Buying Tips & Best Practices",
      icon: FileText,
      questions: [
        {
          question: "New car vs used car financing - which is better?",
          answer: "New cars: Lower interest rates (7-10%), longer tenure options, full warranty, latest features. Used cars: Higher rates (10-15%), shorter tenure, lower insurance, faster depreciation. Choose based on budget and needs."
        },
        {
          question: "How to negotiate the best car loan deal?",
          answer: "Compare offers from multiple banks, check online aggregators, negotiate interest rates based on your credit profile, ask about processing fee waivers, consider dealer financing vs bank loans, and read all terms carefully."
        },
        {
          question: "What documents are needed for car loan approval?",
          answer: "Income proof (salary slips, ITR, bank statements), identity proof (Aadhar, PAN, passport), address proof, employer certificate, car quotation/invoice, insurance documents, and co-applicant documents if applicable."
        },
        {
          question: "How does car insurance affect my total budget?",
          answer: "Car insurance typically costs 2-4% of car value annually. Include comprehensive coverage, third-party liability, and useful add-ons in your budget. Compare policies, check claim settlement ratio, and factor renewal costs into monthly ownership expenses."
        }
      ]
    }
  ]

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
              {categoryIndex === 1 && (
                <div className="mt-12 flex justify-center">
                  <AdSenseAd slot="3456789012" style={{ margin: "24px 0" }} />
                </div>
              )}
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
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-8 py-4 rounded-full transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Car Affordability Calculator
              </Link>
              <Link
                href="/car-loan-prepayment-calculator"
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold text-lg px-8 py-4 rounded-full transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
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