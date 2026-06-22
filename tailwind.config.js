/** @type {import('tailwindcss').Config} */
// ZapZone design tokens — mirrors the customer web app (zappoint) visual identity.
// Brand: primary blue (#2563eb / #3b82f6), secondary violet (#8b5cf6), font Poppins.
// Semantic surface/text/border colors are driven by CSS variables (see global.css)
// so they switch automatically between light and dark themes.
module.exports = {
  darkMode: 'class',
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Semantic, theme-aware tokens (CSS variables resolved at runtime).
        bg: 'rgb(var(--color-bg) / <alpha-value>)',
        'bg-secondary': 'rgb(var(--color-bg-secondary) / <alpha-value>)',
        card: 'rgb(var(--color-card) / <alpha-value>)',
        input: 'rgb(var(--color-input) / <alpha-value>)',
        foreground: 'rgb(var(--color-text) / <alpha-value>)',
        muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
        subtle: 'rgb(var(--color-text-subtle) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        'border-subtle': 'rgb(var(--color-border-subtle) / <alpha-value>)',
        nav: 'rgb(var(--color-nav) / <alpha-value>)',
        'nav-active': 'rgb(var(--color-nav-active) / <alpha-value>)',

        // Brand scales (stable across themes).
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          foreground: 'rgb(var(--color-primary-foreground) / <alpha-value>)',
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        secondary: {
          DEFAULT: 'rgb(var(--color-secondary) / <alpha-value>)',
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        success: {
          DEFAULT: '#16a34a',
          fg: '#dcfce7',
          subtle: '#f0fdf4',
        },
        warning: {
          DEFAULT: '#d97706',
          fg: '#fef3c7',
          subtle: '#fffbeb',
        },
        danger: {
          DEFAULT: '#dc2626',
          fg: '#fee2e2',
          subtle: '#fef2f2',
        },
        info: {
          DEFAULT: '#2563eb',
          fg: '#dbeafe',
          subtle: '#eff6ff',
        },
      },
      fontFamily: {
        sans: ['Poppins_400Regular'],
        medium: ['Poppins_500Medium'],
        semibold: ['Poppins_600SemiBold'],
        bold: ['Poppins_700Bold'],
      },
      borderRadius: {
        // Mirrors web rounded-lg/xl/2xl usage.
        sm: '6px',
        DEFAULT: '8px',
        md: '10px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
        '3xl': '28px',
      },
      fontSize: {
        '2xs': '10px',
        xs: '12px',
        sm: '13px',
        base: '15px',
        lg: '17px',
        xl: '19px',
        '2xl': '22px',
        '3xl': '26px',
        '4xl': '32px',
      },
    },
  },
  plugins: [],
};
