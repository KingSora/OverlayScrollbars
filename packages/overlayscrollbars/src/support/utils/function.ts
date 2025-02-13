/* eslint-disable @typescript-eslint/no-explicit-any */
import { isNumber, isFunction } from './types';
import { from } from './array';
import { rAF, cAF, setT, clearT } from './alias';
import { noop } from './noop';

type DebounceTiming = number | false | null | undefined;

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

/**
 * Debounces the given function either with a timeout or a animation frame.
 * @param functionToDebounce The function which shall be debounced.
 * @param options Options for debouncing.
 */
export const debounce = <FunctionToDebounce extends (...args: any) => any>(
  functionToDebounce: FunctionToDebounce,
  options?: DebounceOptions<FunctionToDebounce>
): Debounced<FunctionToDebounce> => {
  const { _timeout, _maxDelay, _leading, _mergeParams } = options || {};
  let maxTimeoutId: number | undefined;
  let prevArguments: Parameters<FunctionToDebounce> | null | undefined;
  let latestArguments: Parameters<FunctionToDebounce> | null | undefined;
  let leadingInvoked: boolean | undefined;
  let clear = noop;

  const invokeFunctionToDebounce = function (args: Parameters<FunctionToDebounce>) {
    clear();
    clearT(maxTimeoutId);
    leadingInvoked = maxTimeoutId = prevArguments = undefined;
    clear = noop;
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
    if (clear !== noop) {
      invokeFunctionToDebounce(mergeParms(latestArguments!) || latestArguments!);
    }
  };

  const debouncedFn = function () {
    // eslint-disable-next-line prefer-rest-params
    const args: Parameters<FunctionToDebounce> = from(arguments) as Parameters<FunctionToDebounce>;
    const finalTimeout = isFunction(_timeout) ? _timeout() : _timeout;
    const hasTimeout = isNumber(finalTimeout) && finalTimeout >= 0;

    if (hasTimeout) {
      const finalMaxWait = isFunction(_maxDelay) ? _maxDelay() : _maxDelay;
      const hasMaxWait = isNumber(finalMaxWait) && finalMaxWait >= 0;
      const setTimeoutFn = finalTimeout > 0 ? setT : rAF!;
      const clearTimeoutFn = finalTimeout > 0 ? clearT : cAF!;
      const mergeParamsResult = mergeParms(args);
      const invokedArgs = mergeParamsResult || args;
      const boundInvoke = invokeFunctionToDebounce.bind(0, invokedArgs);
      let timeoutId: number | undefined;

      // if (!mergeParamsResult) {
      //   invokeFunctionToDebounce(prevArguments || args);
      // }

      clear();
      if (_leading && !leadingInvoked) {
        boundInvoke();
        leadingInvoked = true;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        timeoutId = setTimeoutFn(() => (leadingInvoked = undefined), finalTimeout);
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        timeoutId = setTimeoutFn(boundInvoke, finalTimeout);

        if (hasMaxWait && !maxTimeoutId) {
          maxTimeoutId = setT(flush, finalMaxWait as number);
        }
      }

      clear = () => clearTimeoutFn(timeoutId as number);

      prevArguments = latestArguments = invokedArgs;
    } else {
      invokeFunctionToDebounce(args);
    }
  };
  debouncedFn._flush = flush;

  return debouncedFn as Debounced<FunctionToDebounce>;
};
