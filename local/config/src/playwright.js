const { devices } = require('@playwright/test');

module.exports = {
  testMatch: /.*\/tests\/playwright\/.*\.test\.[jt]sx?/,
  timeout: 10 * 60 * 1000,
  actionTimeout: 300,
  navigationTimeout: 1000,
  retries: 0,
  workers: 1,
  projects: [
    {
      name: 'Chromium',
      use: {
        ...devices['Desktop Chromium'],
        headless: false,
      },
    },
    /*
    {
      name: 'Firefox',
      use: {
        ...devices['Desktop Firefox'],
        headless: false,
      },
    },
    {
      name: 'Safari',
      use: {
        ...devices['Desktop Safari'],
        headless: false,
      },
    },
    */
  ],
};
