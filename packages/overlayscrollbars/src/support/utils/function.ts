import { isNumber } from 'support/utils/types';
import { cAF, rAF } from 'support/compatibility/apis';

/**
 * Debounces the given function either with a timeout or a animation frame.
 * @param functionToDebounce The function which shall be debounced.
 * @param timeout The timeout for debouncing. If 0 or lower animation frame is used for debouncing, a timeout otherwise.
 * @param maxWait A maximum amount of ms. before the function will be called even with debounce.
 */
export const debounce = (functionToDebounce: (...args: any) => any, timeout?: number, maxWait?: number) => {
  let timeoutId: number | void;
  let lastCallTime: number;
  const hasTimeout = isNumber(timeout) && timeout > 0;
  const hasMaxWait = isNumber(maxWait) && maxWait > 0;
  const cancel = hasTimeout ? window.clearTimeout : cAF!;
  const set = hasTimeout ? window.setTimeout : rAF!;
  const setFn = function (args: IArguments) {
    lastCallTime = hasMaxWait ? performance.now() : 0;
    timeoutId && cancel(timeoutId);
    // eslint-disable-next-line
    // @ts-ignore
    functionToDebounce.apply(this, args);
  };

  return function () {
    // eslint-disable-next-line
    // @ts-ignore
    const boundSetFn = setFn.bind(this, arguments); // eslint-disable-line
    const forceCall = hasMaxWait ? performance.now() - lastCallTime >= maxWait! : false;

    timeoutId && cancel(timeoutId);
    timeoutId = forceCall ? boundSetFn() : (set(boundSetFn, timeout!) as number);
  };
};
