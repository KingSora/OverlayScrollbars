const { expect } = require('@playwright/test');

const resultSelector = '#testResult';

// default timeout = // 10mins
module.exports = async (page, timeout = 10 * 60 * 1000) => {
  await page.locator(resultSelector).waitFor({ state: 'visible', timeout });
  await expect(page.locator(resultSelector)).toHaveClass('passed', { timeout: 1000 });
};
