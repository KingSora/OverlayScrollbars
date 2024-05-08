import '~/index.scss';
import './index.scss';
import { OverlayScrollbars } from '~/overlayscrollbars';
import { ClickScrollPlugin } from '~/plugins';
import { setTestResult } from '@~local/browser-testing';

OverlayScrollbars.plugin(ClickScrollPlugin);

const startBtn = document.querySelector<HTMLButtonElement>('#start')!;
const targetElm = document.querySelector<HTMLElement>('#target')!;
const viewportElement = document.querySelector<HTMLElement>('#viewport')!;
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

startBtn.addEventListener('click', async () => {
  setTestResult(null);

  try {
    setTestResult(true);
  } catch (exception) {
    setTestResult(false);
    throw exception;
  }
});
