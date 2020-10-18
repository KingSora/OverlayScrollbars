import 'overlayscrollbars.scss';
import './index.scss';
import { createSizeObserver } from 'overlayscrollbars/observers/createSizeObserver';
import { from, removeClass, addClass } from 'support';

const targetElm = document.querySelector('#target');
const heightSelect: HTMLSelectElement | null = document.querySelector('#height');
const widthSelect: HTMLSelectElement | null = document.querySelector('#width');
const paddingSelect: HTMLSelectElement | null = document.querySelector('#padding');
const startBtn: HTMLButtonElement | null = document.querySelector('#start');
const resizesSlot: HTMLButtonElement | null = document.querySelector('#resizes');

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

heightSelect?.addEventListener('change', selectCallback);
widthSelect?.addEventListener('change', selectCallback);
paddingSelect?.addEventListener('change', selectCallback);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
selectCallback({ target: heightSelect });
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
selectCallback({ target: widthSelect });
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
selectCallback({ target: paddingSelect });

let iterations = 0;
const observerElm = createSizeObserver(() => {
  iterations += 1;
  requestAnimationFrame(() => {
    if (resizesSlot) {
      resizesSlot.textContent = iterations.toString();
    }
  });
});

targetElm?.appendChild(observerElm);

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
      const currValue = select.value;
      if (option === currValue) {
        continue;
      }
      select.value = option;
      const currIterations = iterations;

      let event;
      if (typeof Event === 'function') {
        event = new Event('change');
      } else {
        event = document.createEvent('Event');
        event.initEvent('change', true, true);
      }
      select.dispatchEvent(event);

      // eslint-disable-next-line
      await waitFor(() => iterations === currIterations + 1);

      if (typeof afterEach === 'function') {
        // eslint-disable-next-line
        await afterEach();
      }
    }
  }
};

window.iteratePadding = async (afterEach?: () => any) => {
  await iterateSelect(paddingSelect, afterEach);
};
window.iterateHeight = async (afterEach?: () => any) => {
  await iterateSelect(heightSelect, afterEach);
};
window.iterateWidth = async (afterEach?: () => any) => {
  await iterateSelect(widthSelect, afterEach);
};

const start = (window.iterate = async () => {
  window.setTestResult(null);
  targetElm?.removeAttribute('style');
  await iterateHeight(async () => {
    await iterateWidth(async () => {
      await iteratePadding();
    });
  });
  window.setTestResult(true);
});

startBtn?.addEventListener('click', start);
