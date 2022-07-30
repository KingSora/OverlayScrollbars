import { isUndefined } from '../utils/types';
import { each, push, runEachAndClear } from '../utils/array';
let passiveEventsSupport;
const supportPassiveEvents = () => {
    if (isUndefined(passiveEventsSupport)) {
        passiveEventsSupport = false;
        try {
            /* eslint-disable */
            // @ts-ignore
            window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
                get() {
                    passiveEventsSupport = true;
                },
            }));
            /* eslint-enable */
        }
        catch (e) { }
    }
    return passiveEventsSupport;
};
const splitEventNames = (eventNames) => eventNames.split(' ');
/**
 * Removes the passed event listener for the passed events with the passed options.
 * @param target The element from which the listener shall be removed.
 * @param eventNames The eventsnames for which the listener shall be removed.
 * @param listener The listener which shall be removed.
 * @param capture The options of the removed listener.
 */
export const off = (target, eventNames, listener, capture) => {
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
export const on = (target, eventNames, listener, options) => {
    const doSupportPassiveEvents = supportPassiveEvents();
    const passive = (doSupportPassiveEvents && options && options._passive) ?? doSupportPassiveEvents;
    const capture = (options && options._capture) || false;
    const once = (options && options._once) || false;
    const offListeners = [];
    const nativeOptions = doSupportPassiveEvents
        ? {
            passive,
            capture,
        }
        : capture;
    each(splitEventNames(eventNames), (eventName) => {
        const finalListener = (once
            ? (evt) => {
                target.removeEventListener(eventName, finalListener, capture);
                listener && listener(evt);
            }
            : listener);
        push(offListeners, off.bind(null, target, eventName, finalListener, capture));
        target.addEventListener(eventName, finalListener, nativeOptions);
    });
    return runEachAndClear.bind(0, offListeners);
};
/**
 * Shorthand for the stopPropagation event Method.
 * @param evt The event of which the stopPropagation method shall be called.
 */
export const stopPropagation = (evt) => evt.stopPropagation();
/**
 * Shorthand for the preventDefault event Method.
 * @param evt The event of which the preventDefault method shall be called.
 */
export const preventDefault = (evt) => evt.preventDefault();
/**
 * Shorthand for the stopPropagation and preventDefault event Method.
 * @param evt The event of which the stopPropagation and preventDefault methods shall be called.
 */
export const stopAndPrevent = (evt) => stopPropagation(evt) || preventDefault(evt);
//# sourceMappingURL=events.js.map