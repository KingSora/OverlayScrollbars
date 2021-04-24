import 'styles/overlayscrollbars.scss';
import './index.scss';
import should from 'should';
import { resize } from '@/testing-browser/Resize';
import { setTestResult, waitForOrFailTest } from '@/testing-browser/TestResult';
import { generateClassChangeSelectCallback, iterateSelect } from '@/testing-browser/Select';
import { timeout } from '@/testing-browser/timeout';
import { OverlayScrollbars } from 'overlayscrollbars';
import { createTrinsicObserver } from 'observers/trinsicObserver';
import { from, getBoundingClientRect, style, parent, addClass } from 'support';

// @ts-ignore
const msie11 = !!window.MSInputMethodContext && !!document.documentMode;
const firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

const useContentElement = false;
const fixedDigits = msie11 ? 1 : 10;
const fixedDigitsOffset = firefox ? 3 : fixedDigits; // ff does roundign errors here only

const startBtn: HTMLButtonElement | null = document.querySelector('#start');
const target: HTMLElement | null = document.querySelector('#target');
const comparison: HTMLElement | null = document.querySelector('#comparison');
const targetResize: HTMLElement | null = document.querySelector('#target .resize');
const comparisonResize: HTMLElement | null = document.querySelector('#comparison .resize');
const targetPercent: HTMLElement | null = document.querySelector('#target .percent');
const comparisonPercent: HTMLElement | null = document.querySelector('#comparison .percent');
const targetEnd: HTMLElement | null = document.querySelector('#target .end');
const comparisonEnd: HTMLElement | null = document.querySelector('#comparison .end');

const resizeElms = document.querySelectorAll('.resize');
const percentElms = document.querySelectorAll('.percent');
const endElms = document.querySelectorAll('.end');
const envElms = document.querySelectorAll<HTMLElement>('.env');
const containerElms = document.querySelectorAll<HTMLElement>('.container');

resize(target!).addResizeListener((width, height) => style(comparison, { width, height }));
//resize(comparison!).addResizeListener((width, height) => style(target, { width, height }));
resize(targetResize!).addResizeListener((width, height) => style(comparisonResize, { width, height }));
//resize(comparisonRes!).addResizeListener((width, height) => style(targetRes, { width, height }));

target!.querySelector('.os-viewport')?.addEventListener('scroll', (e) => {
  const viewport: HTMLElement | null = e.currentTarget as HTMLElement;
  comparison!.scrollLeft = viewport.scrollLeft;
  comparison!.scrollTop = viewport.scrollTop;
});

if (!useContentElement) {
  envElms.forEach((elm) => {
    addClass(elm, 'intrinsic-hack');
  });
}

const osInstance = (window.os = OverlayScrollbars({ target: target!, content: useContentElement }));

const selectCallbackEnv = generateClassChangeSelectCallback(from(envElms));
const envWidthSelect = document.querySelector<HTMLSelectElement>('#envWidth');
const envHeightSelect = document.querySelector<HTMLSelectElement>('#envHeight');
const containerWidthSelect = document.querySelector<HTMLSelectElement>('#width');
const containerHeightSelect = document.querySelector<HTMLSelectElement>('#height');
const containerFloatSelect = document.querySelector<HTMLSelectElement>('#float');
const containerPaddingSelect = document.querySelector<HTMLSelectElement>('#padding');
const containerBorderSelect = document.querySelector<HTMLSelectElement>('#border');
const containerMarginSelect = document.querySelector<HTMLSelectElement>('#margin');
const containerBoxSizingSelect = document.querySelector<HTMLSelectElement>('#boxSizing');
const containerDirectionSelect = document.querySelector<HTMLSelectElement>('#direction');
const containerMinMaxSelect = document.querySelector<HTMLSelectElement>('#minMax');

