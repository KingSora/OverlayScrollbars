/* eslint-disable @typescript-eslint/no-explicit-any */
import { isNumber, isFunction } from './types';
import { from } from './array';
import { rAF, cAF, setT, clearT } from './alias';

type DebouncerFn = (task: () => void) => () => void;

export type DebounceTiming = { _debouncer: DebouncerFn } | number | false | null | undefined;

export interface DebounceOptions<FunctionToDebounce extends (...args: any) => any> {
  /**
   * The timing for debouncing. If false, null or undefined, no debounce is applied.
   */
  _debounceTiming?: DebounceTiming | (() => DebounceTiming);
  /**
   * The timing which determines when the debounced will be called even when the debounce timing did not call it yet.
   */
  _maxDebounceTiming?: DebounceTiming | (() => DebounceTiming);
  /**
   * Defines the calling on the leading edge of the timeout.
   */
  _leading?: boolean;
  /**
   * Function which merges parameters for each canceled debounce.
   * If parameters can't be merged the function will return null, otherwise it returns the merged parameters.
   */
  _mergeParams?: (
    prev: Parameters<FunctionToDebounce>,
    curr: Parameters<FunctionToDebounce>
  ) => Parameters<FunctionToDebounce> | false | null | undefined;
}

export interface Debounced<FunctionToDebounce extends (...args: any) => any> {
  (...args: Parameters<FunctionToDebounce>): ReturnType<FunctionToDebounce>;
  _flush(): void;
}

export const bind = <A extends any[], B extends any[], R>(
  fn: (...args: [...A, ...B]) => R,
  ...args: A
): ((...args: B) => R) => fn.bind(0, ...args);

/**
 * Creates a timeout and cleartimeout tuple. The timeout function always clears the previously created timeout before it runs.
 * @param timeout The timeout in ms. If no timeout (or 0) is passed requestAnimationFrame is used instead of setTimeout.
 * @returns A tuple with the timeout function as the first value and the clearTimeout function as the second value.
 */
export const selfClearTimeout = (timeout?: number | (() => number)) => {
  let id: number;
  const setTFn = timeout ? setT : rAF!;
  const clearTFn = timeout ? clearT : cAF!;
  return [
    (callback: () => any) => {
      clearTFn(id);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      id = setTFn(() => callback(), isFunction(timeout) ? timeout() : timeout);
    },
    () => clearTFn(id),
  ] as [timeout: (callback: () => any) => void, clear: () => void];
};

const getDebouncer = (
  debounceTiming: DebounceTiming | (() => DebounceTiming)
): DebouncerFn | false | null | undefined | void => {
  const debounceTimingResult = isFunction(debounceTiming) ? debounceTiming() : debounceTiming;
  if (isNumber(debounceTimingResult)) {
    const schedule = debounceTimingResult ? setT! : rAF!;
    const clear = debounceTimingResult ? clearT : cAF;
    return (task) => {
      const timeoutId = schedule!(
        () => task(),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        debounceTimingResult
      );
      return () => {
        clear!(timeoutId);
      };
    };
  }

  return debounceTimingResult && debounceTimingResult._debouncer;
};

/**
 * Debounces the given function either with a timeout or a animation frame.
 * @param functionToDebounce The function which shall be debounced.
 * @param options Options for debouncing.
 */
export const debounce = <FunctionToDebounce extends (...args: any) => any>(
  functionToDebounce: FunctionToDebounce,
  options?: DebounceOptions<FunctionToDebounce>
): Debounced<FunctionToDebounce> => {
  const {
    _debounceTiming: _timeout,
    _maxDebounceTiming: _maxDelay,
    _leading,
    _mergeParams,
  } = options || {};
  let cancelMaxTimeoutDebouncer: (() => void) | undefined;
  let cancelTimeoutDebounder: (() => void) | undefined;
  let prevArguments: Parameters<FunctionToDebounce> | null | undefined;
  let leadingInvoked: boolean | undefined;

  const invokeFunctionToDebounce = function (args: Parameters<FunctionToDebounce>) {
    if (cancelTimeoutDebounder) {
      cancelTimeoutDebounder();
    }
    if (cancelMaxTimeoutDebouncer) {
      cancelMaxTimeoutDebouncer();
    }

    leadingInvoked = cancelTimeoutDebounder = cancelMaxTimeoutDebouncer = prevArguments = undefined;
    // eslint-disable-next-line
    // @ts-ignore
    functionToDebounce.apply(this, args);
  };

  const mergeParms = (
    curr: Parameters<FunctionToDebounce>
  ): Parameters<FunctionToDebounce> | false | null | undefined =>
    _mergeParams && prevArguments ? _mergeParams(prevArguments, curr) : curr;

  const flush = () => {
    /* istanbul ignore next */
    if (cancelTimeoutDebounder && prevArguments) {
      invokeFunctionToDebounce(mergeParms(prevArguments) || prevArguments);
    }
  };

  const debouncedFn = function () {
    // eslint-disable-next-line prefer-rest-params
    const args: Parameters<FunctionToDebounce> = from(arguments) as Parameters<FunctionToDebounce>;
    const timeoutDebouncer = getDebouncer(_timeout);

    if (timeoutDebouncer) {
      const maxDelayDebouncer = getDebouncer(_maxDelay);
      const mergeParamsResult = mergeParms(args);
      const invokedArgs = mergeParamsResult || args;
      const boundInvoke = invokeFunctionToDebounce.bind(0, invokedArgs);

      if (cancelTimeoutDebounder) {
        cancelTimeoutDebounder();
      }

      if (_leading && !leadingInvoked) {
        boundInvoke();
        leadingInvoked = true;
        cancelTimeoutDebounder = timeoutDebouncer(() => (leadingInvoked = undefined));
      } else {
        cancelTimeoutDebounder = timeoutDebouncer(boundInvoke);

        if (maxDelayDebouncer && !cancelMaxTimeoutDebouncer) {
          cancelMaxTimeoutDebouncer = maxDelayDebouncer(flush);
        }
      }

      prevArguments = invokedArgs;
    } else {
      invokeFunctionToDebounce(args);
    }
  };
  debouncedFn._flush = flush;

  return debouncedFn as Debounced<FunctionToDebounce>;
};
