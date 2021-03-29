import { isArrayLike, isString } from 'support/utils/types';
import { PlainObject } from 'typings';

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
  callback: (value: T, indexOrKey: number, source: Array<T>) => boolean | void
): Array<T> | ReadonlyArray<T>;
export function each<T>(
  array: Array<T> | ReadonlyArray<T> | null | undefined,
  callback: (value: T, indexOrKey: number, source: Array<T>) => boolean | void
): Array<T> | ReadonlyArray<T> | null | undefined;
export function each<T>(
  arrayLikeObject: ArrayLike<T>,
  callback: (value: T, indexOrKey: number, source: ArrayLike<T>) => boolean | void
): ArrayLike<T>;
export function each<T>(
  arrayLikeObject: ArrayLike<T> | null | undefined,
  callback: (value: T, indexOrKey: number, source: ArrayLike<T>) => boolean | void
): ArrayLike<T> | null | undefined;
export function each(obj: PlainObject, callback: (value: any, indexOrKey: string, source: PlainObject) => boolean | void): PlainObject;
export function each(
  obj: PlainObject | null | undefined,
  callback: (value: any, indexOrKey: string, source: PlainObject) => boolean | void
): PlainObject | null | undefined;
export function each<T>(
  source: ArrayLike<T> | PlainObject | null | undefined,
  callback: (value: T, indexOrKey: any, source: any) => boolean | void
): Array<T> | ReadonlyArray<T> | ArrayLike<T> | PlainObject | null | undefined {
  if (isArrayLike(source)) {
    for (let i = 0; i < source.length; i++) {
      if (callback(source[i], i, source) === false) {
        break;
      }
    }
  } else if (source) {
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
export const indexOf = <T = any>(arr: Array<T>, item: T, fromIndex?: number): number => arr.indexOf(item, fromIndex);

/**
 * Pushesh all given items into the given array and returns it.
 * @param array The array the items shall be pushed into.
 * @param items The items which shall be pushed into the array.
 */
export const push = <T>(array: Array<T>, items: T | ArrayLike<T>, arrayIsSingleItem?: boolean): Array<T> => {
  !arrayIsSingleItem && !isString(items) && isArrayLike(items) ? Array.prototype.push.apply(array, items as Array<T>) : array.push(items as T);
  return array;
};

/**
 * Creates a shallow-copied Array instance from an array-like or iterable object.
 * @param arr The object from which the array instance shall be created.
 */
export const from = <T = any>(arr: ArrayLike<T>) => {
  if (Array.from) {
    return Array.from(arr);
  }
  const result: Array<T> = [];

  each(arr, (elm) => {
    push(result, elm);
  });

  return result;
};

/**
 * Check whether the passed array is empty.
 * @param array The array which shall be checked.
 */
export const isEmptyArray = (array: Array<any> | null | undefined) => array && array.length === 0;

/**
 * Calls all functions in the passed array/set of functions.
 * @param arr The array filled with function which shall be called.
 * @param p1 The first param.
 */
export const runEach = (arr: ArrayLike<RunEachItem> | Set<RunEachItem>, p1?: unknown): void => {
  const runFn = (fn: RunEachItem) => fn && fn(p1);
  if (arr instanceof Set) {
    arr.forEach(runFn);
  } else {
    each(arr, runFn);
  }
};