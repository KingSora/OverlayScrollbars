import '~/index.scss';
import './index.scss';
import './handleEnvironment';
import { OverlayScrollbars } from '~/overlayscrollbars';
import { dataAttributeViewport, dataValueViewportNoContent } from '~/classnames';
import { ScrollbarsHidingPlugin } from '~/plugins';
import { setTestResult, timeout } from '@~local/browser-testing';
import should from 'should';

import './app/.build/app.css';
import { mountApp } from './app/.build/app';

if (!OverlayScrollbars.env().scrollbarsHiding) {
  OverlayScrollbars.plugin(ScrollbarsHidingPlugin);
}

window.OverlayScrollbars = OverlayScrollbars;

mountApp(document.querySelector('#app'));

const startBtn: HTMLButtonElement = document.querySelector('#start')!;
startBtn.addEventListener('click', async () => {
  setTestResult(null);

  try {
    const errors: Error[] = [];
    const target = document.querySelector<HTMLDivElement>('#target')!;
    const insertBtn: HTMLButtonElement = document.querySelector('#insert')!;
    const removeBtn: HTMLButtonElement = document.querySelector('#remove')!;
    const shuffleBtn: HTMLButtonElement = document.querySelector('#shuffle')!;
    const resetBtn: HTMLButtonElement = document.querySelector('#reset')!;
    const osInstance = OverlayScrollbars(target)!;

    const checkUndefined = [target, insertBtn, removeBtn, shuffleBtn, resetBtn, osInstance];

    if (checkUndefined.some((elm) => !elm)) {
      throw new Error('DOM not complete');
    }

    const { viewport } = osInstance.elements();
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const oldValue = mutation.oldValue || '';
        const newValue = viewport.getAttribute(dataAttributeViewport) || '';

        const oldValueSplit = oldValue.split(' ');
        const newValueSplit = newValue.split(' ');

        try {
          should.ok(
            !oldValueSplit.includes(dataValueViewportNoContent),
            "Viewport is not in 'noContent' mode"
          );
          should.ok(
            !newValueSplit.includes(dataValueViewportNoContent),
            "Viewport is not in 'noContent' mode"
          );
        } catch (error) {
          // @ts-ignore
          const message = (error || {})?.message || 'Unexpected Error';
          errors.push(new Error(message));
        }
      });
    });
    mutationObserver.observe(osInstance.elements().viewport, {
      attributeFilter: [dataAttributeViewport],
      attributeOldValue: true,
      attributes: true,
    });

    await timeout(500);

    for (let i = 0; i < 5; i++) {
      insertBtn.click();
      await timeout(300);
    }

    shuffleBtn.click();
    await timeout(300);

    for (let i = 0; i < 8; i++) {
      removeBtn.click();
      await timeout(300);
    }

    shuffleBtn.click();
    await timeout(300);

    resetBtn.click();
    await timeout(300);

    shuffleBtn.click();
    await timeout(300);

    if (errors.length) {
      console.log(errors);
      throw new Error(
        `${errors.length} Errors ${errors.map((error) => error.message).join('\r\n')}`
      );
    }

    setTestResult(true);
  } catch (exception) {
    setTestResult(false);
    throw exception;
  }
});
