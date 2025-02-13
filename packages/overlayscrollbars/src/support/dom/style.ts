import type { PlainObject, StyleObject, StyleObjectKey, StyleObjectValue } from '../../typings';
import type { XY } from './offset';
import type { HTMLElementTarget } from './types';
import { wnd } from '../utils/alias';
import { each, from } from '../utils/array';
import { isString, isNumber, isObject, isNull, isBoolean } from '../utils/types';

export interface TRBL {
  t: number;
  r: number;
  b: number;
  l: number;
}

const getCSSVal = (computedStyle: CSSStyleDeclaration, prop: StyleObjectKey): string =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  computedStyle.getPropertyValue(prop) || computedStyle[prop as any] || '';

const validFiniteNumber = (number: number) => {
  const notNaN = number || 0;
  return isFinite(notNaN) ? notNaN : 0;
};

const parseToZeroOrNumber = (value?: string): number => validFiniteNumber(parseFloat(value || ''));

export const roundCssNumber = (value: number) => Math.round(value * 10000) / 10000;

export const ratioToCssPercent = (ratio: number) =>
  `${roundCssNumber(validFiniteNumber(ratio) * 100)}%`;

export const numberToCssPx = (number: number) => `${roundCssNumber(validFiniteNumber(number))}px`;

export function setStyles(
  elm: HTMLElementTarget,
  styles: StyleObject | false | null | undefined
): void {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  elm &&
    styles &&
    each(styles, (rawValue: StyleObjectValue, name) => {
      try {
        const elmStyle = elm.style;
        const value =
          isNull(rawValue) || isBoolean(rawValue)
            ? ''
            : isNumber(rawValue)
              ? numberToCssPx(rawValue)
              : rawValue;

        if (name.indexOf('--') === 0) {
          elmStyle.setProperty(name, value);
        } else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          elmStyle[name as any] = value;
        }
        // eslint-disable-next-line no-empty
      } catch {}
    });
}

export function getStyles(
  elm: HTMLElementTarget,
  styles: Array<StyleObjectKey> | ReadonlyArray<StyleObjectKey>,
  pseudoElm?: string | null | undefined
): Partial<Record<StyleObjectKey, string>>;
export function getStyles(
  elm: HTMLElementTarget,
  styles: StyleObjectKey,
  pseudoElm?: string | null | undefined
): string;
export function getStyles(
  elm: HTMLElementTarget,
  styles: Array<StyleObjectKey> | ReadonlyArray<StyleObjectKey> | StyleObjectKey,
  pseudoElm?: string | null | undefined
): Partial<Record<StyleObjectKey, string>> | string {
  const getSingleStyle = isString(styles);
  let getStylesResult: string | PlainObject = getSingleStyle ? '' : {};

  if (elm) {
    const computedStyle = wnd.getComputedStyle(elm, pseudoElm) || elm.style;
    getStylesResult = getSingleStyle
      ? getCSSVal(computedStyle, styles)
      : from(styles).reduce((result, key) => {
          result[key] = getCSSVal(computedStyle, key);
          return result;
        }, getStylesResult as PlainObject);
  }
  return getStylesResult;
}

/**
 * Returns the top right bottom left values of the passed css property.
 * @param elm The element of which the values shall be returned.
 * @param propertyPrefix The css property prefix. (e.g. "border")
 * @param propertySuffix The css property suffix. (e.g. "width")
 */
export const topRightBottomLeft = (
  elm?: HTMLElementTarget,
  propertyPrefix?: string,
  propertySuffix?: string
): TRBL => {
  const finalPrefix = propertyPrefix ? `${propertyPrefix}-` : '';
  const finalSuffix = propertySuffix ? `-${propertySuffix}` : '';
  const top = `${finalPrefix}top${finalSuffix}` as StyleObjectKey;
  const right = `${finalPrefix}right${finalSuffix}` as StyleObjectKey;
  const bottom = `${finalPrefix}bottom${finalSuffix}` as StyleObjectKey;
  const left = `${finalPrefix}left${finalSuffix}` as StyleObjectKey;
  const result = getStyles(elm, [top, right, bottom, left]);
  return {
    t: parseToZeroOrNumber(result[top]),
    r: parseToZeroOrNumber(result[right]),
    b: parseToZeroOrNumber(result[bottom]),
    l: parseToZeroOrNumber(result[left]),
  };
};

export const getTrasformTranslateValue = (
  value: string | number | XY<string | number>,
  isHorizontal?: boolean
) =>
  `translate${
    isObject(value) ? `(${value.x},${value.y})` : `${isHorizontal ? 'X' : 'Y'}(${value})`
  }`;
