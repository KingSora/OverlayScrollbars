import { playwrightRollup, expectSuccess } from '@~local/playwright-tooling';
import { test } from '@playwright/test';

playwrightRollup();

test.describe('scrollSnap', () => {
  test('default', async ({ page }) => {
    await expectSuccess(page);
  });
});
