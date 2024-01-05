import { playwrightRollup, expectSuccess } from '@~local/playwright-tooling';
import { test } from '@playwright/test';

playwrightRollup();

test.describe('StructureSetup.body', () => {
  test('with native scrollbar styling', async ({ page }) => {
    await expectSuccess(page);
  });

  test('without native scrollbar styling', async ({ page }) => {
    await page.click('#nsh');
    await expectSuccess(page);
  });
});
