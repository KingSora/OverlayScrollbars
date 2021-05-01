import 'jest-playwright-preset';
import 'expect-playwright';
import url from './.build/build.html';

describe('SizeObserver', () => {
  beforeEach(async () => {
    await jestPlaywright.resetPage();
    await page.goto(url);
  });

  test('with ResizeOserver', async () => {
    await page.click('#start');
    await expect(page).toHaveSelector('#testResult.passed');
  });

  test('with ResizeOserver polyfill', async () => {
    await page.click('#roPolyfill');
    await page.waitForTimeout(500);
    await page.click('#start');
    await expect(page).toHaveSelector('#testResult.passed');
  });
});
