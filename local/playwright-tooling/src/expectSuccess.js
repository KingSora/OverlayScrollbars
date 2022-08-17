const { expect } = require('@playwright/test');

const startSelector = '#start';
const resultSelector = '#testResult';

// default timeout = // 10mins
module.exports = async (page, timeout = 10 * 60 * 1000) => {
  await page.waitForLoadState('domcontentloaded', { timeout: 5000 });
  await page.click(startSelector, { timeout: 1000 });

  await page.locator(resultSelector).waitFor({ state: 'visible', timeout });
  await expect(page.locator(resultSelector)).toHaveClass('passed', { timeout: 1000 });
};
