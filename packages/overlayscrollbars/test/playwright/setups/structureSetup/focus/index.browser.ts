import '~/index.scss';
import './index.scss';
import './handleEnvironment';
import { OverlayScrollbars } from '~/overlayscrollbars';
import { ScrollbarsHidingPlugin } from '~/plugins';
import { setTestResult, timeout } from '@~local/browser-testing';
import should from 'should';
import { hasClass } from '~/support';

if (!OverlayScrollbars.env().scrollbarsHiding) {
  OverlayScrollbars.plugin(ScrollbarsHidingPlugin);
}

const viewportIsTarget = hasClass(document.body, 'vpt');
OverlayScrollbars.env().setDefaultInitialization({
  cancel: { nativeScrollbarsOverlaid: false, body: false },
  ...(viewportIsTarget
    ? {
        elements: {
          viewport: (target) => target,
        },
      }
    : {}),
});

let focusEvents = 0;
const blurEvents = 0;
const wrapperElm: HTMLDivElement | null = document.querySelector('#wrapper');
const targetElm: HTMLDivElement | null = document.querySelector('#target');
const inputElm: HTMLInputElement | null = document.querySelector('#input');
const startBtn: HTMLButtonElement | null = document.querySelector('#start');

const incrementFocusEvents = () => {
  focusEvents++;
};
const incrementBlurEvents = () => {
  focusEvents++;
};

const testInputFocus = async () => {
  inputElm!.focus();
  inputElm!.addEventListener('focus', incrementFocusEvents);
  inputElm!.addEventListener('blur', incrementBlurEvents);

  await timeout(500);

  const beforeInitFocusEvents = focusEvents;
  const beforeInitBlurEvents = blurEvents;
  should.ok(document.activeElement === inputElm, 'Input element is focused before init.');

  const bodyInstance = OverlayScrollbars(document.body, {});
  const wrapperInstance = OverlayScrollbars(wrapperElm!, {});
  const targetInstance = OverlayScrollbars(targetElm!, {});

  should.ok(document.activeElement === inputElm, 'Input element is focused after init.');

  await timeout(500);

  should.equal(beforeInitFocusEvents, focusEvents, '0 additional Focus events after init.');
  should.equal(beforeInitBlurEvents, blurEvents, '0 additional Blur events after init.');
  should.ok(document.activeElement === inputElm, 'Input element is focused before destroy.');

  const beforeDestroyFocusEvents = focusEvents;
  const beforeDestroyBlurEvents = blurEvents;

  bodyInstance.destroy();
  wrapperInstance.destroy();
  targetInstance.destroy();

  should.equal(beforeDestroyFocusEvents, focusEvents, '0 additional Focus events after destroy.');
  should.equal(beforeDestroyBlurEvents, blurEvents, '0 additional Blur events after destroy.');
  should.ok(document.activeElement === inputElm, 'Input element is focused after destroy.');

  inputElm!.removeEventListener('focus', incrementFocusEvents);
  inputElm!.removeEventListener('blur', incrementBlurEvents);
};

const testViewportFocus = async () => {
  const body = document.body;
  (document.activeElement as HTMLElement | null)?.blur?.();
  body!.addEventListener('focus', incrementFocusEvents);
  body!.addEventListener('blur', incrementBlurEvents);

  const beforeInitFocusEvents = focusEvents;
  const beforeInitBlurEvents = blurEvents;
  should.ok(document.activeElement === body, 'Default focus element is body.');

  const bodyInstance = OverlayScrollbars(body, {});
  const { viewport } = bodyInstance.elements();

  should.ok(
    viewport === document.documentElement
      ? document.activeElement === document.body
      : document.activeElement === viewport,
    'Viewport element is focused after init.'
  );
  should.equal(beforeInitFocusEvents, focusEvents, '0 additional Focus events after init.');
  should.equal(beforeInitBlurEvents, blurEvents, '0 additional Blur events after init.');

  await timeout(500);

  const beforeDestroyFocusEvents = focusEvents;
  const beforeDestroyBlurEvents = blurEvents;

  bodyInstance.destroy();
  should.equal(beforeDestroyFocusEvents, focusEvents, '0 additional Focus events after destroy.');
  should.equal(beforeDestroyBlurEvents, blurEvents, '0 additional Blur events after destroy.');
  should.ok(document.activeElement === body, 'Body element is focused after destroy.');

  body!.removeEventListener('focus', incrementFocusEvents);
  body!.removeEventListener('blur', incrementBlurEvents);
};

startBtn?.addEventListener('click', async () => {
  setTestResult(null);

  try {
    // viewport first!
    await testViewportFocus();
    await testInputFocus();
    setTestResult(true);
  } catch (exception) {
    setTestResult(false);
    throw exception;
  }
});
