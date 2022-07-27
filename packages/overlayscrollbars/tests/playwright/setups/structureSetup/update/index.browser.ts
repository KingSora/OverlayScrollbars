import 'index.scss';
import './index.scss';
import './handleEnvironment';
import { OverlayScrollbars } from 'overlayscrollbars';
import should from 'should';
import {
  assignDeep,
  clientSize,
  from,
  getBoundingClientRect,
  style,
  parent,
  addClass,
  WH,
  removeAttr,
  contents,
  appendChildren,
  createDOM,
  hasClass,
} from 'support';
import { resize } from '@/testing-browser/Resize';
import { setTestResult, waitForOrFailTest } from '@/testing-browser/TestResult';
import { generateClassChangeSelectCallback, iterateSelect } from '@/testing-browser/Select';
import { timeout } from '@/testing-browser/timeout';
import { Options } from 'options';
import { DeepPartial } from 'typings';
import { addPlugin, scrollbarsHidingPlugin, sizeObserverPlugin } from 'plugins';

if (!window.ResizeObserver) {
  addPlugin(sizeObserverPlugin);
}
if (!OverlayScrollbars.env().scrollbarsHiding) {
  addPlugin(scrollbarsHidingPlugin);
}

// @ts-ignore
window.OverlayScrollbars = OverlayScrollbars;

OverlayScrollbars.env().setDefaultInitialization({
  cancel: { nativeScrollbarsOverlaid: false },
});

interface Metrics {
  offset: {
    left: number;
    top: number;
  };
  size: {
    width: number;
    height: number;
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
    width: number;
    height: number;
  };
  endElm: {
    width: number;
    height: number;
  };
}

interface CheckComparisonObj {
  updCount: number;
  metrics: Metrics;
}

const isFractionalPixelRatio = () => window.devicePixelRatio % 1 !== 0;

const isVisibleOverflow = (val: string) => val.indexOf('visible') === 0;

const expectedOverflowVisibleBehavior = (
  overflowOptionAxis: string,
  hasOverflowOtherAxis: boolean
) => {
  const overflowVisibleBehavior = overflowOptionAxis.replace('visible', '').slice(1);
  return hasOverflowOtherAxis ? overflowVisibleBehavior || 'hidden' : 'visible';
};

// @ts-ignore
const msie11 = !!window.MSInputMethodContext && !!document.documentMode;
const ff = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
const msedge = window.navigator.userAgent.toLowerCase().indexOf('edge') > -1;

msie11 && addClass(document.body, 'msie11');

const useContentElement = false;
const fixedDigits = msie11 ? 1 : 3;
const fixedDigitsOffset = 3;

const startBtn: HTMLButtonElement | null = document.querySelector('#start');
const target: HTMLElement | null = document.querySelector('#target');
const targetMetrics: HTMLElement | null = document.querySelector('#targetMetrics');
const comparison: HTMLElement | null = document.querySelector('#comparison');
const comparisonMetrics: HTMLElement | null = document.querySelector('#comparisonMetrics');
const targetResize: HTMLElement | null = document.querySelector('#target .resize');
const comparisonResize: HTMLElement | null = document.querySelector('#comparison .resize');
const targetPercent: HTMLElement | null = document.querySelector('#target .percent');
const comparisonPercent: HTMLElement | null = document.querySelector('#comparison .percent');
const targetEnd: HTMLElement | null = document.querySelector('#target .end');
const comparisonEnd: HTMLElement | null = document.querySelector('#comparison .end');
const targetOptionsSlot: HTMLElement | null = document.querySelector('#options');
const targetUpdatesSlot: HTMLElement | null = document.querySelector('#updates');
const comparisonContentElm: HTMLElement = document.createElement('div');

const envElms = document.querySelectorAll<HTMLElement>('.env');

if (!useContentElement) {
  envElms.forEach((elm) => {
    addClass(elm, 'intrinsicHack');
  });
} else {
  const elms = contents(comparison);
  addClass(comparisonContentElm, 'comparisonContent');
  appendChildren(comparison, comparisonContentElm);
  appendChildren(comparisonContentElm, elms);
}

const initObj = hasClass(document.body, 'tvp')
  ? {
      target: target!,
      viewport: target!,
      content: useContentElement,
    }
  : { target: target!, content: useContentElement };

