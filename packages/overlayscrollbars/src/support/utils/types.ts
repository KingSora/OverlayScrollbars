import { PlainObject } from 'typings';
import { hasOwnProperty } from 'support/utils/object';

const ElementNodeType = Node.ELEMENT_NODE;

export const type: (obj: any) => string = (obj) => {
  if (obj === undefined) return `${obj}`;
  if (obj === null) return `${obj}`;
  return Object.prototype.toString
    .call(obj)
    .replace(/^\[object (.+)\]$/, '$1')
    .toLowerCase();
};

export function isNumber(obj: any): obj is number {
  return typeof obj === 'number';
}

export function isString(obj: any): obj is string {
  return typeof obj === 'string';
}

export function isBoolean(obj: any): obj is boolean {
  return typeof obj === 'boolean';
}

export function isFunction(obj: any): obj is (...args: Array<unknown>) => unknown {
  return typeof obj === 'function';
}

export function isUndefined(obj: any): obj is undefined {
  return obj === undefined;
}

export function isNull(obj: any): obj is null {
  return obj === null;
}

export function isArray(obj: any): obj is Array<any> {
  return Array.isArray(obj);
}

export function isObject(obj: any): boolean {
  return typeof obj === 'object' && !isArray(obj) && !isNull(obj);
}

/**
 * Returns true if the given object is array like, false otherwise.
 * @param obj The Object
 */
export function isArrayLike<T extends PlainObject = any>(obj: any): obj is ArrayLike<T> {
  const length = !!obj && obj.length;
  const lengthCorrectFormat = isNumber(length) && length > -1 && length % 1 == 0; // eslint-disable-line eqeqeq

  return isArray(obj) || (!isFunction(obj) && lengthCorrectFormat) ? (length > 0 && isObject(obj) ? length - 1 in obj : true) : false;
}

/**
 * Returns true if the given object is a "plain" (e.g. { key: value }) object, false otherwise.
 * @param obj The Object.
 */
export function isPlainObject<T = any>(obj: any): obj is PlainObject<T> {
  if (!obj || !isObject(obj) || type(obj) !== 'object') return false;

  let key;
  const cstr = 'constructor';
  const ctor = obj[cstr];
  const ctorProto = ctor && ctor.prototype;
  const hasOwnConstructor = hasOwnProperty(obj, cstr);
  const hasIsPrototypeOf = ctorProto && hasOwnProperty(ctorProto, 'isPrototypeOf');

  if (ctor && !hasOwnConstructor && !hasIsPrototypeOf) {
    return false;
  }

  /* eslint-disable no-restricted-syntax */
  for (key in obj) {
    /**/
  }
  /* eslint-enable */

  return isUndefined(key) || hasOwnProperty(obj, key);
}

/**
 * Checks whether the given object is a HTMLElement.
 * @param obj The object which shall be checked.
 */
export function isHTMLElement(obj: any): obj is HTMLElement {
  const instanceofObj = window.HTMLElement;
  return obj ? (instanceofObj ? obj instanceof instanceofObj : obj.nodeType === ElementNodeType) : false;
}

/**
 * Checks whether the given object is a Element.
 * @param obj The object which shall be checked.
 */
export function isElement(obj: any): obj is Element {
  const instanceofObj = window.Element;
  return obj ? (instanceofObj ? obj instanceof instanceofObj : obj.nodeType === ElementNodeType) : false;
}
