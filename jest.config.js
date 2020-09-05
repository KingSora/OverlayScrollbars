const resolve = require('./resolve.config');

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
      transform: {
        '^.+\\.[jt]sx?$': 'babel-jest',
        '^.+\\.html?$': 'html-loader-jest',
      },
    },
  ],
};
