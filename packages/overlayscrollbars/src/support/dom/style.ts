import { each, keys } from '~/support/utils';
import { isString, isNumber, isArray, isUndefined } from '~/support/utils/types';
import type { PlainObject, StyleObject, StyleObjectKey } from '~/typings';

export interface TRBL {
  t: number;
  r: number;
  b: number;
  l: number;
}

export type CSSStyleProperty = Extract<keyof CSSStyleDeclaration, string>;

const cssNumber: Partial<Record<CSSStyleProperty, number>> = {
  // animationiterationcount: 1,
  // columncount: 1,
  // fillopacity: 1,
  // flexgrow: 1,
  // flexshrink: 1,
  // fontweight: 1,
  // lineheight: 1,
  // order: 1,
  // orphans: 1,
  // widows: 1,
  // zoom: 1,
  opacity: 1,
  zIndex: 1,
};

const parseToZeroOrNumber = (value?: string, toFloat?: boolean): number => {
  const finalValue = value || '';
  /* istanbul ignore next */
  const num = toFloat ? parseFloat(finalValue) : parseInt(finalValue, 10);
  // num === num means num is not NaN
  /* istanbul ignore next */
  return num === num ? num : 0; // eslint-disable-line no-self-compare
};

const adaptCSSVal = (prop: CSSStyleProperty, val: string | number): string | number =>
  !cssNumber[prop] && isNumber(val) ? `${val}px` : val;

const getCSSVal = (
  elm: HTMLElement,
  computedStyle: CSSStyleDeclaration,
  prop: CSSStyleProperty
): string =>
  String(
    /* istanbul ignore next */
    (computedStyle != null
      ? computedStyle[prop] || computedStyle.getPropertyValue(prop)
      : elm.style[prop]) || ''
  );

const setCSSVal = (elm: HTMLElement, prop: StyleObjectKey, val: string | number): void => {
  try {
    const { style: elmStyle } = elm;

    if (!isUndefined(elmStyle[prop])) {
      elmStyle[prop as any] = adaptCSSVal(prop, val) as string;
    } else {
      elmStyle.setProperty(prop, val as string);
    }
  } catch (e) {}
};

/**
 * Gets or sets the passed styles to the passed element.
 * @param elm The element to which the styles shall be applied to / be read from.
 * @param styles The styles which shall be set or read.
 */
export function style<CustomCssProps>(
  elm: HTMLElement | false | null | undefined,
  styles: StyleObject<CustomCssProps>
): void;
export function style(elm: HTMLElement | false | null | undefined, styles: StyleObjectKey): string;
export function style(
  elm: HTMLElement | false | null | undefined,
  styles: Array<StyleObjectKey> | StyleObjectKey
): Partial<Record<StyleObjectKey, string>>;
export function style<CustomCssProps>(
  elm: HTMLElement | false | null | undefined,
  styles: StyleObject<CustomCssProps> | Array<StyleObjectKey> | StyleObjectKey
): Partial<Record<StyleObjectKey, string>> | string | void {
  const getSingleStyle = isString(styles);
  const getStyles = isArray(styles) || getSingleStyle;

  if (getStyles) {
    let getStylesResult: string | PlainObject = getSingleStyle ? '' : {};
    if (elm) {
      const computedStyle: CSSStyleDeclaration = window.getComputedStyle(elm, null);
      getStylesResult = getSingleStyle
        ? getCSSVal(elm, computedStyle, styles)
        : styles.reduce((result, key) => {
            result[key] = getCSSVal(elm, computedStyle, key);
            return result;
          }, getStylesResult as PlainObject);
    }
    return getStylesResult;
  }
  elm &&
    each(keys(styles), (key: StyleObjectKey) =>
      setCSSVal(elm, key, styles[key as keyof typeof styles]!)
    );
}

export const getDirectionIsRTL = (elm: HTMLElement | false | null | undefined): boolean =>
  style(elm, 'direction') === 'rtl';

/**
 * Returns the top right bottom left values of the passed css property.
 * @param elm The element of which the values shall be returned.
 * @param propertyPrefix The css property prefix. (e.g. "border")
 * @param propertySuffix The css property suffix. (e.g. "width")
 */
export const topRightBottomLeft = (
  elm?: HTMLElement | false | null | undefined,
  propertyPrefix?: string,
  propertySuffix?: string
): TRBL => {
  const finalPrefix = propertyPrefix ? `${propertyPrefix}-` : '';
  const finalSuffix = propertySuffix ? `-${propertySuffix}` : '';
  const top = `${finalPrefix}top${finalSuffix}` as StyleObjectKey;
  const right = `${finalPrefix}right${finalSuffix}` as StyleObjectKey;
  const bottom = `${finalPrefix}bottom${finalSuffix}` as StyleObjectKey;
  const left = `${finalPrefix}left${finalSuffix}` as StyleObjectKey;
  const result = style(elm, [top, right, bottom, left]);
  return {
    t: parseToZeroOrNumber(result[top], true),
    r: parseToZeroOrNumber(result[right], true),
    b: parseToZeroOrNumber(result[bottom], true),
    l: parseToZeroOrNumber(result[left], true),
  };
};

export const getTrasformTranslateValue = (
  value: string | number | [x: string | number, y: string | number],
  isHorizontal?: boolean
) =>
  `translate${
    isArray(value) ? `(${value[0]},${value[1]})` : `${isHorizontal ? 'X' : 'Y'}(${value})`
  }`;
