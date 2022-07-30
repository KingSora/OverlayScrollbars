import { getBoundingClientRect } from './dimensions';
const zeroObj = {
    x: 0,
    y: 0,
};
/**
 * Returns the offset- left and top coordinates of the passed element relative to the document. If the element is null the top and left values are 0.
 * @param elm The element of which the offset- top and left coordinates shall be returned.
 */
export const absoluteCoordinates = (elm) => {
    const rect = elm ? getBoundingClientRect(elm) : 0;
    return rect
        ? {
            x: rect.left + window.pageYOffset,
            y: rect.top + window.pageXOffset,
        }
        : zeroObj;
};
/**
 * Returns the offset- left and top coordinates of the passed element. If the element is null the top and left values are 0.
 * @param elm The element of which the offset- top and left coordinates shall be returned.
 */
export const offsetCoordinates = (elm) => elm
    ? {
        x: elm.offsetLeft,
        y: elm.offsetTop,
    }
    : zeroObj;
//# sourceMappingURL=offset.js.map