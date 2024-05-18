import '~/index.scss';
import './index.scss';
import './handleEnvironment';
import { OverlayScrollbars } from '~/overlayscrollbars';
import { ScrollbarsHidingPlugin } from '~/plugins';
import { setTestResult, timeout } from '@~local/browser-testing';
import should from 'should';
import { hasClass } from '~/support';

console.log(OverlayScrollbars.env());

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
const subscribeFocusEvents = (elm: HTMLElement) => {
  document.body.addEventListener('focusin', incrementFocusEvents);
  document.body.addEventListener('focusout', incrementBlurEvents);
  document.body.addEventListener('focus', incrementFocusEvents);
  document.body.addEventListener('blur', incrementBlurEvents);

  elm.addEventListener('focusout', incrementBlurEvents);
  elm.addEventListener('focusin', incrementFocusEvents);
  elm.addEventListener('focus', incrementFocusEvents);
  elm.addEventListener('blur', incrementBlurEvents);
  return () => {
    document.body.removeEventListener('focusin', incrementFocusEvents);
    document.body.removeEventListener('focusout', incrementBlurEvents);
    document.body.removeEventListener('focus', incrementFocusEvents);
    document.body.removeEventListener('blur', incrementBlurEvents);

    elm.removeEventListener('focusout', incrementBlurEvents);
    elm.removeEventListener('focusin', incrementFocusEvents);
    elm.removeEventListener('focus', incrementFocusEvents);
    elm.removeEventListener('blur', incrementBlurEvents);
  };
};

const testInputFocus = async () => {
  inputElm!.focus();
  const removeFocusEvents = subscribeFocusEvents(inputElm!);

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

  removeFocusEvents();
};

const testBodyFocus = async () => {
  const body = document.body;
  (document.activeElement as HTMLElement | null)?.blur?.();

  const removeFocusEvents = subscribeFocusEvents(body!);

  const beforeInitFocusEvents = focusEvents;
  const beforeInitBlurEvents = blurEvents;
  should.ok(document.activeElement === body, 'Default focus element is body.');

  const bodyInstance = OverlayScrollbars(body, {});
  const { viewport } = bodyInstance.elements();
  const bodyViewportIsTarget = viewport === document.documentElement;

  should.ok(
    bodyViewportIsTarget
      ? document.activeElement === document.body
      : document.activeElement === viewport,
    'Body Viewport element is focused after init.'
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

  removeFocusEvents();
};

const testElementViewportFocus = async () => {
  const viewportElm = targetElm!.firstElementChild! as HTMLElement;
  viewportElm.setAttribute('tabindex', '123');
  viewportElm.focus();

  const unsubscribe = subscribeFocusEvents(viewportElm);

  const beforeInitFocusEvents = focusEvents;
  const beforeInitBlurEvents = blurEvents;

  const targetInstance = OverlayScrollbars(
    viewportIsTarget
      ? targetElm!
      : {
          target: targetElm!,
          elements: {
            viewport: viewportElm,
          },
        },
    {}
  );

  should.equal(
    viewportElm.getAttribute('tabindex'),
    '123',
    'Explicit viewport tabindex is correct before init.'
  );

  const afterInitFocusEvents = focusEvents;
  const afterInitBlurEvents = blurEvents;

  should.ok(
    document.activeElement === viewportElm,
    `Explicit viewport holds focus during initialization.`
  );
  should.ok(
    beforeInitFocusEvents === afterInitFocusEvents,
    `0 Additional Focus events after explicit viewport init.`
  );
  should.ok(
    beforeInitBlurEvents === afterInitBlurEvents,
    `0 Additional Blur events after explicit viewport init.`
  );

  await timeout(100);
  should.equal(
    viewportElm.getAttribute('tabindex'),
    '123',
    'Explicit viewport tabindex is correct after init.'
  );

  const beforeDestroyFocusEvents = focusEvents;
  const beforeDestroyBlurEvents = blurEvents;

  targetInstance.destroy();

  const afterDestroyFocusEvents = focusEvents;
  const afterDestroyBlurEvents = blurEvents;

  should.ok(document.activeElement === viewportElm, `Explicit viewport holds focus after destroy.`);
  should.ok(
    beforeDestroyFocusEvents === afterDestroyFocusEvents,
    `0 Additional Focus events after explicit viewport destroy.`
  );
  should.ok(
    beforeDestroyBlurEvents === afterDestroyBlurEvents,
    `0 Additional Blur events after explicit viewport destroy.`
  );
  should.equal(
    viewportElm.getAttribute('tabindex'),
    '123',
    'Explicit viewport tabindex is correct after destroy.'
  );

  unsubscribe();
  viewportElm.removeAttribute('tabindex');
};

const testElementTargetFocus = async (withTargetFocus?: boolean) => {
  if (withTargetFocus) {
    targetElm!.setAttribute('tabindex', '456');
    targetElm!.focus();
  }

  const originalFocusElement = document.activeElement as HTMLElement;

  const unsubscribe = subscribeFocusEvents(targetElm!);

  const beforeInitFocusEvents = focusEvents;
  const beforeInitBlurEvents = blurEvents;

  should.ok(document.activeElement === originalFocusElement, `Target before init correct focus.`);

  const targetInstance = OverlayScrollbars(targetElm!, {});

  should.equal(
    targetElm!.getAttribute('tabindex'),
    withTargetFocus ? '456' : null,
    'Target tabindex is correct before init.'
  );

  const afterInitFocusEvents = focusEvents;
  const afterInitBlurEvents = blurEvents;

  should.ok(document.activeElement === originalFocusElement, `Target after init correct focus.`);
  should.ok(
    beforeInitFocusEvents === afterInitFocusEvents,
    `0 Additional Focus events after target init.`
  );
  should.ok(
    beforeInitBlurEvents === afterInitBlurEvents,
    `0 Additional Blur events after target init.`
  );

  await timeout(100);
  should.equal(
    targetElm!.getAttribute('tabindex'),
    withTargetFocus ? '456' : null,
    'Target tabindex is correct after init.'
  );
  should.equal(
    targetInstance.elements().viewport.getAttribute('tabindex'),
    viewportIsTarget ? (withTargetFocus ? '456' : null) : '-1',
    'Target init viewport tabindex is correct after init.'
  );

  const beforeDestroyFocusEvents = focusEvents;
  const beforeDestroyBlurEvents = blurEvents;

  targetInstance.destroy();

  const afterDestroyFocusEvents = focusEvents;
  const afterDestroyBlurEvents = blurEvents;

  if (withTargetFocus) {
    should.ok(
      document.activeElement === originalFocusElement,
      `Target after destroy correct focus.`
    );
  }

  should.equal(
    targetElm!.getAttribute('tabindex'),
    withTargetFocus ? '456' : null,
    'Target tabindex is correct after destroy.'
  );
  should.ok(
    beforeDestroyFocusEvents === afterDestroyFocusEvents,
    `0 Additional Focus events after target destroy.`
  );
  should.ok(
    beforeDestroyBlurEvents === afterDestroyBlurEvents,
    `0 Additional Blur events after target destroy.`
  );

  unsubscribe();
  targetElm!.removeAttribute('tabindex');
};

startBtn?.addEventListener('click', async () => {
  setTestResult(null);

  try {
    // body viewport first!
    await testBodyFocus();
    await timeout(100);
    await testElementTargetFocus();
    await timeout(100);
    await testElementTargetFocus(true);
    await timeout(100);
    await testElementViewportFocus();
    await timeout(100);
    await testInputFocus();
    setTestResult(true);
  } catch (exception) {
    setTestResult(false);
    throw exception;
  }
});
