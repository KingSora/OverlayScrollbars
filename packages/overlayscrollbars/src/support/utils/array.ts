import { isArrayLike } from 'support/utils/types';
import { PlainObject } from 'typings';

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
  array: Array<T> | ReadonlyArray<T> | null,
  callback: (value: T, indexOrKey: number, source: Array<T>) => boolean | void
): Array<T> | ReadonlyArray<T> | null;
export function each<T>(
  arrayLikeObject: ArrayLike<T>,
  callback: (value: T, indexOrKey: number, source: ArrayLike<T>) => boolean | void
): ArrayLike<T>;
export function each<T>(
  arrayLikeObject: ArrayLike<T> | null,
  callback: (value: T, indexOrKey: number, source: ArrayLike<T>) => boolean | void
): ArrayLike<T> | null;
export function each(obj: PlainObject, callback: (value: any, indexOrKey: string, source: PlainObject) => boolean | void): PlainObject;
export function each(obj: PlainObject | null, callback: (value: any, indexOrKey: string, source: PlainObject) => boolean | void): PlainObject | null;
export function each<T>(
  source: ArrayLike<T> | PlainObject | null,
  callback: (value: T | any, indexOrKey: any, source: any) => boolean | void
): Array<T> | ReadonlyArray<T> | ArrayLike<T> | PlainObject | null {
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
 * Creates a shallow-copied Array instance from an array-like or iterable object.
 * @param arr The object from which the array instance shall be created.
 */
export const from = <T = any>(arr: ArrayLike<T>) => {
  if (Array.from) {
    return Array.from(arr);
  }
  const result: Array<T> = [];
  each(arr, (elm) => {
    result.push(elm);
  });
  return result;
};
