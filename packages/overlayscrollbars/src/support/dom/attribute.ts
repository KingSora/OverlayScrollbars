import { isUndefined } from 'support/utils/types';

type GetSetPropName = 'scrollLeft' | 'scrollTop' | 'value';

function getSetProp(
  topLeft: GetSetPropName,
  fallback: number | string,
  elm: HTMLElement | HTMLInputElement | null,
  value?: number | string
): number | string | void {
  if (isUndefined(value)) {
    return elm ? elm[topLeft] : fallback;
  }
  elm && (elm[topLeft] = value);
}

/**
 * Gets or sets a attribute with the given attribute of the given element depending whether the value attribute is given.
 * Returns null if the element has no attribute with the given name.
 * @param elm The element of which the attribute shall be get or set.
 * @param attrName The attribute name which shall be get or set.
 * @param value The value of the attribute which shall be set.
 */
export function attr(elm: HTMLElement | null, attrName: string): string | null;
export function attr(elm: HTMLElement | null, attrName: string, value: string): void;
export function attr(elm: HTMLElement | null, attrName: string, value?: string): string | null | void {
  if (isUndefined(value)) {
    return elm ? elm.getAttribute(attrName) : null;
  }
  elm && elm.setAttribute(attrName, value);
}

/**
 * Removes the given attribute from the given element.
 * @param elm The element of which the attribute shall be removed.
 * @param attrName The attribute name.
 */
export const removeAttr = (elm: Element | null, attrName: string): void => {
  elm?.removeAttribute(attrName);
};

/**
 * Gets or sets the scrollLeft value of the given element depending whether the value attribute is given.
 * @param elm The element of which the scrollLeft value shall be get or set.
 * @param value The scrollLeft value which shall be set.
 */
export function scrollLeft(elm: HTMLElement | null): number;
export function scrollLeft(elm: HTMLElement | null, value: number): void;
export function scrollLeft(elm: HTMLElement | null, value?: number): number | void {
  return getSetProp('scrollLeft', 0, elm, value) as number;
}

/**
 * Gets or sets the scrollTop value of the given element depending whether the value attribute is given.
 * @param elm The element of which the scrollTop value shall be get or set.
 * @param value The scrollTop value which shall be set.
 */
export function scrollTop(elm: HTMLElement | null): number;
export function scrollTop(elm: HTMLElement | null, value: number): void;
export function scrollTop(elm: HTMLElement | null, value?: number): number | void {
  return getSetProp('scrollTop', 0, elm, value) as number;
}

/**
 * Gets or sets the value of the given input element depending whether the value attribute is given.
 * @param elm The input element of which the value shall be get or set.
 * @param value The value which shall be set.
 */
export function val(elm: HTMLInputElement | null): string;
export function val(elm: HTMLInputElement | null, value: string): void;
export function val(elm: HTMLInputElement | null, value?: string): string | void {
  return getSetProp('value', '', elm, value) as string;
}
