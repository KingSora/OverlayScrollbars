/** @type {import('jest').Config} */
module.exports = {
  coverageDirectory: './.coverage',
  testEnvironment: 'jsdom',
  testMatch: ['**/test/**/*.test.[jt]s?(x)'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
