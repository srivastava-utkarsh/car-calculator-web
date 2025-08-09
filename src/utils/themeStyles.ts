// Theme-based styling utility inspired by professional financial websites like Bankrate, ICICI Bank, and Mint

export interface ThemeStyles {
  // Main backgrounds
  mainBg: string
  cardBg: string
  headerBg: string
  
  // Text colors
  primaryText: string
  secondaryText: string
  mutedText: string
  
  // Borders and dividers
  border: string
  divider: string
  
  // Form elements
  inputBg: string
  inputBorder: string
  inputFocus: string
  
  // Buttons and interactive elements
  primaryButton: string
  secondaryButton: string
  
  // Status colors (keeping consistent across themes)
  success: string
  warning: string
  error: string
  info: string
  
  // Professional accents
  accent: string
  accentSecondary: string
  
  // Shadows and effects
  shadow: string
  cardShadow: string
}

export const lightTheme: ThemeStyles = {
  // Clean, professional white theme inspired by Bankrate and ICICI Bank
  mainBg: 'bg-gradient-to-br from-slate-50 via-white to-slate-50',
  cardBg: 'bg-white border border-slate-200/60 shadow-sm',
  headerBg: 'bg-white border-b border-slate-200/60',
  
  // Professional text hierarchy
  primaryText: 'text-slate-900',
  secondaryText: 'text-slate-700',
  mutedText: 'text-slate-500',
  
  // Subtle, professional borders
  border: 'border-slate-200/60',
  divider: 'border-slate-100',
  
  // Clean form styling
  inputBg: 'bg-white',
  inputBorder: 'border-slate-300 focus:border-blue-500',
  inputFocus: 'focus:ring-2 focus:ring-blue-500/20',
  
  // Professional blue buttons (common in financial sites)
  primaryButton: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white',
  secondaryButton: 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300',
  
  // Consistent status colors
  success: 'text-green-600 bg-green-50 border-green-200',
  warning: 'text-amber-600 bg-amber-50 border-amber-200',
  error: 'text-red-600 bg-red-50 border-red-200',
  info: 'text-blue-600 bg-blue-50 border-blue-200',
  
  // Professional financial blue accents
  accent: 'bg-blue-600',
  accentSecondary: 'bg-slate-100',
  
  // Subtle, professional shadows
  shadow: 'shadow-sm',
  cardShadow: 'shadow-lg shadow-slate-200/50'
}

export const darkTheme: ThemeStyles = {
  // Current dark theme (keeping as is)
  mainBg: 'bg-black',
  cardBg: 'bg-white/5 backdrop-blur-xl border border-white/10',
  headerBg: 'bg-black border-b border-white/5',
  
  primaryText: 'text-white',
  secondaryText: 'text-white/90',
  mutedText: 'text-white/70',
  
  border: 'border-white/10',
  divider: 'border-white/5',
  
  inputBg: 'bg-white/5',
  inputBorder: 'border-white/20 focus:border-white/40',
  inputFocus: 'focus:ring-2 focus:ring-white/20',
  
  primaryButton: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white',
  secondaryButton: 'bg-white/10 hover:bg-white/20 text-white/90 border border-white/20',
  
  success: 'text-green-400 bg-green-500/10 border-green-400/20',
  warning: 'text-amber-400 bg-amber-500/10 border-amber-400/20',
  error: 'text-red-400 bg-red-500/10 border-red-400/20',
  info: 'text-blue-400 bg-blue-500/10 border-blue-400/20',
  
  accent: 'bg-blue-600',
  accentSecondary: 'bg-white/10',
  
  shadow: 'shadow-2xl',
  cardShadow: 'shadow-2xl shadow-black/10'
}

export function getThemeStyles(theme: 'light' | 'dark'): ThemeStyles {
  return theme === 'light' ? lightTheme : darkTheme
}

// Utility function for conditional theme classes
export function themeClass(lightClass: string, darkClass: string, isLight: boolean): string {
  return isLight ? lightClass : darkClass
}