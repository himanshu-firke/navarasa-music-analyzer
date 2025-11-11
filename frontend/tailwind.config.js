/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom Navarasa emotion colors
        shringara: {
          DEFAULT: '#FF69B4',
          light: '#FFB6D9',
          dark: '#C94A7F',
        },
        hasya: {
          DEFAULT: '#FFD700',
          light: '#FFE966',
          dark: '#CCA300',
        },
        karuna: {
          DEFAULT: '#4169E1',
          light: '#7B9EF5',
          dark: '#2347B8',
        },
        raudra: {
          DEFAULT: '#DC143C',
          light: '#E85A75',
          dark: '#A20F2B',
        },
        veera: {
          DEFAULT: '#FF4500',
          light: '#FF7A47',
          dark: '#C23300',
        },
        bhayanaka: {
          DEFAULT: '#800080',
          light: '#B34DB3',
          dark: '#4D004D',
        },
        bibhatsa: {
          DEFAULT: '#228B22',
          light: '#5FB85F',
          dark: '#166216',
        },
        adbhuta: {
          DEFAULT: '#00CED1',
          light: '#47DBDE',
          dark: '#009EA0',
        },
        shanta: {
          DEFAULT: '#98FB98',
          light: '#C3FDC3',
          dark: '#6BC96B',
        },
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
