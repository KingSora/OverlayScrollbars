const elementHasDimensions = (elm) => !!(elm.offsetWidth || elm.offsetHeight || elm.getClientRects().length);
const zeroObj = {
    w: 0,
    h: 0,
};
/**
 * Returns the window inner- width and height.
 */
export const windowSize = () => ({
    w: window.innerWidth,
    h: window.innerHeight,
});
/**
 * Returns the scroll- width and height of the passed element. If the element is null the width and height values are 0.
 * @param elm The element of which the scroll- width and height shall be returned.
 */
export const offsetSize = (elm) => elm
    ? {
        w: elm.offsetWidth,
        h: elm.offsetHeight,
    }
    : zeroObj;
/**
 * Returns the client- width and height of the passed element. If the element is null the width and height values are 0.
 * @param elm The element of which the client- width and height shall be returned.
 */
export const clientSize = (elm) => elm
    ? {
        w: elm.clientWidth,
        h: elm.clientHeight,
    }
    : zeroObj;
/**
 * Returns the client- width and height of the passed element. If the element is null the width and height values are 0.
 * @param elm The element of which the client- width and height shall be returned.
 */
export const scrollSize = (elm) => elm
    ? {
        w: elm.scrollWidth,
        h: elm.scrollHeight,
    }
    : zeroObj;
/**
 * Returns the BoundingClientRect of the passed element.
 * @param elm The element of which the BoundingClientRect shall be returned.
 */
export const getBoundingClientRect = (elm) => elm.getBoundingClientRect();
/**
 * Determines whether the passed element has any dimensions.
 * @param elm The element.
 */
export const hasDimensions = (elm) => elm ? elementHasDimensions(elm) : false;
//# sourceMappingURL=dimensions.js.map