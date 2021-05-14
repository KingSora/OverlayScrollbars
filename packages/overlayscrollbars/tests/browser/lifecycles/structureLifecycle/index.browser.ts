import 'styles/overlayscrollbars.scss';
import './index.scss';
import './handleEnvironment';
import should from 'should';
import { resize } from '@/testing-browser/Resize';
import { setTestResult, waitForOrFailTest } from '@/testing-browser/TestResult';
import { generateClassChangeSelectCallback, iterateSelect } from '@/testing-browser/Select';
import { timeout } from '@/testing-browser/timeout';
import { OverlayScrollbars } from 'overlayscrollbars';
import { assignDeep, clientSize, from, getBoundingClientRect, style, parent, addClass, WH, removeAttr } from 'support';

interface Metrics {
  offset: {
    left: string | number;
    top: string | number;
  };
  size: {
    width: string | number;
    height: string | number;
  };
  scroll: {
    width: number;
    height: number;
  };
  hasOverflow: {
    x: boolean;
    y: boolean;
  };
  percentElm: {
    width: string | number;
    height: string | number;
  };
  endElm: {
    width: string | number;
    height: string | number;
  };
}

interface CheckComparisonObj {
  updCount: number;
  metrics: Metrics;
}

const isFractionalPixelRatio = () => window.devicePixelRatio % 1 !== 0;

const getMetrics = (elm: HTMLElement): Metrics => {
  const rounding = isFractionalPixelRatio() ? Math.round : (num: number) => num;
  const elmIsTarget = elm === target;
  const comparisonEnvBCR = getBoundingClientRect(parent(elm!) as HTMLElement);
  const comparisonBCR = getBoundingClientRect(elm!);
  const comparisonPercentBCR = getBoundingClientRect(elm!.querySelector('.percent')!);
  const comparisonEndBCR = getBoundingClientRect(elm!.querySelector('.end')!);
  const targetViewport = target!.querySelector<HTMLElement>('.os-viewport');

  const scrollMeasure = (elm: HTMLElement) => {
    return {
      width: Math.max(0, elm!.scrollWidth - elm!.clientWidth),
      height: Math.max(0, elm!.scrollHeight - elm!.clientHeight),
    };
  };

  const hasOverflow = (elm: HTMLElement) => {
    const measure = scrollMeasure(elm);
    return elmIsTarget
      ? {
          x: osInstance.state()._overflowAmount.w > 0,
          y: osInstance.state()._overflowAmount.h > 0,
        }
      : {
          x: measure.width > 0,
          y: measure.height > 0,
        };
  };

  return {
    offset: {
      left: rounding(comparisonBCR.left - comparisonEnvBCR.left).toFixed(Math.min(fixedDigitsOffset, fixedDigits)),
      top: rounding(comparisonBCR.top - comparisonEnvBCR.top).toFixed(Math.min(fixedDigitsOffset, fixedDigits)),
    },
    size: {
      width: rounding(comparisonBCR.width).toFixed(fixedDigits),
      height: rounding(comparisonBCR.height).toFixed(fixedDigits),
    },
    scroll: elmIsTarget ? scrollMeasure(targetViewport!) : scrollMeasure(comparison!),
    hasOverflow: elmIsTarget ? hasOverflow(targetViewport!) : hasOverflow(comparison!),
    percentElm: {
      width: rounding(comparisonPercentBCR.width).toFixed(fixedDigits),
      height: rounding(comparisonPercentBCR.height).toFixed(fixedDigits),
    },
    endElm: {
      width: rounding(comparisonEndBCR.width).toFixed(fixedDigits),
      height: rounding(comparisonEndBCR.height).toFixed(fixedDigits),
    },
  };
};

const metricsDimensionsEqual = (a: Metrics, b: Metrics) => {
  const aDimensions = assignDeep({}, a, { offset: null });
  const bDimensions = assignDeep({}, b, { offset: null });

  return JSON.stringify(aDimensions) === JSON.stringify(bDimensions);
};

const plusMinusArr = (original: number, plusMinus: number) => {
  const arr = Array.from(Array(plusMinus).keys())
    .map((_, index) => original + (index + 1))
    .concat(Array.from(Array(plusMinus).keys()).map((_, index) => original - (index + 1)));
  arr.push(original);
  return arr;
};

