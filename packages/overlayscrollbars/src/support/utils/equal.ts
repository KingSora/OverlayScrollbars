import { each } from 'support/utils/array';
import { WH, XY, TRBL } from 'support/dom';
import { PlainObject } from 'typings';

/**
 * Compares two objects and returns true if all values of the passed prop names are identical, false otherwise or if one of the two object is falsy.
 * @param a Object a.
 * @param b Object b.
 * @param props The props which shall be compared.
 */
export const equal = <T extends PlainObject>(a: T | undefined, b: T | undefined, props: Array<keyof T>): boolean => {
  if (a && b) {
    let result = true;
    each(props, (prop) => {
      if (a[prop] !== b[prop]) {
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
export const equalWH = (a?: WH, b?: WH) => equal<WH>(a, b, ['w', 'h']);

/**
 * Compares object a with object b and returns true if both have the same property values, false otherwise.
 * Also returns false if one of the objects is undefined or null.
 * @param a Object a.
 * @param b Object b.
 */
export const equalXY = (a?: XY, b?: XY) => equal<XY>(a, b, ['x', 'y']);

/**
 * Compares object a with object b and returns true if both have the same property values, false otherwise.
 * Also returns false if one of the objects is undefined or null.
 * @param a Object a.
 * @param b Object b.
 */
export const equalTRBL = (a?: TRBL, b?: TRBL) => equal<TRBL>(a, b, ['t', 'r', 'b', 'l']);
