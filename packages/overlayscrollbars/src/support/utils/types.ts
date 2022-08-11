import { PlainObject } from 'typings';

const ElementNodeType = Node.ELEMENT_NODE;
const { toString, hasOwnProperty } = Object.prototype;

export const isUndefined = (obj: any): obj is undefined => obj === undefined;

export const isNull = (obj: any): obj is null => obj === null;

export const type = (obj: any): string =>
  isUndefined(obj) || isNull(obj)
    ? `${obj}`
    : toString
        .call(obj)
        .replace(/^\[object (.+)\]$/, '$1')
        .toLowerCase();

export const isNumber = (obj: any): obj is number => typeof obj === 'number';

export const isString = (obj: any): obj is string => typeof obj === 'string';

export const isBoolean = (obj: any): obj is boolean => typeof obj === 'boolean';

export const isFunction = (obj: any): obj is (...args: any[]) => any => typeof obj === 'function';

export const isArray = <T = any>(obj: any): obj is Array<T> => Array.isArray(obj);

export const isObject = (obj: any): boolean =>
  typeof obj === 'object' && !isArray(obj) && !isNull(obj);

/**
 * Returns true if the given object is array like, false otherwise.
 * @param obj The Object
 */
export const isArrayLike = <T extends PlainObject = any>(obj: any): obj is ArrayLike<T> => {
  const length = !!obj && obj.length;
  const lengthCorrectFormat = isNumber(length) && length > -1 && length % 1 == 0; // eslint-disable-line eqeqeq

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
export const isPlainObject = <T = any>(obj: any): obj is PlainObject<T> => {
  if (!obj || !isObject(obj) || type(obj) !== 'object') return false;

  let key;
  const cstr = 'constructor';
  const ctor = obj[cstr];
  const ctorProto = ctor && ctor.prototype;
  const hasOwnConstructor = hasOwnProperty.call(obj, cstr);
  const hasIsPrototypeOf = ctorProto && hasOwnProperty.call(ctorProto, 'isPrototypeOf');

  if (ctor && !hasOwnConstructor && !hasIsPrototypeOf) {
    return false;
  }

  /* eslint-disable no-restricted-syntax */
  for (key in obj) {
    /**/
  }
  /* eslint-enable */

  return isUndefined(key) || hasOwnProperty.call(obj, key);
};

/**
 * Checks whether the given object is a HTMLElement.
 * @param obj The object which shall be checked.
 */
export const isHTMLElement = (obj: any): obj is HTMLElement => {
  const instanceofObj = HTMLElement;
  return obj
    ? instanceofObj
      ? obj instanceof instanceofObj
      : obj.nodeType === ElementNodeType
    : false;
};

/**
 * Checks whether the given object is a Element.
 * @param obj The object which shall be checked.
 */
export const isElement = (obj: any): obj is Element => {
  const instanceofObj = Element;
  return obj
    ? instanceofObj
      ? obj instanceof instanceofObj
      : obj.nodeType === ElementNodeType
    : false;
};