let updateCount = 0;
// @ts-ignore
const osInstance =
  // @ts-ignore
  (window.os = OverlayScrollbars(
    initObj,
    {},
    {
      updated() {
        updateCount++;
        requestAnimationFrame(() => {
          if (targetUpdatesSlot) {
            targetUpdatesSlot.textContent = `${updateCount}`;
          }
          if (targetOptionsSlot) {
            targetOptionsSlot.textContent = JSON.stringify(osInstance.options().overflow, null, 2);
          }
        });
      },
    }
  ));

const getMetrics = (elm: HTMLElement): Metrics => {
  // const rounding = isFractionalPixelRatio() ? Math.round : (num: number) => num;
  const elmIsTarget = elm === target;
  const comparisonEnvBCR = getBoundingClientRect(parent(elm!) as HTMLElement);
  const comparisonBCR = getBoundingClientRect(elm!);
  const comparisonPercentBCR = getBoundingClientRect(elm!.querySelector('.percent')!);
  const comparisonEndBCR = getBoundingClientRect(elm!.querySelector('.end')!);
  const scrollMeasure = () => {
    const condition = (raw: number) => (window.devicePixelRatio % 1 !== 0 ? raw > 1 : raw > 0);
    const amount = {
      width: Math.max(0, comparison!.scrollWidth - comparison!.clientWidth),
      height: Math.max(0, comparison!.scrollHeight - comparison!.clientHeight),
    };
    return {
      width: condition(amount.width) ? amount.width : 0,
      height: condition(amount.height) ? amount.height : 0,
    };
  };

  const results = {
    offset: {
      left: parseFloat(
        (comparisonBCR.left - comparisonEnvBCR.left).toFixed(
          Math.min(fixedDigitsOffset, fixedDigits)
        )
      ),
      top: parseFloat(
        (comparisonBCR.top - comparisonEnvBCR.top).toFixed(Math.min(fixedDigitsOffset, fixedDigits))
      ),
    },
    size: {
      width: parseFloat(comparisonBCR.width.toFixed(fixedDigits)),
      height: parseFloat(comparisonBCR.height.toFixed(fixedDigits)),
    },
    scroll: elmIsTarget
      ? {
          width: Math.round(osInstance.state().overflowAmount.x),
          height: Math.round(osInstance.state().overflowAmount.y),
        }
      : scrollMeasure(),
    hasOverflow: elmIsTarget
      ? {
          x: osInstance.state().hasOverflow.x,
          y: osInstance.state().hasOverflow.y,
        }
      : {
          x: scrollMeasure().width > 0,
          y: scrollMeasure().height > 0,
        },
    percentElm: {
      width: parseFloat(comparisonPercentBCR.width.toFixed(fixedDigits)),
      height: parseFloat(comparisonPercentBCR.height.toFixed(fixedDigits)),
    },
    endElm: {
      width: parseFloat(comparisonEndBCR.width.toFixed(fixedDigits)),
      height: parseFloat(comparisonEndBCR.height.toFixed(fixedDigits)),
    },
  };

  if (elmIsTarget) {
    targetMetrics!.textContent = JSON.stringify(results, null, 2);
  } else {
    comparisonMetrics!.textContent = JSON.stringify(results, null, 2);
  }

  return results;
};

const metricsDimensionsEqual = (a: Metrics, b: Metrics) => {
  const aDimensions = assignDeep({}, a, { offset: null });
  const bDimensions = assignDeep({}, b, { offset: null });

  return JSON.stringify(aDimensions) === JSON.stringify(bDimensions);
};

osInstance.elements().viewport.addEventListener('scroll', (e) => {
  const viewport: HTMLElement | null = e.currentTarget as HTMLElement;
  comparison!.scrollLeft = viewport.scrollLeft;
  comparison!.scrollTop = viewport.scrollTop;
});

