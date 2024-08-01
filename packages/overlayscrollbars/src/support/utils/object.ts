import type { PlainObject } from '../../typings';
import { isArray, isFunction, isPlainObject, isNull } from './types';
import { each } from './array';

/**
 * Determines whether the passed object has a property with the passed name.
 * @param obj The object.
 * @param prop The name of the property.
 */
export const hasOwnProperty = (obj: any, prop: string | number | symbol): boolean =>
  Object.prototype.hasOwnProperty.call(obj, prop);

/**
 * Returns the names of the enumerable string properties and methods of an object.
 * @param obj The object of which the properties shall be returned.
 */
export const keys = (obj: any): Array<string> => (obj ? Object.keys(obj) : []);

type AssignDeep = {
  <T, U>(target: T, object1: U): T & U;
  <T, U, V>(target: T, object1: U, object2: V): T & U & V;
  <T, U, V, W>(target: T, object1: U, object2: V, object3: W): T & U & V & W;
  <T, U, V, W, X>(target: T, object1: U, object2: V, object3: W, object4: X): T & U & V & W & X;
  <T, U, V, W, X, Y>(
    target: T,
    object1: U,
    object2: V,
    object3: W,
    object4: X,
    object5: Y
  ): T & U & V & W & X & Y;
  <T, U, V, W, X, Y, Z>(
    target: T,
    object1?: U,
    object2?: V,
    object3?: W,
    object4?: X,
    object5?: Y,
    object6?: Z
  ): T & U & V & W & X & Y & Z;
};

// https://github.com/jquery/jquery/blob/master/src/core.js#L116
export const assignDeep: AssignDeep = <T, U, V, W, X, Y, Z>(
  target: T,
  object1?: U,
  object2?: V,
  object3?: W,
  object4?: X,
  object5?: Y,
  object6?: Z
): T & U & V & W & X & Y & Z => {
  const sources: Array<any> = [object1, object2, object3, object4, object5, object6];

  // Handle case when target is a string or something (possible in deep copy)
  if ((typeof target !== 'object' || isNull(target)) && !isFunction(target)) {
    target = {} as T;
  }

  each(sources, (source) => {
    // Extend the base object
    each(source, (_, key) => {
      const copy: any = source[key];

      // Prevent Object.prototype pollution
      // Prevent never-ending loop
      if (target === copy) {
        return true;
      }

      const copyIsArray = isArray(copy);

      // Recurse if we're merging plain objects or arrays
      if (copy && isPlainObject(copy)) {
        const src = target[key as keyof T];
        let clone: any = src;

        // Ensure proper type for the source value
        if (copyIsArray && !isArray(src)) {
          clone = [];
        } else if (!copyIsArray && !isPlainObject(src)) {
          clone = {};
        }

        // Never move original objects, clone them
        target[key as keyof T] = assignDeep(clone, copy) as any;
      } else {
        target[key as keyof T] = copyIsArray ? copy.slice() : copy;
      }
    });
  });

  // Return the modified object
  return target as any;
};

export const removeUndefinedProperties = <T extends PlainObject>(target: T, deep?: boolean): T =>
  each(assignDeep({}, target), (value, key, copy) => {
    if (value === undefined) {
      delete copy[key];
    } else if (deep && value && isPlainObject(value)) {
      copy[key as keyof typeof copy] = removeUndefinedProperties(value, deep) as any;
    }
  });

/**
 * Returns true if the given object is empty, false otherwise.
 * @param obj The Object.
 */
export const isEmptyObject = (obj: any): boolean => !keys(obj).length;
