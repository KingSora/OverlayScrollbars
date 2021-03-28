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
export declare const off: <T extends Event = Event>(target: EventTarget, eventNames: string, listener: (event: T) => any, capture?: boolean | undefined) => void;
/**
 * Adds the passed event listener for the passed eventnames with the passed options.
 * @param target The element to which the listener shall be added.
 * @param eventNames The eventsnames for which the listener shall be called.
 * @param listener The listener which is called on the eventnames.
 * @param options The options of the added listener.
 */
export declare const on: <T extends Event = Event>(target: EventTarget, eventNames: string, listener: (event: T) => any, options?: OnOptions | undefined) => (() => void);
/**
 * Shorthand for the stopPropagation event Method.
 * @param evt The event of which the stopPropagation method shall be called.
 */
export declare const stopPropagation: (evt: Event) => void;
/**
 * Shorthand for the preventDefault event Method.
 * @param evt The event of which the preventDefault method shall be called.
 */
export declare const preventDefault: (evt: Event) => void;
