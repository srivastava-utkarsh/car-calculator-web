'use client'

import { useState, useEffect } from 'react'

export const useAdBlockerDetection = () => {
  const [isAdBlockerEnabled, setIsAdBlockerEnabled] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const detectAdBlocker = async () => {
      try {
        // Method 1: Try to create a fake ad element
        const adElement = document.createElement('div')
        adElement.innerHTML = '&nbsp;'
        adElement.className = 'adsbox'
        adElement.style.position = 'absolute'
        adElement.style.left = '-9999px'
        adElement.style.height = '1px'
        adElement.style.width = '1px'
        
        document.body.appendChild(adElement)
        
        // Wait a moment for ad blockers to process
        await new Promise(resolve => setTimeout(resolve, 100))
        
        const isBlocked = adElement.offsetHeight === 0 || 
                         adElement.offsetWidth === 0 || 
                         !adElement.offsetParent ||
                         window.getComputedStyle(adElement).display === 'none'
        
        document.body.removeChild(adElement)
        
        // Method 2: Check for common ad blocker properties
        const additionalChecks = 
          // @ts-expect-error - googletag may not be defined if ad blocker is active
          typeof window.googletag === 'undefined' &&
          // @ts-expect-error - adsbygoogle may not be defined if ad blocker is active
          typeof window.adsbygoogle === 'undefined' &&
          // Check for blocked scripts
          !document.querySelector('script[src*="googletagmanager"]') &&
          !document.querySelector('script[src*="googlesyndication"]')
        
        setIsAdBlockerEnabled(isBlocked || additionalChecks)
        
      } catch (error) {
        console.log('Ad blocker detection failed:', error)
        setIsAdBlockerEnabled(false)
      } finally {
        setIsLoading(false)
      }
    }

    // Run detection after page load
    if (typeof window !== 'undefined') {
      const timer = setTimeout(detectAdBlocker, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  return { isAdBlockerEnabled, isLoading }
}