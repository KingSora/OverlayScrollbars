import '~/index.scss';
import './index.scss';
//import should from 'should';
import { /* timeout, setTestResult, waitForOrFailTest,*/ resize } from '@~local/browser-testing';
import { OverlayScrollbars } from '~/overlayscrollbars';
import { ScrollbarsHidingPlugin, SizeObserverPlugin } from '~/plugins';

if (!window.ResizeObserver) {
  OverlayScrollbars.plugin(SizeObserverPlugin);
}
if (!OverlayScrollbars.env().scrollbarsHiding) {
  OverlayScrollbars.plugin(ScrollbarsHidingPlugin);
}

// @ts-ignore
window.OverlayScrollbars = OverlayScrollbars;

OverlayScrollbars.env().setDefaultInitialization({
  cancel: { nativeScrollbarsOverlaid: false },
});

const stageResizer: HTMLElement | null = document.querySelector('#stageResizer');
const targetA: HTMLElement | null = document.querySelector('#targetA');
const targetB: HTMLElement | null = document.querySelector('#targetB');
let firstUpdateA = true;
let firstUpdateB = true;

resize(stageResizer!);

OverlayScrollbars(
  targetA!,
  {},
  {
    updated(instance) {
      if (!firstUpdateA) {
        return;
      }

      const { overflowAmount } = instance.state();

      instance.elements().scrollOffsetElement.scrollTo({
        behavior: 'auto',
        left: overflowAmount.x / 2,
        top: overflowAmount.y / 2,
      });

      firstUpdateA = false;
    },
  }
);
OverlayScrollbars(
  {
    target: targetB!,
    elements: {
      viewport: targetB!,
    },
  },
  {},
  {
    updated(instance) {
      if (!firstUpdateB) {
        return;
      }

      const { overflowAmount } = instance.state();

      instance.elements().scrollOffsetElement.scrollTo({
        behavior: 'auto',
        left: overflowAmount.x / -2,
        top: overflowAmount.y / 2,
      });

      firstUpdateB = false;
    },
  }
);