// @ts-ignore
const msie11 = !!window.MSInputMethodContext && !!document.documentMode;
const msedge = window.navigator.userAgent.toLowerCase().indexOf('edge') > -1;

msie11 && addClass(document.body, 'msie11');

const useContentElement = false;
const fixedDigits = msie11 ? 1 : 3;
const fixedDigitsOffset = 3;
const fractionalPixelRatioTollerance = 2; // nss=true && any overlaid ? 2 : 1;

const startBtn: HTMLButtonElement | null = document.querySelector('#start');
const target: HTMLElement | null = document.querySelector('#target');
const comparison: HTMLElement | null = document.querySelector('#comparison');
const targetResize: HTMLElement | null = document.querySelector('#target .resize');
const comparisonResize: HTMLElement | null = document.querySelector('#comparison .resize');
const targetPercent: HTMLElement | null = document.querySelector('#target .percent');
const comparisonPercent: HTMLElement | null = document.querySelector('#comparison .percent');
const targetEnd: HTMLElement | null = document.querySelector('#target .end');
const comparisonEnd: HTMLElement | null = document.querySelector('#comparison .end');
const targetUpdatesSlot: HTMLElement | null = document.querySelector('#updates');

const envElms = document.querySelectorAll<HTMLElement>('.env');

if (!useContentElement) {
  envElms.forEach((elm) => {
    addClass(elm, 'intrinsic-hack');
  });
}

let updateCount = 0;
// @ts-ignore
const osInstance = (window.os = OverlayScrollbars(
  { target: target!, content: useContentElement },
  {
    callbacks: {
      onUpdated() {
        updateCount++;
        requestAnimationFrame(() => {
          if (targetUpdatesSlot) {
            targetUpdatesSlot.textContent = `${updateCount}`;
          }
        });
      },
    },
  }
));

target!.querySelector('.os-viewport')?.addEventListener('scroll', (e) => {
  const viewport: HTMLElement | null = e.currentTarget as HTMLElement;
  comparison!.scrollLeft = viewport.scrollLeft;
  comparison!.scrollTop = viewport.scrollTop;
});

resize(target!).addResizeListener((width, height) => {
  style(comparison, { width, height });
});
//resize(comparison!).addResizeListener((width, height) => style(target, { width, height }));
resize(targetResize!).addResizeListener((width, height) => {
  style(comparisonResize, { width, height });
});
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

