'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'

export default function CookieBanner() {
  const { isLight } = useTheme()
  const [consent, setConsent] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already given consent
    const storedConsent = localStorage.getItem('cookie_consent')
    setConsent(storedConsent)
    
    // Show banner if no consent decision has been made
    if (!storedConsent) {
      // Delay showing banner slightly for better UX
      setTimeout(() => setIsVisible(true), 1000)
    }
  }, [])

  useEffect(() => {
    // Load AdSense script only after consent is granted
    if (consent === 'granted' && process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID) {
      const existingScript = document.querySelector('script[data-adsense]')
      if (!existingScript) {
        const script = document.createElement('script')
        script.setAttribute('data-adsense', 'true')
        script.async = true
        script.crossOrigin = 'anonymous'
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`
        document.head.appendChild(script)
      }
    }
  }, [consent])

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'granted')
    setConsent('granted')
    setIsVisible(false)
  }

  const handleReject = () => {
    localStorage.setItem('cookie_consent', 'denied')
    setConsent('denied')
    setIsVisible(false)
  }

  // Don't render if consent decision has been made or banner not yet visible
  if (consent || !isVisible) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998] transition-opacity duration-300"
        style={{ opacity: isVisible ? 1 : 0 }}
      />
      
      {/* Banner */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6 transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="container mx-auto max-w-6xl">
          <div 
            className={`rounded-2xl shadow-2xl p-6 sm:p-8 ${
              isLight 
                ? 'bg-white border border-slate-200' 
                : 'bg-slate-900 border border-slate-700'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Icon */}
              <div className={`flex-shrink-0 p-3 rounded-xl ${
                isLight ? 'bg-blue-100' : 'bg-blue-900/30'
              }`}>
                <svg 
                  className={`w-8 h-8 ${isLight ? 'text-blue-600' : 'text-blue-400'}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className={`text-lg sm:text-xl font-bold mb-2 ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  We Use Cookies
                </h3>
                <p className={`text-sm sm:text-base mb-3 ${
                  isLight ? 'text-slate-600' : 'text-white/80'
                }`}>
                  We use cookies to enhance your experience and serve personalized ads through Google AdSense. 
                  By accepting, you consent to our use of cookies for analytics and advertising.{' '}
                  <Link 
                    href="/privacy" 
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Learn more
                  </Link>
                </p>
                <p className={`text-xs ${
                  isLight ? 'text-slate-500' : 'text-white/60'
                }`}>
                  Your calculator data is always processed locally and never stored on our servers.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={handleAccept}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap"
                >
                  Accept All
                </button>
                <button
                  onClick={handleReject}
                  className={`px-6 py-3 font-semibold rounded-xl transition-all duration-200 whitespace-nowrap ${
                    isLight
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
