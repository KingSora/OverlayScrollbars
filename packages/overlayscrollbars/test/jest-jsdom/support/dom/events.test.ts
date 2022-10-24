import { off, preventDefault, stopPropagation, stopAndPrevent } from '~/support/dom/events';
import type { OnOptions } from '~/support/dom/events';

const testElm = document.body;
const mockEventListener = (
  passive?: boolean,
  add?: (...args: any) => any,
  remove?: (...args: any) => any
) => {
  const originalAdd = testElm.addEventListener;
  const originalRemove = testElm.removeEventListener;
  const originalWindow = window.addEventListener;

  if (add) {
    testElm.addEventListener = add;
  }
  if (remove) {
    testElm.removeEventListener = remove;
  }
  if (!passive) {
    window.addEventListener = () => {};
  }
  return () => {
    testElm.addEventListener = originalAdd;
    testElm.removeEventListener = originalRemove;
    window.addEventListener = originalWindow;
  };
};

describe('dom events', () => {
  describe('on', () => {
    let eventsModule: any;
    const onOffTest = (passive: boolean, eventNames: string, options?: OnOptions) => {
      const once = options?._once;
      const expectObjAdd = passive
        ? {
            passive: (options && options._passive) ?? passive,
            capture: (options && options._capture) || false,
          }
        : options?._capture || false;
      const expectObjRemove = options?._capture || false;
      const onceListeners: (() => void)[] = [];
      const mockFnRemove = jest.fn();
      const mockFnAdd = jest.fn();
      const eventListener = () => {};

      const revert = mockEventListener(
        passive,
        (name: string, listener: any, ...args: any) => {
          if (once) {
            const onceRemoveMockFn = jest.fn();
            const revertOnceMock = mockEventListener(passive, jest.fn(), onceRemoveMockFn);

            listener();
            expect(onceRemoveMockFn).toHaveBeenCalledWith(name, listener, expectObjRemove);

            revertOnceMock();
            onceListeners.push(listener);
          }
          mockFnAdd(name, listener, ...args);
        },
        mockFnRemove
      );
      const removeFn = eventsModule.on(testElm, eventNames, eventListener, options);

      eventNames.split(' ').forEach((eventName, index) => {
        expect(mockFnAdd).toHaveBeenCalledWith(
          eventName,
          once ? onceListeners[index] : eventListener,
          expectObjAdd
        );
      });

      removeFn();
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
      import('~/support/dom/events').then((module) => {
        eventsModule = module;
        jest.resetModules();
      })
    );

    [true, false].forEach((passiveSupport) => {
      describe(`passive event listeners support: ${passiveSupport}`, () => {
        ['testEventName', 'testEventName testEventName2 testEventName3'].forEach((eventNames) => {
          const title = eventNames.split(' ').length === 1 ? 'single' : 'multiple';
          test(title, () => {
            onOffTest(passiveSupport, eventNames);
            onOffTest(passiveSupport, eventNames, { _capture: true });
            onOffTest(passiveSupport, eventNames, { _capture: false });
            onOffTest(passiveSupport, eventNames, { _capture: true, _passive: true });
            onOffTest(passiveSupport, eventNames, { _capture: false, _passive: false });
            onOffTest(passiveSupport, eventNames, { _capture: true, _passive: false });
            onOffTest(passiveSupport, eventNames, { _capture: false, _passive: true });

            onOffTest(passiveSupport, eventNames, { _once: true });
            onOffTest(passiveSupport, eventNames, { _once: false });
          });
        });
      });
    });
  });

  describe('off', () => {
    const offTest = (eventNames: string, options?: boolean) => {
      const mockFnRemove = jest.fn();
      const listener = () => {};
      const revert = mockEventListener(false, jest.fn(), mockFnRemove);

      off(testElm, eventNames, listener, options);
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
      preventDefault: jest.fn(),
    };
    preventDefault(fakeEvent);
    expect(fakeEvent.preventDefault).toHaveBeenCalled();
  });

  test('stopPropagation', () => {
    // @ts-ignore
    const fakeEvent: Event = {
      stopPropagation: jest.fn(),
    };
    stopPropagation(fakeEvent);
    expect(fakeEvent.stopPropagation).toHaveBeenCalled();
  });

  test('stopAndPrevent', () => {
    // @ts-ignore
    const fakeEvent: Event = {
      stopPropagation: jest.fn(),
      preventDefault: jest.fn(),
    };
    stopAndPrevent(fakeEvent);
    expect(fakeEvent.stopPropagation).toHaveBeenCalled();
    expect(fakeEvent.preventDefault).toHaveBeenCalled();
  });
});
