import { isArray, isFunction, isPlainObject, isNull } from 'support/utils/types';
import { each } from 'support/utils/array';

/**
 * Determines whether the passed object has a property with the passed name.
 * @param obj The object.
 * @param prop The name of the property.
 */
export const hasOwnProperty = (obj: any, prop: string | number | symbol): boolean => Object.prototype.hasOwnProperty.call(obj, prop);

/**
 * Returns the names of the enumerable string properties and methods of an object.
 * @param obj The object of which the properties shall be returned.
 */
export const keys = (obj: any): Array<string> => (obj ? Object.keys(obj) : []);

// https://github.com/jquery/jquery/blob/master/src/core.js#L116
export function assignDeep<T, U>(target: T, object1: U): T & U;
export function assignDeep<T, U, V>(target: T, object1: U, object2: V): T & U & V;
export function assignDeep<T, U, V, W>(target: T, object1: U, object2: V, object3: W): T & U & V & W;
export function assignDeep<T, U, V, W, X>(target: T, object1: U, object2: V, object3: W, object4: X): T & U & V & W & X;
export function assignDeep<T, U, V, W, X, Y>(target: T, object1: U, object2: V, object3: W, object4: X, object5: Y): T & U & V & W & X & Y;
export function assignDeep<T, U, V, W, X, Y, Z>(
  target: T,
  object1?: U,
  object2?: V,
  object3?: W,
  object4?: X,
  object5?: Y,
  object6?: Z
): T & U & V & W & X & Y & Z {
  const sources: Array<any> = [object1, object2, object3, object4, object5, object6];

  // Handle case when target is a string or something (possible in deep copy)
  if ((typeof target !== 'object' || isNull(target)) && !isFunction(target)) {
    target = {} as T;
  }

  each(sources, (source) => {
    // Extend the base object
    each(keys(source), (key) => {
      const copy: any = source[key];

      // Prevent Object.prototype pollution
      // Prevent never-ending loop
      if (target === copy) {
        return true;
      }

      const copyIsArray = isArray(copy);

      // Recurse if we're merging plain objects or arrays
      if (copy && (isPlainObject(copy) || copyIsArray)) {
        const src = target[key];
        let clone: any = src;

        // Ensure proper type for the source value
        if (copyIsArray && !isArray(src)) {
          clone = [];
        } else if (!copyIsArray && !isPlainObject(src)) {
          clone = {};
        }

        // Never move original objects, clone them
        target[key] = assignDeep(clone, copy) as any;
      } else {
        target[key] = copy;
      }
    });
  });

  // Return the modified object
  return target as any;
}