envWidthSelect?.addEventListener('change', selectCallbackEnv);
envHeightSelect?.addEventListener('change', selectCallbackEnv);
containerWidthSelect?.addEventListener('change', selectCallbackEnv);
containerHeightSelect?.addEventListener('change', selectCallbackEnv);
containerFloatSelect?.addEventListener('change', selectCallbackEnv);
containerPaddingSelect?.addEventListener('change', selectCallbackEnv);
containerBorderSelect?.addEventListener('change', selectCallbackEnv);
containerMarginSelect?.addEventListener('change', selectCallbackEnv);
containerBoxSizingSelect?.addEventListener('change', selectCallbackEnv);
containerDirectionSelect?.addEventListener('change', selectCallbackEnv);
containerMinMaxSelect?.addEventListener('change', selectCallbackEnv);

selectCallbackEnv(envWidthSelect);
selectCallbackEnv(envHeightSelect);
selectCallbackEnv(containerWidthSelect);
selectCallbackEnv(containerHeightSelect);
selectCallbackEnv(containerFloatSelect);
selectCallbackEnv(containerPaddingSelect);
selectCallbackEnv(containerBorderSelect);
selectCallbackEnv(containerMarginSelect);
selectCallbackEnv(containerBoxSizingSelect);
selectCallbackEnv(containerDirectionSelect);
selectCallbackEnv(containerMinMaxSelect);

// 1. no overflow
// 2. 1px overflow (width)
// 3. 1px overflow (height)
// 4. lerge overflow (width & height)

// tests for restricted measuring without content elm

const iterate = async (select: HTMLSelectElement | null, afterEach?: () => any) => {
  await iterateSelect(select, {
    async check() {
      const comparisonEnvBCR = getBoundingClientRect(parent(comparison!) as HTMLElement);
      const comparisonBCR = getBoundingClientRect(comparison!);
      const comparisonPercentBCR = getBoundingClientRect(comparisonPercent!);
      const comparisonEndBCR = getBoundingClientRect(comparisonEnd!);
      const comparisonMatrics = {
        offset: {
          left: (comparisonBCR.left - comparisonEnvBCR.left).toFixed(Math.min(fixedDigitsOffset, fixedDigits)),
          top: (comparisonBCR.top - comparisonEnvBCR.top).toFixed(Math.min(fixedDigitsOffset, fixedDigits)),
        },
        size: {
          width: comparisonBCR.width.toFixed(fixedDigits),
          height: comparisonBCR.height.toFixed(fixedDigits),
        },
        scroll: {
          width: comparison!.scrollWidth - comparison!.clientWidth,
          height: comparison!.scrollHeight - comparison!.clientHeight,
        },
        percentElm: {
          width: comparisonPercentBCR.width.toFixed(fixedDigits),
          height: comparisonPercentBCR.height.toFixed(fixedDigits),
        },
        endElm: {
          width: comparisonEndBCR.width.toFixed(fixedDigits),
          height: comparisonEndBCR.height.toFixed(fixedDigits),
        },
      };

      await waitForOrFailTest(async () => {
        const targetEnvBCR = getBoundingClientRect(parent(target!) as HTMLElement);
        const targetBCR = getBoundingClientRect(target!);
        const targetPercentBCR = getBoundingClientRect(targetPercent!);
        const targetEndBCR = getBoundingClientRect(targetEnd!);
        const targetViewport = target!.querySelector<HTMLElement>('.os-viewport');

        const targetMetrics = {
          offset: {
            left: (targetBCR.left - targetEnvBCR.left).toFixed(Math.min(fixedDigitsOffset, fixedDigits)),
            top: (targetBCR.top - targetEnvBCR.top).toFixed(Math.min(fixedDigitsOffset, fixedDigits)),
          },
          size: {
            width: targetBCR.width.toFixed(fixedDigits),
            height: targetBCR.height.toFixed(fixedDigits),
          },
          scroll: {
            width: targetViewport!.scrollWidth - targetViewport!.clientWidth,
            height: targetViewport!.scrollHeight - targetViewport!.clientHeight,
          },
          percentElm: {
            width: targetPercentBCR.width.toFixed(fixedDigits),
            height: targetPercentBCR.height.toFixed(fixedDigits),
          },
          endElm: {
            width: targetEndBCR.width.toFixed(fixedDigits),
            height: targetEndBCR.height.toFixed(fixedDigits),
          },
        };

        //console.log('t', targetMetrics);
        //console.log('c', comparisonMatrics);

        should.equal(targetMetrics.offset.left, comparisonMatrics.offset.left, 'Offset left equality.');
        should.equal(targetMetrics.offset.top, comparisonMatrics.offset.top, 'Offset top equality.');

        should.equal(targetMetrics.size.width, comparisonMatrics.size.width, 'Size width equality.');
        should.equal(targetMetrics.size.height, comparisonMatrics.size.height, 'Size height equality.');

        should.equal(targetMetrics.scroll.width, comparisonMatrics.scroll.width, 'Scroll width equality.');
        should.equal(targetMetrics.scroll.height, comparisonMatrics.scroll.height, 'Scroll height equality.');

        if (targetMetrics.scroll.width > 0) {
          should.equal(style(targetViewport!, 'overflowX'), 'scroll', 'Overflow-X should result in scroll.');
        } else {
          should.notEqual(style(targetViewport!, 'overflowX'), 'scroll', 'No Overflow-X shouldnt result in scroll.');
        }

        if (targetMetrics.scroll.height > 0) {
          should.equal(style(targetViewport!, 'overflowY'), 'scroll', 'Overflow-Y should result in scroll.');
        } else {
          should.notEqual(style(targetViewport!, 'overflowY'), 'scroll', 'No Overflow-Y shouldnt result in scroll.');
        }

        should.equal(targetMetrics.percentElm.width, comparisonMatrics.percentElm.width, 'Percent Elements width equality.');
        should.equal(targetMetrics.percentElm.height, comparisonMatrics.percentElm.height, 'Percent Elements height equality.');

        should.equal(targetMetrics.endElm.width, comparisonMatrics.endElm.width, 'End Elements width equality.');
        should.equal(targetMetrics.endElm.height, comparisonMatrics.endElm.height, 'End Elements height equality.');

        await timeout(1);
      });
    },
    afterEach,
  });
};

