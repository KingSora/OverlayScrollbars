import { playwrightRollup, expectSuccess } from '@~local/playwright-tooling';
import { test } from '@playwright/test';

playwrightRollup();

test.describe('TrinsicObserver', () => {
  test('with IntersectionObserver', async ({ page }) => {
    await expectSuccess(page);
  });

  test('with ResizeObserver', async ({ page }) => {
    await page.click('#ioPolyfill');

    await expectSuccess(page);
  });

  test('with ResizeObserver polyfill', async ({ page }) => {
    await page.click('#ioPolyfill');
    await page.click('#roPolyfill');

    await expectSuccess(page);
  });
});
