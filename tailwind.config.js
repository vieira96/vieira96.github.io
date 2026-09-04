/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './script.js'],
  theme: {
    extend: {
      fontFamily: { sans: ['Manrope', 'sans-serif'], mono: ['DM Mono', 'monospace'] },
      colors: { ink: '#07090d', surface: '#0c1017', line: '#202a39', electric: '#4b91ff' },
    },
  },
};
