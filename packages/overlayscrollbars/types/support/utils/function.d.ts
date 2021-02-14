export declare const noop: () => void;
/**
 * Debounces the given function either with a timeout or a animation frame.
 * @param functionToDebounce The function which shall be debounced.
 * @param timeout The timeout for debouncing. If 0 or lower animation frame is used for debouncing, a timeout otherwise.
 * @param maxWait A maximum amount of ms. before the function will be called even with debounce.
 */
export declare const debounce: (functionToDebounce: (...args: any) => any, timeout?: number | undefined, maxWait?: number | undefined) => () => void;
