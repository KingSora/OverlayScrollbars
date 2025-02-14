import { expect } from '@playwright/test';

const startSelector = '#start';
const resultSelector = '#testResult';
const logError = async (page, ...args) => {
  const title = await page.title();

  console.log(title, ...args);
};

// default timeout = // 15mins
export default async (page, timeout = 10 * 60 * 1500) => {
  page.on('pageerror', (err) => {
    logError(page, err.message);
  });
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      logError(page, msg.text());
    }
  });

  await page.waitForLoadState('domcontentloaded', { timeout: 5000 });
  await page.click(startSelector, { timeout: 1000 });
  await page.mouse.move(0, 0);

  await page.locator(resultSelector).waitFor({ state: 'visible', timeout });
  await expect(page.locator(resultSelector)).toHaveClass('passed', { timeout: 1000 });
};
