/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cosmic: {
          darkest: '#05030a',
          dark: '#0e0b1f',
          panel: 'rgba(15, 11, 35, 0.4)',
          border: 'rgba(255, 255, 255, 0.08)',
          glow: '#7c3aed',
        },
        rpg: {
          hp: '#ff2e93', // Vibrant Magenta for HP
          xp: '#00f6ff', // Cyber Teal for XP
          gold: '#ffd700', // Sparkling Gold
          level: '#a855f7' // Cosmic Purple for levels
        }
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-medium': 'float 4s ease-in-out infinite',
        'float-fast': 'float 3.2s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'orbit': 'orbit 10s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-8px) rotate(0.5deg)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(8px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(8px) rotate(-360deg)' },
        }
      },
      boxShadow: {
        'cosmic-glow': '0 0 20px rgba(124, 58, 237, 0.3)',
        'hp-glow': '0 0 15px rgba(255, 46, 147, 0.4)',
        'xp-glow': '0 0 15px rgba(0, 246, 255, 0.4)',
        'gold-glow': '0 0 15px rgba(255, 215, 0, 0.4)',
      }
    },
  },
  plugins: [],
}
