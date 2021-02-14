import 'overlayscrollbars.scss';
import './index.scss';
import should from 'should';
// import { generateClassChangeSelectCallback, iterateSelect, setTestResult, waitForOrFailTest, timeout } from '@/testing-browser';
import { generateClassChangeSelectCallback, iterateSelect } from '@/testing-browser/Select';
import { setTestResult, waitForOrFailTest } from '@/testing-browser/TestResult';
import { timeout } from '@/testing-browser/timeout';
import { hasDimensions, offsetSize, WH, style } from 'support';

import { createSizeObserver } from 'observers/sizeObserver';

let sizeIterations = 0;
let directionIterations = 0;
const contentBox = (elm: HTMLElement | null): WH<number> => {
  if (elm) {
    const computedStyle = window.getComputedStyle(elm);
    return {
      w: elm.clientWidth - (parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight)),
      h: elm.clientHeight - (parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom)),
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

const selectCallback = generateClassChangeSelectCallback(targetElm as HTMLElement);
const iterate = async (select: HTMLSelectElement | null, afterEach?: () => any) => {
  interface IterateSelect {
    currSizeIterations: number;
    currDirectionIterations: number;
    currOffsetSize: WH<number>;
    currContentSize: WH<number>;
    currDir: string;
  }

  await iterateSelect<IterateSelect>(select, {
    beforeEach() {
      const currSizeIterations = sizeIterations;
      const currDirectionIterations = directionIterations;
      const currOffsetSize = offsetSize(targetElm as HTMLElement);
      const currContentSize = contentBox(targetElm as HTMLElement);
      const currDir = style(targetElm as HTMLElement, 'direction');

      return {
        currSizeIterations,
        currDirectionIterations,
        currOffsetSize,
        currContentSize,
        currDir,
      };
    },
    async check({ currSizeIterations, currDirectionIterations, currOffsetSize, currContentSize, currDir }) {
      const newOffsetSize = offsetSize(targetElm as HTMLElement);
      const newContentSize = contentBox(targetElm as HTMLElement);
      const newDir = style(targetElm as HTMLElement, 'direction');
      const offsetSizeChanged = currOffsetSize.w !== newOffsetSize.w || currOffsetSize.h !== newOffsetSize.h;
      const contentSizeChanged = currContentSize.w !== newContentSize.w || currContentSize.h !== newContentSize.h;
      const dirChanged = currDir !== newDir;
      const dimensions = hasDimensions(targetElm as HTMLElement);
      const observerElm = targetElm?.firstElementChild as HTMLElement;

      // no overflow if not needed
      if (targetElm && newContentSize.w > 0) {
        should.ok(observerElm.getBoundingClientRect().right <= targetElm.getBoundingClientRect().right);
      }
      if (targetElm && newContentSize.h > 0) {
        should.ok(observerElm.getBoundingClientRect().bottom <= targetElm.getBoundingClientRect().bottom);
      }

      if (dimensions && (offsetSizeChanged || contentSizeChanged || dirChanged)) {
        await waitForOrFailTest(() => {
          if (offsetSizeChanged || contentSizeChanged) {
            should.equal(sizeIterations, currSizeIterations + 1);
          }
          if (dirChanged) {
            should.equal(directionIterations, currDirectionIterations + 1);
          }
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

const start = async () => {
  setTestResult(null);

  console.log('init direction changes:', directionIterations);
  console.log('init size changes:', sizeIterations);
  should.ok(directionIterations > 0);
  should.ok(sizeIterations > 0);

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

  setTestResult(true);
};

startBtn?.addEventListener('click', start);

createSizeObserver(
  targetElm as HTMLElement,
  (directionIsRTLCache?: any) => {
    if (directionIsRTLCache) {
      directionIterations += 1;
    } else {
      sizeIterations += 1;
    }
    requestAnimationFrame(() => {
      if (resizesSlot) {
        resizesSlot.textContent = (directionIterations + sizeIterations).toString();
      }
    });
  },
  { _direction: true, _appear: true }
);

export { start };
