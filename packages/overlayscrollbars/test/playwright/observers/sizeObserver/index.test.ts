import { playwrightRollup, expectSuccess } from '@~local/playwright-tooling';
import { test } from '@playwright/test';

playwrightRollup();

test.describe('SizeObserver', () => {
  test('with ResizeOserver', async ({ page }) => {
    await expectSuccess(page);
  });

  test('with ResizeOserver without options.box', async ({ page }) => {
    await page.click('#roNoBox');

    await expectSuccess(page);
  });

  test('with ResizeOserver polyfill', async ({ page }) => {
    await page.click('#roPolyfill');

    await expectSuccess(page);
  });
});
