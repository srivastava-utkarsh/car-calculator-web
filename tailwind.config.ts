import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        surface: 'var(--surface)',
        'surface-variant': 'var(--surface-variant)',
        'on-surface': 'var(--on-surface)',
        'on-surface-variant': 'var(--on-surface-variant)',
        outline: 'var(--outline)',
        'outline-variant': 'var(--outline-variant)',
        'md-primary': 'var(--md-primary)',
        'md-primary-container': 'var(--md-primary-container)',
        'md-on-primary': 'var(--md-on-primary)',
        'md-on-primary-container': 'var(--md-on-primary-container)',
        'md-secondary': 'var(--md-secondary)',
        'md-secondary-container': 'var(--md-secondary-container)',
        'md-on-secondary': 'var(--md-on-secondary)',
        'md-on-secondary-container': 'var(--md-on-secondary-container)',
        'md-tertiary': 'var(--md-tertiary)',
        'md-tertiary-container': 'var(--md-tertiary-container)',
        'md-on-tertiary': 'var(--md-on-tertiary)',
        'md-on-tertiary-container': 'var(--md-on-tertiary-container)',
        'md-error': 'var(--md-error)',
        'md-error-container': 'var(--md-error-container)',
        'md-on-error': 'var(--md-on-error)',
        'md-on-error-container': 'var(--md-on-error-container)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      boxShadow: {
        'neo': '8px 8px 0px 0px #000000',
        'neo-sm': '4px 4px 0px 0px #000000',
        'neo-lg': '12px 12px 0px 0px #000000',
        'md-elevation-1': 'var(--elevation-1)',
        'md-elevation-2': 'var(--elevation-2)',
        'md-elevation-3': 'var(--elevation-3)',
        'md-elevation-4': 'var(--elevation-4)',
        'md-elevation-5': 'var(--elevation-5)',
      },
      dropShadow: {
        'glow': '0 0 20px rgba(251, 146, 60, 0.5)',
      }
    },
  },
  plugins: [],
}
export default config