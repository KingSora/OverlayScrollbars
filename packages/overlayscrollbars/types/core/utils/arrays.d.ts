import { PlainObject } from 'core/typings';
export declare function each<T>(array: Array<T> | ReadonlyArray<T>, callback: (value: T, indexOrKey: number, source: Array<T>) => boolean | void): Array<T> | ReadonlyArray<T>;
export declare function each<T>(array: Array<T> | ReadonlyArray<T> | null, callback: (value: T, indexOrKey: number, source: Array<T>) => boolean | void): Array<T> | ReadonlyArray<T> | null;
export declare function each<T>(arrayLikeObject: ArrayLike<T>, callback: (value: T, indexOrKey: number, source: ArrayLike<T>) => boolean | void): ArrayLike<T>;
export declare function each<T>(arrayLikeObject: ArrayLike<T> | null, callback: (value: T, indexOrKey: number, source: ArrayLike<T>) => boolean | void): ArrayLike<T> | null;
export declare function each(obj: PlainObject, callback: (value: any, indexOrKey: string, source: PlainObject) => boolean | void): PlainObject;
export declare function each(obj: PlainObject | null, callback: (value: any, indexOrKey: string, source: PlainObject) => boolean | void): PlainObject | null;
export declare const indexOf: <T = any>(arr: Array<T>, item: T, fromIndex?: number) => number;
