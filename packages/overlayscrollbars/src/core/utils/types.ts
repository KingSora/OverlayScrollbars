import { PlainObject } from 'core/typings';

export const type: (obj: any) => string = (obj) => {
    if (obj === undefined)
        return obj + '';
    if (obj === null)
        return obj + '';
    return Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
}

export function isNumber(obj: any): obj is number {
    return typeof obj === 'number';
};

export function isString(obj: any): obj is string {
    return typeof obj === 'string';
}

export function isBoolean(obj: any): obj is boolean {
    return typeof obj === 'boolean';
}

export function isObject(obj: any): boolean {
    return typeof obj === 'object' && !isArray(obj) && !isNull(obj);
}

export function isFunction(obj: any): obj is Function {
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


/**
 * Returns true if the given object is array like, false otherwise.
 * @param obj The Object
 */
export function isArrayLike<T extends PlainObject = any>(obj: any): obj is ArrayLike<T> {
    const length = !!obj && obj.length;
    return isArray(obj) || (!isFunction(obj) && isNumber(length) && length > -1 && length % 1 == 0);
}

/**
 * Returns true if the given object is a "plain" (e.g. { key: value }) object, false otherwise. 
 * @param obj The Object.
 */
export function isPlainObject<T = any>(obj: any): obj is PlainObject<T> {
    if (!obj || !isObject(obj) || type(obj) !== 'object')
        return false;

    let key;
    const proto = 'prototype';
    const hasOwnProperty = Object[proto].hasOwnProperty;
    const hasOwnConstructor = hasOwnProperty.call(obj, 'constructor');
    const hasIsPrototypeOf = obj.constructor && obj.constructor[proto] && hasOwnProperty.call(obj.constructor[proto], 'isPrototypeOf');

    if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
        return false;
    }

    for (key in obj) { /**/ }

    return isUndefined(key) || hasOwnProperty.call(obj, key);
};

/**
 * Checks whether the given object is a HTMLElement.
 * @param obj The object which shall be checked.
 */
export function isHTMLElement(obj: any): obj is HTMLElement {
    const instaceOfRightHandSide = window.HTMLElement;
    const doInstanceOf = isObject(instaceOfRightHandSide) || isFunction(instaceOfRightHandSide);
    return !!(
        doInstanceOf ? obj instanceof instaceOfRightHandSide : (obj && isObject(obj) && obj.nodeType === 1 && isString(obj.nodeName))
    );
}

/**
 * Returns true if the given object is empty, false otherwise.
 * @param obj The Object.
 */
export function isEmptyObject(obj: any): boolean {
    for (let name in obj)
        return false;
    return true;
};