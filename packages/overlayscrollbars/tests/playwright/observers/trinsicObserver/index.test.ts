import { playwrightRollup, expectSuccess } from '@~local/playwright-tooling';
import { test } from '@playwright/test';

playwrightRollup();

test.describe('TrinsicObserver', () => {
  test('with IntersectionObserver', async ({ page }) => {
    await page.click('#start');
    await expectSuccess(page);
  });

  test('with ResizeObserver', async ({ page }) => {
    await page.click('#ioPolyfill');
    await page.waitForTimeout(500);
    await page.click('#start');
    await expectSuccess(page);
  });

  test('with ResizeObserver polyfill', async ({ page }) => {
    await page.click('#ioPolyfill');
    await page.waitForTimeout(500);
    await page.click('#roPolyfill');
    await page.waitForTimeout(500);
    await page.click('#start');
    await expectSuccess(page);
  });
});
