// @ts-ignore
import { playwrightRollup, expectSuccess } from '@/playwright/rollup';
import { test } from '@playwright/test';

playwrightRollup();

test.describe('DOMObserver', () => {
  test('test', async ({ page }) => {
    await page.click('#start');
    await expectSuccess(page);
  });
});
