import { devices } from '@playwright/test';

export default {
  testMatch: /.*\/test\/playwright\/.*\.test\.[jt]sx?/,
  timeout: 10 * 60 * 1500,
  navigationTimeout: 1000,
  retries: 1,
  maxFailures: 0,
  workers: 4,
  fullyParallel: true,
  reporter: 'list',
  outputDir: '.playwright',
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
