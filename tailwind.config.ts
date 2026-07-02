import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: '1.5rem', screens: { '2xl': '1360px' } },
    extend: {
      colors: {
        void: '#0B0B10',
        graphite: '#131318',
        steel: '#1E1E27',
        mist: '#8A8A9A',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: '#8B5CF6', foreground: '#FFFFFF' },
        secondary: { DEFAULT: '#1E1E27', foreground: '#E4E4EA' },
        volt: { DEFAULT: '#00D9FF', foreground: '#00121A' },
        signal: { DEFAULT: '#8B5CF6', 50: '#F5F1FF', 400: '#A78BFA', 500: '#8B5CF6', 600: '#7C3AED', 700: '#6D28D9' },
        destructive: { DEFAULT: '#EF4444', foreground: '#FFFFFF' },
        muted: { DEFAULT: '#17171F', foreground: '#8A8A9A' },
        accent: { DEFAULT: '#1E1E27', foreground: '#E4E4EA' },
        popover: { DEFAULT: '#131318', foreground: '#E4E4EA' },
        card: { DEFAULT: '#131318', foreground: '#E4E4EA' },
      },
      fontFamily: {
        display: ['var(--font-rajdhani)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      borderRadius: { lg: 'var(--radius)', md: 'calc(var(--radius) - 2px)', sm: 'calc(var(--radius) - 4px)' },
      backgroundImage: {
        'grid-fade': 'linear-gradient(180deg, transparent 0%, #0B0B10 100%), linear-gradient(90deg, rgba(139,92,246,0.08) 1px, transparent 1px), linear-gradient(180deg, rgba(0,217,255,0.06) 1px, transparent 1px)',
        'glow-purple': 'radial-gradient(600px circle at var(--x,50%) var(--y,0%), rgba(139,92,246,0.25), transparent 40%)',
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        'pulse-glow': { '0%,100%': { opacity: '0.6' }, '50%': { opacity: '1' } },
        scan: { '0%': { transform: 'translateY(-100%)' }, '100%': { transform: 'translateY(100%)' } },
        wave: { '0%,100%': { transform: 'scaleY(0.3)' }, '50%': { transform: 'scaleY(1)' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
        scan: 'scan 3s linear infinite',
        wave: 'wave 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;