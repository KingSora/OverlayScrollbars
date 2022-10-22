const { resolve } = require('path');
const { defineConfig } = require('vitest/config');

const setupFileName = 'vitest.setup.js';
const include = ['test/**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'];

module.exports = defineConfig({
  test: {
    setupFiles: resolve(__dirname, setupFileName),
    environment: 'jsdom',
    include,
    coverage: {
      reportsDirectory: './.coverage/unit',
      // https://github.com/vitest-dev/vitest/issues/2190
      // without this the setup file or the test files show up in the final coverage on the CI
      exclude: [`**/${setupFileName}`, ...include],
    },
  },
});
