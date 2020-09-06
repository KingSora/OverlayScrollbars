const resolve = require('./resolve.config');
const puppeteerRollupConfig = require('./jest-puppeteer.rollup.config.js');

// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

const base = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  moduleDirectories: resolve.directories,
  moduleFileExtensions: resolve.extensions.map((ext) => ext.replace(/\./, '')),
  testPathIgnorePatterns: ['\\\\node_modules\\\\'],
  verbose: true,
};

module.exports = {
  projects: [
    {
      ...base,
      displayName: 'jsdom',
      testMatch: ['**/__tests__/jsdom/**/*.test.[jt]s?(x)'],
    },
    {
      ...base,
      preset: 'jest-puppeteer',
      displayName: 'puppeteer',
      setupFilesAfterEnv: ['expect-puppeteer'],
      testMatch: ['**/__tests__/puppeteer/**/*.test.[jt]s?(x)'],
      testEnvironment: './jest-puppeteer.env.js',
      coveragePathIgnorePatterns: ['/node_modules/', `/${puppeteerRollupConfig.build}/`],
      transform: {
        '^.+\\.[jt]sx?$': 'babel-jest',
        [`^.+${puppeteerRollupConfig.build}.+${puppeteerRollupConfig.html.output}?$`]: './jest-test-server.loader.js',
      },
    },
  ],
};
