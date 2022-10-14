/** @type {import('tailwindcss').Config} */
module.exports = {
  // eslint-disable-next-line global-require
  presets: [require('@~local-docs/tailwind')],
  content: ['**/*.{js,ts,jsx,tsx}'],
};
