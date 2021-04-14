import 'styles/overlayscrollbars.scss';
import './index.scss';
import './handleEnvironment';
import should from 'should';
import { generateClassChangeSelectCallback, iterateSelect, selectOption } from '@/testing-browser/Select';
import { timeout } from '@/testing-browser/timeout';
import { setTestResult, waitForOrFailTest } from '@/testing-browser/TestResult';
import { offsetSize } from 'support';

import { createTrinsicObserver } from 'observers/trinsicObserver';

let heightIntrinsic: boolean | undefined;
let heightIterations = 0;
const envElm = document.querySelector('#env');
const targetElm = document.querySelector('#target');
const checkElm = document.querySelector('#check');
const envHeightSelect: HTMLSelectElement | null = document.querySelector('#envHeight');
const targetHeightSelect: HTMLSelectElement | null = document.querySelector('#targetHeight');
const displaySelect: HTMLSelectElement | null = document.querySelector('#display');
const startBtn: HTMLButtonElement | null = document.querySelector('#start');
const changesSlot: HTMLButtonElement | null = document.querySelector('#changes');
const preInitChildren = targetElm?.children.length;

const trinsicObserver = createTrinsicObserver(targetElm as HTMLElement, (heightIntrinsicCache) => {
  if (heightIntrinsicCache._changed) {
    heightIterations += 1;
    heightIntrinsic = heightIntrinsicCache._value;
  }
  requestAnimationFrame(() => {
    if (changesSlot) {
      changesSlot.textContent = heightIterations.toString();
    }
  });
});

const envElmSelectCallback = generateClassChangeSelectCallback(envElm as HTMLElement);
const targetElmSelectCallback = generateClassChangeSelectCallback(targetElm as HTMLElement);

envHeightSelect?.addEventListener('change', envElmSelectCallback);
targetHeightSelect?.addEventListener('change', targetElmSelectCallback);
displaySelect?.addEventListener('change', targetElmSelectCallback);

envElmSelectCallback(envHeightSelect);
targetElmSelectCallback(targetHeightSelect);
targetElmSelectCallback(displaySelect);

const iterate = async (select: HTMLSelectElement | null, afterEach?: () => any) => {
  interface IterateSelect {
    currHeightIterations: number;
    currHeightIntrinsic: boolean;
  }

  await iterateSelect<IterateSelect>(select, {
    beforeEach() {
      const currHeightIterations = heightIterations;
      const currHeightIntrinsic = offsetSize(checkElm as HTMLElement).h === 0;
      return {
        currHeightIterations,
        currHeightIntrinsic,
      };
    },
    async check({ currHeightIterations, currHeightIntrinsic }) {
      const newHeightIntrinsic = offsetSize(checkElm as HTMLElement).h === 0;
      const trinsicHeightChanged = newHeightIntrinsic !== currHeightIntrinsic;

      await waitForOrFailTest(() => {
        if (trinsicHeightChanged) {
          should.equal(heightIterations, currHeightIterations + 1);
        }
        should.equal(trinsicObserver._getCurrentCacheValues()._heightIntrinsic._value, newHeightIntrinsic);
      });
    },
    afterEach,
  });
};

const iterateEnvHeight = async (afterEach?: () => any) => {
  await iterate(envHeightSelect, afterEach);
};
const iterateTargetHeight = async (afterEach?: () => any) => {
  await iterate(targetHeightSelect, afterEach);
};
const changeWhileHidden = async () => {
  selectOption(targetHeightSelect as HTMLSelectElement, 'targetHeightHundred');

  const autoToHundred = async () => {
    selectOption(envHeightSelect as HTMLSelectElement, 'envHeightAuto');
    selectOption(displaySelect as HTMLSelectElement, 'displayNone');

    await timeout(250);

    selectOption(envHeightSelect as HTMLSelectElement, 'envHeightHundred');
    selectOption(displaySelect as HTMLSelectElement, 'displayBlock');

    await waitForOrFailTest(() => {
      should.equal(heightIntrinsic, false);
    });
  };

  const hundredToAuto = async () => {
    selectOption(envHeightSelect as HTMLSelectElement, 'envHeightHundred');
    selectOption(displaySelect as HTMLSelectElement, 'displayNone');

    await timeout(250);

    selectOption(envHeightSelect as HTMLSelectElement, 'envHeightAuto');
    selectOption(displaySelect as HTMLSelectElement, 'displayBlock');

    await waitForOrFailTest(() => {
      should.equal(heightIntrinsic, true);
    });
  };

  await autoToHundred();
  await hundredToAuto();
  await autoToHundred();
  await hundredToAuto();
};

const start = async () => {
  setTestResult(null);

  targetElm?.removeAttribute('style');
  await iterateEnvHeight();
  await iterateTargetHeight();
  await iterateEnvHeight(async () => {
    await iterateTargetHeight();
  });
  await changeWhileHidden();

  trinsicObserver._destroy();
  should.equal(targetElm?.children.length, preInitChildren);
  setTestResult(true);
};

startBtn?.addEventListener('click', start);

export { start };
