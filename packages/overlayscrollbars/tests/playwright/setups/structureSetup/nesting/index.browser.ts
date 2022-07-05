import 'styles/overlayscrollbars.scss';
import './index.scss';
import should from 'should';
import { OverlayScrollbars } from 'overlayscrollbars';

import { resize } from '@/testing-browser/Resize';
import { setTestResult, waitForOrFailTest } from '@/testing-browser/TestResult';
import { addClass } from 'support';

OverlayScrollbars.env().setDefaultOptions({
  nativeScrollbarsOverlaid: { initialize: true },
});

const startBtn: HTMLButtonElement | null = document.querySelector('#start');
const targetRoot: HTMLElement | null = document.querySelector('#targetRoot');
const targetA: HTMLElement | null = document.querySelector('#targetA');
const targetB: HTMLElement | null = document.querySelector('#targetB');
const updatesRootSlot: HTMLElement | null = document.querySelector('#updatesRoot');
const updatesASlot: HTMLElement | null = document.querySelector('#updatesA');
const updatesBSlot: HTMLElement | null = document.querySelector('#updatesB');
const resizeRoot: HTMLElement | null = document.querySelector('#resizeRoot');
const resizeA: HTMLElement | null = document.querySelector('#resizeA');
const resizeB: HTMLElement | null = document.querySelector('#resizeB');
const resizeBetweenRoot: HTMLElement | null = document.createElement('div');
const resizeBetweenA: HTMLElement | null = document.createElement('div');
const resizeBetweenB: HTMLElement | null = document.createElement('div');

let rootUpdateCount = 0;
let aUpdateCount = 0;
let bUpdateCount = 0;
const osInstanceRoot = OverlayScrollbars(
  targetRoot!,
  {},
  {
    initialized() {
      addClass(resizeBetweenRoot, 'resize resizeBetween');
      targetRoot!.append(resizeBetweenRoot);
    },
    updated() {
      rootUpdateCount++;
      requestAnimationFrame(() => {
        if (updatesRootSlot) {
          updatesRootSlot.textContent = `${rootUpdateCount}`;
        }
      });
    },
  }
);
const osInstanceA = OverlayScrollbars(
  targetA!,
  {},
  {
    initialized() {
      addClass(resizeBetweenA, 'resize resizeBetween');
      targetA!.append(resizeBetweenA);
    },
    updated(args) {
      console.log(args);
      aUpdateCount++;
      requestAnimationFrame(() => {
        if (updatesASlot) {
          updatesASlot.textContent = `${aUpdateCount}`;
        }
      });
    },
  }
);
const osInstanceB = OverlayScrollbars(
  targetB!,
  {},
  {
    initialized() {
      addClass(resizeBetweenB, 'resize resizeBetween');
      targetB!.append(resizeBetweenB);
    },
    updated() {
      bUpdateCount++;
      requestAnimationFrame(() => {
        if (updatesBSlot) {
          updatesBSlot.textContent = `${bUpdateCount}`;
        }
      });
    },
  }
);

resize(resizeRoot!);
resize(resizeA!);
resize(resizeB!);
resize(resizeBetweenRoot!);
resize(resizeBetweenA!);
resize(resizeBetweenB!);

const start = async () => {
  setTestResult(null);

  // target?.removeAttribute('style');

  setTestResult(true);
};

startBtn?.addEventListener('click', start);
