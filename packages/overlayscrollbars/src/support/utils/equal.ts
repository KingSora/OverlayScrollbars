import { each } from '~/support/utils/array';
import type { WH, XY, TRBL } from '~/support/dom';
import type { PlainObject } from '~/typings';

/**
 * Compares two objects and returns true if all values of the passed prop names are identical, false otherwise or if one of the two object is falsy.
 * @param a Object a.
 * @param b Object b.
 * @param props The props which shall be compared.
 */
export const equal = <T extends PlainObject>(
  a: T | undefined,
  b: T | undefined,
  props: Array<keyof T>,
  propMutation?: ((value: any) => any) | null | false
): boolean => {
  if (a && b) {
    let result = true;
    each(props, (prop) => {
      const compareA = propMutation ? propMutation(a[prop]) : a[prop];
      const compareB = propMutation ? propMutation(b[prop]) : b[prop];
      if (compareA !== compareB) {
        result = false;
      }
    });
    return result;
  }
  return false;
};

/**
 * Compares object a with object b and returns true if both have the same property values, false otherwise.
 * Also returns false if one of the objects is undefined or null.
 * @param a Object a.
 * @param b Object b.
 */
export const equalWH = <T>(a?: WH<T>, b?: WH<T>) => equal<WH<T>>(a, b, ['w', 'h']);

/**
 * Compares object a with object b and returns true if both have the same property values, false otherwise.
 * Also returns false if one of the objects is undefined or null.
 * @param a Object a.
 * @param b Object b.
 */
export const equalXY = <T>(a?: XY<T>, b?: XY<T>) => equal<XY<T>>(a, b, ['x', 'y']);

/**
 * Compares object a with object b and returns true if both have the same property values, false otherwise.
 * Also returns false if one of the objects is undefined or null.
 * @param a Object a.
 * @param b Object b.
 */
export const equalTRBL = (a?: TRBL, b?: TRBL) => equal<TRBL>(a, b, ['t', 'r', 'b', 'l']);

/**
 * Compares two DOM Rects for their equality of their width and height properties
 * Also returns false if one of the DOM Rects is undefined or null.
 * @param a DOM Rect a.
 * @param b DOM Rect b.
 * @param round Whether the values should be rounded.
 */
export const equalBCRWH = (a?: DOMRect, b?: DOMRect, round?: boolean) =>
  equal<DOMRect>(a, b, ['width', 'height'], round && ((value) => Math.round(value)));
