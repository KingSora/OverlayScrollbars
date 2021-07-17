const path = require('path');
const resolve = require('./resolve.config');
const browserRollupConfig = require('./config/jest-browser.rollup.config.js');

const testServerLoaderPath = path.resolve(__dirname, './config/jest-test-server.loader.js');
const jsdomSetupFile = path.resolve(__dirname, './config/jest-jsdom.setup.js');
const browserGlobalSetupPath = path.resolve(__dirname, './config/jest-browser.globalSetup.js');
const browserGlobalTeardownPath = path.resolve(__dirname, './config/jest-browser.globalTeardown.js');
const browserTestEnvironmentPath = path.resolve(__dirname, './config/jest-browser.env.js');
const browserSetupAfterEnvFile = path.resolve(__dirname, './config/jest-browser.setupAfterEnv.js');

// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

const base = {
  clearMocks: true,
  coverageDirectory: './.coverage/jsdom',
  testEnvironment: 'jsdom',
  moduleDirectories: resolve.directories,
  moduleFileExtensions: resolve.extensions.map((ext) => ext.replace(/\./, '')),
  testPathIgnorePatterns: ['\\\\node_modules\\\\'],
};

const browserBase = {
  ...base,
  collectCoverage: false,
  preset: 'jest-playwright-preset',
  globalSetup: browserGlobalSetupPath,
  globalTeardown: browserGlobalTeardownPath,
  testEnvironment: browserTestEnvironmentPath,
  setupFilesAfterEnv: [browserSetupAfterEnvFile],
  testMatch: ['**/tests/browser/**/*.test.[jt]s?(x)'],
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
    },
  ],
};
