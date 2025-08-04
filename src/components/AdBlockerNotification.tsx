'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, Coffee, Shield } from 'lucide-react'

interface AdBlockerNotificationProps {
  onDismiss: () => void
}

export default function AdBlockerNotification({ onDismiss }: AdBlockerNotificationProps) {
  const [isDismissed, setIsDismissed] = useState(false)

  const handleDismiss = () => {
    setIsDismissed(true)
    setTimeout(onDismiss, 300) // Wait for animation to complete
  }

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 shadow-lg border-b border-white/10"
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4 max-w-6xl mx-auto">
              
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Message */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <Heart className="w-4 h-4 text-pink-300" />
                  <span className="text-white font-semibold text-sm">
                    We noticed you&apos;re using an ad blocker
                  </span>
                </div>
                <p className="text-white/90 text-xs leading-relaxed">
                  Our free car finance calculator is supported by ads. Consider whitelisting us to help keep this tool free for everyone!
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={handleDismiss}
                  className="hidden sm:flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border border-white/20 hover:border-white/30"
                >
                  <Coffee className="w-3 h-3" />
                  <span>Maybe Later</span>
                </button>
                
                <button
                  onClick={handleDismiss}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
                  aria-label="Dismiss notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mobile Action Button */}
            <div className="sm:hidden mt-3 flex justify-center">
              <button
                onClick={handleDismiss}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 border border-white/20"
              >
                <Coffee className="w-3 h-3" />
                <span>I&apos;ll consider it</span>
              </button>
            </div>
          </div>

          {/* Subtle bottom border animation */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent origin-left"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}