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
import { getOffsetSize } from '~/support';
import { createTrinsicObserver } from '~/observers';
import { OverlayScrollbars } from '~/overlayscrollbars';
import { SizeObserverPlugin } from '~/plugins';

if (!window.ResizeObserver) {
  OverlayScrollbars.plugin(SizeObserverPlugin);
}

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

const [constructTrinsicObserver, updateTrinsicObserver] = createTrinsicObserver(
  targetElm as HTMLElement,
  (heightIntrinsicCache) => {
    const [currentHeightIntrinsic, currentHeightIntrinsicChanged] = heightIntrinsicCache;
    if (currentHeightIntrinsicChanged) {
      heightIterations += 1;
      heightIntrinsic = currentHeightIntrinsic;
    }
    requestAnimationFrame(() => {
      if (changesSlot) {
        changesSlot.textContent = heightIterations.toString();
      }
    });
  }
);
const destroyTrinsicObserver = constructTrinsicObserver();

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
      const currHeightIntrinsic = getOffsetSize(checkElm as HTMLElement).h === 0;
      return {
        currHeightIterations,
        currHeightIntrinsic,
      };
    },
    async check({ currHeightIterations, currHeightIntrinsic }) {
      const newHeightIntrinsic = getOffsetSize(checkElm as HTMLElement).h === 0;
      const trinsicHeightChanged = newHeightIntrinsic !== currHeightIntrinsic;

      await waitForOrFailTest(() => {
        if (trinsicHeightChanged) {
          should.equal(
            heightIterations,
            currHeightIterations + 1,
            'Height intrinsic change has been detected correctly.'
          );
        }
        /*
        should.equal(
          trinsicObserver._getCurrentCacheValues()._heightIntrinsic[0],
          newHeightIntrinsic,
          'Height intrinsic cache value is correct.'
        );
        */
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
      should.equal(
        heightIntrinsic,
        false,
        'Trinsic sizing changes while hidden from intrinsic to extrinsic.'
      );
    });
  };

  const hundredToAuto = async () => {
    selectOption(envHeightSelect as HTMLSelectElement, 'envHeightHundred');
    selectOption(displaySelect as HTMLSelectElement, 'displayNone');

    await timeout(250);

    selectOption(envHeightSelect as HTMLSelectElement, 'envHeightAuto');
    selectOption(displaySelect as HTMLSelectElement, 'displayBlock');

    await waitForOrFailTest(() => {
      should.equal(
        heightIntrinsic,
        true,
        'Trinsic sizing changes while hidden from extrinsic to intrinsic.'
      );
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

  updateTrinsicObserver();
  destroyTrinsicObserver();
  updateTrinsicObserver();
  destroyTrinsicObserver();
  should.equal(
    targetElm?.children.length,
    preInitChildren,
    'After destruction all generated elements are removed.'
  );
  setTestResult(true);
};

startBtn?.addEventListener('click', start);

export { start };
