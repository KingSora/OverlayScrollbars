import '~/index.scss';
import './index.scss';
import { OverlayScrollbars } from '~/overlayscrollbars';
import { ClickScrollPlugin } from '~/plugins';
import { setTestResult } from '@~local/browser-testing';

OverlayScrollbars.plugin(ClickScrollPlugin);

const startBtn = document.querySelector<HTMLButtonElement>('#start')!;
const targetElm = document.querySelector<HTMLElement>('#target')!;
const targetRTLElm = document.querySelector<HTMLElement>('#targetRTL')!;
const viewportElement = document.querySelector<HTMLElement>('#viewport')!;
const viewportRTLElement = document.querySelector<HTMLElement>('#viewportRTL')!;
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const osInstance = (window.os = OverlayScrollbars(
  {
    target: targetElm,
    elements: {
      viewport: viewportElement,
    },
  },
  {
    scrollbars: {
      clickScroll: true,
    },
  }
));
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const osInstanceRTL = (window.osRTL = OverlayScrollbars(
  {
    target: targetRTLElm,
    elements: {
      viewport: viewportRTLElement,
    },
  },
  {
    scrollbars: {
      clickScroll: true,
    },
  }
));

startBtn.addEventListener('click', async () => {
  setTestResult(null);

  try {
    setTestResult(true);
  } catch (exception) {
    setTestResult(false);
    throw exception;
  }
});
