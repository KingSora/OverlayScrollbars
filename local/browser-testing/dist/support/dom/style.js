import { each, keys } from '../utils';
import { isString, isNumber, isArray, isUndefined } from '../utils/types';
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
const parseToZeroOrNumber = (value, toFloat) => {
    /* istanbul ignore next */
    const num = toFloat ? parseFloat(value) : parseInt(value, 10);
    // num === num means num is not NaN
    /* istanbul ignore next */
    return num === num ? num : 0; // eslint-disable-line no-self-compare
};
const adaptCSSVal = (prop, val) => !cssNumber[prop.toLowerCase()] && isNumber(val) ? `${val}px` : val;
const getCSSVal = (elm, computedStyle, prop) => 
/* istanbul ignore next */
computedStyle != null
    ? computedStyle[prop] || computedStyle.getPropertyValue(prop)
    : elm.style[prop];
const setCSSVal = (elm, prop, val) => {
    try {
        const { style: elmStyle } = elm;
        if (!isUndefined(elmStyle[prop])) {
            elmStyle[prop] = adaptCSSVal(prop, val);
        }
        else {
            elmStyle.setProperty(prop, val);
        }
    }
    catch (e) { }
};
export function style(elm, styles) {
    const getSingleStyle = isString(styles);
    const getStyles = isArray(styles) || getSingleStyle;
    if (getStyles) {
        let getStylesResult = getSingleStyle ? '' : {};
        if (elm) {
            const computedStyle = window.getComputedStyle(elm, null);
            getStylesResult = getSingleStyle
                ? getCSSVal(elm, computedStyle, styles)
                : styles.reduce((result, key) => {
                    result[key] = getCSSVal(elm, computedStyle, key);
                    return result;
                }, getStylesResult);
        }
        return getStylesResult;
    }
    elm && each(keys(styles), (key) => setCSSVal(elm, key, styles[key]));
}
/**
 * Hides the passed element (display: none).
 * @param elm The element which shall be hidden.
 */
export const hide = (elm) => {
    style(elm, { display: 'none' });
};
/**
 * Shows the passed element (display: block).
 * @param elm The element which shall be shown.
 */
export const show = (elm) => {
    style(elm, { display: 'block' });
};
/**
 * Returns the top right bottom left values of the passed css property.
 * @param elm The element of which the values shall be returned.
 * @param propertyPrefix The css property prefix. (e.g. "border")
 * @param propertySuffix The css property suffix. (e.g. "width")
 */
export const topRightBottomLeft = (elm, propertyPrefix, propertySuffix) => {
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
//# sourceMappingURL=style.js.map