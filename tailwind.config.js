/* eslint-disable no-undef */
const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: ['Chillax', defaultTheme.fontFamily.sans],
    },
    colors: {
      white: colors.white,
      stone: colors.stone,
      gold: '#FFBF00',
      crimson: '#EC1850',
      vermilion: '#F64D07',
      'cod-gray': '#121212',
      'mine-shaft': '#232323',
      'dark-transparent': {
        20: 'rgba(0, 0, 0, 0.2)',
        50: 'rgba(0, 0, 0, 0.5)',
        60: 'rgba(0, 0, 0, 0.65)'
      },
      'white-transparent': {
        50: 'rgba(255, 255, 255, 0.50)',
        60: 'rgba(255, 255, 255, 0.60)'
      }
    }
  },
  plugins: [],
}

