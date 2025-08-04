/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-cyan': '#00ffff',
        'neon-pink': '#ff00ff',
        'neon-green': '#00ff00',
        'neon-yellow': '#ffff00',
        'neon-orange': '#ff8800',
        'neon-purple': '#8800ff',
        'retro-dark': '#0a0a0a',
        'retro-gray': '#1a1a1a',
        'retro-border': '#444444',
        'retro-light': '#2a2a2a',
      },
      fontFamily: {
        'pixel': ['"Courier New"', 'monospace'],
        'retro': ['"Press Start 2P"', 'cursive'],
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite alternate',
        'flicker': 'flicker 0.15s infinite linear',
        'crt-flicker': 'crt-flicker 0.15s infinite linear',
      },
      keyframes: {
        'pulse-neon': {
          'from': {
            'text-shadow': '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #00ffff, 0 0 20px #00ffff',
          },
          'to': {
            'text-shadow': '0 0 2px #fff, 0 0 5px #fff, 0 0 8px #00ffff, 0 0 12px #00ffff',
          }
        },
        'flicker': {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': {
            'opacity': '0.99',
          },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': {
            'opacity': '0.4',
          }
        },
        'crt-flicker': {
          '0%': { 'opacity': '1' },
          '98%': { 'opacity': '1' },
          '99%': { 'opacity': '0.98' },
          '100%': { 'opacity': '1' }
        }
      },
      boxShadow: {
        'neon': '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
        'neon-strong': '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
      }
    },
  },
  plugins: [],
}