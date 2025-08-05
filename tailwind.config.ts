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
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      boxShadow: {
        'neo': '8px 8px 0px 0px #000000',
        'neo-sm': '4px 4px 0px 0px #000000',
        'neo-lg': '12px 12px 0px 0px #000000',
      },
      dropShadow: {
        'glow': '0 0 20px rgba(251, 146, 60, 0.5)',
      }
    },
  },
  plugins: [],
}
export default config