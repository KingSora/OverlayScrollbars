const path = require('path');
const resolve = require('./resolve.config');
const puppeteerRollupConfig = require('./config/jest-puppeteer.rollup.config.js');

const testEnvironmentPath = path.resolve(__dirname, './config/jest-puppeteer.env.js');
const testServerLoaderPath = path.resolve(__dirname, './config/jest-test-server.loader.js');
const jsdomSetupFile = path.resolve(__dirname, './config/jest-jsdom.setup.js');
const puppeteerSetupFile = path.resolve(__dirname, './config/jest-puppeteer.setup.js');

// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

const base = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: './.coverage',
  moduleDirectories: resolve.directories,
  moduleFileExtensions: resolve.extensions.map((ext) => ext.replace(/\./, '')),
  testPathIgnorePatterns: ['\\\\node_modules\\\\'],
  globals: {
    baseConfig: __filename,
  },
};

const pptrBase = {
  ...base,
  preset: 'jest-puppeteer',
  setupFilesAfterEnv: ['expect-puppeteer', puppeteerSetupFile],
  testMatch: ['**/tests/puppeteer/**/*.test.[jt]s?(x)'],
  testEnvironment: testEnvironmentPath,
  coveragePathIgnorePatterns: ['/node_modules/', `/${puppeteerRollupConfig.build}/`],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
    [`^.+${puppeteerRollupConfig.build}.+${puppeteerRollupConfig.html.output}?$`]: testServerLoaderPath,
  },
};

module.exports = {
  ...base,
  projects: [
    {
      ...base,
      displayName: 'jsdom',
      setupFilesAfterEnv: [jsdomSetupFile],
      testMatch: ['**/tests/jsdom/**/*.test.[jt]s?(x)'],
    },
    {
      ...pptrBase,
      displayName: 'puppeteer',
    },
    {
      ...pptrBase,
      displayName: 'puppeteer-dev',
      collectCoverage: false,
    },
  ],
};
