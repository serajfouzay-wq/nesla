/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        nestle: {
          red: '#E2001A',
          dark: '#071020',
          navy: '#0A1628',
          blue: '#1A3A6B',
          green: '#00703C',
          gold: '#F0A500',
        },
        neon: {
          green: '#00FF88',
          cyan: '#00D4FF',
          red: '#FF2244',
          gold: '#FFD700',
        },
      },
      fontFamily: {
        display: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      keyframes: {
        'float': { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-8px)' } },
        'bird-fly': { '0%': { transform: 'translateX(-20px) translateY(10px)', opacity: '0' }, '100%': { transform: 'translateX(0) translateY(0)', opacity: '1' } },
        'slide-up': { '0%': { transform: 'translateY(16px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        'slide-in': { '0%': { transform: 'translateX(-16px)', opacity: '0' }, '100%': { transform: 'translateX(0)', opacity: '1' } },
        'shield-flash': { '0%,100%': { opacity: '1', filter: 'drop-shadow(0 0 4px #00FF88)' }, '50%': { opacity: '0.6', filter: 'drop-shadow(0 0 12px #00FF88)' } },
        'pulse-glow': { '0%,100%': { boxShadow: '0 0 8px rgba(226,0,26,0.4)' }, '50%': { boxShadow: '0 0 24px rgba(226,0,26,0.8)' } },
        'score-pop': { '0%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.3)' }, '100%': { transform: 'scale(1)' } },
        'shake': { '0%,100%': { transform: 'translateX(0)' }, '20%,60%': { transform: 'translateX(-6px)' }, '40%,80%': { transform: 'translateX(6px)' } },
        'glow-border': { '0%,100%': { borderColor: 'rgba(0,212,255,0.4)' }, '50%': { borderColor: 'rgba(0,212,255,0.9)' } },
        'ticker': { '0%': { backgroundPosition: '0% 50%' }, '100%': { backgroundPosition: '100% 50%' } },
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'bird-fly': 'bird-fly 0.5s ease-out forwards',
        'slide-up': 'slide-up 0.35s ease-out forwards',
        'slide-in': 'slide-in 0.35s ease-out forwards',
        'shield-flash': 'shield-flash 1.2s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'score-pop': 'score-pop 0.4s ease-in-out',
        'shake': 'shake 0.4s ease-in-out',
        'glow-border': 'glow-border 2s ease-in-out infinite',
      },
      backgroundImage: {
        'hud-grid': "linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)",
        'nestle-gradient': 'linear-gradient(135deg, #0A1628 0%, #071020 50%, #0D1F3C 100%)',
      },
      backgroundSize: {
        'grid': '32px 32px',
      },
    },
  },
  plugins: [],
}