import '~/index.scss';
import './index.scss';
import './handleEnvironment';
import should from 'should';
import {
  generateClassChangeSelectCallback,
  iterateSelect,
  resize,
  timeout,
  setTestResult,
  waitForOrFailTest,
} from '@~local/browser-testing';
import { OverlayScrollbars } from '~/overlayscrollbars';
import { dataAttributeViewport } from '~/classnames';
import {
  assignDeep,
  getClientSize,
  from,
  getBoundingClientRect,
  parent,
  addClass,
  removeAttrs,
  contents,
  appendChildren,
  createDOM,
  hasClass,
  createDiv,
  removeElements,
  removeClass,
  setStyles,
  getStyles,
} from '~/support';
import { ScrollbarsHidingPlugin, SizeObserverPlugin, ClickScrollPlugin } from '~/plugins';
import type { WH } from '~/support';
import type { Options } from '~/options';
import type { DeepPartial } from '~/typings';

console.log(OverlayScrollbars.env());

OverlayScrollbars.plugin(ClickScrollPlugin);

if (!window.ResizeObserver) {
  OverlayScrollbars.plugin(SizeObserverPlugin);
}
if (!OverlayScrollbars.env().scrollbarsHiding) {
  OverlayScrollbars.plugin(ScrollbarsHidingPlugin);
}

// @ts-ignore
window.OverlayScrollbars = OverlayScrollbars;

