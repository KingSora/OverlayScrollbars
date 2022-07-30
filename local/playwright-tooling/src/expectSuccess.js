const { expect } = require('@playwright/test');

const resultSelector = '#testResult';

module.exports = async (page) => {
  await page.locator(resultSelector).waitFor({ state: 'visible', timeout: 10 * 60 * 1000 }); // 10mins
  await expect(page.locator(resultSelector)).toHaveClass('passed', { timeout: 500 });
}