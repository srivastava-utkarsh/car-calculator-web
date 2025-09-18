'use client'

import { Mail, MessageSquare, HelpCircle, Send } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'
import { useState } from 'react'

export default function ContactPage() {
  const { isLight } = useTheme()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Show success alert
    alert('Message sent successfully! Thank you for contacting us.')

    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

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
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className={`font-medium hover:text-blue-600 transition-colors ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                Home
              </Link>
              <Link href="/about" className={`font-medium hover:text-blue-600 transition-colors ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                About
              </Link>
              <Link href="/car-affordability-calculator" className={`font-medium hover:text-blue-600 transition-colors ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                Calculators
              </Link>
              <Link href="/contact" className={`font-medium text-blue-600`}>
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
            <Mail className={`w-16 h-16 mx-auto mb-6 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
            <h1 className={`text-4xl sm:text-5xl font-bold mb-6 tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Contact Us
            </h1>
            <p className={`text-xl mb-12 font-medium max-w-3xl mx-auto ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
              Have questions about our calculators? Need help with car financing? We&apos;re here to help you make informed financial decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className={`py-16 ${isLight ? 'bg-white' : 'bg-slate-900/20'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className={`text-3xl font-bold text-center mb-12 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              How Can We Help You?
            </h2>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className={`p-8 rounded-2xl text-center ${isLight ? 'bg-slate-50 border border-slate-200' : 'bg-slate-800/30 border border-slate-700'}`}>
                <HelpCircle className={`w-12 h-12 mx-auto mb-6 ${isLight ? 'text-green-600' : 'text-green-400'}`} />
                <h3 className={`text-xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  General Questions
                </h3>
                <p className={`${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                  Questions about how our calculators work, methodology, or general car financing advice.
                </p>
              </div>

              <div className={`p-8 rounded-2xl text-center ${isLight ? 'bg-slate-50 border border-slate-200' : 'bg-slate-800/30 border border-slate-700'}`}>
                <MessageSquare className={`w-12 h-12 mx-auto mb-6 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
                <h3 className={`text-xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Technical Support
                </h3>
                <p className={`${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                  Having trouble using our calculators? Report bugs, technical issues, or accessibility concerns.
                </p>
              </div>

              <div className={`p-8 rounded-2xl text-center ${isLight ? 'bg-slate-50 border border-slate-200' : 'bg-slate-800/30 border border-slate-700'}`}>
                <Send className={`w-12 h-12 mx-auto mb-6 ${isLight ? 'text-purple-600' : 'text-purple-400'}`} />
                <h3 className={`text-xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Feedback & Suggestions
                </h3>
                <p className={`${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                  Ideas for new features, calculator improvements, or content suggestions to better serve users.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className={`p-8 rounded-3xl ${isLight ? 'bg-white border border-slate-200 shadow-lg' : 'bg-slate-800/30 border border-slate-700'}`}>
              <h2 className={`text-3xl font-bold text-center mb-8 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Send Us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className={`block text-sm font-medium mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-white'}`}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className={`block text-sm font-medium mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-white'}`}
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className={`block text-sm font-medium mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-white'}`}
                  >
                    <option value="">Select a topic</option>
                    <option value="general">General Question</option>
                    <option value="technical">Technical Support</option>
                    <option value="calculator">Calculator Help</option>
                    <option value="feedback">Feedback & Suggestions</option>
                    <option value="privacy">Privacy Concerns</option>
                    <option value="business">Business Inquiry</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className={`block text-sm font-medium mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-white'}`}
                    placeholder="Please provide details about your question, issue, or feedback..."
                  />
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-full transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </button>
                  <p className={`mt-4 text-sm ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
                    We&apos;ll get back to you within 24-48 hours.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Response Time */}
      <section className={`py-16 ${isLight ? 'bg-slate-50' : 'bg-slate-900/20'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className={`text-3xl font-bold mb-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              What to Expect
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className={`p-6 rounded-2xl ${isLight ? 'bg-white border border-slate-200' : 'bg-slate-800/30 border border-slate-700'}`}>
                <h3 className={`text-xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Response Time
                </h3>
                <p className={`${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                  We typically respond to all inquiries within 24-48 hours during business days. Technical issues are prioritized and addressed quickly.
                </p>
              </div>

              <div className={`p-6 rounded-2xl ${isLight ? 'bg-white border border-slate-200' : 'bg-slate-800/30 border border-slate-700'}`}>
                <h3 className={`text-xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Privacy Assurance
                </h3>
                <p className={`${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                  Your personal information is kept confidential and is only used to respond to your inquiry. We never share contact details with third parties.
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