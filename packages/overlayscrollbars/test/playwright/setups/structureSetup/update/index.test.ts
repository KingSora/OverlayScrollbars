import { playwrightRollup, expectSuccess } from '@~local/playwright-tooling';
import { test } from '@playwright/test';
import type { Page } from '@playwright/test';

playwrightRollup();

test.describe.configure({ mode: 'parallel' });

test.describe('StructureSetup.update', () => {
  [false, true].forEach((viewportIsTarget) => {
    const isOrIsNot = viewportIsTarget ? 'is' : 'is not';
    const setTargetIsVp = async (page: Page) => {
      if (viewportIsTarget) {
        await page.click('#vpt');
      }
    };
    const setFast = async (page: Page) => {
      await page.click('#fast');
    };

    test.describe(`target ${isOrIsNot} viewport`, () => {
      [false, true].forEach((nativeScrollbarHiding) => {
        const withText = nativeScrollbarHiding ? 'with' : 'without';
        const nsh = async (page: Page) => {
          if (!nativeScrollbarHiding) {
            await page.click('#nsh');
          }
        };

        // Viewport is target should only be initialized when nativeScrollbarHiding is supported thus tests with this combo doesnt make sense
        if (!nativeScrollbarHiding && viewportIsTarget) {
          return;
        }

        test.describe(`${withText} native scrollbar styling`, () => {
          test.beforeEach(async ({ page }) => {
            await setTargetIsVp(page);
            await nsh(page);
          });

          test('default', async ({ page }) => {
            await expectSuccess(page);
          });

          test.describe(`fast`, () => {
            test.beforeEach(async ({ page }) => {
              await setFast(page);
            });

            test('with fully overlaid scrollbars', async ({ page }) => {
              await page.click('#fo');

              await expectSuccess(page);
            });

            test('with partially overlaid scrollbars', async ({ page, browserName }) => {
              test.skip(
                browserName === 'firefox' || browserName === 'webkit',
                "firefox can't simulate partially overlaid scrollbars, boost speed by omitting webkit"
              );

              await page.click('#po');

              await expectSuccess(page);
            });
          });
        });
      });
    });
  });
});
