import { playwrightRollup, expectSuccess } from '@~local/playwright-tooling';
import { test } from '@playwright/test';

playwrightRollup();

test.describe('StructureSetup.nesting', () => {
  test('nesting updates', async ({ page }) => {
    await expectSuccess(page);
  });
});
