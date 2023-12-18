import { playwrightRollup, expectSuccess } from '@~local/playwright-tooling';
import { test } from '@playwright/test';

playwrightRollup();

test.describe('scrollbarsSetup.scrollbars', () => {
  test.beforeEach(async ({ page }) => {
    await page.click('#targetA .os-scrollbar');
    await page.click('#targetA .os-scrollbar-track');
    await page.click('#targetA .os-scrollbar-handle');

    await page.click('#targetB .os-scrollbar');
    await page.click('#targetB .os-scrollbar-track');
    await page.click('#targetB .os-scrollbar-handle');

    await page.click('#targetC .os-scrollbar');
    await page.click('#targetC .os-scrollbar-track');
    await page.click('#targetC .os-scrollbar-handle');
  });

  test('scrollbars', async ({ page }) => {
    await expectSuccess(page);
  });

  test('scrollbars without ScrollTimeline', async ({ page }) => {
    await page.click('#scrollT');

    await expectSuccess(page);
  });
});
