import { playwrightRollup, expectSuccess } from '@~local/playwright-tooling';
import { test } from '@playwright/test';

playwrightRollup();

test.describe('StructureSetup.focus', () => {
  test.describe('with native scrollbar styling', () => {
    test('default', async ({ page }) => {
      await expectSuccess(page);
    });

    test('viewport is target', async ({ page }) => {
      await page.click('#vpt');
      await expectSuccess(page);
    });
  });

  test('without native scrollbar styling', async ({ page }) => {
    await page.click('#nsh');
    await expectSuccess(page);
  });
});
