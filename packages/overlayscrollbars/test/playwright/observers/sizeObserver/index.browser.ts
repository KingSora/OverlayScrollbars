import '~/index.scss';
import './index.scss';
import './handleEnvironment';
import should from 'should';
import {
  generateClassChangeSelectCallback,
  iterateSelect,
  selectOption,
  timeout,
  setTestResult,
  waitForOrFailTest,
} from '@~local/browser-testing';
import { getStyles, hasDimensions, getOffsetSize, hasClass } from '~/support';
import { SizeObserverPlugin } from '~/plugins';
import { createSizeObserver } from '~/observers';
import { OverlayScrollbars } from '~/overlayscrollbars';
import type { WH } from '~/support';

const isResizeObserverPolyfill = hasClass(document.body, 'roPolyfill');
const isResizeObserverWithoutBox = hasClass(document.body, 'roNoBox');

if (isResizeObserverPolyfill) {
  OverlayScrollbars.plugin(SizeObserverPlugin);
}

let updates = 0;
let sizeIterations = 0;
let appearIterations = 0;

const contentBox = (elm: HTMLElement | null): WH<number> => {
  if (elm) {
    const computedStyle = window.getComputedStyle(elm);
    return {
      w:
        elm.clientWidth -
        (parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight)),
      h:
        elm.clientHeight -
        (parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom)),
    };
  }

  return { w: 0, h: 0 };
};

const targetElm = document.querySelector('#target');
const heightSelect: HTMLSelectElement | null = document.querySelector('#height');
const widthSelect: HTMLSelectElement | null = document.querySelector('#width');
const paddingSelect: HTMLSelectElement | null = document.querySelector('#padding');
const borderSelect: HTMLSelectElement | null = document.querySelector('#border');
const boxSizingSelect: HTMLSelectElement | null = document.querySelector('#boxSizing');
const displaySelect: HTMLSelectElement | null = document.querySelector('#display');
const startBtn: HTMLButtonElement | null = document.querySelector('#start');
const resizesSlot: HTMLButtonElement | null = document.querySelector('#resizes');
const preInitChildren = targetElm?.children.length;

const constructSizeObserver = createSizeObserver(
  targetElm as HTMLElement,
  ({ _sizeChanged, _appear }) => {
    if (_sizeChanged) {
      sizeIterations += 1;
    }

    if (_appear) {
      appearIterations += 1;
    }

    updates += 1;

    requestAnimationFrame(() => {
      if (resizesSlot) {
        resizesSlot.textContent = `${updates}, (size=${sizeIterations}, appear=${appearIterations})`;
      }
    });
  },
  { _appear: true }
);
const destroySizeObserver = constructSizeObserver();

const selectCallback = generateClassChangeSelectCallback(targetElm as HTMLElement);
const iterate = async (select: HTMLSelectElement | null, afterEach?: () => any) => {
  interface IterateSelect {
    currSizeIterations: number;
    currAppearIterations: number;
    currOffsetSize: WH<number>;
    currContentSize: WH<number>;
    currBoxSizing: string;
    currHasDimensions: boolean;
  }

  await iterateSelect<IterateSelect>(select, {
    beforeEach() {
      const currSizeIterations = sizeIterations;
      const currAppearIterations = appearIterations;
      const currOffsetSize = getOffsetSize(targetElm as HTMLElement);
      const currContentSize = contentBox(targetElm as HTMLElement);
      const currBoxSizing = getStyles(targetElm as HTMLElement, 'boxSizing');
      const currHasDimensions = hasDimensions(targetElm as HTMLElement);

      return {
        currSizeIterations,
        currAppearIterations,
        currOffsetSize,
        currContentSize,
        currBoxSizing,
        currHasDimensions,
      };
    },
    async check({
      currSizeIterations,
      currAppearIterations,
      currOffsetSize,
      currContentSize,
      currBoxSizing,
      currHasDimensions,
    }) {
      const newOffsetSize = getOffsetSize(targetElm as HTMLElement);
      const newContentSize = contentBox(targetElm as HTMLElement);
      const newBoxSizing = getStyles(targetElm as HTMLElement, 'boxSizing');
      const offsetSizeChanged =
        currOffsetSize.w !== newOffsetSize.w || currOffsetSize.h !== newOffsetSize.h;
      const contentSizeChanged =
        currContentSize.w !== newContentSize.w || currContentSize.h !== newContentSize.h;
      const boxSizingChanged = currBoxSizing !== newBoxSizing;
      const dimensions = hasDimensions(targetElm as HTMLElement);
      const observerElm = (
        isResizeObserverPolyfill || isResizeObserverWithoutBox
          ? targetElm?.firstElementChild
          : targetElm
      ) as HTMLElement;

      const canDetectBoxChangeWithoutPaddingOrBorder =
        isResizeObserverPolyfill || isResizeObserverWithoutBox;

      // no overflow if not needed

      if (targetElm && newContentSize.w > 0) {
        should.ok(
          observerElm.getBoundingClientRect().right <= targetElm.getBoundingClientRect().right,
          'Generated observer element inst overflowing target element. (width)'
        );
      }
      if (targetElm && newContentSize.h > 0) {
        should.ok(
          observerElm.getBoundingClientRect().bottom <= targetElm.getBoundingClientRect().bottom,
          'Generated observer element inst overflowing target element. (height)'
        );
      }

      if (
        boxSizingChanged &&
        (canDetectBoxChangeWithoutPaddingOrBorder
          ? true
          : paddingSelect?.value !== 'padding0' && borderSelect?.value !== 'border0')
      ) {
        await waitForOrFailTest(() => {
          should.equal(
            sizeIterations,
            currSizeIterations + 1,
            'BoxSizing change was detected correctly.'
          );
        });
      }

      if (currHasDimensions && dimensions && (offsetSizeChanged || contentSizeChanged)) {
        await waitForOrFailTest(() => {
          should.equal(
            sizeIterations,
            currSizeIterations + 1,
            'Size change was detected correctly.'
          );
        });
      }

      if (!currHasDimensions && dimensions) {
        await waitForOrFailTest(() => {
          should.equal(
            appearIterations,
            currAppearIterations + 1,
            'Appear change was detected correctly.'
          );
        });
      }

      if (!dimensions) {
        await timeout(100);
      }
    },
    afterEach,
  });
};

