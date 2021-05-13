declare type DebounceTiming = number | false | null | undefined;
export interface DebounceOptions<FunctionToDebounce extends (...args: any) => any> {
    /**
     * The timeout for debouncing. If null, no debounce is applied.
     */
    _timeout?: DebounceTiming | (() => DebounceTiming);
    /**
     * A maximum amount of ms. before the function will be called even with debounce.
     */
    _maxDelay?: DebounceTiming | (() => DebounceTiming);
    /**
     * Function which merges parameters for each canceled debounce.
     * If parameters can't be merged the function will return null, otherwise it returns the merged parameters.
     */
    _mergeParams?: (prev: Parameters<FunctionToDebounce>, curr: Parameters<FunctionToDebounce>) => Parameters<FunctionToDebounce> | false | null | undefined;
}
export interface Debounced<FunctionToDebounce extends (...args: any) => any> {
    (...args: Parameters<FunctionToDebounce>): ReturnType<FunctionToDebounce>;
    _flush(): void;
}
export declare const noop: () => void;
/**
 * Debounces the given function either with a timeout or a animation frame.
 * @param functionToDebounce The function which shall be debounced.
 * @param options Options for debouncing.
 */
export declare const debounce: <FunctionToDebounce extends (...args: any) => any>(functionToDebounce: FunctionToDebounce, options: DebounceOptions<FunctionToDebounce>) => Debounced<FunctionToDebounce>;
export {};
