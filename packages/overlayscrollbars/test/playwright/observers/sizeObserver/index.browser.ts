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
import { hasDimensions, offsetSize, style } from '~/support';
import { SizeObserverPlugin } from '~/plugins';
import { createSizeObserver } from '~/observers';
import { OverlayScrollbars } from '~/overlayscrollbars';
import type { WH } from '~/support';

if (!window.ResizeObserver) {
  OverlayScrollbars.plugin(SizeObserverPlugin);
}

let sizeIterations = 0;
let directionIterations = 0;
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
const directionSelect: HTMLSelectElement | null = document.querySelector('#direction');
const startBtn: HTMLButtonElement | null = document.querySelector('#start');
const resizesSlot: HTMLButtonElement | null = document.querySelector('#resizes');
const preInitChildren = targetElm?.children.length;

const constructSizeObserver = createSizeObserver(
  targetElm as HTMLElement,
  ({ _directionIsRTLCache, _sizeChanged }) => {
    if (_sizeChanged) {
      sizeIterations += 1;
    }

    if (_directionIsRTLCache) {
      directionIterations += 1;
    }

    requestAnimationFrame(() => {
      if (resizesSlot) {
        resizesSlot.textContent = (directionIterations + sizeIterations).toString();
      }
    });
  },
  { _direction: true, _appear: true, _ignoreWindowResize: true }
);
const destroySizeObserver = constructSizeObserver();

const selectCallback = generateClassChangeSelectCallback(targetElm as HTMLElement);
const iterate = async (select: HTMLSelectElement | null, afterEach?: () => any) => {
  interface IterateSelect {
    currSizeIterations: number;
    currDirectionIterations: number;
    currOffsetSize: WH<number>;
    currContentSize: WH<number>;
    currDir: string;
    currBoxSizing: string;
  }

  await iterateSelect<IterateSelect>(select, {
    beforeEach() {
      const currSizeIterations = sizeIterations;
      const currDirectionIterations = directionIterations;
      const currOffsetSize = offsetSize(targetElm as HTMLElement);
      const currContentSize = contentBox(targetElm as HTMLElement);
      const currDir = style(targetElm as HTMLElement, 'direction');
      const currBoxSizing = style(targetElm as HTMLElement, 'boxSizing');

      return {
        currSizeIterations,
        currDirectionIterations,
        currOffsetSize,
        currContentSize,
        currDir,
        currBoxSizing,
      };
    },
    async check({
      currSizeIterations,
      currDirectionIterations,
      currOffsetSize,
      currContentSize,
      currDir,
      currBoxSizing,
    }) {
      const newOffsetSize = offsetSize(targetElm as HTMLElement);
      const newContentSize = contentBox(targetElm as HTMLElement);
      const newDir = style(targetElm as HTMLElement, 'direction');
      const newBoxSizing = style(targetElm as HTMLElement, 'boxSizing');
      const offsetSizeChanged =
        currOffsetSize.w !== newOffsetSize.w || currOffsetSize.h !== newOffsetSize.h;
      const contentSizeChanged =
        currContentSize.w !== newContentSize.w || currContentSize.h !== newContentSize.h;
      const dirChanged = currDir !== newDir;
      const boxSizingChanged = currBoxSizing !== newBoxSizing;
      const dimensions = hasDimensions(targetElm as HTMLElement);
      const observerElm = targetElm?.firstElementChild as HTMLElement;

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

      if (dirChanged) {
        await waitForOrFailTest(() => {
          // const expectedCacheValue = newDir === 'rtl';
          should.equal(
            directionIterations,
            currDirectionIterations + 1,
            'Direction change was detected correctly.'
          );
          /*
          should.equal(
            sizeObserver._getCurrentCacheValues()._directionIsRTL[0],
            expectedCacheValue,
            'Direction cache value is correct.'
          );
          */
        });
      }

      if (boxSizingChanged) {
        await waitForOrFailTest(() => {
          should.equal(
            sizeIterations,
            currSizeIterations + 1,
            'BoxSizing change was detected correctly.'
          );
        });
      }

      if (dimensions && (offsetSizeChanged || contentSizeChanged)) {
        await waitForOrFailTest(() => {
          should.equal(
            sizeIterations,
            currSizeIterations + 1,
            'Size change was detected correctly.'
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
directionSelect?.addEventListener('change', selectCallback);

selectCallback(heightSelect);
selectCallback(widthSelect);
selectCallback(paddingSelect);
selectCallback(borderSelect);
selectCallback(boxSizingSelect);
selectCallback(displaySelect);
selectCallback(directionSelect);

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
const iterateDirection = async (afterEach?: () => any) => {
  await iterate(directionSelect, afterEach);
};
const cleanBoxSizingChange = async () => {
  selectOption(heightSelect as HTMLSelectElement, 'heightAuto');
  selectOption(widthSelect as HTMLSelectElement, 'widthAuto');
  selectOption(paddingSelect as HTMLSelectElement, 'padding0');
  selectOption(borderSelect as HTMLSelectElement, 'border0');

  await timeout(250);

  await iterateDirection(async () => {
    await iterateBoxSizing();
  });

  selectOption(heightSelect as HTMLSelectElement, 'height200');
  selectOption(widthSelect as HTMLSelectElement, 'width200');

  await timeout(250);

  await iterateDirection(async () => {
    await iterateBoxSizing();
  });

  selectOption(heightSelect as HTMLSelectElement, 'heightHundred');
  selectOption(widthSelect as HTMLSelectElement, 'widthHundred');

  await timeout(250);

  await iterateDirection(async () => {
    await iterateBoxSizing();
  });
};
const start = async () => {
  setTestResult(null);

  console.log('init direction changes:', directionIterations);
  console.log('init size changes:', sizeIterations);
  should.ok(directionIterations > 0, 'Initial direction observations are fired.');
  should.ok(sizeIterations > 0, 'Initial size observations are fired.');

  targetElm?.removeAttribute('style');
  await iterateDisplay();
  await iterateDirection();
  await iterateBoxSizing(async () => {
    await iterateHeight(async () => {
      await iterateWidth(async () => {
        await iterateBorder(async () => {
          await iterateDirection();
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
