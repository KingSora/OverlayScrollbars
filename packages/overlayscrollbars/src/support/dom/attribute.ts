import { from } from '~/support/utils/array';
import { isNumber, isString, isUndefined } from '~/support/utils/types';

type GetSetPropName = 'scrollLeft' | 'scrollTop' | 'value';

type Attr = {
  (elm: HTMLElement | false | null | undefined, attrName: string): string | null;
  (elm: HTMLElement | false | null | undefined, attrName: string, value: string): void;
  (elm: HTMLElement | false | null | undefined, attrName: string, value?: string):
    | string
    | null
    | void;
};

type GetSetProp<T> = {
  (elm: HTMLElement | false | null | undefined): T;
  (elm: HTMLElement | false | null | undefined, value: T | false | null): void;
  (elm: HTMLElement | false | null | undefined, value?: T | false | null): T | void;
};

const getSetProp = (
  topLeft: GetSetPropName,
  fallback: number | string,
  elm: HTMLElement | HTMLInputElement | false | null | undefined,
  value?: number | string | false | null
): number | string | void => {
  if (isUndefined(value)) {
    return elm ? elm[topLeft] : fallback;
  }
  elm && (isString(value) || isNumber(value)) && (elm[topLeft] = value);
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
    const currValues = attr(elm, attrName) || '';
    const currValuesSet = new Set(currValues.split(' '));
    currValuesSet[add ? 'add' : 'delete'](value);

    attr(elm, attrName, from(currValuesSet).join(' ').trim());
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
) => {
  const currValues = attr(elm, attrName) || '';
  const currValuesSet = new Set(currValues.split(' '));
  return currValuesSet.has(value);
};

/**
 * Removes the given attribute from the given element.
 * @param elm The element of which the attribute shall be removed.
 * @param attrName The attribute name.
 */
export const removeAttr = (elm: Element | false | null | undefined, attrName: string): void => {
  elm && elm.removeAttribute(attrName);
};

/**
 * Gets or sets the scrollLeft value of the given element depending whether the value attribute is given.
 * @param elm The element of which the scrollLeft value shall be get or set.
 * @param value The scrollLeft value which shall be set.
 */
export const scrollLeft = ((
  elm: HTMLElement | false | null | undefined,
  value?: number | false | null
): number | void => getSetProp('scrollLeft', 0, elm, value) as number) as GetSetProp<number>;

/**
 * Gets or sets the scrollTop value of the given element depending whether the value attribute is given.
 * @param elm The element of which the scrollTop value shall be get or set.
 * @param value The scrollTop value which shall be set.
 */
export const scrollTop = ((
  elm: HTMLElement | false | null | undefined,
  value?: number | false | null
): number | void => getSetProp('scrollTop', 0, elm, value) as number) as GetSetProp<number>;

/**
 * Gets or sets the value of the given input element depending whether the value attribute is given.
 * @param elm The input element of which the value shall be get or set.
 * @param value The value which shall be set.
 */
export const val = ((
  elm: HTMLInputElement | false | null | undefined,
  value?: string
): string | void => getSetProp('value', '', elm, value) as string) as GetSetProp<string>;
