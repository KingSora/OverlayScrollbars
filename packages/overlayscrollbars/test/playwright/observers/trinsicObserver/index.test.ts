import { playwrightRollup, expectSuccess } from '@~local/playwright-tooling';
import { test } from '@playwright/test';

playwrightRollup();

test.describe('TrinsicObserver', () => {
  test('with IntersectionObserver', async ({ page }) => {
    await expectSuccess(page);
  });

  /*
  // there is no scenario where IntersectionObserver not supported and ResizeObserver is:
  // https://caniuse.com/intersectionobserver
  // https://caniuse.com/?search=resizeobserver
  test('with ResizeObserver', async ({ page }) => {
    await page.click('#ioPolyfill');

    await expectSuccess(page);
  });
  */

  test('with ResizeObserver polyfill', async ({ page }) => {
    await page.click('#ioPolyfill');
    await page.click('#roPolyfill');

    await expectSuccess(page);
  });
});
