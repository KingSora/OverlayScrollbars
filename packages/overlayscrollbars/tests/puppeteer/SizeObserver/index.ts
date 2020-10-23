import 'overlayscrollbars.scss';
import './index.scss';
import { createSizeObserver } from 'overlayscrollbars/observers/createSizeObserver';
import { from, removeClass, addClass, hasDimensions, isString, isNumber, offsetSize } from 'support';

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

const getSelectOptions = (selectElement: HTMLSelectElement) => {
  const arr = from(selectElement.options).map((option) => option.value);
  return arr;
};

const selectCallback = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const selectedOption = target.value;
  const selectOptions = getSelectOptions(target);

  removeClass(targetElm, selectOptions.join(' '));
  addClass(targetElm, selectedOption);
};

const selectOption = (select: HTMLSelectElement | null, selectedOption: string | number): boolean => {
  if (!select) {
    return false;
  }

  const options = getSelectOptions(select);
  const currValue = select.value;

  if (selectedOption === currValue) {
    return false;
  }

  if (isString(selectedOption) && options.includes(selectedOption)) {
    select.value = selectedOption;
  } else if (isNumber(selectedOption) && options.length < selectedOption && selectedOption > -1) {
    select.selectedIndex = selectedOption;
  }

  let event;
  if (typeof Event === 'function') {
    event = new Event('change');
  } else {
    event = document.createEvent('Event');
    event.initEvent('change', true, true);
  }
  select.dispatchEvent(event);

  return true;
};

const waitFor = (func: () => any) => {
  const start = Date.now();

  return new Promise((resolve, reject) => {
    const intervalId = setInterval(() => {
      const now = Date.now();

      if (func()) {
        clearInterval(intervalId);
        resolve();
      }
      if (now - start > 5000) {
        clearInterval(intervalId);
        window.setTestResult(false);
        reject();
      }
    }, 30);
  });
};

const iterateSelect = async (select: HTMLSelectElement | null, afterEach?: () => any) => {
  if (select) {
    const selectOptions = getSelectOptions(select);
    const selectOptionsReversed = getSelectOptions(select).reverse();
    const iterateOptions = [...selectOptions, ...selectOptionsReversed];
    for (let i = 0; i < iterateOptions.length; i++) {
      const option = iterateOptions[i];
      const currIterations = iterations;
      const currOffsetSize = offsetSize(targetElm as HTMLElement);
      if (selectOption(select, option)) {
        const newOffsetSize = offsetSize(targetElm as HTMLElement);
        const offsetSizeChanged = currOffsetSize.w !== newOffsetSize.w || currOffsetSize.h !== newOffsetSize.h;

        if (hasDimensions(targetElm as HTMLElement) && offsetSizeChanged) {
          // eslint-disable-next-line
          await waitFor(() => iterations === currIterations + 1);
        }

        if (typeof afterEach === 'function') {
          // eslint-disable-next-line
          await afterEach();
        }
      }
    }
  }
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

const iteratePadding = (window.iteratePadding = async (afterEach?: () => any) => {
  await iterateSelect(paddingSelect, afterEach);
});
const iterateBorder = (window.iterateBorder = async (afterEach?: () => any) => {
  await iterateSelect(borderSelect, afterEach);
});
const iterateHeight = (window.iterateHeight = async (afterEach?: () => any) => {
  await iterateSelect(heightSelect, afterEach);
});
const iterateWidth = (window.iterateWidth = async (afterEach?: () => any) => {
  await iterateSelect(widthSelect, afterEach);
});
const iterateBoxSizing = (window.iterateBoxSizing = async (afterEach?: () => any) => {
  await iterateSelect(boxSizingSelect, afterEach);
});
const iterateDisplay = (window.iterateDisplay = async (afterEach?: () => any) => {
  await iterateSelect(displaySelect, afterEach);
});

const start = (window.iterate = async () => {
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
});

startBtn?.addEventListener('click', start);

targetElm?.appendChild(observerElm);
