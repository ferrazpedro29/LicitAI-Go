import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1B4FD8',
          50: '#EEF2FD',
          100: '#D5E0FA',
          600: '#1B4FD8',
          700: '#1540B0',
          800: '#0F3190',
        },
        action: {
          DEFAULT: '#10B981',
          50: '#ECFDF5',
          600: '#10B981',
          700: '#059669',
        },
        navy: {
          DEFAULT: '#0F2D5E',
          50: '#E8EDF5',
          100: '#C4D0E8',
          600: '#0F2D5E',
          700: '#0A1F42',
          800: '#061529',
          900: '#030C18',
        },
        surface: '#F8FAFF',
        border: '#E8EDF5',
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-dm-mono)', 'Menlo', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
