const { resolve } = require('path');
const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
  test: {
    setupFiles: resolve(__dirname, 'vitest.setup.js'),
    environment: 'jsdom',
    include: ['test/**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      reportsDirectory: './.coverage',
    },
  },
});
