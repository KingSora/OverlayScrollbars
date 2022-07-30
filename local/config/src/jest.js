const path = require('path');
const resolve = require('./resolve');

// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  clearMocks: true,
  coverageDirectory: './.coverage/jest',
  testEnvironment: 'jsdom',
  moduleDirectories: resolve.directories,
  moduleFileExtensions: resolve.extensions.map((ext) => ext.replace(/\./, '')),
  testPathIgnorePatterns: ['\\\\node_modules\\\\'],
  displayName: 'jest',
  setupFilesAfterEnv: [path.resolve(__dirname, './jest.setup.js')],
  testMatch: ['**/tests/jest/**/*.test.[jt]s?(x)'],
};
