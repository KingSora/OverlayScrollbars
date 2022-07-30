declare type PlainObject = Record<string, any>;
declare type RunEachItem = ((...args: any) => any | any[]) | null | undefined;
/**
 * Iterates through a array or object
 * @param arrayLikeOrObject The array or object through which shall be iterated.
 * @param callback The function which is responsible for the iteration.
 * If the function returns true its treated like a "continue" statement.
 * If the function returns false its treated like a "break" statement.
 */
export declare function each<T>(array: Array<T> | ReadonlyArray<T>, callback: (value: T, indexOrKey: number, source: Array<T>) => boolean | unknown): Array<T> | ReadonlyArray<T>;
export declare function each<T>(array: Array<T> | ReadonlyArray<T> | false | null | undefined, callback: (value: T, indexOrKey: number, source: Array<T>) => boolean | unknown): Array<T> | ReadonlyArray<T> | false | null | undefined;
export declare function each<T>(arrayLikeObject: ArrayLike<T>, callback: (value: T, indexOrKey: number, source: ArrayLike<T>) => boolean | unknown): ArrayLike<T>;
export declare function each<T>(arrayLikeObject: ArrayLike<T> | false | null | undefined, callback: (value: T, indexOrKey: number, source: ArrayLike<T>) => boolean | unknown): ArrayLike<T> | false | null | undefined;
export declare function each(obj: PlainObject, callback: (value: any, indexOrKey: string, source: PlainObject) => boolean | unknown): PlainObject;
export declare function each(obj: PlainObject | false | null | undefined, callback: (value: any, indexOrKey: string, source: PlainObject) => boolean | unknown): PlainObject | false | null | undefined;
/**
 * Returns the index of the given inside the given array or -1 if the given item isn't part of the given array.
 * @param arr The array.
 * @param item The item.
 * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at index 0.
 */
export declare const indexOf: <T = any>(arr: T[], item: T, fromIndex?: number) => number;
/**
 * Pushesh all given items into the given array and returns it.
 * @param array The array the items shall be pushed into.
 * @param items The items which shall be pushed into the array.
 */
export declare const push: <T>(array: T[], items: T | ArrayLike<T>, arrayIsSingleItem?: boolean) => T[];
/**
 * Creates a shallow-copied Array instance from an array-like or iterable object.
 * @param arr The object from which the array instance shall be created.
 */
export declare const from: <T = any>(arr?: ArrayLike<T> | Set<T> | undefined) => T[];
/**
 * Check whether the passed array is empty.
 * @param array The array which shall be checked.
 */
export declare const isEmptyArray: (array: any[] | null | undefined) => boolean;
/**
 * Calls all functions in the passed array/set of functions.
 * @param arr The array filled with function which shall be called.
 * @param args The args with which each function is called.
 * @param keep True when the Set / array should not be cleared afterwards, false otherwise.
 */
export declare const runEachAndClear: (arr: RunEachItem[], args?: any[], keep?: boolean) => void;
export {};