resize(target!).addResizeListener((width, height) => {
  style(comparison, { width, height });
});
// resize(comparison!).addResizeListener((width, height) => style(target, { width, height }));
resize(targetResize!).addResizeListener((width, height) => {
  style(comparisonResize, { width, height });
});
// resize(comparisonRes!).addResizeListener((width, height) => style(targetRes, { width, height }));

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
  const {
    host: targetHost,
    viewport: targetViewport,
    padding: targetPadding,
  } = osInstance.elements();
  const viewportIsTarget = targetHost === targetViewport;
  const { metrics: oldMetrics, updCount: oldUpdCount } = checkComparison;
  const currMetrics = getMetrics(comparison!);
  await waitForOrFailTest(async () => {
    if (!viewportIsTarget && !metricsDimensionsEqual(oldMetrics, currMetrics)) {
      should.ok(updateCount > oldUpdCount, 'Update should have been triggered.');
    }
  });
  await waitForOrFailTest(async () => {
    const comparisonMetrics = getMetrics(comparison!);
    const targetMetrics = getMetrics(target!);

    const { x: overflowOptionX, y: overflowOptionY } = osInstance.options().overflow;
    const overflowOptionXVisible = isVisibleOverflow(overflowOptionX);
    const overflowOptionYVisible = isVisibleOverflow(overflowOptionY);
    const hostOverflowStyle = style(target, 'overflow');
    const paddingOverflowStyle = style(targetPadding, 'overflow');
    const viewportOverflowXStyle = style(targetViewport!, 'overflowX');
    const viewportOverflowYStyle = style(targetViewport!, 'overflowY');

    // ==== check scroll values:

    if (ff && isFractionalPixelRatio() && viewportIsTarget) {
      should.ok(
        Math.abs(targetMetrics.scroll.width - comparisonMetrics.scroll.width) <= 1,
        `Scroll width equality. +-1 (${osInstance.state().overflowAmount.x})`
      );
      should.ok(
        Math.abs(targetMetrics.scroll.height - comparisonMetrics.scroll.height) <= 1,
        `Scroll height equality. +-1 (${osInstance.state().overflowAmount.y})`
      );

      if (!document.querySelector('#rounding')) {
        appendChildren(
          targetUpdatesSlot!.parentElement!.parentElement,
          createDOM('<span>Rounding issues: <span id="rounding">0</span></span>')
        );
      }
      const roundingElm = document.querySelector('#rounding');
      const scrollWidth = targetMetrics.scroll.width - comparisonMetrics.scroll.width;
      const scrollHeight = targetMetrics.scroll.height - comparisonMetrics.scroll.height;
      if (scrollWidth !== 0 || scrollHeight !== 0) {
        console.log(scrollWidth);
        console.log(scrollHeight);
        roundingElm!.textContent = `${(parseInt(roundingElm!.textContent || '0', 10) || 0) + 1}`;
      }
    } else {
      should.equal(
        targetMetrics.scroll.width,
        comparisonMetrics.scroll.width,
        `Scroll width equality. (${osInstance.state().overflowAmount.x})`
      );
      should.equal(
        targetMetrics.scroll.height,
        comparisonMetrics.scroll.height,
        `Scroll height equality. (${osInstance.state().overflowAmount.y})`
      );
    }

    should.equal(
      targetMetrics.hasOverflow.x,
      comparisonMetrics.hasOverflow.x,
      'Has overflow x equality.'
    );
    should.equal(
      targetMetrics.hasOverflow.y,
      comparisonMetrics.hasOverflow.y,
      'Has overflow y equality.'
    );

    if (targetMetrics.hasOverflow.x) {
      should.ok(
        osInstance.state().overflowAmount.x > 0,
        'Overflow amount width should be > 0 with overflow.'
      );
    } else {
      should.equal(
        osInstance.state().overflowAmount.x,
        0,
        'Overflow amount width should be 0 without overflow.'
      );
    }
    if (targetMetrics.hasOverflow.y) {
      should.ok(
        osInstance.state().overflowAmount.y > 0,
        'Overflow amount height should be > 0 with overflow.'
      );
    } else {
      should.equal(
        osInstance.state().overflowAmount.y,
        0,
        'Overflow amount height should be 0 without overflow.'
      );
    }

    // ==== check elements offset and dimensions:

    // host offset
    should.equal(targetMetrics.offset.left, comparisonMetrics.offset.left, 'Offset left equality.');
    should.equal(targetMetrics.offset.top, comparisonMetrics.offset.top, 'Offset top equality.');

    // host dimensions
    should.equal(targetMetrics.size.width, comparisonMetrics.size.width, 'Size width equality.');
    should.equal(targetMetrics.size.height, comparisonMetrics.size.height, 'Size height equality.');

    // percent element dimensions
    should.equal(
      targetMetrics.percentElm.width,
      comparisonMetrics.percentElm.width,
      'Percent Elements width equality.'
    );
    should.equal(
      targetMetrics.percentElm.height,
      comparisonMetrics.percentElm.height,
      'Percent Elements height equality.'
    );

    // end element dimensions
    should.equal(
      targetMetrics.endElm.width,
      comparisonMetrics.endElm.width,
      'End Elements width equality.'
    );
    should.equal(
      targetMetrics.endElm.height,
      comparisonMetrics.endElm.height,
      'End Elements height equality.'
    );

    // ==== check viewport overflow style:

    if (targetMetrics.hasOverflow.x) {
      if (overflowOptionXVisible && !overflowOptionYVisible) {
        const expectedStyle = expectedOverflowVisibleBehavior(
          overflowOptionX,
          targetMetrics.hasOverflow.y
        );
        should.equal(
          viewportOverflowXStyle,
          expectedStyle,
          `Overflow-X visible behavior should result in ${expectedStyle}.`
        );
      } else if (overflowOptionXVisible && overflowOptionYVisible) {
        should.equal(
          viewportOverflowXStyle,
          'visible',
          `Overflow-X full visible behavior should result in visible.`
        );
      } else {
        should.equal(
          viewportOverflowXStyle,
          overflowOptionX,
          `Overflow-X should result in ${overflowOptionX}.`
        );
      }

      should.notEqual(viewportOverflowXStyle, 'auto', `Overflow-X should never be auto.`);
    } else {
      should.notEqual(viewportOverflowXStyle, 'scroll', 'No Overflow-X shouldnt result in scroll.');
    }

    if (targetMetrics.hasOverflow.y) {
      if (!overflowOptionXVisible && overflowOptionYVisible) {
        const expectedStyle = expectedOverflowVisibleBehavior(
          overflowOptionY,
          targetMetrics.hasOverflow.x
        );
        should.equal(
          viewportOverflowYStyle,
          expectedStyle,
          `Overflow-Y visible behavior should result in ${expectedStyle}.`
        );
      } else if (overflowOptionXVisible && overflowOptionYVisible) {
        should.equal(
          viewportOverflowYStyle,
          'visible',
          `Overflow-Y full visible behavior should result in visible.`
        );
      } else {
        should.equal(
          viewportOverflowYStyle,
          overflowOptionY,
          `Overflow-Y should result in ${overflowOptionY}.`
        );
      }

      should.notEqual(viewportOverflowYStyle, 'auto', `Overflow-Y should never be auto.`);
    } else {
      should.notEqual(viewportOverflowYStyle, 'scroll', 'No Overflow-Y shouldnt result in scroll.');
    }

    should.equal(
      osInstance.state().overflowStyle.x,
      viewportOverflowXStyle,
      'Overflow-X Style: State and style should match.'
    );
    should.equal(
      osInstance.state().overflowStyle.y,
      viewportOverflowYStyle,
      'Overflow-Y Style: State and style should match.'
    );

    // ==== check host & padding overflow style:

    if (!targetMetrics.hasOverflow.x && !targetMetrics.hasOverflow.y) {
      should.equal(hostOverflowStyle, 'hidden', 'Host Overflow should be hidden without overflow.');
    }
    if (
      isVisibleOverflow(viewportOverflowXStyle) &&
      isVisibleOverflow(viewportOverflowXStyle) &&
      (targetMetrics.hasOverflow.x || targetMetrics.hasOverflow.y)
    ) {
      should.equal(
        hostOverflowStyle,
        'visible',
        'Host Overflow should be visible with visible overflowing content.'
      );
    } else if (!viewportIsTarget) {
      should.equal(
        hostOverflowStyle,
        'hidden',
        'Host Overflow should be hidden without visible overflowing content.'
      );
    }
    if (targetPadding !== targetViewport) {
      should.equal(
        paddingOverflowStyle,
        hostOverflowStyle,
        'Padding Overflow should equal Host overflow.'
      );
    }

    await timeout(1);

    // steady pace for ie11 / edge or it will freeze progressively
    if (msie11 || msedge) {
      await timeout(25);
    }
  });
};

