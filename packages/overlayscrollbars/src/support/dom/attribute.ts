import type { AttributeTarget } from './types';
import { isUndefined } from '../utils/types';
import { bind, from } from '../utils';

type Attr = {
  (elm: AttributeTarget, attrName: string): string | null;
  (elm: AttributeTarget, attrName: string, value: string): void;
  (elm: AttributeTarget, attrName: string, value?: string): string | null | void;
};

export type DomTokens = string | false | null | undefined | void;

/**
 * Gets or sets a attribute with the given attribute of the given element depending whether the value attribute is given.
 * Returns null if the element has no attribute with the given name.
 * @param elm The element of which the attribute shall be get or set.
 * @param attrName The attribute name which shall be get or set.
 * @param value The value of the attribute which shall be set.
 */
export const attr = ((
  elm: AttributeTarget,
  attrName: string,
  value?: string
): string | null | void => {
  if (isUndefined(value)) {
    return elm ? elm.getAttribute(attrName) : null;
  }
  elm && elm.setAttribute(attrName, value);
}) as Attr;

/**
 * Removes the given attribute from the given element.
 * @param elm The element of which the attribute shall be removed.
 * @param attrName The attribute name.
 */
export const removeAttr = (elm: AttributeTarget, attrName: string): void => {
  elm && elm.removeAttribute(attrName);
};

export const domTokenListAttr = (elm: AttributeTarget, attrName: string) => {
  const elmAttr = bind(attr, elm, attrName);
  const getDomTokenListSet = (tokens: DomTokens) =>
    new Set((tokens || '').split(' ').filter((token) => !!token));
  const domTokenListOperation = (
    initialSet: Set<string>,
    operationTokens: DomTokens,
    operation: 'add' | 'delete'
  ) => {
    const initialSetCopy = new Set(initialSet);
    getDomTokenListSet(operationTokens).forEach((token) => {
      initialSetCopy[operation](token);
    });
    return from(initialSetCopy).join(' ');
  };
  const initialSet = getDomTokenListSet(elmAttr());

  return {
    _remove: (removeTokens: DomTokens) =>
      elmAttr(domTokenListOperation(initialSet, removeTokens, 'delete')),
    _add: (addTokens: DomTokens) => elmAttr(domTokenListOperation(initialSet, addTokens, 'add')),
    _has: (hasTokens: DomTokens) => {
      const tokenSet = getDomTokenListSet(hasTokens);
      return from(tokenSet).reduce(
        (boolean, token) => boolean && initialSet.has(token),
        tokenSet.size > 0
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
export const removeAttrClass = (elm: AttributeTarget, attrName: string, value: string) => {
  domTokenListAttr(elm, attrName)._remove(value);
};

/**
 * Treats the given attribute like the "class" attribute and adds value to it.
 * @param elm The element.
 * @param attrName The attributeName to which the value shall be added.
 * @param value The value which shall be added.
 */
export const addAttrClass = (elm: AttributeTarget, attrName: string, value: string) => {
  domTokenListAttr(elm, attrName)._add(value);
  return bind(removeAttrClass, elm, attrName, value);
};

export const addRemoveAttrClass = (
  elm: AttributeTarget,
  attrName: string,
  value: string,
  add?: boolean
) => {
  (add ? addAttrClass : removeAttrClass)(elm, attrName, value);
};

/**
 * Treats the given attribute like the "class" attribute and checks if the given value is in it.
 * @param elm The element.
 * @param attrName The attributeName from which the content shall be checked.
 * @param value The value.
 * @returns True if the given attribute has the value in it, false otherwise.
 */
export const hasAttrClass = (elm: AttributeTarget, attrName: string, value: string): boolean =>
  domTokenListAttr(elm, attrName)._has(value);
