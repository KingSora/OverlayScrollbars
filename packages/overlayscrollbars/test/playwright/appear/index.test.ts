import { playwrightRollup, expectSuccess } from '@~local/playwright-tooling';
import { test } from '@playwright/test';

playwrightRollup();

test.describe('appear', () => {
  test('appear', async ({ page }) => {
    await page.click('#nsh');
    await expectSuccess(page);
  });
});
