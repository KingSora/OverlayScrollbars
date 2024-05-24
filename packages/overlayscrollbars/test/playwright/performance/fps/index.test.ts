import { playwrightRollup, expectSuccess } from '@~local/playwright-tooling';
import { test } from '@playwright/test';

playwrightRollup();

test.describe('performance.fps', () => {
  test('default', async ({ page }) => {
    await expectSuccess(page);
  });
});
