import './index.scss';
import 'index.scss';
import { OverlayScrollbars } from 'overlayscrollbars';

OverlayScrollbars.env().setDefaultOptions({
  nativeScrollbarsOverlaid: { initialize: true },
});

OverlayScrollbars.env().setInitializationStrategy({ viewport: (target) => target });

window.os = OverlayScrollbars(document.body, {});

// test viewport inheritted attrs (tabindex) for multiple and single element init
// test appear & resize for multiple and single element init
// test children changing attr according to dom observer

/*
import { OverlayScrollbars } from 'overlayscrollbars';

import should from 'should';
import { resize } from '@/testing-browser/Resize';
import { timeout } from '@/testing-browser/timeout';
import { setTestResult, waitForOrFailTest } from '@/testing-browser/TestResult';
import { addClass, each, isArray, removeAttr, style } from 'support';

OverlayScrollbars.env().setDefaultOptions({
  nativeScrollbarsOverlaid: { initialize: true },
});




/*
const startBtn: HTMLButtonElement | null = document.querySelector('#start');
const target: HTMLElement | null = document.querySelector('#target');
const updatesSlot: HTMLElement | null = document.querySelector('#update');

let updateCount = 0;

const osInstance = OverlayScrollbars(
  { target: target! },
  {
    updating: {
      ignoreMutation(mutation) {
        console.log(mutation);
      },
    },
  },
  {
    updated() {
      updateCount++;
      requestAnimationFrame(() => {
        if (updatesSlot) {
          updatesSlot.textContent = `${updateCount}`;
        }
      });
    },
  }
);

const start = async () => {
  setTestResult(null);

  setTestResult(true);
};

startBtn?.addEventListener('click', start);
*/
