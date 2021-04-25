import 'styles/overlayscrollbars.scss';
import './index.scss';
import should from 'should';
import { resize } from '@/testing-browser/Resize';
import { setTestResult, waitForOrFailTest } from '@/testing-browser/TestResult';
import { generateClassChangeSelectCallback, iterateSelect, selectOption } from '@/testing-browser/Select';
import { timeout } from '@/testing-browser/timeout';
import { OverlayScrollbars } from 'overlayscrollbars';
import { clientSize, from, getBoundingClientRect, style, parent, addClass, WH, removeAttr } from 'support';

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

const envElms = document.querySelectorAll<HTMLElement>('.env');

if (!useContentElement) {
  envElms.forEach((elm) => {
    addClass(elm, 'intrinsic-hack');
  });
}

const osInstance = (window.os = OverlayScrollbars({ target: target!, content: useContentElement }));

target!.querySelector('.os-viewport')?.addEventListener('scroll', (e) => {
  const viewport: HTMLElement | null = e.currentTarget as HTMLElement;
  comparison!.scrollLeft = viewport.scrollLeft;
  comparison!.scrollTop = viewport.scrollTop;
});

resize(target!).addResizeListener((width, height) => style(comparison, { width, height }));
//resize(comparison!).addResizeListener((width, height) => style(target, { width, height }));
resize(targetResize!).addResizeListener((width, height) => style(comparisonResize, { width, height }));
//resize(comparisonRes!).addResizeListener((width, height) => style(targetRes, { width, height }));

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

const checkMetrics = async () => {
  const comparisonEnvBCR = getBoundingClientRect(parent(comparison!) as HTMLElement);
  const comparisonBCR = getBoundingClientRect(comparison!);
  const comparisonPercentBCR = getBoundingClientRect(comparisonPercent!);
  const comparisonEndBCR = getBoundingClientRect(comparisonEnd!);
  const comparisonMetrics = {
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

    should.equal(targetMetrics.offset.left, comparisonMetrics.offset.left, 'Offset left equality.');
    should.equal(targetMetrics.offset.top, comparisonMetrics.offset.top, 'Offset top equality.');

    should.equal(targetMetrics.size.width, comparisonMetrics.size.width, 'Size width equality.');
    should.equal(targetMetrics.size.height, comparisonMetrics.size.height, 'Size height equality.');

    should.equal(targetMetrics.scroll.width, comparisonMetrics.scroll.width, 'Scroll width equality.');
    should.equal(targetMetrics.scroll.height, comparisonMetrics.scroll.height, 'Scroll height equality.');

    should.equal(osInstance.state()._overflowAmount.w, comparisonMetrics.scroll.width, 'Overflow amount width equality.');
    should.equal(osInstance.state()._overflowAmount.h, comparisonMetrics.scroll.height, 'Overflow amount height equality.');

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

    should.equal(targetMetrics.percentElm.width, comparisonMetrics.percentElm.width, 'Percent Elements width equality.');
    should.equal(targetMetrics.percentElm.height, comparisonMetrics.percentElm.height, 'Percent Elements height equality.');

    should.equal(targetMetrics.endElm.width, comparisonMetrics.endElm.width, 'End Elements width equality.');
    should.equal(targetMetrics.endElm.height, comparisonMetrics.endElm.height, 'End Elements height equality.');

    await timeout(1);
  });
};

