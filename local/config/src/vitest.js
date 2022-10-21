const { resolve } = require('path');
const { defineConfig } = require('vitest/config');

const setupFile = resolve(__dirname, 'vitest.setup.js');

module.exports = defineConfig({
  test: {
    setupFiles: setupFile,
    environment: 'jsdom',
    include: ['test/**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      reportsDirectory: './.coverage/unit',
      exclude: [setupFile],
    },
  },
});
