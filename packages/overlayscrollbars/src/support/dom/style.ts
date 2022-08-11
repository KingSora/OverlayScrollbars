import { each, keys } from 'support/utils';
import { isString, isNumber, isArray, isUndefined } from 'support/utils/types';
import { PlainObject, StyleObject } from 'typings';

export interface TRBL {
  t: number;
  r: number;
  b: number;
  l: number;
}

const cssNumber = {
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
  zindex: 1,
};

const parseToZeroOrNumber = (value: string, toFloat?: boolean): number => {
  /* istanbul ignore next */
  const num = toFloat ? parseFloat(value) : parseInt(value, 10);
  // num === num means num is not NaN
  /* istanbul ignore next */
  return num === num ? num : 0; // eslint-disable-line no-self-compare
};

const adaptCSSVal = (prop: string, val: string | number): string | number =>
  !cssNumber[prop.toLowerCase()] && isNumber(val) ? `${val}px` : val;

const getCSSVal = (elm: HTMLElement, computedStyle: CSSStyleDeclaration, prop: string): string =>
  /* istanbul ignore next */
  computedStyle != null
    ? computedStyle[prop] || computedStyle.getPropertyValue(prop)
    : elm.style[prop];

const setCSSVal = (elm: HTMLElement, prop: string, val: string | number): void => {
  try {
    const { style: elmStyle } = elm;
    if (!isUndefined(elmStyle[prop])) {
      elmStyle[prop] = adaptCSSVal(prop, val);
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
export function style(elm: HTMLElement | false | null | undefined, styles: string): string;
export function style(
  elm: HTMLElement | false | null | undefined,
  styles: Array<string> | string
): { [key: string]: string };
export function style<CustomCssProps>(
  elm: HTMLElement | false | null | undefined,
  styles: StyleObject<CustomCssProps> | Array<string> | string
): { [key: string]: string } | string | void {
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
  elm && each(keys(styles), (key) => setCSSVal(elm, key, styles[key]));
}

export const directionIsRTL = (elm: HTMLElement | false | null | undefined): boolean =>
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
  const top = `${finalPrefix}top${finalSuffix}`;
  const right = `${finalPrefix}right${finalSuffix}`;
  const bottom = `${finalPrefix}bottom${finalSuffix}`;
  const left = `${finalPrefix}left${finalSuffix}`;
  const result = style(elm, [top, right, bottom, left]);
  return {
    t: parseToZeroOrNumber(result[top]),
    r: parseToZeroOrNumber(result[right]),
    b: parseToZeroOrNumber(result[bottom]),
    l: parseToZeroOrNumber(result[left]),
  };
};