const iterateEnvWidth = async (afterEach?: () => any) => {
  await iterate(envWidthSelect, afterEach);
};
const iterateEnvHeight = async (afterEach?: () => any) => {
  await iterate(envHeightSelect, afterEach);
};
const iterateHeight = async (afterEach?: () => any) => {
  await iterate(containerHeightSelect, afterEach);
};
const iterateWidth = async (afterEach?: () => any) => {
  await iterate(containerWidthSelect, afterEach);
};
const iterateFloat = async (afterEach?: () => any) => {
  await iterate(containerFloatSelect, afterEach);
};
const iteratePadding = async (afterEach?: () => any) => {
  await iterate(containerPaddingSelect, afterEach);
};
const iterateBorder = async (afterEach?: () => any) => {
  await iterate(containerBorderSelect, afterEach);
};
const iterateMargin = async (afterEach?: () => any) => {
  await iterate(containerMarginSelect, afterEach);
};
const iterateBoxSizing = async (afterEach?: () => any) => {
  await iterate(containerBoxSizingSelect, afterEach);
};
const iterateDirection = async (afterEach?: () => any) => {
  await iterate(containerDirectionSelect, afterEach);
};
const iterateMinMax = async (afterEach?: () => any) => {
  await iterate(containerMinMaxSelect, afterEach);
};

const start = async () => {
  setTestResult(null);

  target?.removeAttribute('style');
  await iterateMinMax(async () => {
    await iterateBoxSizing(async () => {
      await iterateHeight(async () => {
        await iterateWidth(async () => {
          await iterateBorder(async () => {
            // assume this part isn't critical for IE11, to boost test speed
            if (!msie11) {
              await iterateFloat(async () => {
                await iterateMargin();
              });
            }

            await iteratePadding();
            await iterateDirection();
          });
        });
      });
    });
  });

  setTestResult(true);
};

startBtn?.addEventListener('click', start);
