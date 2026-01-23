import { playwrightRollup, expectSuccess } from '@~local/playwright-tooling';
import { test } from '@playwright/test';

playwrightRollup();

test.describe('performance.timing', () => {
  test('default', async ({ page }) => {
    await expectSuccess(page);
  });

  test('non default scroll direction', async ({ page }) => {
    await page.click('#ndsd');
    await expectSuccess(page);
  });

  test('ignore flow direction', async ({ page }) => {
    await page.click('#ndsd');
    await page.click('#ifd');
    await expectSuccess(page);
  });
});
