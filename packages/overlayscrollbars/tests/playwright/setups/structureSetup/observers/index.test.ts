import { playwrightRollup, expectSuccess } from '@~local/playwright-tooling';
import { test } from '@playwright/test';

playwrightRollup();

test.describe('StructureSetup.elements', () => {
  test('nesting updates', async ({ page }) => {
    await page.click('#start');
    await expectSuccess(page);
  });
});