heightSelect?.addEventListener('change', selectCallback);
widthSelect?.addEventListener('change', selectCallback);
paddingSelect?.addEventListener('change', selectCallback);
borderSelect?.addEventListener('change', selectCallback);
boxSizingSelect?.addEventListener('change', selectCallback);
displaySelect?.addEventListener('change', selectCallback);

selectCallback(heightSelect);
selectCallback(widthSelect);
selectCallback(paddingSelect);
selectCallback(borderSelect);
selectCallback(boxSizingSelect);
selectCallback(displaySelect);

const iteratePadding = async (afterEach?: () => any) => {
  await iterate(paddingSelect, afterEach);
};
const iterateBorder = async (afterEach?: () => any) => {
  await iterate(borderSelect, afterEach);
};
const iterateHeight = async (afterEach?: () => any) => {
  await iterate(heightSelect, afterEach);
};
const iterateWidth = async (afterEach?: () => any) => {
  await iterate(widthSelect, afterEach);
};
const iterateBoxSizing = async (afterEach?: () => any) => {
  await iterate(boxSizingSelect, afterEach);
};
const iterateDisplay = async (afterEach?: () => any) => {
  await iterate(displaySelect, afterEach);
};
const cleanBoxSizingChange = async () => {
  selectOption(heightSelect as HTMLSelectElement, 'heightAuto');
  selectOption(widthSelect as HTMLSelectElement, 'widthAuto');
  selectOption(paddingSelect as HTMLSelectElement, 'padding0');
  selectOption(borderSelect as HTMLSelectElement, 'border0');

  await timeout(250);

  await iterateBoxSizing();

  selectOption(heightSelect as HTMLSelectElement, 'height200');
  selectOption(widthSelect as HTMLSelectElement, 'width200');

  await timeout(250);

  await iterateBoxSizing();

  selectOption(heightSelect as HTMLSelectElement, 'heightHundred');
  selectOption(widthSelect as HTMLSelectElement, 'widthHundred');

  await timeout(250);

  await iterateBoxSizing();
};
const start = async () => {
  setTestResult(null);

  console.log('init size changes:', sizeIterations);
  should.ok(sizeIterations > 0, 'Initial size observations are fired.');
  should.ok(appearIterations > 0, 'Initial appear observations are fired.');

  if (isResizeObserverPolyfill || isResizeObserverWithoutBox) {
    should.ok(!!targetElm?.firstElementChild, `Polyfills use polyfill DOM.`);
  } else {
    should.ok(
      !targetElm?.firstElementChild,
      `Full support ResizeObserver doesn't use any additional DOM.`
    );
  }

  targetElm?.removeAttribute('style');
  await iterateDisplay();
  await iterateBoxSizing(async () => {
    await iterateHeight(async () => {
      await iterateWidth(async () => {
        await iterateBorder(async () => {
          await iteratePadding();
        });
      });
    });
  });
  await cleanBoxSizingChange();

  destroySizeObserver();
  should.equal(
    targetElm?.children.length,
    preInitChildren,
    'Destruction removes all generated elements.'
  );
  setTestResult(true);
};

startBtn?.addEventListener('click', start);

export { start };
