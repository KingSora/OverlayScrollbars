import { isArrayLike, isString } from '~/support/utils/types';
import type { PlainObject } from '~/typings';

type RunEachItem = ((...args: any) => any | any[]) | null | undefined;

/**
 * Iterates through a array or object
 * @param arrayLikeOrObject The array or object through which shall be iterated.
 * @param callback The function which is responsible for the iteration.
 * If the function returns true its treated like a "continue" statement.
 * If the function returns false its treated like a "break" statement.
 */
export function each<T>(
  array: Array<T> | ReadonlyArray<T>,
  callback: (value: T, indexOrKey: number, source: Array<T>) => boolean | unknown
): Array<T> | ReadonlyArray<T>;
export function each<T>(
  array: Array<T> | ReadonlyArray<T> | false | null | undefined,
  callback: (value: T, indexOrKey: number, source: Array<T>) => boolean | unknown
): Array<T> | ReadonlyArray<T> | false | null | undefined;
export function each<T>(
  arrayLikeObject: ArrayLike<T>,
  callback: (value: T, indexOrKey: number, source: ArrayLike<T>) => boolean | unknown
): ArrayLike<T>;
export function each<T>(
  arrayLikeObject: ArrayLike<T> | false | null | undefined,
  callback: (value: T, indexOrKey: number, source: ArrayLike<T>) => boolean | unknown
): ArrayLike<T> | false | null | undefined;
export function each(
  obj: PlainObject,
  callback: (value: any, indexOrKey: string, source: PlainObject) => boolean | unknown
): PlainObject;
export function each(
  obj: PlainObject | false | null | undefined,
  callback: (value: any, indexOrKey: string, source: PlainObject) => boolean | unknown
): PlainObject | false | null | undefined;
export function each<T>(
  source: Array<T> | ArrayLike<T> | ReadonlyArray<T> | PlainObject | false | null | undefined,
  callback: (value: T, indexOrKey: any, source: any) => boolean | unknown
): Array<T> | ArrayLike<T> | ReadonlyArray<T> | PlainObject | false | null | undefined {
  if (isArrayLike(source)) {
    for (let i = 0; i < source.length; i++) {
      if (callback(source[i], i, source) === false) {
        break;
      }
    }
  } else if (source) {
    // cant use support func keys here due to circular dep
    each(Object.keys(source), (key) => callback(source[key], key, source));
  }
  return source;
}

/**
 * Returns the index of the given inside the given array or -1 if the given item isn't part of the given array.
 * @param arr The array.
 * @param item The item.
 * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at index 0.
 */
export const indexOf = <T = any>(arr: T[], item: T, fromIndex?: number): number =>
  arr.indexOf(item, fromIndex);

/**
 * Pushesh all given items into the given array and returns it.
 * @param array The array the items shall be pushed into.
 * @param items The items which shall be pushed into the array.
 */
export const push = <T>(array: T[], items: T | ArrayLike<T>, arrayIsSingleItem?: boolean): T[] => {
  !arrayIsSingleItem && !isString(items) && isArrayLike(items)
    ? Array.prototype.push.apply(array, items as T[])
    : array.push(items as T);
  return array;
};

/**
 * Creates a shallow-copied Array instance from an array-like or iterable object.
 * @param arr The object from which the array instance shall be created.
 */
export const from = <T = any>(arr?: ArrayLike<T> | Set<T>) => {
  const original = Array.from;
  const result: T[] = [];

  if (original && arr) {
    return original(arr);
  }

  if (arr instanceof Set) {
    arr.forEach((value) => {
      push(result, value);
    });
  } else {
    each(arr, (elm) => {
      push(result, elm);
    });
  }

  return result;
};

/**
 * Check whether the passed array is empty.
 * @param array The array which shall be checked.
 */
export const isEmptyArray = (array: any[] | null | undefined): boolean =>
  !!array && array.length === 0;

/**
 * Calls all functions in the passed array/set of functions.
 * @param arr The array filled with function which shall be called.
 * @param args The args with which each function is called.
 * @param keep True when the Set / array should not be cleared afterwards, false otherwise.
 */
export const runEachAndClear = (arr: RunEachItem[], args?: any[], keep?: boolean): void => {
  // eslint-disable-next-line prefer-spread
  const runFn = (fn: RunEachItem) => fn && fn.apply(undefined, args || []);
  each(arr, runFn);
  !keep && ((arr as any[]).length = 0);
};
