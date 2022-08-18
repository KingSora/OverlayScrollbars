import { playwrightRollup, expectSuccess } from '@~local/playwright-tooling';
import { test, Page } from '@playwright/test';

playwrightRollup();

const createTests = (fast?: boolean) => {
  [false, true].forEach((targetIsViewport) => {
    const isOrIsNot = targetIsViewport ? 'is' : 'is not';
    const setTargetIsVp = async (page: Page) => {
      if (targetIsViewport) {
        await page.click('#vpt');
      }
    };
    const setFast = async (page: Page) => {
      if (fast || targetIsViewport) {
        await page.click('#fast');
      }
    };

    test.describe(`target ${isOrIsNot} viewport`, () => {
      [false, true].forEach((nativeScrollbarStyling) => {
        const withText = nativeScrollbarStyling ? 'with' : 'without';
        const nsh = async (page: Page) => {
          if (!nativeScrollbarStyling) {
            await page.click('#nsh');
          }
        };

        test.beforeEach(async ({ page }) => {
          await setFast(page);
          await setTargetIsVp(page);
          await nsh(page);
        });

        test.describe(`${withText} native scrollbar styling`, () => {
          // test.describe.configure({ mode: 'parallel' });

          test('default', async ({ page }) => {
            await expectSuccess(page);
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

          test('without flexbox glue & css custom props', async ({ page }) => {
            await page.click('#fbg');
            await page.click('#ccp');

            await expectSuccess(page);
          });
        });
      });
    });
  });
};

test.describe('StructureSetup.update @special', () => {
  createTests();
});

test.describe('StructureSetup.update', () => {
  createTests(true);
});
