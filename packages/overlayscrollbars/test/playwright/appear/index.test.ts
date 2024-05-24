import { playwrightRollup, expectSuccess } from '@~local/playwright-tooling';
import { test } from '@playwright/test';

playwrightRollup();

test.describe('appear', () => {
  test.beforeEach(async ({ page }) => {
    await page.mouse.move(0, 0);
  });

  test('default', async ({ page }) => {
    await expectSuccess(page);
  });

  test('with autoHideSuspend', async ({ page }) => {
    await page.click('#autoHideSuspend');
    await expectSuccess(page);
  });
});
