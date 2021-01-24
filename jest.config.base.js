const path = require('path');
const resolve = require('./resolve.config');
const browserRollupConfig = require('./config/jest-browser.rollup.config.js');

const testServerLoaderPath = path.resolve(__dirname, './config/jest-test-server.loader.js');
const jsdomSetupFile = path.resolve(__dirname, './config/jest-jsdom.setup.js');
const browserTestEnvironmentPath = path.resolve(__dirname, './config/jest-browser.env.js');
const browserSetupFile = path.resolve(__dirname, './config/jest-browser.setup.js');

// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

const base = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: './.coverage',
  moduleDirectories: resolve.directories,
  moduleFileExtensions: resolve.extensions.map((ext) => ext.replace(/\./, '')),
  testPathIgnorePatterns: ['\\\\node_modules\\\\'],
};

const browserBase = {
  ...base,
  preset: 'jest-playwright-preset',
  setupFilesAfterEnv: [browserSetupFile],
  testMatch: ['**/tests/browser/**/*.test.[jt]s?(x)'],
  testEnvironment: browserTestEnvironmentPath,
  coveragePathIgnorePatterns: ['/node_modules/', `/${browserRollupConfig.build}/`],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
    [`^.+${browserRollupConfig.build}.+${browserRollupConfig.html.output}?$`]: testServerLoaderPath,
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
      ...browserBase,
      displayName: {
        name: 'browser',
        color: 'white',
      },
    },
    {
      ...browserBase,
      displayName: {
        name: 'browser-dev',
        color: 'white',
      },
      collectCoverage: false,
    },
  ],
};
