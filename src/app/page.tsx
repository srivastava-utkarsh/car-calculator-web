'use client'

import { Calculator, TrendingUp, Shield } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import { useTheme } from '@/contexts/ThemeContext'
import AdSenseAd from '@/components/AdSenseAd'



export default function HomePage() {
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
              <Link href="/" className={`font-medium text-blue-600`}>
                Home
              </Link>
              <Link href="/blog" className={`font-medium hover:text-blue-600 transition-colors ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                Blog
              </Link>
              <Link href="/about" className={`font-medium hover:text-blue-600 transition-colors ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                About
              </Link>
              <Link href="/how-it-works" className={`font-medium hover:text-blue-600 transition-colors ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                How It Works
              </Link>
              <Link href="/contact" className={`font-medium hover:text-blue-600 transition-colors ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Main Heading */}
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Car Buying Calculator - Calculate Your Ideal Car Budget
            </h1>
            
            {/* Subtitle */}
            <p className={`text-lg sm:text-xl mb-8 font-medium max-w-3xl mx-auto ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
              Figure out the total buying and monthly cost of the car and make affordability decision accordingly. Reduce loan faster and reduce EMI faster with our calculators. Get overall cost of running a car monthly basis after purchase using our proven 20/4/10 rule.
            </p>

            {/* Additional Context with Trust Signals */}
            <div className={`max-w-4xl mx-auto mb-12 p-8 rounded-2xl ${isLight ? 'bg-slate-50 border border-slate-200' : 'bg-slate-800/30 border border-slate-700'}`}>
              <h2 className={`text-2xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Why BudgetGear is India&apos;s Trusted Car Finance Calculator
              </h2>
              <p className={`text-base mb-4 ${isLight ? 'text-slate-700' : 'text-white/90'}`}>
                BudgetGear provides professional car finance calculators trusted by over 50,000+ users across India every month. Our tools help you calculate your ideal car budget based on salary, determine monthly EMI payments, plan loan prepayments, and understand the complete cost of car ownership. Whether you want to buy a new car or reduce your existing loan burden, our calculators follow industry-standard formulas used by major Indian banks including SBI, HDFC, ICICI, and Axis Bank.
              </p>
              <p className={`text-base mb-4 ${isLight ? 'text-slate-700' : 'text-white/90'}`}>
                Founded in 2024 by financial technology experts, we believe in financial transparency and empowering car buyers with accurate, unbiased information. Our comprehensive guides cover everything from the proven 20/4/10 car buying rule to hidden costs of car ownership, helping you make informed decisions that align with your financial goals. All our calculators are 100% free to use, require no registration, and provide instant results with detailed breakdowns including amortization schedules and interest savings projections.
              </p>
              <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t ${isLight ? 'border-slate-200' : 'border-slate-700'}`}>
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-1 ${isLight ? 'text-blue-600' : 'text-blue-400'}`}>50,000+</div>
                  <div className={`text-sm ${isLight ? 'text-slate-600' : 'text-white/70'}`}>Monthly Users</div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-1 ${isLight ? 'text-green-600' : 'text-green-400'}`}>100%</div>
                  <div className={`text-sm ${isLight ? 'text-slate-600' : 'text-white/70'}`}>Free Tools</div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-1 ${isLight ? 'text-purple-600' : 'text-purple-400'}`}>25+</div>
                  <div className={`text-sm ${isLight ? 'text-slate-600' : 'text-white/70'}`}>Expert Guides</div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-1 ${isLight ? 'text-orange-600' : 'text-orange-400'}`}>4.8/5</div>
                  <div className={`text-sm ${isLight ? 'text-slate-600' : 'text-white/70'}`}>User Rating</div>
                </div>
              </div>
            </div>

            {/* Features Grid - More Prominent */}
            <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
              {/* Car Affordability */}
              <Link 
                href="/car-affordability-calculator"
                className={`block text-center p-10 rounded-3xl border min-h-[400px] flex flex-col ${isLight ? 'bg-white border-slate-200 shadow-lg hover:shadow-xl' : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800/60'} transition-all duration-300 hover:scale-105`}
              >
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 ${isLight ? 'bg-blue-100' : 'bg-blue-500/20'}`}>
                  <Calculator className={`w-10 h-10 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
                </div>
                <h2 className={`text-2xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  How Much Car Can I Afford?
                </h2>
                <p className={`text-lg mb-6 leading-relaxed flex-grow ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                  Figure out the total buying cost of car and monthly cost breakdown. Make affordability decision based on your salary. Calculate overall cost of running a car monthly to determine total car ownership expenses.
                </p>
                <div className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-10 py-4 rounded-full transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl">
                  Calculate Affordability
                </div>
              </Link>

              {/* Prepayment Calculator */}
              <Link 
                href="/car-loan-prepayment-calculator"
                className={`block text-center p-10 rounded-3xl border min-h-[400px] flex flex-col ${isLight ? 'bg-white border-slate-200 shadow-lg hover:shadow-xl' : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800/60'} transition-all duration-300 hover:scale-105`}
              >
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 ${isLight ? 'bg-green-100' : 'bg-green-500/20'}`}>
                  <TrendingUp className={`w-10 h-10 ${isLight ? 'text-green-600' : 'text-green-400'}`} />
                </div>
                <h2 className={`text-2xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Car Loan Prepayment Calculator India
                </h2>
                <p className={`text-lg mb-6 leading-relaxed flex-grow ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                  Reduce loan faster and reduce EMI faster with prepayment strategies. Calculate monthly cost savings and total buying cost reduction through smart prepayment planning.
                </p>
                <div className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold text-lg px-10 py-4 rounded-full transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl">
                  Plan Prepayments
                </div>
              </Link>
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

            {/* AdSense Ad - After main content */}
            <div className="mt-12 flex justify-center">
              <AdSenseAd slot="1234567890" style={{ margin: "24px 0" }} />
            </div>
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className={`text-3xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Car Finance Guides & Resources
              </h2>
              <p className={`text-lg ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                Expert insights on car loans, EMI calculations, and smart car buying strategies
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Link href="/blog/20-4-10-car-buying-rule-india" className={`p-6 rounded-2xl border transition-all hover:scale-105 ${isLight ? 'bg-white border-slate-200 hover:shadow-xl' : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800/60'}`}>
                <div className={`text-sm font-semibold mb-2 ${isLight ? 'text-blue-600' : 'text-blue-400'}`}>Car Buying Tips</div>
                <h3 className={`text-lg font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>20/4/10 Car Buying Rule</h3>
                <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-white/80'}`}>Learn the proven rule for smart car financing</p>
              </Link>
              <Link href="/blog/how-much-car-afford-salary" className={`p-6 rounded-2xl border transition-all hover:scale-105 ${isLight ? 'bg-white border-slate-200 hover:shadow-xl' : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800/60'}`}>
                <div className={`text-sm font-semibold mb-2 ${isLight ? 'text-blue-600' : 'text-blue-400'}`}>Affordability</div>
                <h3 className={`text-lg font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>How Much Car Can You Afford?</h3>
                <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-white/80'}`}>Calculate your ideal car budget based on salary</p>
              </Link>
              <Link href="/blog/car-prepayment-strategies-save-money" className={`p-6 rounded-2xl border transition-all hover:scale-105 ${isLight ? 'bg-white border-slate-200 hover:shadow-xl' : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800/60'}`}>
                <div className={`text-sm font-semibold mb-2 ${isLight ? 'text-blue-600' : 'text-blue-400'}`}>Loan Prepayment</div>
                <h3 className={`text-lg font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>Prepayment Strategies</h3>
                <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-white/80'}`}>Save money with smart prepayment tactics</p>
              </Link>
            </div>
            <div className="text-center">
              <Link href="/blog" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full transition-all">
                View All Articles
              </Link>
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
                  How Much Car Can I Afford Based on My Salary?
                </h3>
                <p className={`text-lg ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                  Use our car buying calculator to determine how much you can afford to spend. Calculate your ideal car budget based on your income, existing EMIs, down payment capacity, and follow the 20/4/10 rule for smart car purchasing decisions.
                </p>
              </div>

              {/* FAQ 5 - New */}
              <div className={`p-6 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/30 border-slate-700'}`}>
                <h3 className={`text-xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Want to Buy a New Car? Here is How to Calculate Your Budget
                </h3>
                <p className={`text-lg ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                  Start by calculating 10% of your monthly salary for total car expenses. Then determine your down payment capacity (20% recommended), choose appropriate loan tenure (4 years max), and use our calculator to find your ideal car budget range.
                </p>
              </div>

              {/* FAQ 6 - Loan EMI Prepayment */}
              <div className={`p-6 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/30 border-slate-700'}`}>
                <h3 className={`text-xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  How does Loan EMI Prepayment Calculator work?
                </h3>
                <p className={`text-lg ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                  Our Loan EMI Prepayment Calculator helps you calculate interest savings when you prepay your car loan. Input your current EMI details, prepayment amount, and get instant calculations for reduced tenure and total interest savings.
                </p>
              </div>

              {/* FAQ 7 - Total Buying Cost */}
              <div className={`p-6 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/30 border-slate-700'}`}>
                <h3 className={`text-xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  How to Figure Out the Total Buying Cost of Car?
                </h3>
                <p className={`text-lg ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                  Calculate total buying cost including car price, loan interest, insurance, registration, and taxes. Use our calculator to figure out monthly cost breakdown and make affordability decision based on your budget and financial capacity.
                </p>
              </div>

              {/* FAQ 8 - Monthly Running Cost */}
              <div className={`p-6 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/30 border-slate-700'}`}>
                <h3 className={`text-xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  How to Get Overall Cost of Running Car Monthly After Purchase?
                </h3>
                <p className={`text-lg ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                  Monthly car running cost includes EMI, fuel, insurance, maintenance, parking, and servicing. Calculate total car ownership cost to understand ongoing monthly expenses and plan your budget accordingly.
                </p>
              </div>

              {/* FAQ 9 - Reduce Loan Faster */}
              <div className={`p-6 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/30 border-slate-700'}`}>
                <h3 className={`text-xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  How to Reduce Loan Faster and Reduce EMI Faster?
                </h3>
                <p className={`text-lg ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                  Reduce loan faster through prepayments, higher down payment, or shorter tenure. Reduce EMI faster by refinancing at lower rates, making partial prepayments, or increasing payment frequency to save on total interest costs.
                </p>
              </div>

              {/* FAQ 10 - Car Buying Tips */}
              <div className={`p-6 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/30 border-slate-700'}`}>
                <h3 className={`text-xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Best Car Buying Tips for First-Time Buyers in India
                </h3>
                <p className={`text-lg ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                  Research car prices across dealers, negotiate on-road price including all charges, check loan terms from multiple banks, verify insurance coverage, inspect vehicle condition, and read all documents carefully before signing.
                </p>
              </div>

              {/* FAQ 11 - Car Insurance */}
              <div className={`p-6 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/30 border-slate-700'}`}>
                <h3 className={`text-xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  How Car Insurance Affects Your Total Car Budget?
                </h3>
                <p className={`text-lg ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                  Car insurance typically costs 2-4% of car value annually. Include comprehensive coverage, third-party liability, and add-ons in your budget. Compare policies, check claim settlement ratio, and factor renewal costs into monthly car ownership expenses.
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
              All calculations are estimates for informational purposes only. Consult with financial advisors for personalized advice. Last updated: {new Date().getFullYear()}.
            </p>
            <p className={`text-xs mt-2 ${isLight ? 'text-slate-500' : 'text-white/60'}`}>
              Trusted by thousands of users across India for accurate car loan calculations.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
