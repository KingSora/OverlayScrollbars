import 'jest-playwright-preset';
import 'expect-playwright';
import url from './.build/build.html';

describe('TrinsicObserver', () => {
  beforeAll(async () => {
    await page.goto(url);
  });

  test('with IntersectionObserver', async () => {
    await page.click('#start');
    await expect(page).toHaveSelector('#testResult.passed');
  });

  test('with ResizeObserver', async () => {
    await page.click('#ioPolyfill');
    await page.waitForTimeout(500);
    await page.click('#start');
    await expect(page).toHaveSelector('#testResult.passed');
  });

  test('with ResizeObserver polyfill', async () => {
    await page.click('#ioPolyfill');
    await page.waitForTimeout(500);
    await page.click('#roPolyfill');
    await page.waitForTimeout(500);
    await page.click('#start');
    await expect(page).toHaveSelector('#testResult.passed');
  });
});
