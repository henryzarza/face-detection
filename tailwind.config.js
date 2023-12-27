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
      'dark-transparent': {
        60: 'rgba(0, 0, 0, 0.65)'
      },
      'white-transparent': {
        50: 'rgba(255, 255, 255, 0.50)'
      }
    }
  },
  plugins: [],
}

