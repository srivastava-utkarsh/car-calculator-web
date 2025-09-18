'use client'

import { FileText, AlertTriangle, Scale, Ban } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'

export default function TermsPage() {
  const { isLight } = useTheme()

  return (
    <main className={`min-h-screen ${isLight ? 'bg-gradient-to-br from-slate-50 via-white to-slate-50' : 'bg-black'}`}>
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
            <nav className="flex items-center space-x-6">
              <Link href="/" className={`font-medium hover:text-blue-600 transition-colors ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                Home
              </Link>
              <Link href="/about" className={`font-medium hover:text-blue-600 transition-colors ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                About
              </Link>
              <Link href="/terms" className={`font-medium text-blue-600`}>
                Terms
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Scale className={`w-16 h-16 mx-auto mb-6 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
            <h1 className={`text-4xl sm:text-5xl font-bold mb-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Terms of Use
            </h1>
            <p className={`text-xl ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
              Last updated: September 15, 2025
            </p>
          </div>

          <div className="space-y-12">
            {/* Agreement */}
            <section className={`p-8 rounded-2xl ${isLight ? 'bg-white border border-slate-200' : 'bg-slate-800/30 border border-slate-700'}`}>
              <h2 className={`text-2xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Agreement to Terms
              </h2>
              <p className={`text-lg ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                By accessing and using BudgetGear (budgetgear.in), you accept and agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            {/* Service Description */}
            <section className={`p-8 rounded-2xl ${isLight ? 'bg-slate-50 border border-slate-200' : 'bg-slate-800/30 border border-slate-700'}`}>
              <div className="flex items-center mb-4">
                <FileText className={`w-8 h-8 mr-3 ${isLight ? 'text-green-600' : 'text-green-400'}`} />
                <h2 className={`text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Service Description
                </h2>
              </div>
              <p className={`text-lg mb-4 ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                BudgetGear provides free online financial calculators specifically designed for car financing, including:
              </p>
              <ul className={`list-disc list-inside space-y-2 ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                <li>Car affordability calculator based on income and expenses</li>
                <li>EMI (Equated Monthly Installment) calculator for car loans</li>
                <li>Loan prepayment calculator for interest savings analysis</li>
                <li>Financial planning tools following the 20/4/10 rule</li>
              </ul>
            </section>

            {/* Disclaimer */}
            <section className={`p-8 rounded-2xl ${isLight ? 'bg-yellow-50 border border-yellow-200' : 'bg-yellow-900/20 border border-yellow-700'}`}>
              <div className="flex items-center mb-4">
                <AlertTriangle className={`w-8 h-8 mr-3 ${isLight ? 'text-yellow-600' : 'text-yellow-400'}`} />
                <h2 className={`text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Important Disclaimer
                </h2>
              </div>

              <div className="space-y-4">
                <p className={`text-lg font-semibold ${isLight ? 'text-yellow-800' : 'text-yellow-200'}`}>
                  All calculations are estimates for informational purposes only.
                </p>

                <div className={`${isLight ? 'text-slate-700' : 'text-white/90'}`}>
                  <h3 className="text-lg font-semibold mb-2">What This Means:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Results are approximations and may not match actual loan offers</li>
                    <li>Banks and lenders have their own calculation methods and criteria</li>
                    <li>Interest rates, fees, and terms vary by lender and individual circumstances</li>
                    <li>We do not guarantee loan approval or specific terms</li>
                  </ul>
                </div>

                <div className={`${isLight ? 'text-slate-700' : 'text-white/90'}`}>
                  <h3 className="text-lg font-semibold mb-2">Professional Advice:</h3>
                  <p>Always consult with qualified financial advisors, banks, or certified financial planners before making significant financial decisions.</p>
                </div>
              </div>
            </section>

            {/* User Responsibilities */}
            <section className={`p-8 rounded-2xl ${isLight ? 'bg-white border border-slate-200' : 'bg-slate-800/30 border border-slate-700'}`}>
              <h2 className={`text-2xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                User Responsibilities
              </h2>
              <p className={`text-lg mb-4 ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                When using our services, you agree to:
              </p>
              <ul className={`list-disc list-inside space-y-2 ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                <li>Provide accurate information for calculations</li>
                <li>Use the service for personal, non-commercial purposes</li>
                <li>Not attempt to reverse engineer or copy our calculation algorithms</li>
                <li>Not use the service for any illegal or unauthorized purposes</li>
                <li>Understand that calculations are estimates, not guarantees</li>
                <li>Verify all financial decisions with qualified professionals</li>
              </ul>
            </section>

            {/* Prohibited Uses */}
            <section className={`p-8 rounded-2xl ${isLight ? 'bg-red-50 border border-red-200' : 'bg-red-900/20 border border-red-700'}`}>
              <div className="flex items-center mb-4">
                <Ban className={`w-8 h-8 mr-3 ${isLight ? 'text-red-600' : 'text-red-400'}`} />
                <h2 className={`text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Prohibited Uses
                </h2>
              </div>
              <p className={`text-lg mb-4 ${isLight ? 'text-slate-700' : 'text-white/90'}`}>
                You may not use BudgetGear to:
              </p>
              <ul className={`list-disc list-inside space-y-2 ${isLight ? 'text-slate-700' : 'text-white/90'}`}>
                <li>Provide financial advice to others without proper licensing</li>
                <li>Scrape, copy, or redistribute our content without permission</li>
                <li>Attempt to hack, disrupt, or damage our systems</li>
                <li>Upload malicious code or conduct automated attacks</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Impersonate BudgetGear or its representatives</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section className={`p-8 rounded-2xl ${isLight ? 'bg-slate-50 border border-slate-200' : 'bg-slate-800/30 border border-slate-700'}`}>
              <h2 className={`text-2xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Intellectual Property
              </h2>
              <p className={`text-lg mb-4 ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                All content, features, and functionality on BudgetGear, including but not limited to:
              </p>
              <ul className={`list-disc list-inside mb-4 space-y-2 ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                <li>Text, graphics, logos, and images</li>
                <li>Calculator algorithms and formulas</li>
                <li>Software, code, and user interface design</li>
                <li>Trademarks and service marks</li>
              </ul>
              <p className={`text-lg ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                Are owned by BudgetGear and protected by copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section className={`p-8 rounded-2xl ${isLight ? 'bg-white border border-slate-200' : 'bg-slate-800/30 border border-slate-700'}`}>
              <h2 className={`text-2xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Limitation of Liability
              </h2>
              <p className={`text-lg mb-4 ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                To the maximum extent permitted by law, BudgetGear shall not be liable for:
              </p>
              <ul className={`list-disc list-inside space-y-2 ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                <li>Any financial losses resulting from calculator use</li>
                <li>Inaccurate calculations or estimation errors</li>
                <li>Decisions made based on our calculator results</li>
                <li>Service interruptions or technical issues</li>
                <li>Third-party actions or omissions</li>
                <li>Any indirect, incidental, or consequential damages</li>
              </ul>
            </section>

            {/* Service Availability */}
            <section className={`p-8 rounded-2xl ${isLight ? 'bg-slate-50 border border-slate-200' : 'bg-slate-800/30 border border-slate-700'}`}>
              <h2 className={`text-2xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Service Availability
              </h2>
              <p className={`text-lg ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                We strive to maintain service availability but cannot guarantee uninterrupted access. We may modify, suspend, or discontinue any part of our service at any time without notice. We are not liable for any service interruptions or modifications.
              </p>
            </section>

            {/* Privacy */}
            <section className={`p-8 rounded-2xl ${isLight ? 'bg-white border border-slate-200' : 'bg-slate-800/30 border border-slate-700'}`}>
              <h2 className={`text-2xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Privacy
              </h2>
              <p className={`text-lg ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                Your privacy is important to us. Please review our Privacy Policy, which explains how we collect, use, and protect your information when you use our services.
              </p>
              <Link
                href="/privacy"
                className={`inline-block mt-4 text-blue-600 hover:text-blue-700 font-semibold`}
              >
                Read Privacy Policy →
              </Link>
            </section>

            {/* Changes to Terms */}
            <section className={`p-8 rounded-2xl ${isLight ? 'bg-slate-50 border border-slate-200' : 'bg-slate-800/30 border border-slate-700'}`}>
              <h2 className={`text-2xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Changes to Terms
              </h2>
              <p className={`text-lg ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the service after any changes constitutes acceptance of the new terms.
              </p>
            </section>

            {/* Governing Law */}
            <section className={`p-8 rounded-2xl ${isLight ? 'bg-white border border-slate-200' : 'bg-slate-800/30 border border-slate-700'}`}>
              <h2 className={`text-2xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Governing Law
              </h2>
              <p className={`text-lg ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                These terms are governed by and construed in accordance with the laws of India. Any legal disputes will be subject to the exclusive jurisdiction of the courts in India.
              </p>
            </section>

            {/* Contact */}
            <section className={`p-8 rounded-2xl text-center ${isLight ? 'bg-blue-50 border border-blue-200' : 'bg-blue-900/20 border border-blue-700'}`}>
              <h2 className={`text-2xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Questions About These Terms?
              </h2>
              <p className={`text-lg mb-6 ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                If you have questions about these Terms of Use, please contact us.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-200 hover:scale-105"
              >
                Contact Us
              </Link>
            </section>
          </div>
        </div>
      </div>

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
            <div className="flex justify-center space-x-6 text-sm">
              <Link href="/privacy" className={`hover:text-blue-600 ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
                Privacy Policy
              </Link>
              <Link href="/terms" className={`hover:text-blue-600 ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
                Terms of Use
              </Link>
              <Link href="/contact" className={`hover:text-blue-600 ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}