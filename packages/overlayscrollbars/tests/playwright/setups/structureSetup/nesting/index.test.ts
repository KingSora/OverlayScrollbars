// @ts-ignore
import { playwrightRollup, expectSuccess } from '@/playwright/rollup';
import { test } from '@playwright/test';

playwrightRollup();

test.describe('StructureSetup.nesting', () => {
  test('nesting updates', async ({ page }) => {
    await page.click('#start');
    await expectSuccess(page);
  });
});
