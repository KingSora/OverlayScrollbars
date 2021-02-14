import { PlainObject } from 'typings';
export declare function isUndefined(obj: any): obj is undefined;
export declare function isNull(obj: any): obj is null;
export declare const type: (obj: any) => string;
export declare function isNumber(obj: any): obj is number;
export declare function isString(obj: any): obj is string;
export declare function isBoolean(obj: any): obj is boolean;
export declare function isFunction(obj: any): obj is (...args: Array<unknown>) => unknown;
export declare function isArray(obj: any): obj is Array<any>;
export declare function isObject(obj: any): boolean;
/**
 * Returns true if the given object is array like, false otherwise.
 * @param obj The Object
 */
export declare function isArrayLike<T extends PlainObject = any>(obj: any): obj is ArrayLike<T>;
/**
 * Returns true if the given object is a "plain" (e.g. { key: value }) object, false otherwise.
 * @param obj The Object.
 */
export declare function isPlainObject<T = any>(obj: any): obj is PlainObject<T>;
/**
 * Checks whether the given object is a HTMLElement.
 * @param obj The object which shall be checked.
 */
export declare function isHTMLElement(obj: any): obj is HTMLElement;
/**
 * Checks whether the given object is a Element.
 * @param obj The object which shall be checked.
 */
export declare function isElement(obj: any): obj is Element;
