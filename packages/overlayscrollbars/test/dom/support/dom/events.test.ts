import { vi, describe, test, beforeEach, expect } from 'vitest';
import type { EventListenerOptions } from '../../../../src/support/dom/events';
import {
  removeEventListener,
  preventDefault,
  stopPropagation,
  stopAndPrevent,
} from '../../../../src/support/dom/events';

const testElm = document.body;
const mockEventListener = (add?: (...args: any) => any, remove?: (...args: any) => any) => {
  const originalAdd = testElm.addEventListener;
  const originalRemove = testElm.removeEventListener;
  const originalWindow = window.addEventListener;

  if (add) {
    testElm.addEventListener = add;
  }
  if (remove) {
    testElm.removeEventListener = remove;
  }
  return () => {
    testElm.addEventListener = originalAdd;
    testElm.removeEventListener = originalRemove;
    window.addEventListener = originalWindow;
  };
};

describe('dom events', () => {
  describe('addEventListener & addEventListeners', () => {
    let eventsModule: typeof import('../../../../src/support/dom/events') | undefined;
    const onOffTest = (eventNames: string, options?: EventListenerOptions) => {
      const once = options?._once;
      const expectObjAdd = {
        passive: (options && options._passive) ?? true,
        capture: (options && options._capture) || false,
      };
      const expectObjRemove = options?._capture || false;
      const onceListeners: (() => void)[] = [];
      const mockFnRemove = vi.fn();
      const mockFnAdd = vi.fn();
      const eventListener = () => {};

      const revert = mockEventListener((name: string, listener: any, ...args: any) => {
        if (once) {
          const onceRemoveMockFn = vi.fn();
          const revertOnceMock = mockEventListener(vi.fn(), onceRemoveMockFn);

          listener();
          expect(onceRemoveMockFn).toHaveBeenCalledWith(name, listener, expectObjRemove);

          revertOnceMock();
          onceListeners.push(listener);
        }
        mockFnAdd(name, listener, ...args);
      }, mockFnRemove);
      const listenerRemoveFn = eventsModule?.addEventListener(
        testElm,
        eventNames,
        eventListener,
        options
      );

      expect(typeof listenerRemoveFn).toBe('function');

      eventNames.split(' ').forEach((eventName, index) => {
        expect(mockFnAdd).toHaveBeenCalledWith(
          eventName,
          once ? onceListeners[index] : eventListener,
          expectObjAdd
        );
      });

      listenerRemoveFn!();
      eventNames.split(' ').forEach((eventName, index) => {
        expect(mockFnRemove).toHaveBeenCalledWith(
          eventName,
          once ? onceListeners[index] : eventListener,
          expectObjRemove
        );
      });

      revert();

      const listenersRemoveFn = eventsModule?.addEventListeners(
        testElm,
        {
          [eventNames]: eventListener,
        },
        options
      );

      expect(typeof listenersRemoveFn).toBe('function');

      eventNames.split(' ').forEach((eventName, index) => {
        expect(mockFnAdd).toHaveBeenCalledWith(
          eventName,
          once ? onceListeners[index] : eventListener,
          expectObjAdd
        );
      });

      listenerRemoveFn!();
      eventNames.split(' ').forEach((eventName, index) => {
        expect(mockFnRemove).toHaveBeenCalledWith(
          eventName,
          once ? onceListeners[index] : eventListener,
          expectObjRemove
        );
      });

      revert();
    };

    beforeEach(() =>
      import('../../../../src/support/dom/events').then((module) => {
        eventsModule = module;
        vi.resetModules();
      })
    );

    describe(`passive event listeners support`, () => {
      ['testEventName', 'testEventName testEventName2 testEventName3'].forEach((eventNames) => {
        const title = eventNames.split(' ').length === 1 ? 'single' : 'multiple';
        test(title, () => {
          onOffTest(eventNames);
          onOffTest(eventNames, { _capture: true });
          onOffTest(eventNames, { _capture: false });
          onOffTest(eventNames, { _capture: true, _passive: true });
          onOffTest(eventNames, { _capture: false, _passive: false });
          onOffTest(eventNames, { _capture: true, _passive: false });
          onOffTest(eventNames, { _capture: false, _passive: true });

          onOffTest(eventNames, { _once: true });
          onOffTest(eventNames, { _once: false });
        });
      });
    });
  });

  describe('removeEventListener', () => {
    const offTest = (eventNames: string, options?: boolean) => {
      const mockFnRemove = vi.fn();
      const listener = () => {};
      const revert = mockEventListener(vi.fn(), mockFnRemove);

      removeEventListener(testElm, eventNames, listener, options);
      eventNames.split(' ').forEach((eventName) => {
        expect(mockFnRemove).toHaveBeenCalledWith(eventName, listener, options);
      });

      revert();
    };

    ['testEventName', 'testEventName testEventName2 testEventName3'].forEach((eventNames) => {
      const title = eventNames.split(' ').length === 1 ? 'single' : 'multiple';
      test(title, () => {
        offTest(eventNames, false);
        offTest(eventNames, true);
      });
    });
  });

  test('preventDefault', () => {
    // @ts-ignore
    const fakeEvent: Event = {
      preventDefault: vi.fn(),
    };
    preventDefault(fakeEvent);
    expect(fakeEvent.preventDefault).toHaveBeenCalled();
  });

  test('stopPropagation', () => {
    // @ts-ignore
    const fakeEvent: Event = {
      stopPropagation: vi.fn(),
    };
    stopPropagation(fakeEvent);
    expect(fakeEvent.stopPropagation).toHaveBeenCalled();
  });

  test('stopAndPrevent', () => {
    // @ts-ignore
    const fakeEvent: Event = {
      stopPropagation: vi.fn(),
      preventDefault: vi.fn(),
    };
    stopAndPrevent(fakeEvent);
    expect(fakeEvent.stopPropagation).toHaveBeenCalled();
    expect(fakeEvent.preventDefault).toHaveBeenCalled();
  });
});
