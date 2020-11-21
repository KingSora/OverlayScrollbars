import 'overlayscrollbars.scss';
import './index.scss';
import should from 'should';
import { waitFor } from '@testing-library/dom';
import { generateSelectCallback, iterateSelect } from '@/testing-browser/Select';
import { setTestResult } from '@/testing-browser/TestResult';
import { hasDimensions, offsetSize, WH, style } from 'support';

import { createSizeObserver } from 'overlayscrollbars/observers/SizeObserver';

let sizeIterations = 0;
let directionIterations = 0;
const contentBox = (elm: HTMLElement | null) => {
  if (elm) {
    const computedStyle = window.getComputedStyle(elm);
    return {
      width: elm.clientWidth - (parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight)),
      height: elm.clientHeight - (parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom)),
    };
  }

  return { width: 0, height: 0 };
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

const selectCallback = generateSelectCallback(targetElm as HTMLElement);
const iterate = async (select: HTMLSelectElement | null, afterEach?: () => any) => {
  interface IterateSelect {
    currSizeIterations: number;
    currDirectionIterations: number;
    currOffsetSize: WH<number>;
    currDir: string;
  }

  await iterateSelect<IterateSelect>(select, {
    beforeEach() {
      const currSizeIterations = sizeIterations;
      const currDirectionIterations = directionIterations;
      const currOffsetSize = offsetSize(targetElm as HTMLElement);
      const currDir = style(targetElm as HTMLElement, 'direction');

      return {
        currSizeIterations,
        currDirectionIterations,
        currOffsetSize,
        currDir,
      };
    },
    async check({ currSizeIterations, currDirectionIterations, currOffsetSize, currDir }) {
      const newOffsetSize = offsetSize(targetElm as HTMLElement);
      const newDir = style(targetElm as HTMLElement, 'direction');
      const offsetSizeChanged = currOffsetSize.w !== newOffsetSize.w || currOffsetSize.h !== newOffsetSize.h;
      const dirChanged = currDir !== newDir;
      const dimensions = hasDimensions(targetElm as HTMLElement);
      const contentSize = contentBox(targetElm as HTMLElement);
      const observerElm = targetElm?.firstElementChild as HTMLElement;

      // no overflow if not needed
      if (targetElm && contentSize.width > 0) {
        should.ok(observerElm.getBoundingClientRect().right <= targetElm.getBoundingClientRect().right);
      }
      if (targetElm && contentSize.height > 0) {
        should.ok(observerElm.getBoundingClientRect().bottom <= targetElm.getBoundingClientRect().bottom);
      }

      if (dimensions && (offsetSizeChanged || dirChanged)) {
        await waitFor(
          async () => {
            if (offsetSizeChanged) {
              should.equal(sizeIterations, currSizeIterations + 1);
            }
            if (dirChanged) {
              should.equal(directionIterations, currDirectionIterations + 1);
            }
          },
          {
            onTimeout(error): Error {
              setTestResult(false);
              return error;
            },
          }
        );
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
  (direction?: boolean) => {
    if (direction) {
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
  true
);

export { start };
