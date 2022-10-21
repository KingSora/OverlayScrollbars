const { resolve } = require('path');
const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
  test: {
    setupFiles: resolve(__dirname, 'vitest.setup.js'),
    environment: 'jsdom',
  },
});