const checkMetrics = async (checkComparison: CheckComparisonObj) => {
  const { metrics: oldMetrics, updCount: oldUpdCount } = checkComparison;
  const currMetrics = getMetrics(comparison!);
  await waitForOrFailTest(async () => {
    if (!metricsDimensionsEqual(oldMetrics, currMetrics)) {
      should.ok(updateCount > oldUpdCount, 'Update should have been triggered.');
    }
  });
  await waitForOrFailTest(async () => {
    const comparisonMetrics = getMetrics(comparison!);
    const targetMetrics = getMetrics(target!);
    const targetViewport = target!.querySelector<HTMLElement>('.os-viewport');

    should.equal(targetMetrics.offset.left, comparisonMetrics.offset.left, 'Offset left equality.');
    should.equal(targetMetrics.offset.top, comparisonMetrics.offset.top, 'Offset top equality.');

    should.equal(targetMetrics.size.width, comparisonMetrics.size.width, 'Size width equality.');
    should.equal(targetMetrics.size.height, comparisonMetrics.size.height, 'Size height equality.');

    if (isFractionalPixelRatio()) {
      should.ok(
        plusMinusArr(targetMetrics.scroll.width, fractionalPixelRatioTollerance).indexOf(comparisonMetrics.scroll.width) > -1,
        `Scroll width equality. (+-${fractionalPixelRatioTollerance}) | Target: ${targetMetrics.scroll.width} | Comparison: ${comparisonMetrics.scroll.width}`
      );
      should.ok(
        plusMinusArr(targetMetrics.scroll.height, fractionalPixelRatioTollerance).indexOf(comparisonMetrics.scroll.height) > -1,
        `Scroll height equality. (+-${fractionalPixelRatioTollerance}) | Target: ${targetMetrics.scroll.height} | Comparison: ${comparisonMetrics.scroll.height}`
      );

      should.ok(
        plusMinusArr(osInstance.state()._overflowAmount.w, fractionalPixelRatioTollerance).indexOf(comparisonMetrics.scroll.width) > -1,
        `Overflow amount width equality. (+-${fractionalPixelRatioTollerance}) | Amount: ${osInstance.state()._overflowAmount.w} | Comparison: ${
          comparisonMetrics.scroll.width
        }`
      );
      should.ok(
        plusMinusArr(osInstance.state()._overflowAmount.h, fractionalPixelRatioTollerance).indexOf(comparisonMetrics.scroll.height) > -1,
        `Overflow amount height equality. (+-${fractionalPixelRatioTollerance}) | Amount: ${osInstance.state()._overflowAmount.h} | Comparison: ${
          comparisonMetrics.scroll.height
        }`
      );
    } else {
      should.equal(targetMetrics.scroll.width, comparisonMetrics.scroll.width, 'Scroll width equality.');
      should.equal(targetMetrics.scroll.height, comparisonMetrics.scroll.height, 'Scroll height equality.');

      should.equal(osInstance.state()._overflowAmount.w, comparisonMetrics.scroll.width, 'Overflow amount width equality.');
      should.equal(osInstance.state()._overflowAmount.h, comparisonMetrics.scroll.height, 'Overflow amount height equality.');

      should.equal(targetMetrics.hasOverflow.x, comparisonMetrics.hasOverflow.x, 'Has overflow x equality.');
      should.equal(targetMetrics.hasOverflow.y, comparisonMetrics.hasOverflow.y, 'Has overflow y equality.');
    }

    if (targetMetrics.hasOverflow.x) {
      should.equal(style(targetViewport!, 'overflowX'), 'scroll', 'Overflow-X should result in scroll.');
      should.ok(osInstance.state()._overflowAmount.w > 0, 'Overflow amount width should be > 0 with overflow.');
    } else {
      should.notEqual(style(targetViewport!, 'overflowX'), 'scroll', 'No Overflow-X shouldnt result in scroll.');
      should.equal(osInstance.state()._overflowAmount.w, 0, 'Overflow amount width should be 0 without overflow.');
    }

    if (targetMetrics.hasOverflow.y) {
      should.equal(style(targetViewport!, 'overflowY'), 'scroll', 'Overflow-Y should result in scroll.');
      should.ok(osInstance.state()._overflowAmount.h > 0, 'Overflow amount height should be > 0 with overflow.');
    } else {
      should.notEqual(style(targetViewport!, 'overflowY'), 'scroll', 'No Overflow-Y shouldnt result in scroll.');
      should.equal(osInstance.state()._overflowAmount.h, 0, 'Overflow amount height should be 0 without overflow.');
    }

    should.equal(targetMetrics.percentElm.width, comparisonMetrics.percentElm.width, 'Percent Elements width equality.');
    should.equal(targetMetrics.percentElm.height, comparisonMetrics.percentElm.height, 'Percent Elements height equality.');

    should.equal(targetMetrics.endElm.width, comparisonMetrics.endElm.width, 'End Elements width equality.');
    should.equal(targetMetrics.endElm.height, comparisonMetrics.endElm.height, 'End Elements height equality.');

    await timeout(1);

    // steady pace for ie11 or it will freeze progressively
    if (msie11) {
      await timeout(25);
    }
  });
};

