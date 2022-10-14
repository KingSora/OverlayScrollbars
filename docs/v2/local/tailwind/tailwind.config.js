const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {},
    container: {
      center: true,
    },
    fontFamily: {
      sans: ['Noto Sans', ...defaultTheme.fontFamily.sans],
    },
    fontWeight: {
      normal: 400,
      medium: 600,
      bold: 800,
    },
    screens: {
      xxs: '374px',
      xs: '640px',
      sm: '768px',
      md: '960px',
      lg: '1280px',
      xl: '1440px',
      xxl: '1536px',
    },
  },
  plugins: [],
};
