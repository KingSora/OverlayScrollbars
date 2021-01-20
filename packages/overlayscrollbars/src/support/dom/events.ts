import { isUndefined } from 'support/utils/types';
import { each, push, runEach } from 'support/utils/array';

let passiveEventsSupport: boolean;
const supportPassiveEvents = (): boolean => {
  if (isUndefined(passiveEventsSupport)) {
    passiveEventsSupport = false;
    try {
      /* eslint-disable */
      // @ts-ignore
      window.addEventListener(
        'test',
        null,
        Object.defineProperty({}, 'passive', {
          get: function () {
            passiveEventsSupport = true;
          },
        })
      );
      /* eslint-enable */
    } catch (e) {}
  }
  return passiveEventsSupport;
};
const splitEventNames = (eventNames: string) => eventNames.split(' ');

export interface OnOptions {
  _capture?: boolean;
  _passive?: boolean;
  _once?: boolean;
}

/**
 * Removes the passed event listener for the passed events with the passed options.
 * @param target The element from which the listener shall be removed.
 * @param eventNames The eventsnames for which the listener shall be removed.
 * @param listener The listener which shall be removed.
 * @param capture The options of the removed listener.
 */
export const off = (target: EventTarget, eventNames: string, listener: EventListener, capture?: boolean): void => {
  each(splitEventNames(eventNames), (eventName) => {
    target.removeEventListener(eventName, listener, capture);
  });
};

/**
 * Adds the passed event listener for the passed eventnames with the passed options.
 * @param target The element to which the listener shall be added.
 * @param eventNames The eventsnames for which the listener shall be called.
 * @param listener The listener which is called on the eventnames.
 * @param options The options of the added listener.
 */
export const on = (target: EventTarget, eventNames: string, listener: EventListener, options?: OnOptions): (() => void) => {
  const doSupportPassiveEvents = supportPassiveEvents();
  const passive = (doSupportPassiveEvents && options && options._passive) || false;
  const capture = (options && options._capture) || false;
  const once = (options && options._once) || false;
  const offListeners: (() => void)[] = [];
  const nativeOptions: AddEventListenerOptions | boolean = doSupportPassiveEvents
    ? {
        passive,
        capture,
      }
    : capture;

  each(splitEventNames(eventNames), (eventName) => {
    const finalListener = once
      ? (evt: Event) => {
          target.removeEventListener(eventName, finalListener, capture);
          listener && listener(evt);
        }
      : listener;

    push(offListeners, off.bind(null, target, eventName, finalListener, capture));
    target.addEventListener(eventName, finalListener, nativeOptions);
  });

  return runEach.bind(0, offListeners);
};

/**
 * Shorthand for the stopPropagation event Method.
 * @param evt The event of which the stopPropagation method shall be called.
 */
export const stopPropagation = (evt: Event) => evt.stopPropagation();

/**
 * Shorthand for the preventDefault event Method.
 * @param evt The event of which the preventDefault method shall be called.
 */
export const preventDefault = (evt: Event) => evt.preventDefault();
