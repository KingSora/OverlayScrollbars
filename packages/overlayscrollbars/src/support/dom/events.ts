/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DomTokens } from './attribute';
import { each, runEachAndClear } from '../utils/array';
import { bind } from '../utils/function';
import { keys } from '../utils';
import { getDomTokensArray } from './attribute';

export interface EventListenerOptions {
  _capture?: boolean;
  _passive?: boolean;
  _once?: boolean;
}

export type EventListenerTarget = EventTarget | false | null | undefined;

export type EventListenerMap = {
  [eventNames: string]: ((event: any) => any) | false | null | undefined;
};

/**
 * Removes the passed event listener for the passed event names with the passed options.
 * @param target The element from which the listener shall be removed.
 * @param eventNames The eventsnames for which the listener shall be removed.
 * @param listener The listener which shall be removed.
 * @param capture The options of the removed listener.
 */
export const removeEventListener = <T extends Event = Event>(
  target: EventListenerTarget,
  eventNames: DomTokens,
  listener: (event: T) => any,
  capture?: boolean
): void => {
  each(getDomTokensArray(eventNames), (eventName) => {
    if (target) {
      target.removeEventListener(eventName, listener as EventListener, capture);
    }
  });
};

/**
 * Adds the passed event listener for the passed event names with the passed options.
 * @param target The element to which the listener shall be added.
 * @param eventNames The eventsnames for which the listener shall be called.
 * @param listener The listener which is called on the eventnames.
 * @param options The options of the added listener.
 */
export const addEventListener = <T extends Event = Event>(
  target: EventListenerTarget,
  eventNames: DomTokens,
  listener: ((event: T) => any) | false | null | undefined,
  options?: EventListenerOptions
): (() => void) => {
  const passive = (options && options._passive) ?? true;
  const capture = (options && options._capture) || false;
  const once = (options && options._once) || false;
  const nativeOptions: AddEventListenerOptions = {
    passive,
    capture,
  };

  return bind(
    runEachAndClear,
    getDomTokensArray(eventNames).map((eventName) => {
      const finalListener = (
        once
          ? (evt: T) => {
              removeEventListener(target, eventName, finalListener, capture);
              if (listener) {
                listener(evt);
              }
            }
          : listener
      ) as EventListener;

      if (target) {
        target.addEventListener(eventName, finalListener, nativeOptions);
      }

      return bind(removeEventListener, target, eventName, finalListener, capture);
    })
  );
};

/**
 * Adds the passed event listeners for the passed event names with the passed options.
 * @param target The element to which the listener shall be added.
 * @param eventListenerMap A map which descirbes the event names and event listeners to be added.
 * @param options The options of the added listeners.
 */
export const addEventListeners = (
  target: EventListenerTarget,
  eventListenerMap: EventListenerMap,
  options?: EventListenerOptions
): (() => void) =>
  bind(
    runEachAndClear,
    keys(eventListenerMap).map((eventNames) =>
      addEventListener(target, eventNames, eventListenerMap[eventNames], options)
    )
  );

/**
 * Shorthand for the stopPropagation event Method.
 * @param evt The event of which the stopPropagation method shall be called.
 */
export const stopPropagation = (evt: Event): void => evt.stopPropagation();

/**
 * Shorthand for the preventDefault event Method.
 * @param evt The event of which the preventDefault method shall be called.
 */
export const preventDefault = (evt: Event): void => evt.preventDefault();

/**
 * Shorthand for the stopPropagation and preventDefault event Method.
 * @param evt The event of which the stopPropagation and preventDefault methods shall be called.
 */
export const stopAndPrevent = (evt: Event): void =>
  (stopPropagation(evt) as undefined) || (preventDefault(evt) as undefined);
