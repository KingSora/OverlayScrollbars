import './index.scss';
import 'styles/overlayscrollbars.scss';
import should from 'should';
import { OverlayScrollbars } from 'overlayscrollbars';
import { resize } from '@/testing-browser/Resize';
import { timeout } from '@/testing-browser/timeout';
import { setTestResult, waitForOrFailTest } from '@/testing-browser/TestResult';
import { addClass, each, isArray, removeAttr, style } from 'support';

OverlayScrollbars.env().setDefaultOptions({
  nativeScrollbarsOverlaid: { initialize: true },
});

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