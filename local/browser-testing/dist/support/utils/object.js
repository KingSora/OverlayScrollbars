import { isArray, isFunction, isPlainObject, isNull } from './types';
import { each } from './array';
/**
 * Determines whether the passed object has a property with the passed name.
 * @param obj The object.
 * @param prop The name of the property.
 */
export const hasOwnProperty = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
/**
 * Returns the names of the enumerable string properties and methods of an object.
 * @param obj The object of which the properties shall be returned.
 */
export const keys = (obj) => (obj ? Object.keys(obj) : []);
// https://github.com/jquery/jquery/blob/master/src/core.js#L116
export const assignDeep = (target, object1, object2, object3, object4, object5, object6) => {
    const sources = [object1, object2, object3, object4, object5, object6];
    // Handle case when target is a string or something (possible in deep copy)
    if ((typeof target !== 'object' || isNull(target)) && !isFunction(target)) {
        target = {};
    }
    each(sources, (source) => {
        // Extend the base object
        each(keys(source), (key) => {
            const copy = source[key];
            // Prevent Object.prototype pollution
            // Prevent never-ending loop
            if (target === copy) {
                return true;
            }
            const copyIsArray = isArray(copy);
            // Recurse if we're merging plain objects or arrays
            if (copy && (isPlainObject(copy) || copyIsArray)) {
                const src = target[key];
                let clone = src;
                // Ensure proper type for the source value
                if (copyIsArray && !isArray(src)) {
                    clone = [];
                }
                else if (!copyIsArray && !isPlainObject(src)) {
                    clone = {};
                }
                // Never move original objects, clone them
                target[key] = assignDeep(clone, copy);
            }
            else {
                target[key] = copy;
            }
        });
    });
    // Return the modified object
    return target;
};
/**
 * Returns true if the given object is empty, false otherwise.
 * @param obj The Object.
 */
export const isEmptyObject = (obj) => {
    /* eslint-disable no-restricted-syntax, guard-for-in */
    // eslint-disable-next-line no-unreachable-loop
    for (const name in obj)
        return false;
    return true;
    /* eslint-enable */
};
//# sourceMappingURL=object.js.map