const iterate = async (select: HTMLSelectElement | null, afterEach?: () => any) => {
  await iterateSelect<CheckComparisonObj>(select, {
    beforeEach() {
      const metrics = getMetrics(comparison!);
      return {
        updCount: updateCount,
        metrics,
      };
    },
    async check(beforeChange) {
      await checkMetrics(beforeChange);
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

const overflowTest = async () => {
  const additiveOverflow = () => {
    if (isFractionalPixelRatio()) {
      return 1;
    }
    return 1;
  };
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
    const before: CheckComparisonObj = {
      updCount: updateCount,
      metrics: getMetrics(comparison!),
    };

    style(targetResize, styleObj);
    style(comparisonResize, styleObj);

    await checkMetrics(before);
  };
  const setSmallestOverflow = async (width?: boolean, height?: boolean) => {
    const { maxWidth, maxHeight } = style(comparison, ['maxWidth', 'maxHeight']);

    if (maxWidth !== 'none' && maxHeight !== 'none') {
      const addOverflow = additiveOverflow();
      const before: CheckComparisonObj = {
        updCount: updateCount,
        metrics: getMetrics(comparison!),
      };
      const { paddingRight, paddingBottom } = style(comparison, ['paddingRight', 'paddingBottom']);
      const comparisonContentBox = contentBox(comparison);
      const widthOverflow = width ? comparisonContentBox.w + addOverflow : 0;
      const heightOverflow = height ? comparisonContentBox.h + addOverflow : 0;
      const styleObj = { width: widthOverflow, height: heightOverflow };

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
        while (comparison!.scrollWidth - comparison!.clientWidth <= addOverflow - 1) {
          styleObj.width += addOverflow;
          style(comparisonResize, styleObj);
        }
      }

      if (height) {
        while (comparison!.scrollHeight - comparison!.clientHeight <= addOverflow - 1) {
          styleObj.height += addOverflow;
          style(comparisonResize, styleObj);
        }
      }

      const overflowAmountCheck = {
        width: comparison!.scrollWidth - comparison!.clientWidth,
        height: comparison!.scrollHeight - comparison!.clientHeight,
      };

      await waitForOrFailTest(() => {
        if (width) {
          should.ok(overflowAmountCheck.width >= addOverflow, 'Correct smallest possible overflow width. (?)');
        } else {
          should.equal(overflowAmountCheck.width, 0, 'Correct smallest possible overflow width. (0)');
        }

        if (height) {
          should.ok(overflowAmountCheck.height >= addOverflow, 'Correct smallest possible overflow height. (?)');
        } else {
          should.equal(overflowAmountCheck.height, 0, 'Correct smallest possible overflow height. (0)');
        }
      });

      style(targetResize, styleObj);

      await checkMetrics(before);
    }
  };
  const setLargeOverflow = async (width?: boolean, height?: boolean) => {
    const before: CheckComparisonObj = {
      updCount: updateCount,
      metrics: getMetrics(comparison!),
    };
    const comparisonContentBox = contentBox(comparison);
    const widthOverflow = width ? comparisonContentBox.w + 1000 : 0;
    const heightOverflow = height ? comparisonContentBox.h + 1000 : 0;
    const styleObj = { width: widthOverflow, height: heightOverflow };
    style(targetResize, styleObj);
    style(comparisonResize, styleObj);

    await checkMetrics(before);
  };
  const overflowTest = async () => {
    style(targetResize, { boxSizing: 'border-box' });
    style(comparisonResize, { boxSizing: 'border-box' });
    style(targetPercent, { display: 'none' });
    style(comparisonPercent, { display: 'none' });
    style(targetEnd, { display: 'none' });
    style(comparisonEnd, { display: 'none' });

    await setNoOverflow();
    await setSmallestOverflow(true, false);
    await setSmallestOverflow(false, true);
    await setSmallestOverflow(true, true);

    await setNoOverflow();
    await setLargeOverflow(true, false);
    await setLargeOverflow(false, true);
    await setLargeOverflow(true, true);

    removeAttr(targetResize, 'style');
    removeAttr(comparisonResize, 'style');
    removeAttr(targetPercent, 'style');
    removeAttr(comparisonPercent, 'style');
    removeAttr(targetEnd, 'style');
    removeAttr(comparisonEnd, 'style');
  };

  await iterateMinMax(async () => {
    await iterateBoxSizing(async () => {
      await iterateHeight(async () => {
        await iterateWidth(async () => {
          await iterateBorder(async () => {
            // assume this part isn't critical
            /*
            await iterateFloat(async () => {
              await iterateMargin();
            });
            */

            await iteratePadding(async () => {
              await overflowTest();
            });
            await iterateDirection();
          });
        });
      });
    });
  });
};

const start = async () => {
  setTestResult(null);

  target?.removeAttribute('style');
  await overflowTest();

  setTestResult(true);
};

startBtn?.addEventListener('click', start);
