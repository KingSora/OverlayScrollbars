import 'overlayscrollbars.scss';
import './index.scss';
import should from 'should';
import { waitFor } from '@testing-library/dom';
import { generateSelectCallback, iterateSelect } from '@/testing-browser/Select';
import { hasDimensions, offsetSize, WH } from 'support';

import { createSizeObserver } from 'overlayscrollbars/observers/createSizeObserver';

const targetElm = document.querySelector('#target');
const heightSelect: HTMLSelectElement | null = document.querySelector('#height');
const widthSelect: HTMLSelectElement | null = document.querySelector('#width');
const paddingSelect: HTMLSelectElement | null = document.querySelector('#padding');
const borderSelect: HTMLSelectElement | null = document.querySelector('#border');
const boxSizingSelect: HTMLSelectElement | null = document.querySelector('#boxSizing');
const displaySelect: HTMLSelectElement | null = document.querySelector('#display');
const startBtn: HTMLButtonElement | null = document.querySelector('#start');
const resizesSlot: HTMLButtonElement | null = document.querySelector('#resizes');

let iterations = 0;
const observerElm = createSizeObserver(() => {
  iterations += 1;
  requestAnimationFrame(() => {
    if (resizesSlot) {
      resizesSlot.textContent = iterations.toString();
    }
  });
});

const selectCallback = generateSelectCallback(targetElm as HTMLElement);

const iterate = async (select: HTMLSelectElement | null, afterEach?: () => any) => {
  await iterateSelect<{ currIterations: number; currOffsetSize: WH<number> }>(select, {
    beforeEach() {
      const currIterations = iterations;
      const currOffsetSize = offsetSize(targetElm as HTMLElement);

      return {
        currIterations,
        currOffsetSize,
      };
    },
    async check({ currIterations, currOffsetSize }) {
      const newOffsetSize = offsetSize(targetElm as HTMLElement);
      const offsetSizeChanged = currOffsetSize.w !== newOffsetSize.w || currOffsetSize.h !== newOffsetSize.h;

      if (hasDimensions(targetElm as HTMLElement) && offsetSizeChanged) {
        // eslint-disable-next-line
        await waitFor(() => should.equal(iterations, currIterations + 1), {
          onTimeout(error): Error {
            window.setTestResult(false);
            return error;
          },
        });
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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
selectCallback({ target: heightSelect });
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
selectCallback({ target: widthSelect });
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
selectCallback({ target: paddingSelect });
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
selectCallback({ target: borderSelect });
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
selectCallback({ target: boxSizingSelect });
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
selectCallback({ target: displaySelect });

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

const start = async () => {
  window.setTestResult(null);
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
  window.setTestResult(true);
};

startBtn?.addEventListener('click', start);

targetElm?.appendChild(observerElm);

export { start };
