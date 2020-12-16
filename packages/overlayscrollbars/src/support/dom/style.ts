import { each, keys } from 'support/utils';
import { isString, isNumber, isArray } from 'support/utils/types';
import { PlainObject } from 'typings';

export interface TRBL {
  t: number;
  r: number;
  b: number;
  l: number;
}

type CssStyles = { [key: string]: string | number };
const cssNumber = {
  animationiterationcount: 1,
  columncount: 1,
  fillopacity: 1,
  flexgrow: 1,
  flexshrink: 1,
  fontweight: 1,
  lineheight: 1,
  opacity: 1,
  order: 1,
  orphans: 1,
  widows: 1,
  zindex: 1,
  zoom: 1,
};

const parseToZeroOrNumber = (value: string, toFloat?: boolean): number => {
  /* istanbul ignore next */
  const num = toFloat ? parseFloat(value) : parseInt(value, 10);
  /* istanbul ignore next */
  return Number.isNaN(num) ? 0 : num;
};
const adaptCSSVal = (prop: string, val: string | number): string | number => (!cssNumber[prop.toLowerCase()] && isNumber(val) ? `${val}px` : val);
const getCSSVal = (elm: HTMLElement, computedStyle: CSSStyleDeclaration, prop: string): string =>
  /* istanbul ignore next */
  computedStyle != null ? computedStyle.getPropertyValue(prop) : elm.style[prop];
const setCSSVal = (elm: HTMLElement | null, prop: string, val: string | number): void => {
  try {
    if (elm && elm.style[prop] !== undefined) {
      elm.style[prop] = adaptCSSVal(prop, val);
    }
  } catch (e) {}
};

/**
 * Gets or sets the passed styles to the passed element.
 * @param elm The element to which the styles shall be applied to / be read from.
 * @param styles The styles which shall be set or read.
 */
export function style(elm: HTMLElement | null, styles: CssStyles): void;
export function style(elm: HTMLElement | null, styles: string): string;
export function style(elm: HTMLElement | null, styles: Array<string> | string): { [key: string]: string };
export function style(elm: HTMLElement | null, styles: CssStyles | Array<string> | string): { [key: string]: string } | string | void {
  const getSingleStyle = isString(styles);
  const getStyles = isArray(styles) || getSingleStyle;

  if (getStyles) {
    let getStylesResult: string | PlainObject = getSingleStyle ? '' : {};
    if (elm) {
      const computedStyle: CSSStyleDeclaration = window.getComputedStyle(elm, null);
      getStylesResult = getSingleStyle
        ? getCSSVal(elm, computedStyle, styles as string)
        : (styles as Array<string>).reduce((result, key) => {
            result[key] = getCSSVal(elm, computedStyle, key as string);
            return result;
          }, getStylesResult);
    }
    return getStylesResult;
  }
  each(keys(styles), (key) => setCSSVal(elm, key, styles[key]));
}

/**
 * Hides the passed element (display: none).
 * @param elm The element which shall be hidden.
 */
export const hide = (elm: HTMLElement | null): void => {
  style(elm, { display: 'none' });
};

/**
 * Shows the passed element (display: block).
 * @param elm The element which shall be shown.
 */
export const show = (elm: HTMLElement | null): void => {
  style(elm, { display: 'block' });
};

/**
 * Returns a top
 * @param elm
 * @param property
 */
export const topRightBottomLeft = (elm: HTMLElement | null, property?: string): TRBL => {
  const finalProp = property || '';
  const top = `${finalProp}-top`;
  const right = `${finalProp}-right`;
  const bottom = `${finalProp}-bottom`;
  const left = `${finalProp}-left`;
  const result = style(elm, [top, right, bottom, left]);
  return {
    t: parseToZeroOrNumber(result[top]),
    r: parseToZeroOrNumber(result[right]),
    b: parseToZeroOrNumber(result[bottom]),
    l: parseToZeroOrNumber(result[left]),
  };
};
