import { playwrightRollup, expectSuccess } from '@~local/playwright-tooling';
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

playwrightRollup();

test.describe('scrollbarsSetup.scrollbars', () => {
  const timeout = (ms: number) =>
    new Promise((resolve) => {
      setTimeout(resolve, ms);
    });

  const clickScrollbar = async (page: Page, target: string) => {
    const options = {
      force: true,
      strict: true,
      timeout: 1000,
    };
    await page.click(`${target} > .os-scrollbar-horizontal`, options);
    await page.click(`${target} > .os-scrollbar-horizontal > .os-scrollbar-track`, options);
    await page.click(
      `${target} > .os-scrollbar-horizontal > .os-scrollbar-track > .os-scrollbar-handle`,
      options
    );
    await page.click(`${target} > .os-scrollbar-vertical`, options);
    await page.click(`${target} > .os-scrollbar-vertical > .os-scrollbar-track`, options);
    await page.click(
      `${target} > .os-scrollbar-vertical > .os-scrollbar-track .os-scrollbar-handle`,
      options
    );

    await timeout(500);
  };
  const scrollToStartEnd = async (page: Page, target: string) => {
    const options = {
      modifiers: ['Shift'] as ['Shift'],
      button: 'left' as const,
      force: true,
      strict: true,
      timeout: 1000,
    };

    const targetSelector = `${target}`;
    const horizontalEndPointSelector = `${target} > .os-scrollbar-horizontal .scrollPoint.end`;
    const horizontalStartPointSelector = `${target} > .os-scrollbar-horizontal .scrollPoint.start`;
    const verticalEndPointSelector = `${target} > .os-scrollbar-vertical .scrollPoint.end`;
    const verticalStartPointSelector = `${target} > .os-scrollbar-vertical .scrollPoint.start`;

    interface EvalScrollbarHandleOffsetArgs {
      targetSelector: string;
      pointSelector: string;
    }

    const scrollAndEvalScrollbarHandleOffset = async (args: EvalScrollbarHandleOffsetArgs) => {
      await page.click(args.pointSelector, options);

      await timeout(100);

      const { diff } = await page.evaluate(({ targetSelector: t, pointSelector }) => {
        const isRTL =
          getComputedStyle(document.querySelector(t)!).getPropertyValue('direction') === 'rtl';
        const isStart = !!document.querySelector(pointSelector)?.classList.contains('start');
        const handle = document
          .querySelector(pointSelector)!
          .closest('.os-scrollbar')!
          .querySelector('.os-scrollbar-handle')!;
        const isHorizontal = handle.closest('.os-scrollbar-horizontal');
        const startKey = isHorizontal ? (isRTL ? 'right' : 'left') : 'top';
        const endKey = isHorizontal ? (isRTL ? 'left' : 'right') : 'bottom';
        const key = isStart ? startKey : endKey;
        const pointOffset = document.querySelector(pointSelector)!.getBoundingClientRect()[key];
        const handleOffset = handle.getBoundingClientRect()[key];
        return {
          diff: Math.abs(pointOffset - handleOffset),
        };
      }, args);

      expect(diff).toBeLessThanOrEqual(1);
    };

    await scrollAndEvalScrollbarHandleOffset({
      targetSelector,
      pointSelector: horizontalEndPointSelector,
    });
    await scrollAndEvalScrollbarHandleOffset({
      targetSelector,
      pointSelector: horizontalStartPointSelector,
    });

    await scrollAndEvalScrollbarHandleOffset({
      targetSelector,
      pointSelector: verticalEndPointSelector,
    });
    await scrollAndEvalScrollbarHandleOffset({
      targetSelector,
      pointSelector: verticalStartPointSelector,
    });

    await timeout(100);
  };
  const testScrollbarClicks = async (page: Page) => {
    // test scrollbar click event propagation stop
    await clickScrollbar(page, 'body');
    await clickScrollbar(page, '#targetA');
    await clickScrollbar(page, '#targetB');
    await clickScrollbar(page, '#targetC');
    await clickScrollbar(page, '#targetD');

    // test whether handle position and scrolling works correctly
    await scrollToStartEnd(page, 'body');
    await scrollToStartEnd(page, '#targetA');
    await scrollToStartEnd(page, '#targetB');
    await scrollToStartEnd(page, '#targetC');
    await scrollToStartEnd(page, '#targetD');

    await page.click('#flexReverse', { timeout: 1000 });

    await scrollToStartEnd(page, 'body');
    await scrollToStartEnd(page, '#targetA');
    await scrollToStartEnd(page, '#targetB');
    await scrollToStartEnd(page, '#targetC');
    await scrollToStartEnd(page, '#targetD');

    await page.click('#flexReverse', { timeout: 1000 });

    await timeout(500);
  };

  test('scrollbars', async ({ page }) => {
    await testScrollbarClicks(page);
    await expectSuccess(page);
  });

  test('scrollbars without ScrollTimeline', async ({ page }) => {
    await page.click('#scrollT');

    await testScrollbarClicks(page);

    await expectSuccess(page);
  });

  test('scrollbars without native scrollbar hiding and without native scrollbar hiding plugin', async ({
    page,
  }) => {
    await page.click('#nsh');

    await expectSuccess(page);
  });
});
