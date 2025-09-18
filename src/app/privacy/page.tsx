'use client'

import { Shield, Eye, Cookie, UserX } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'

export default function PrivacyPolicyPage() {
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
              <Link href="/privacy" className={`font-medium text-blue-600`}>
                Privacy
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Shield className={`w-16 h-16 mx-auto mb-6 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
            <h1 className={`text-4xl sm:text-5xl font-bold mb-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Privacy Policy
            </h1>
            <p className={`text-xl ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
              Last updated: September 15, 2025
            </p>
          </div>

          <div className="space-y-12">
            {/* Introduction */}
            <section className={`p-8 rounded-2xl ${isLight ? 'bg-white border border-slate-200' : 'bg-slate-800/30 border border-slate-700'}`}>
              <h2 className={`text-2xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Introduction
              </h2>
              <p className={`text-lg ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                BudgetGear (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website at budgetgear.in and our car finance calculator services.
              </p>
            </section>

            {/* Information Collection */}
            <section className={`p-8 rounded-2xl ${isLight ? 'bg-slate-50 border border-slate-200' : 'bg-slate-800/30 border border-slate-700'}`}>
              <div className="flex items-center mb-4">
                <Eye className={`w-8 h-8 mr-3 ${isLight ? 'text-green-600' : 'text-green-400'}`} />
                <h2 className={`text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Information We Collect
                </h2>
              </div>

              <h3 className={`text-xl font-semibold mb-3 ${isLight ? 'text-slate-800' : 'text-white/90'}`}>
                Information You Provide
              </h3>
              <ul className={`list-disc list-inside mb-6 space-y-2 ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                <li>Calculator input data (car prices, loan amounts, interest rates, income details)</li>
                <li>Contact information if you reach out to us</li>
                <li>Feedback or suggestions you provide</li>
              </ul>

              <h3 className={`text-xl font-semibold mb-3 ${isLight ? 'text-slate-800' : 'text-white/90'}`}>
                Automatically Collected Information
              </h3>
              <ul className={`list-disc list-inside space-y-2 ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                <li>IP address and location data</li>
                <li>Browser type and version</li>
                <li>Device information (mobile, desktop, tablet)</li>
                <li>Pages visited and time spent on site</li>
                <li>Referral source and search terms</li>
              </ul>
            </section>

            {/* Google AdSense */}
            <section className={`p-8 rounded-2xl ${isLight ? 'bg-white border border-slate-200' : 'bg-slate-800/30 border border-slate-700'}`}>
              <div className="flex items-center mb-4">
                <Cookie className={`w-8 h-8 mr-3 ${isLight ? 'text-orange-600' : 'text-orange-400'}`} />
                <h2 className={`text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Google AdSense and Advertising
                </h2>
              </div>

              <p className={`text-lg mb-4 ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                We use Google AdSense to display advertisements on our website. Google AdSense uses cookies and similar technologies to serve ads based on your previous visits to our website or other websites.
              </p>

              <h3 className={`text-xl font-semibold mb-3 ${isLight ? 'text-slate-800' : 'text-white/90'}`}>
                How Google AdSense Works
              </h3>
              <ul className={`list-disc list-inside mb-6 space-y-2 ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                <li>Google uses cookies to serve ads based on your interests</li>
                <li>Ad personalization can be controlled through Google Ad Settings</li>
                <li>You can opt out of personalized advertising at any time</li>
                <li>Third-party vendors may also show our ads on sites across the internet</li>
              </ul>

              <h3 className={`text-xl font-semibold mb-3 ${isLight ? 'text-slate-800' : 'text-white/90'}`}>
                Cookie Information
              </h3>
              <p className={`text-lg mb-4 ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                Google AdSense uses the following types of cookies:
              </p>
              <ul className={`list-disc list-inside space-y-2 ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                <li><strong>Advertising cookies:</strong> To show relevant ads and measure ad performance</li>
                <li><strong>Analytics cookies:</strong> To understand how users interact with ads</li>
                <li><strong>Functionality cookies:</strong> To remember your preferences and settings</li>
              </ul>
            </section>

            {/* Data Usage */}
            <section className={`p-8 rounded-2xl ${isLight ? 'bg-slate-50 border border-slate-200' : 'bg-slate-800/30 border border-slate-700'}`}>
              <h2 className={`text-2xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                How We Use Your Information
              </h2>
              <ul className={`list-disc list-inside space-y-2 ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                <li>Provide and maintain our calculator services</li>
                <li>Improve user experience and website functionality</li>
                <li>Analyze website usage and performance</li>
                <li>Respond to customer inquiries and support requests</li>
                <li>Display relevant advertisements through Google AdSense</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            {/* Data Sharing */}
            <section className={`p-8 rounded-2xl ${isLight ? 'bg-white border border-slate-200' : 'bg-slate-800/30 border border-slate-700'}`}>
              <h2 className={`text-2xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Data Sharing and Disclosure
              </h2>
              <p className={`text-lg mb-4 ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                We do not sell, trade, or rent your personal information to third parties. We may share information in the following circumstances:
              </p>
              <ul className={`list-disc list-inside space-y-2 ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                <li><strong>With Google:</strong> Through AdSense for advertising purposes</li>
                <li><strong>Analytics providers:</strong> To understand website usage</li>
                <li><strong>Legal compliance:</strong> When required by law or to protect our rights</li>
                <li><strong>Service providers:</strong> Who help us operate our website</li>
              </ul>
            </section>

            {/* User Rights */}
            <section className={`p-8 rounded-2xl ${isLight ? 'bg-slate-50 border border-slate-200' : 'bg-slate-800/30 border border-slate-700'}`}>
              <div className="flex items-center mb-4">
                <UserX className={`w-8 h-8 mr-3 ${isLight ? 'text-purple-600' : 'text-purple-400'}`} />
                <h2 className={`text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Your Rights and Choices
                </h2>
              </div>

              <h3 className={`text-xl font-semibold mb-3 ${isLight ? 'text-slate-800' : 'text-white/90'}`}>
                Cookie Control
              </h3>
              <ul className={`list-disc list-inside mb-6 space-y-2 ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                <li>You can control cookies through your browser settings</li>
                <li>Visit Google Ad Settings to manage ad personalization</li>
                <li>Use Google&apos;s Ads Preferences Manager to opt out</li>
                <li>Install browser extensions that block tracking cookies</li>
              </ul>

              <h3 className={`text-xl font-semibold mb-3 ${isLight ? 'text-slate-800' : 'text-white/90'}`}>
                Data Rights
              </h3>
              <ul className={`list-disc list-inside space-y-2 ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                <li>Request information about data we collect</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to data processing</li>
              </ul>
            </section>

            {/* Data Security */}
            <section className={`p-8 rounded-2xl ${isLight ? 'bg-white border border-slate-200' : 'bg-slate-800/30 border border-slate-700'}`}>
              <h2 className={`text-2xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Data Security
              </h2>
              <p className={`text-lg ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                We implement appropriate security measures to protect your information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
              </p>
            </section>

            {/* Children's Privacy */}
            <section className={`p-8 rounded-2xl ${isLight ? 'bg-slate-50 border border-slate-200' : 'bg-slate-800/30 border border-slate-700'}`}>
              <h2 className={`text-2xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Children&apos;s Privacy
              </h2>
              <p className={`text-lg ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                Our services are not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe your child has provided personal information, please contact us.
              </p>
            </section>

            {/* Updates */}
            <section className={`p-8 rounded-2xl ${isLight ? 'bg-white border border-slate-200' : 'bg-slate-800/30 border border-slate-700'}`}>
              <h2 className={`text-2xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Policy Updates
              </h2>
              <p className={`text-lg ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page with an updated &quot;Last modified&quot; date.
              </p>
            </section>

            {/* Contact */}
            <section className={`p-8 rounded-2xl text-center ${isLight ? 'bg-blue-50 border border-blue-200' : 'bg-blue-900/20 border border-blue-700'}`}>
              <h2 className={`text-2xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Contact Us
              </h2>
              <p className={`text-lg mb-6 ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                If you have questions about this Privacy Policy or our data practices, please contact us:
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