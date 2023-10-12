import { from } from '../utils/array';
import { isUndefined } from '../utils/types';

type Attr = {
  (elm: HTMLElement | false | null | undefined, attrName: string): string | null;
  (elm: HTMLElement | false | null | undefined, attrName: string, value: string): void;
  (elm: HTMLElement | false | null | undefined, attrName: string, value?: string):
    | string
    | null
    | void;
};

/**
 * Gets or sets a attribute with the given attribute of the given element depending whether the value attribute is given.
 * Returns null if the element has no attribute with the given name.
 * @param elm The element of which the attribute shall be get or set.
 * @param attrName The attribute name which shall be get or set.
 * @param value The value of the attribute which shall be set.
 */
export const attr = ((
  elm: HTMLElement | false | null | undefined,
  attrName: string,
  value?: string
): string | null | void => {
  if (isUndefined(value)) {
    return elm ? elm.getAttribute(attrName) : null;
  }
  elm && elm.setAttribute(attrName, value);
}) as Attr;

const getValueSet = (elm: HTMLElement | false | null | undefined, attrName: string) =>
  new Set((attr(elm, attrName) || '').split(' '));

/**
 * Removes the given attribute from the given element.
 * @param elm The element of which the attribute shall be removed.
 * @param attrName The attribute name.
 */
export const removeAttr = (elm: Element | false | null | undefined, attrName: string): void => {
  elm && elm.removeAttribute(attrName);
};

/**
 * Treats the given attribute like the "class" attribute and adds or removes the given value from it.
 * @param elm The element.
 * @param attrName The attributeName to which the value shall be added or removed.
 * @param value The value which shall be added or removed.
 * @param add True if the value shall be added, false otherwise.
 */
export const attrClass = (
  elm: HTMLElement | false | null | undefined,
  attrName: string,
  value: string,
  add?: boolean
) => {
  if (value) {
    const currValuesSet = getValueSet(elm, attrName);
    currValuesSet[add ? 'add' : 'delete'](value);
    const newTokens = from(currValuesSet).join(' ').trim();
    attr(elm, attrName, newTokens);
  }
};

/**
 * Treats the given attribute like the "class" attribute and checks if the given value is in it.
 * @param elm The element.
 * @param attrName The attributeName from which the content shall be checked.
 * @param value The value.
 * @returns True if the given attribute has the value in it, false otherwise.
 */
export const hasAttrClass = (
  elm: HTMLElement | false | null | undefined,
  attrName: string,
  value: string
) => getValueSet(elm, attrName).has(value);
