import type { HTMLElementTarget } from './types';
import { bind, deduplicateArray, each, from, isArray } from '../utils';

export type AttributeElementTarget = HTMLElementTarget | Element;

export type DomTokens = string | string[] | false | null | undefined | void;

export const getDomTokensArray = (tokens: DomTokens) =>
  deduplicateArray((isArray(tokens) ? tokens : (tokens || '').split(' ')).filter((token) => token));

/**
 * Gets a attribute with the given attribute of the given element.
 * @param elm The element of which the attribute shall be get.
 * @param attrName The attribute name which shall be get.
 * @returns The attribute value or `null` when the attribute is not set or `false` if the element is undefined.
 */
export const getAttr = (elm: AttributeElementTarget, attrName: string) =>
  elm && elm.getAttribute(attrName);

/**
 * Returns whether the given attribute exists on the given element.
 * @param elm The element.
 * @param attrName The attribute.
 * @returns A Truthy value indicates a present attrubte.
 */
export const hasAttr = (elm: AttributeElementTarget, attrName: string) =>
  elm && elm.hasAttribute(attrName);

/**
 * Sets the given attributes to the given element.
 * @param elm The element of which the attributes shall be removed.
 * @param attrName The attribute names separated by a space.
 */
export const setAttrs = (
  elm: AttributeElementTarget,
  attrNames: string | string[],
  value: string | number | false | null | undefined
) => {
  each(getDomTokensArray(attrNames), (attrName) => {
    if (elm) {
      elm.setAttribute(attrName, String(value || ''));
    }
  });
};

/**
 * Removes the given attributes from the given element.
 * @param elm The element of which the attribute shall be removed.
 * @param attrName The attribute names separated by a space.
 */
export const removeAttrs = (elm: AttributeElementTarget, attrNames: string | string[]): void => {
  each(getDomTokensArray(attrNames), (attrName) => elm && elm.removeAttribute(attrName));
};

export const domTokenListAttr = (elm: AttributeElementTarget, attrName: string) => {
  const initialArr = getDomTokensArray(getAttr(elm, attrName));
  const setElmAttr = bind(setAttrs, elm, attrName);
  const domTokenListOperation = (operationTokens: DomTokens, operation: 'add' | 'delete') => {
    const initialArrSet = new Set(initialArr);
    each(getDomTokensArray(operationTokens), (token) => {
      initialArrSet[operation](token);
    });
    return from(initialArrSet).join(' ');
  };

  return {
    _remove: (removeTokens: DomTokens) => setElmAttr(domTokenListOperation(removeTokens, 'delete')),
    _add: (addTokens: DomTokens) => setElmAttr(domTokenListOperation(addTokens, 'add')),
    _has: (hasTokens: DomTokens) => {
      const tokenSet = getDomTokensArray(hasTokens);
      return tokenSet.reduce(
        (boolean, token) => boolean && initialArr.includes(token),
        tokenSet.length > 0
      );
    },
  };
};

/**
 * Treats the given attribute like the "class" attribute and removes the given value from it.
 * @param elm The element.
 * @param attrName The attributeName to which the value shall be removed.
 * @param value The value which shall be removed.
 */
export const removeAttrClass = (
  elm: AttributeElementTarget,
  attrName: string,
  value: DomTokens
): (() => void) => {
  domTokenListAttr(elm, attrName)._remove(value);
  return bind(addAttrClass, elm, attrName, value);
};

/**
 * Treats the given attribute like the "class" attribute and adds value to it.
 * @param elm The element.
 * @param attrName The attributeName to which the value shall be added.
 * @param value The value which shall be added.
 */
export const addAttrClass = (
  elm: AttributeElementTarget,
  attrName: string,
  value: DomTokens
): (() => void) => {
  domTokenListAttr(elm, attrName)._add(value);
  return bind(removeAttrClass, elm, attrName, value);
};

export const addRemoveAttrClass = (
  elm: AttributeElementTarget,
  attrName: string,
  value: DomTokens,
  add?: boolean
) => (add ? addAttrClass : removeAttrClass)(elm, attrName, value);

/**
 * Treats the given attribute like the "class" attribute and checks if the given value is in it.
 * @param elm The element.
 * @param attrName The attributeName from which the content shall be checked.
 * @param value The value.
 * @returns True if the given attribute has the value in it, false otherwise.
 */
export const hasAttrClass = (
  elm: AttributeElementTarget,
  attrName: string,
  value: DomTokens
): boolean => domTokenListAttr(elm, attrName)._has(value);
