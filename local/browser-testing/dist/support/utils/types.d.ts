declare type PlainObject<T = any> = Record<string, T>;
export declare const isUndefined: (obj: any) => obj is undefined;
export declare const isNull: (obj: any) => obj is null;
export declare const type: (obj: any) => string;
export declare const isNumber: (obj: any) => obj is number;
export declare const isString: (obj: any) => obj is string;
export declare const isBoolean: (obj: any) => obj is boolean;
export declare const isFunction: (obj: any) => obj is (...args: any[]) => any;
export declare const isArray: <T = any>(obj: any) => obj is T[];
export declare const isObject: (obj: any) => boolean;
/**
 * Returns true if the given object is array like, false otherwise.
 * @param obj The Object
 */
export declare const isArrayLike: <T extends PlainObject<any> = any>(obj: any) => obj is ArrayLike<T>;
/**
 * Returns true if the given object is a "plain" (e.g. { key: value }) object, false otherwise.
 * @param obj The Object.
 */
export declare const isPlainObject: <T = any>(obj: any) => obj is PlainObject<T>;
/**
 * Checks whether the given object is a HTMLElement.
 * @param obj The object which shall be checked.
 */
export declare const isHTMLElement: (obj: any) => obj is HTMLElement;
/**
 * Checks whether the given object is a Element.
 * @param obj The object which shall be checked.
 */
export declare const isElement: (obj: any) => obj is Element;
export {};