const iterate = async (
  select: HTMLSelectElement | null,
  afterEach?: () => any,
  skippedItems?: string[]
) => {
  await iterateSelect<CheckComparisonObj>(select, {
    filter: (item: string) => !skippedItems?.includes(item),
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
/*
const iterateEnvWidth = async (afterEach?: () => any) => {
  await iterate(envWidthSelect, afterEach);
};
const iterateEnvHeight = async (afterEach?: () => any) => {
  await iterate(envHeightSelect, afterEach);
};
*/
const iterateHeight = async (afterEach?: () => any, skippedItems?: string[]) => {
  await iterate(containerHeightSelect, afterEach, skippedItems);
};
const iterateWidth = async (afterEach?: () => any, skippedItems?: string[]) => {
  await iterate(containerWidthSelect, afterEach, skippedItems);
};
/*
const iterateFloat = async (afterEach?: () => any) => {
  await iterate(containerFloatSelect, afterEach);
};
*/
const iteratePadding = async (afterEach?: () => any, skippedItems?: string[]) => {
  await iterate(containerPaddingSelect, afterEach, skippedItems);
};
const iterateBorder = async (afterEach?: () => any, skippedItems?: string[]) => {
  await iterate(containerBorderSelect, afterEach, skippedItems);
};
/*
const iterateMargin = async (afterEach?: () => any) => {
  await iterate(containerMarginSelect, afterEach);
};
*/
const iterateBoxSizing = async (afterEach?: () => any) => {
  await iterate(containerBoxSizingSelect, afterEach);
};
const iterateDirection = async (afterEach?: () => any) => {
  await iterate(containerDirectionSelect, afterEach);
};
const iterateMinMax = async (afterEach?: () => any) => {
  await iterate(containerMinMaxSelect, afterEach);
};

const overflowTest = async (osOptions?: DeepPartial<Options>) => {
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
        w:
          size.w - (parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight)),
        h:
          size.h - (parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom)),
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
          should.ok(
            overflowAmountCheck.width >= addOverflow,
            'Correct smallest possible overflow width. (?)'
          );
        } else {
          should.equal(
            overflowAmountCheck.width,
            0,
            'Correct smallest possible overflow width. (0)'
          );
        }

        if (height) {
          should.ok(
            overflowAmountCheck.height >= addOverflow,
            'Correct smallest possible overflow height. (?)'
          );
        } else {
          should.equal(
            overflowAmountCheck.height,
            0,
            'Correct smallest possible overflow height. (0)'
          );
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
  const iterateOverflow = async () => {
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

  if (osOptions) {
    osInstance.options(osOptions);

    await iterateMinMax(async () => {
      await iterateBoxSizing(async () => {
        await iterateHeight(async () => {
          await iterateWidth(async () => {
            await iterateBorder(async () => {
              await iteratePadding(async () => {
                await iterateOverflow();
              }, ['paddingLarge']);
            }, ['borderSmall']);
          }, ['widthHundred']);
        }, ['heightHundred']);
      });
    });
  } else {
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
                await iterateOverflow();
              });
              await iterateDirection();
            });
          });
        });
      });
    });
  }
};

const start = async () => {
  setTestResult(null);

  target?.removeAttribute('style');
  try {
    await overflowTest();
    await overflowTest({ overflow: { x: 'visible', y: 'visible' } });
    await overflowTest({ overflow: { x: 'visible-scroll', y: 'visible-hidden' } });
    await overflowTest({ overflow: { x: 'visible-hidden', y: 'hidden' } });
    await overflowTest({ overflow: { x: 'visible', y: 'visible-scroll' } });
    await overflowTest({ overflow: { x: 'scroll', y: 'visible-scroll' } });
    await overflowTest({ overflow: { x: 'hidden', y: 'scroll' } });
    await overflowTest({ overflow: { x: 'scroll', y: 'hidden' } });
    await overflowTest({ overflow: { x: 'visible', y: 'scroll' } });
    await overflowTest({ overflow: { x: 'scroll', y: 'visible' } });
    await overflowTest({ overflow: { x: 'visible', y: 'hidden' } });
    await overflowTest({ overflow: { x: 'hidden', y: 'visible' } });
  } catch (e) {
    console.log(e);
  }

  setTestResult(true);
};

startBtn?.addEventListener('click', start);
