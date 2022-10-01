const path = require('path');
const resolve = require('./resolve');

// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

/** @type {import('jest').Config} */
module.exports = {
  coverageDirectory: './.coverage/jest',
  projects: [
    {
      displayName: 'node',
      testMatch: ['**/tests/jest-node/**/*.test.[jt]s?(x)'],
      testEnvironment: 'node',
      clearMocks: true,
      moduleDirectories: resolve.directories,
      moduleFileExtensions: resolve.extensions.map((ext) => ext.replace(/\./, '')),
      testPathIgnorePatterns: ['\\\\node_modules\\\\'],
      setupFilesAfterEnv: [path.resolve(__dirname, './jest.setup.js')],
      ...resolve.paths.jest,
    },
    {
      displayName: 'jsdom',
      testMatch: ['**/tests/jest-jsdom/**/*.test.[jt]s?(x)'],
      testEnvironment: 'jsdom',
      clearMocks: true,
      moduleDirectories: resolve.directories,
      moduleFileExtensions: resolve.extensions.map((ext) => ext.replace(/\./, '')),
      testPathIgnorePatterns: ['\\\\node_modules\\\\'],
      setupFilesAfterEnv: [path.resolve(__dirname, './jest.setup.js')],
      ...resolve.paths.jest,
    },
  ],
};