const iterate = async (select: HTMLSelectElement | null, afterEach?: () => any) => {
  await iterateSelect(select, {
    async check() {
      await checkMetrics();
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

const containerTest = async () => {
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
};
const overflowTest = async () => {
  const contentBox = (elm: HTMLElement | null): WH<number> => {
    if (elm) {
      const computedStyle = window.getComputedStyle(elm);
      const size = clientSize(elm);
      return {
        w: size.w - (parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight)),
        h: size.h - (parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom)),
      };
    }

    return { w: 0, h: 0 };
  };
  const setNoOverflow = async () => {
    const styleObj = { width: 0, height: 0 };
    style(targetResize, styleObj);
    style(comparisonResize, styleObj);

    await checkMetrics();
  };
  const setSmallestOverflow = async (width?: boolean, height?: boolean) => {
    const { maxWidth, maxHeight } = style(comparison, ['maxWidth', 'maxHeight']);

    if (maxWidth !== 'none' && maxHeight !== 'none') {
      const { paddingRight, paddingBottom } = style(comparison, ['paddingRight', 'paddingBottom']);
      const comparisonContentBox = contentBox(comparison);
      const widthOverflow = width ? 1 : 0;
      const heightOverflow = height ? 1 : 0;
      const styleObj = { width: comparisonContentBox.w + widthOverflow, height: comparisonContentBox.h + heightOverflow };

      style(comparisonResize, styleObj);

      const overflowAmount = {
        width: comparison!.scrollWidth - comparison!.clientWidth,
        height: comparison!.scrollHeight - comparison!.clientHeight,
      };

      if (width && overflowAmount.width <= 0) {
        styleObj.width += parseFloat(paddingRight);
      }
      if (height && overflowAmount.height <= 0) {
        styleObj.height += parseFloat(paddingBottom);
      }

      style(comparisonResize, styleObj);

      if (width) {
        while (comparison!.scrollWidth - comparison!.clientWidth <= 0) {
          styleObj.width += 1;
          style(comparisonResize, styleObj);
        }
      }

      if (height) {
        while (comparison!.scrollHeight - comparison!.clientHeight <= 0) {
          styleObj.height += 1;
          style(comparisonResize, styleObj);
        }
      }

      const overflowAmountCheck = {
        width: comparison!.scrollWidth - comparison!.clientWidth,
        height: comparison!.scrollHeight - comparison!.clientHeight,
      };

      should.equal(overflowAmountCheck.width, width ? 1 : 0, 'Correct smallest possible overflow width.');
      should.equal(overflowAmountCheck.height, height ? 1 : 0, 'Correct smallest possible overflow height.');

      style(targetResize, styleObj);

      await checkMetrics();
    }
  };
  const setLargeOverflow = async (width?: boolean, height?: boolean) => {
    const comparisonContentBox = contentBox(comparison);
    const widthOverflow = width ? 1000 : 0;
    const heightOverflow = height ? 1000 : 0;
    const styleObj = { width: comparisonContentBox.w + widthOverflow, height: comparisonContentBox.h + heightOverflow };
    style(targetResize, styleObj);
    style(comparisonResize, styleObj);

    await checkMetrics();
  };

  style(targetResize, { boxSizing: 'border-box', background: 'rgba(0, 0, 0, 0.1)' });
  style(comparisonResize, { boxSizing: 'border-box', background: 'rgba(0, 0, 0, 0.1)' });
  style(targetPercent, { display: 'none' });
  style(comparisonPercent, { display: 'none' });
  style(targetEnd, { display: 'none' });
  style(comparisonEnd, { display: 'none' });

  await iterateMinMax(async () => {
    await iterateBoxSizing(async () => {
      await iterateHeight(async () => {
        await iterateWidth(async () => {
          await iterateBorder(async () => {
            await iteratePadding(async () => {
              await setNoOverflow();
              await setSmallestOverflow(true, false);
              await setSmallestOverflow(false, true);
              await setSmallestOverflow(true, true);

              await setNoOverflow();
              await setLargeOverflow(true, false);
              await setLargeOverflow(false, true);
              await setLargeOverflow(true, true);
            });
          });
        });
      });
    });
  });

  removeAttr(targetResize, 'style');
  removeAttr(comparisonResize, 'style');
  removeAttr(targetPercent, 'style');
  removeAttr(comparisonPercent, 'style');
  removeAttr(targetEnd, 'style');
  removeAttr(comparisonEnd, 'style');
};

const start = async () => {
  setTestResult(null);

  target?.removeAttribute('style');
  //await containerTest();
  await overflowTest();

  setTestResult(true);
};

startBtn?.addEventListener('click', start);
