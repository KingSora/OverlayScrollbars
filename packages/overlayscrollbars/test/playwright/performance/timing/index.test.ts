import { playwrightRollup, expectSuccess } from '@~local/playwright-tooling';
import { test } from '@playwright/test';

playwrightRollup();

test.describe('performance.timing', () => {
  test('default', async ({ page }) => {
    await expectSuccess(page);
  });
});
