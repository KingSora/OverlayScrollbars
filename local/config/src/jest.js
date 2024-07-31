import path from 'node:path';
import { fileURLToPath } from 'node:url';
import resolve from './resolve.json' with { type: 'json' };

// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

const dirname = path.dirname(fileURLToPath(import.meta.url));
const assetFilesModuleNameMapper = {
  '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
    path.resolve(dirname, 'jest.fileMock.js'),
  '.*\\.(css|less|scss|sass)$': path.resolve(dirname, 'jest.fileMock.js'),
};
const coveragePathIgnorePatterns = [
  '/node_modules/',
  '<rootDir>/([^/]*)\\.config\\.(js|mjs|cjs|ts)',
];

/** @type {import('jest').Config} */
export default {
  coverageDirectory: './.coverage/unit',
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
      testPathIgnorePatterns: ['/node_modules/'],
      setupFilesAfterEnv: [path.resolve(dirname, './jest.setup.node.js')],
      coveragePathIgnorePatterns,
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
      testPathIgnorePatterns: ['/node_modules/'],
      setupFilesAfterEnv: [path.resolve(dirname, './jest.setup.jsdom.js')],
      coveragePathIgnorePatterns,
    },
  ],
};
