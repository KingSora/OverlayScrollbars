const { expect } = require('@playwright/test');

const startSelector = '#start';
const resultSelector = '#testResult';
const logError = async (page, ...args) => {
  const title = await page.title();
  // eslint-disable-next-line no-console
  console.log(title, ...args);
};

// default timeout = // 10mins
module.exports = async (page, timeout = 10 * 60 * 2000) => {
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

  await page.locator(resultSelector).waitFor({ state: 'visible', timeout });
  await expect(page.locator(resultSelector)).toHaveClass('passed', { timeout: 1000 });
};
