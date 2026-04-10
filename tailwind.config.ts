import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        headline: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        label: ['Inter', 'sans-serif'],
      },
      colors: {
        // Stitch Design System — Ascelo.ai dark theme
        background: '#0e1322',
        surface: '#0e1322',
        'surface-dim': '#0e1322',
        'surface-bright': '#343949',
        'surface-container-lowest': '#090e1c',
        'surface-container-low': '#161b2b',
        'surface-container': '#1a1f2f',
        'surface-container-high': '#25293a',
        'surface-container-highest': '#2f3445',
        'surface-variant': '#2f3445',
        primary: {
          DEFAULT: '#4cd7f6',
          container: '#06b6d4',
          fixed: '#acedff',
          'fixed-dim': '#4cd7f6',
        },
        secondary: {
          DEFAULT: '#ffb0cd',
          container: '#aa0266',
        },
        tertiary: {
          DEFAULT: '#00e1ab',
          container: '#00bd8f',
        },
        'on-surface': '#dee1f7',
        'on-surface-variant': '#bcc9cd',
        'on-primary': '#003640',
        'on-primary-container': '#00424f',
        'on-secondary': '#640039',
        'on-tertiary': '#003828',
        'on-background': '#dee1f7',
        outline: {
          DEFAULT: '#869397',
          variant: '#3d494c',
        },
        error: '#ffb4ab',
        'error-container': '#93000a',
        'inverse-surface': '#dee1f7',
        'inverse-on-surface': '#2b3040',
        'inverse-primary': '#00687a',
        // Legacy compatibility
        cta: '#06B6D4',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        foreground: 'hsl(var(--foreground))',
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        scroll: 'scroll 30s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
