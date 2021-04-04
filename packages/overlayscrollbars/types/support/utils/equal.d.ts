import { WH, XY, TRBL } from 'support/dom';
import { PlainObject } from 'typings';
/**
 * Compares two objects and returns true if all values of the passed prop names are identical, false otherwise or if one of the two object is falsy.
 * @param a Object a.
 * @param b Object b.
 * @param props The props which shall be compared.
 */
export declare const equal: <T extends PlainObject<any>>(a: T | undefined, b: T | undefined, props: (keyof T)[], propMutation?: false | ((value: any) => any) | null | undefined) => boolean;
/**
 * Compares object a with object b and returns true if both have the same property values, false otherwise.
 * Also returns false if one of the objects is undefined or null.
 * @param a Object a.
 * @param b Object b.
 */
export declare const equalWH: (a?: WH<number> | undefined, b?: WH<number> | undefined) => boolean;
/**
 * Compares object a with object b and returns true if both have the same property values, false otherwise.
 * Also returns false if one of the objects is undefined or null.
 * @param a Object a.
 * @param b Object b.
 */
export declare const equalXY: (a?: XY<number> | undefined, b?: XY<number> | undefined) => boolean;
/**
 * Compares object a with object b and returns true if both have the same property values, false otherwise.
 * Also returns false if one of the objects is undefined or null.
 * @param a Object a.
 * @param b Object b.
 */
export declare const equalTRBL: (a?: TRBL | undefined, b?: TRBL | undefined) => boolean;
/**
 * Compares two DOM Rects for their equality of their width and height properties
 * Also returns false if one of the DOM Rects is undefined or null.
 * @param a DOM Rect a.
 * @param b DOM Rect b.
 * @param round Whether the values should be rounded.
 */
export declare const equalBCRWH: (a?: DOMRect | undefined, b?: DOMRect | undefined, round?: boolean | undefined) => boolean;
