/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#44B6C5',
          hover: '#379CA9',
          muted: '#2A9CAB',
          light: '#E2F2F5',
          lighter: '#F1F9FB',
          tint: 'rgba(68,182,197,0.14)',
          tint2: 'rgba(68,182,197,0.09)',
        },
        app: {
          bg: '#EAF1F4',
          text: '#0F172A',
          secondary: '#64748B',
          tertiary: '#94A3B8',
          border: '#E4E9EE',
          'border-strong': '#D7DEE5',
          counter: '#F1F4F7',
          'icon-bg': '#DEEFF3',
          'icon-color': '#2A9CAB',
        },
      },
      fontFamily: {
        app: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
      boxShadow: {
        dropdown: '0px 4px 6px 0px rgba(0,0,0,0.09)',
        modal: '0 24px 60px rgba(15,23,42,0.18), 0 4px 12px rgba(15,23,42,0.06)',
        card: '0 8px 24px rgba(15,23,42,0.06)',
        'modal-heavy': '0 28px 70px rgba(0,0,0,0.5), 0 4px 14px rgba(0,0,0,0.25)',
      },
      borderRadius: {
        card: '14px',
        modal: '20px',
        pill: '999px',
      },
      keyframes: {
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px) scale(0.985)' },
          to:   { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
      },
      animation: {
        'slide-up': 'slideUp 0.45s cubic-bezier(0.16,1,0.3,1)',
        'fade-in':  'fadeIn 0.3s ease',
      },
    },
  },
  plugins: [],
}