OverlayScrollbars.env().setDefaultInitialization({
  cancel: { nativeScrollbarsOverlaid: false },
});
OverlayScrollbars.env().setDefaultOptions({
  scrollbars: {
    clickScroll: true,
  },
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
  textwrapElm: {
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

const getDevicePixelRatio = () => parseFloat(window.devicePixelRatio.toFixed(3));

const isFractionalPixelRatio = () => getDevicePixelRatio() % 1 !== 0;

const isVisibleOverflow = (val: string) => val.indexOf('visible') === 0;

const expectedOverflowVisibleBehavior = (
  overflowOptionAxis: string,
  hasOverflowOtherAxis: boolean
) => {
  const overflowVisibleBehavior = overflowOptionAxis.replace('visible', '').slice(1);
  return hasOverflowOtherAxis ? overflowVisibleBehavior || 'hidden' : 'visible';
};

const initialPaddingAbsolute = hasClass(document.body, 'pa');
const isFastTestRun = hasClass(document.body, 'fast');
const useContentElement = false;
const fixedDigits = 3;
const fixedDigitsOffset = 3;

const startBtn: HTMLButtonElement | null = document.querySelector('#start');
const target: HTMLElement | null = document.querySelector('#target');
const targetMetricsElement: HTMLElement | null = document.querySelector('#targetMetrics');
const comparison: HTMLElement | null = document.querySelector('#comparison');
const comparisonMetricsElement: HTMLElement | null = document.querySelector('#comparisonMetrics');
const targetResize: HTMLElement | null = document.querySelector('#target .resize');
const comparisonResize: HTMLElement | null = document.querySelector('#comparison .resize');
const targetPercent: HTMLElement | null = document.querySelector('#target .percent');
const comparisonPercent: HTMLElement | null = document.querySelector('#comparison .percent');
const targetTextwrap: HTMLElement | null = document.querySelector('#target .textwrap');
const comparisonTextwrap: HTMLElement | null = document.querySelector('#comparison .textwrap');
const targetEnd: HTMLElement | null = document.querySelector('#target .end');
const comparisonEnd: HTMLElement | null = document.querySelector('#comparison .end');
const targetOptionsSlot: HTMLElement | null = document.querySelector('#options');
const targetUpdatesSlot: HTMLElement | null = document.querySelector('#updates');
const comparisonContentElm: HTMLElement = document.createElement('div');
const envElms = document.querySelectorAll<HTMLElement>('.env');
const getComparisonViewport = () =>
  (comparison?.querySelector(`[${dataAttributeViewport}]`) || comparison) as HTMLElement;

const initObj = hasClass(document.body, 'vpt')
  ? {
      target: target!,
      elements: {
        viewport: OverlayScrollbars.env().scrollbarsHiding && target!,
        content: useContentElement,
      },
    }
  : {
      target: target!,
      elements: {
        content: useContentElement,
      },
    };

let updateCount = 0;

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

// initialize resize handles always after OverlayScrollbars was initialized to preserve correct parent elements
const targetResizeInstance = resize(target!);
targetResizeInstance.addResizeListener((width, height) => {
  setStyles(comparison, { width, height });
});
const targetResizeResizeInstance = resize(targetResize!);
targetResizeResizeInstance.addResizeListener((width, height) => {
  setStyles(comparisonResize, { width, height });
});

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

// @ts-ignore
const osInstance =
  // @ts-ignore
  (window.os = OverlayScrollbars(
    initObj,
    {
      paddingAbsolute: initialPaddingAbsolute,
    },
    {
      initialized(instance) {
        instance.elements().target.append(targetResizeInstance.resizeBtn);
      },
      updated(instance) {
        updateCount++;
        const { paddingAbsolute, overflow } = instance.options();
        const comparisonViewport = getComparisonViewport();

        if (paddingAbsolute) {
          if (comparisonViewport === comparison) {
            addClass(document.body, 'pa');
            const absoluteWrapper = createDiv();
            absoluteWrapper.setAttribute(dataAttributeViewport, '');

            appendChildren(absoluteWrapper, contents(comparison));

            appendChildren(comparison, absoluteWrapper);
          }
        } else if (comparisonViewport !== comparison) {
          removeClass(document.body, 'pa');
          appendChildren(comparison, contents(comparisonViewport));
          removeElements(comparisonViewport);
        }

        requestAnimationFrame(() => {
          if (targetUpdatesSlot) {
            targetUpdatesSlot.textContent = `${updateCount}`;
          }
          if (targetOptionsSlot) {
            targetOptionsSlot.textContent = JSON.stringify(
              assignDeep({}, overflow, {
                paddingAbsolute,
                viewportIsTarget: instance.elements().viewport === target,
              }),
              null,
              2
            );
          }
        });
      },
    }
  ));

const getMetrics = (elm: HTMLElement): Metrics => {
  const elmIsTarget = elm === target;
  const comparisonViewport = getComparisonViewport();
  const comparisonEnvBCR = getBoundingClientRect(parent(elm!) as HTMLElement);
  const comparisonBCR = getBoundingClientRect(elm!);
  const comparisonPercentBCR = getBoundingClientRect(elm!.querySelector('.percent')!);
  const comparisonTextwrapBCR = getBoundingClientRect(elm!.querySelector('.textwrap')!);
  const comparisonEndBCR = getBoundingClientRect(elm!.querySelector('.end')!);
  const scrollMeasure = () => {
    const condition = (raw: number) => (isFractionalPixelRatio() ? raw > 1 : raw > 0);
    const amount = {
      width: Math.max(0, comparisonViewport!.scrollWidth - comparisonViewport!.clientWidth),
      height: Math.max(0, comparisonViewport!.scrollHeight - comparisonViewport!.clientHeight),
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
    textwrapElm: {
      width: parseFloat(comparisonTextwrapBCR.width.toFixed(fixedDigits)),
      height: parseFloat(comparisonTextwrapBCR.height.toFixed(fixedDigits)),
    },
    endElm: {
      width: parseFloat(comparisonEndBCR.width.toFixed(fixedDigits)),
      height: parseFloat(comparisonEndBCR.height.toFixed(fixedDigits)),
    },
  };

  if (elmIsTarget) {
    targetMetricsElement!.textContent = JSON.stringify(results, null, 2);
  } else {
    comparisonMetricsElement!.textContent = JSON.stringify(results, null, 2);
  }

  return results;
};

const metricsDimensionsEqual = (a: Metrics, b: Metrics) => {
  const aDimensions = assignDeep({}, a, { offset: null });
  const bDimensions = assignDeep({}, b, { offset: null });

  return JSON.stringify(aDimensions) === JSON.stringify(bDimensions);
};

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
    const hostOverflowStyle = getStyles(target, 'overflow');
    const paddingOverflowStyle = getStyles(targetPadding, 'overflow');
    const viewportOverflowXStyle = getStyles(targetViewport!, 'overflowX');
    const viewportOverflowYStyle = getStyles(targetViewport!, 'overflowY');

    // ==== check scroll values:

    if (isFractionalPixelRatio() && viewportIsTarget) {
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

    // textwrap element dimensions
    should.equal(
      targetMetrics.textwrapElm.width,
      comparisonMetrics.textwrapElm.width,
      'TextWrap Elements width equality.'
    );
    should.equal(
      targetMetrics.textwrapElm.height,
      comparisonMetrics.textwrapElm.height,
      'TextWrap Elements height equality.'
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

    // ==== scroll coordinates:

    const { scrollCoordinates, overflowAmount } = osInstance.state();
    const { start, end } = scrollCoordinates;

    should.equal(
      Math.abs(start.x + end.x),
      overflowAmount.x,
      'OverflowAmountX and ScrollCoordinatesX matches.'
    );
    should.equal(
      Math.abs(start.y + end.y),
      overflowAmount.y,
      'OverflowAmountY and ScrollCoordinatesY matches.'
    );

    await timeout(1);
  });
};

const iterate = async (
  select: HTMLSelectElement | null,
  afterEach?: () => any,
  skippedItems?: string[] | false | null
) => {
  await iterateSelect<CheckComparisonObj>(select, {
    filter: skippedItems ? (item: string) => !skippedItems?.includes(item) : undefined,
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
const iterateHeight = async (afterEach?: () => any, skippedItems?: string[] | false | null) => {
  await iterate(containerHeightSelect, afterEach, skippedItems);
};
const iterateWidth = async (afterEach?: () => any, skippedItems?: string[] | false | null) => {
  await iterate(containerWidthSelect, afterEach, skippedItems);
};
/*
const iterateFloat = async (afterEach?: () => any) => {
  await iterate(containerFloatSelect, afterEach);
};
*/
const iteratePadding = async (afterEach?: () => any, skippedItems?: string[] | false | null) => {
  await iterate(containerPaddingSelect, afterEach, skippedItems);
};
const iterateBorder = async (afterEach?: () => any, skippedItems?: string[] | false | null) => {
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
  const contentBox = (elm: HTMLElement | null): WH<number> => {
    if (elm) {
      const computedStyle = window.getComputedStyle(elm);
      const size = getClientSize(elm);
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

    setStyles(targetResize, styleObj);
    setStyles(comparisonResize, styleObj);

    await checkMetrics(before);
  };
  const setSmallestOverflow = async (width?: boolean, height?: boolean) => {
    const { maxWidth, maxHeight } = getStyles(comparison, ['maxWidth', 'maxHeight']);

    if (maxWidth !== 'none' && maxHeight !== 'none') {
      const addOverflow = 1;
      const before: CheckComparisonObj = {
        updCount: updateCount,
        metrics: getMetrics(comparison!),
      };
      const { paddingRight, paddingBottom } = getStyles(comparison, [
        'paddingRight',
        'paddingBottom',
      ]);
      const comparisonViewport = getComparisonViewport();
      const comparisonContentBox = contentBox(comparisonViewport);
      const widthOverflow = width ? comparisonContentBox.w + addOverflow : 0;
      const heightOverflow = height ? comparisonContentBox.h + addOverflow : 0;
      const styleObj = { width: widthOverflow, height: heightOverflow };

      setStyles(comparisonResize, styleObj);

      const overflowAmount = {
        width: comparisonViewport!.scrollWidth - comparisonViewport!.clientWidth,
        height: comparisonViewport!.scrollHeight - comparisonViewport!.clientHeight,
      };

      if (width && overflowAmount.width <= 0 && paddingRight) {
        styleObj.width += parseFloat(paddingRight);
      }
      if (height && overflowAmount.height <= 0 && paddingBottom) {
        styleObj.height += parseFloat(paddingBottom);
      }

      setStyles(comparisonResize, styleObj);

      if (width) {
        while (
          comparisonViewport!.scrollWidth - comparisonViewport!.clientWidth <=
          addOverflow - 1
        ) {
          styleObj.width += addOverflow;
          setStyles(comparisonResize, styleObj);
        }
      }

      if (height) {
        while (
          comparisonViewport!.scrollHeight - comparisonViewport!.clientHeight <=
          addOverflow - 1
        ) {
          styleObj.height += addOverflow;
          setStyles(comparisonResize, styleObj);
        }
      }

      const overflowAmountCheck = {
        width: comparisonViewport!.scrollWidth - comparisonViewport!.clientWidth,
        height: comparisonViewport!.scrollHeight - comparisonViewport!.clientHeight,
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

      setStyles(targetResize, styleObj);

      await checkMetrics(before);
    }
  };
  const setLargeOverflow = async (width?: boolean, height?: boolean) => {
    const before: CheckComparisonObj = {
      updCount: updateCount,
      metrics: getMetrics(comparison!),
    };
    const comparisonViewport = getComparisonViewport();
    const comparisonContentBox = contentBox(comparisonViewport);
    const widthOverflow = width ? comparisonContentBox.w + 1000 : 0;
    const heightOverflow = height ? comparisonContentBox.h + 1000 : 0;
    const styleObj = { width: widthOverflow, height: heightOverflow };
    setStyles(targetResize, styleObj);
    setStyles(comparisonResize, styleObj);

    await checkMetrics(before);
  };
  const iterateOverflow = async () => {
    setStyles(targetResize, { boxSizing: 'border-box' });
    setStyles(comparisonResize, { boxSizing: 'border-box' });
    setStyles(targetPercent, { display: 'none' });
    setStyles(comparisonPercent, { display: 'none' });
    setStyles(targetTextwrap, { display: 'none' });
    setStyles(comparisonTextwrap, { display: 'none' });
    setStyles(targetEnd, { display: 'none' });
    setStyles(comparisonEnd, { display: 'none' });

    await setNoOverflow();
    await setSmallestOverflow(true, false);
    await setSmallestOverflow(false, true);
    await setSmallestOverflow(true, true);

    await setNoOverflow();
    await setLargeOverflow(true, false);
    await setLargeOverflow(false, true);
    await setLargeOverflow(true, true);

    removeAttrs(targetResize, 'style');
    removeAttrs(comparisonResize, 'style');
    removeAttrs(targetPercent, 'style');
    removeAttrs(comparisonPercent, 'style');
    removeAttrs(targetTextwrap, 'style');
    removeAttrs(comparisonTextwrap, 'style');
    removeAttrs(targetEnd, 'style');
    removeAttrs(comparisonEnd, 'style');
  };

  const withSkippedItems = osOptions || isFastTestRun;

  if (osOptions) {
    osInstance.options(osOptions);
  }

  await iterateMinMax(async () => {
    const minMaxValue = containerMinMaxSelect?.value;

    if (minMaxValue === 'minMaxNone') {
      addClass(targetTextwrap, 'forceHidden');
      addClass(comparisonTextwrap, 'forceHidden');
    } else {
      removeClass(targetTextwrap, 'forceHidden');
      removeClass(comparisonTextwrap, 'forceHidden');
    }

    await iterateBoxSizing(async () => {
      await iterateHeight(
        async () => {
          await iterateWidth(
            async () => {
              await iterateBorder(
                async () => {
                  // assume this part isn't critical
                  // await iterateFloat(async () => {
                  //   await iterateMargin();
                  // });
                  await iteratePadding(
                    async () => {
                      await iterateOverflow();
                    },
                    withSkippedItems && ['paddingLarge']
                  );

                  // assume this part isn't critical for special options
                  if (!osOptions) {
                    await iterateDirection();
                  }
                },
                withSkippedItems && ['borderSmall']
              );
            },
            withSkippedItems && ['widthHundred']
          );
        },
        withSkippedItems && ['heightHundred']
      );
    });
  });
};

const start = async () => {
  setTestResult(null);

  target?.removeAttribute('style');

  try {
    await overflowTest();

    osInstance.options({ paddingAbsolute: !initialPaddingAbsolute });

    await overflowTest();

    osInstance.options({ paddingAbsolute: initialPaddingAbsolute });

    await overflowTest({ overflow: { x: 'visible', y: 'visible' } });
    await overflowTest({ overflow: { x: 'hidden', y: 'scroll' } });
    await overflowTest({ overflow: { x: 'visible-hidden', y: 'scroll' } });
    await overflowTest({ overflow: { x: 'scroll', y: 'visible-scroll' } });

    if (!isFastTestRun) {
      await overflowTest({ overflow: { x: 'visible-scroll', y: 'visible-hidden' } });
      await overflowTest({ overflow: { x: 'hidden', y: 'visible' } });
      await overflowTest({ overflow: { x: 'visible', y: 'scroll' } });
      await overflowTest({ overflow: { x: 'visible-hidden', y: 'hidden' } });
      await overflowTest({ overflow: { x: 'visible', y: 'visible-scroll' } });
      await overflowTest({ overflow: { x: 'scroll', y: 'visible-scroll' } });
      await overflowTest({ overflow: { x: 'scroll', y: 'hidden' } });
      await overflowTest({ overflow: { x: 'scroll', y: 'visible' } });
      await overflowTest({ overflow: { x: 'visible', y: 'hidden' } });
    }

    setTestResult(true);
  } catch (e: any) {
    const { scrollbarsSize, scrollbarsOverlaid, scrollbarsHiding } = OverlayScrollbars.env();
    console.error(
      e.message,
      {
        expected: e.expected,
        actual: e.actual,
        operator: e.operator,
      },
      {
        updateCount,
        env: {
          scrollbarsSize,
          scrollbarsOverlaid,
          scrollbarsHiding,
        },
        opts: targetOptionsSlot!.textContent,
        flags: document.body.getAttribute('class'),
        devicePixelRatio: getDevicePixelRatio(),
        devicePixelRatioRaw: window.devicePixelRatio,
      }
    );
  }
};

startBtn!.addEventListener('click', start);
