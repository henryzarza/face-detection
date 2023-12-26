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
      secondary: '#121212',
      gold: '#FFBF00'
    }
  },
  plugins: [],
}

