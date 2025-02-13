/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PlainObject } from '../../typings';

export const isUndefined = (obj: any): obj is undefined => obj === undefined;

export const isNull = (obj: any): obj is null => obj === null;

export const type = (obj: any): string =>
  isUndefined(obj) || isNull(obj)
    ? `${obj}`
    : Object.prototype.toString
        .call(obj)
        .replace(/^\[object (.+)\]$/, '$1')
        .toLowerCase();

export const isNumber = (obj: any): obj is number => typeof obj === 'number';

export const isString = (obj: any): obj is string => typeof obj === 'string';

export const isBoolean = (obj: any): obj is boolean => typeof obj === 'boolean';

export const isFunction = (obj: any): obj is (...args: any[]) => any => typeof obj === 'function';

export const isArray = <T = any>(obj: any): obj is Array<T> => Array.isArray(obj);

export const isObject = (obj: any): obj is object =>
  typeof obj === 'object' && !isArray(obj) && !isNull(obj);

/**
 * Returns true if the given object is array like, false otherwise.
 * @param obj The Object
 */
export const isArrayLike = <T extends PlainObject = any>(obj: any): obj is ArrayLike<T> => {
  const length = !!obj && obj.length;
  const lengthCorrectFormat = isNumber(length) && length > -1 && length % 1 == 0;

  return isArray(obj) || (!isFunction(obj) && lengthCorrectFormat)
    ? length > 0 && isObject(obj)
      ? length - 1 in obj
      : true
    : false;
};

/**
 * Returns true if the given object is a "plain" (e.g. { key: value }) object, false otherwise.
 * @param obj The Object.
 */
export const isPlainObject = <T = any>(obj: any): obj is PlainObject<T> =>
  !!obj && obj.constructor === Object;

/**
 * Checks whether the given object is a HTMLElement.
 * @param obj The object which shall be checked.
 */
export const isHTMLElement = (obj: any): obj is HTMLElement => obj instanceof HTMLElement;

/**
 * Checks whether the given object is a Element.
 * @param obj The object which shall be checked.
 */
export const isElement = (obj: any): obj is Element => obj instanceof Element;
