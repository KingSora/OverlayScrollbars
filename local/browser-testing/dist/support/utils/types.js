const ElementNodeType = Node.ELEMENT_NODE;
const { toString, hasOwnProperty } = Object.prototype;
export const isUndefined = (obj) => obj === undefined;
export const isNull = (obj) => obj === null;
export const type = (obj) => isUndefined(obj) || isNull(obj)
    ? `${obj}`
    : toString
        .call(obj)
        .replace(/^\[object (.+)\]$/, '$1')
        .toLowerCase();
export const isNumber = (obj) => typeof obj === 'number';
export const isString = (obj) => typeof obj === 'string';
export const isBoolean = (obj) => typeof obj === 'boolean';
export const isFunction = (obj) => typeof obj === 'function';
export const isArray = (obj) => Array.isArray(obj);
export const isObject = (obj) => typeof obj === 'object' && !isArray(obj) && !isNull(obj);
/**
 * Returns true if the given object is array like, false otherwise.
 * @param obj The Object
 */
export const isArrayLike = (obj) => {
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
export const isPlainObject = (obj) => {
    if (!obj || !isObject(obj) || type(obj) !== 'object')
        return false;
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
export const isHTMLElement = (obj) => {
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
export const isElement = (obj) => {
    const instanceofObj = Element;
    return obj
        ? instanceofObj
            ? obj instanceof instanceofObj
            : obj.nodeType === ElementNodeType
        : false;
};
//# sourceMappingURL=types.js.map