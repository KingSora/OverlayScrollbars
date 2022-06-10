// @ts-ignore
import { playwrightRollup } from '@/playwright/rollup';
import { test } from '@playwright/test';
import { Environment } from 'environment';

playwrightRollup();

test.describe('Environment', () => {
  test('page should be titled "Environment"', async ({ page }) => {
    // @ts-ignore
    const a: Environment = await page.evaluate(() => window.environment.envInstance);
    console.log(a);
    await expect(page.title()).resolves.toMatch('environment');
  });
});
