import '~/index.scss';
import './index.scss';
import './handleEnvironment';
import { OverlayScrollbars } from '~/overlayscrollbars';
import { setTestResult, timeout } from '@~local/browser-testing';
import should from 'should';
import { hasClass } from '~/support';

const targetElm: HTMLDivElement | null = document.querySelector('#target');
const viewportElm: HTMLDivElement | null = document.querySelector('#viewport');
const startBtn: HTMLButtonElement | null = document.querySelector('#start');

startBtn?.addEventListener('click', async () => {
  setTestResult(null);

  try {
    await timeout(1000);

    const viewportIsTarget = hasClass(document.body, 'vpt');
    const scrollableViewort = hasClass(document.body, 'vps');
    const notScrollableViewport = hasClass(document.body, 'vp');
    const originaScrollElement = scrollableViewort ? viewportElm : targetElm;

    const originalScrollLeft = originaScrollElement!.scrollLeft;
    const originalScrollTop = originaScrollElement!.scrollTop;

    should.ok(originalScrollLeft > 0, 'Original ScrollLeft is expected to be > 0.');
    should.ok(originalScrollTop > 0, 'Original ScrollTop is expected to be > 0.');

    const osInstance = OverlayScrollbars(
      {
        target: targetElm!,
        elements: {
          viewport: viewportIsTarget
            ? targetElm!
            : (scrollableViewort || notScrollableViewport) && viewportElm,
        },
      },
      {}
    );

    const { scrollOffsetElement } = osInstance.elements();
    const initScrollLeft = scrollOffsetElement.scrollLeft;
    const initScrollTop = scrollOffsetElement.scrollTop;

    should.ok(initScrollLeft > 0, 'Init ScrollLeft is expected to be > 0.');
    should.ok(initScrollTop > 0, 'Init ScrollTop is expected to be > 0.');

    const { scrollbarsSize } = OverlayScrollbars.env();

    should.ok(
      Math.abs(originalScrollLeft - initScrollLeft - scrollbarsSize.x) <= 1,
      'Original and Init ScrollLeft should be about the same.'
    );
    should.ok(
      Math.abs(originalScrollTop - initScrollTop - scrollbarsSize.y) <= 1,
      'Original and Init ScrollTop should be about the same.'
    );

    setTestResult(true);
  } catch (exception) {
    setTestResult(false);
    throw exception;
  }
});
