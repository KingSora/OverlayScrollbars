import { isNumber, isFunction } from 'support/utils/types';
import { from } from 'support/utils/array';
import { rAF, cAF } from 'support/compatibility/apis';

const clearTimeouts = (id: number | undefined) => {
  id && window.clearTimeout(id);
  id && cAF!(id);
};

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

export const noop = () => {}; // eslint-disable-line

/**
 * Debounces the given function either with a timeout or a animation frame.
 * @param functionToDebounce The function which shall be debounced.
 * @param options Options for debouncing.
 */
export const debounce = <FunctionToDebounce extends (...args: any) => any>(
  functionToDebounce: FunctionToDebounce,
  options?: DebounceOptions<FunctionToDebounce>
): Debounced<FunctionToDebounce> => {
  let timeoutId: number | undefined;
  let maxTimeoutId: number | undefined;
  let prevArguments: Parameters<FunctionToDebounce> | null | undefined;
  let latestArguments: Parameters<FunctionToDebounce> | null | undefined;
  const { _timeout, _maxDelay, _mergeParams } = options || {};
  const setT = window.setTimeout;

  const invokeFunctionToDebounce = function (args: IArguments) {
    clearTimeouts(timeoutId);
    clearTimeouts(maxTimeoutId);
    maxTimeoutId = timeoutId = prevArguments = undefined;
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
    if (timeoutId) {
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
      const mergeParamsResult = mergeParms(args);
      const invokedArgs = mergeParamsResult || args;
      const boundInvoke = invokeFunctionToDebounce.bind(0, invokedArgs);

      // if (!mergeParamsResult) {
      //   invokeFunctionToDebounce(prevArguments || args);
      // }

      clearTimeouts(timeoutId);
      timeoutId = setTimeoutFn(boundInvoke, finalTimeout as number) as number;

      if (hasMaxWait && !maxTimeoutId) {
        maxTimeoutId = setT(flush, finalMaxWait as number);
      }

      prevArguments = latestArguments = invokedArgs;
    } else {
      invokeFunctionToDebounce(args);
    }
  };
  debouncedFn._flush = flush;

  return debouncedFn as Debounced<FunctionToDebounce>;
};
