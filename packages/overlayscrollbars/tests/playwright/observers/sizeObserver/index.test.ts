// @ts-ignore
import { playwrightRollup, expectSuccess } from '@/playwright/rollup';
import { test } from '@playwright/test';

playwrightRollup();

test.describe('SizeObserver', () => {
  test('with ResizeOserver', async ({ page }) => {
    await page.click('#start');
    await expectSuccess(page);
  });

  test('with ResizeOserver polyfill', async ({ page }) => {
    await page.click('#roPolyfill');
    await page.waitForTimeout(500);
    await page.click('#start');
    await expectSuccess(page);
  });
});
