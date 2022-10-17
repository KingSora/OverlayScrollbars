/*
import { playwrightRollup } from '@~local/playwright-tooling';
import { test } from '@playwright/test';
import { InternalEnvironment } from '~/environment';

playwrightRollup();

test.describe('Environment', () => {
  test('page should be titled "Environment"', async ({ page }) => {
    // @ts-ignore
    const a: InternalEnvironment = await page.evaluate(() => window.environment.envInstance);
    console.log(a);
    await expect(page.title()).resolves.toMatch('environment');
  });
});
*/
