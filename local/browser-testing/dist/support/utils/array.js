import { isArrayLike, isString } from './types';
export function each(source, callback) {
    if (isArrayLike(source)) {
        for (let i = 0; i < source.length; i++) {
            if (callback(source[i], i, source) === false) {
                break;
            }
        }
    }
    else if (source) {
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
export const indexOf = (arr, item, fromIndex) => arr.indexOf(item, fromIndex);
/**
 * Pushesh all given items into the given array and returns it.
 * @param array The array the items shall be pushed into.
 * @param items The items which shall be pushed into the array.
 */
export const push = (array, items, arrayIsSingleItem) => {
    !arrayIsSingleItem && !isString(items) && isArrayLike(items)
        ? Array.prototype.push.apply(array, items)
        : array.push(items);
    return array;
};
/**
 * Creates a shallow-copied Array instance from an array-like or iterable object.
 * @param arr The object from which the array instance shall be created.
 */
export const from = (arr) => {
    const original = Array.from;
    const result = [];
    if (original && arr) {
        return original(arr);
    }
    if (arr instanceof Set) {
        arr.forEach((value) => {
            push(result, value);
        });
    }
    else {
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
export const isEmptyArray = (array) => !!array && array.length === 0;
/**
 * Calls all functions in the passed array/set of functions.
 * @param arr The array filled with function which shall be called.
 * @param args The args with which each function is called.
 * @param keep True when the Set / array should not be cleared afterwards, false otherwise.
 */
export const runEachAndClear = (arr, args, keep) => {
    // eslint-disable-next-line prefer-spread
    const runFn = (fn) => fn && fn.apply(undefined, args || []);
    each(arr, runFn);
    !keep && (arr.length = 0);
};
//# sourceMappingURL=array.js.map