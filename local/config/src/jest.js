const path = require('path');
const resolve = require('./resolve');

// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

const assetFilesModuleNameMapper = {
  '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
    path.resolve(__dirname, 'jest.fileMock.js'),
  '.*\\.(css|less|scss|sass)$': path.resolve(__dirname, 'jest.fileMock.js'),
};

/** @type {import('jest').Config} */
module.exports = {
  coverageDirectory: './.coverage/unit',
  moduleNameMapper: assetFilesModuleNameMapper,
  projects: [
    {
      displayName: 'node',
      testMatch: ['**/test/jest-node/**/*.test.[jt]s?(x)'],
      testEnvironment: 'node',
      clearMocks: true,
      moduleDirectories: resolve.directories,
      moduleFileExtensions: resolve.extensions.map((ext) => ext.replace(/\./, '')),
      moduleNameMapper: {
        ...assetFilesModuleNameMapper,
        ...resolve.paths.jest.moduleNameMapper,
      },
      testPathIgnorePatterns: ['\\\\node_modules\\\\'],
      setupFilesAfterEnv: [path.resolve(__dirname, './jest.setup.js')],
    },
    {
      displayName: 'jsdom',
      testMatch: ['**/test/jest-jsdom/**/*.test.[jt]s?(x)'],
      testEnvironment: 'jsdom',
      clearMocks: true,
      moduleDirectories: resolve.directories,
      moduleFileExtensions: resolve.extensions.map((ext) => ext.replace(/\./, '')),
      moduleNameMapper: {
        ...assetFilesModuleNameMapper,
        ...resolve.paths.jest.moduleNameMapper,
      },
      testPathIgnorePatterns: ['\\\\node_modules\\\\'],
      setupFilesAfterEnv: [path.resolve(__dirname, './jest.setup.js')],
    },
  ],
};
