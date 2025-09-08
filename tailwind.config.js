/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light theme colors
        bg: 'hsl(220, 20%, 98%)',
        accent: 'hsl(220, 80%, 50%)',
        primary: 'hsl(171, 70%, 30%)',
        surface: 'hsl(0, 0%, 100%)',
        
        // Enhanced nature-inspired color palette
        nature: {
          forest: 'hsl(171, 70%, 30%)',
          moss: 'hsl(171, 50%, 40%)',
          sage: 'hsl(171, 30%, 50%)',
          leaf: 'hsl(120, 40%, 45%)',
          bark: 'hsl(30, 25%, 35%)',
          sky: 'hsl(200, 70%, 60%)',
          earth: 'hsl(25, 30%, 25%)',
        },
        
        // Dark theme with improved contrast
        dark: {
          bg: 'hsl(220, 25%, 6%)',
          surface: 'hsl(220, 20%, 10%)',
          card: 'hsl(220, 18%, 14%)',
          border: 'hsl(220, 15%, 20%)',
          hover: 'hsl(220, 15%, 18%)',
        },
        
        // Status colors
        success: 'hsl(142, 76%, 36%)',
        warning: 'hsl(38, 92%, 50%)',
        error: 'hsl(0, 84%, 60%)',
        info: 'hsl(200, 70%, 60%)',
      },
      borderRadius: {
        'lg': '16px',
        'md': '10px',
        'sm': '6px',
      },
      spacing: {
        'lg': '20px',
        'md': '12px',
        'sm': '8px',
      },
      boxShadow: {
        'card': '0 8px 24px hsla(0, 0%, 0%, 0.12)',
      },
      animation: {
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.22,1,0.36,1) infinite',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'recording-pulse': 'recording-pulse 1.5s ease-in-out infinite',
      },
      keyframes: {
        'pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(1.5)', opacity: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'recording-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
}
