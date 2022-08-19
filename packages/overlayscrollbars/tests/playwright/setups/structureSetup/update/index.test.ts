import { playwrightRollup, expectSuccess } from '@~local/playwright-tooling';
import { test, Page } from '@playwright/test';

playwrightRollup();

test.describe.configure({ mode: 'parallel' });

const createTests = (fast?: boolean) => {
  [false, true].forEach((viewportIsTarget) => {
    const isOrIsNot = viewportIsTarget ? 'is' : 'is not';
    const setTargetIsVp = async (page: Page) => {
      if (viewportIsTarget) {
        await page.click('#vpt');
      }
    };
    const setFast = async (page: Page) => {
      if (fast || viewportIsTarget) {
        await page.click('#fast');
      }
    };

    test.describe(`target ${isOrIsNot} viewport`, () => {
      [false, true].forEach((nativeScrollbarHiding) => {
        const withText = nativeScrollbarHiding ? 'with' : 'without';
        const nsh = async (page: Page) => {
          if (!nativeScrollbarHiding) {
            await page.click('#nsh');
          }
        };

        test.beforeEach(async ({ page }) => {
          test.skip(
            !nativeScrollbarHiding && viewportIsTarget,
            'Viewport is target should only be initialized when nativeScrollbarHiding is supported.'
          );
          await setFast(page);
          await setTargetIsVp(page);
          await nsh(page);
        });

        test.describe(`${withText} native scrollbar styling`, () => {
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
