export interface WH<T = number> {
    w: T;
    h: T;
}
/**
 * Returns the window inner- width and height.
 */
export declare const windowSize: () => WH;
/**
 * Returns the scroll- width and height of the passed element. If the element is null the width and height values are 0.
 * @param elm The element of which the scroll- width and height shall be returned.
 */
export declare const offsetSize: (elm: HTMLElement | null | undefined) => WH;
/**
 * Returns the client- width and height of the passed element. If the element is null the width and height values are 0.
 * @param elm The element of which the client- width and height shall be returned.
 */
export declare const clientSize: (elm: HTMLElement | null | undefined) => WH;
/**
 * Returns the client- width and height of the passed element. If the element is null the width and height values are 0.
 * @param elm The element of which the client- width and height shall be returned.
 */
export declare const scrollSize: (elm: HTMLElement | null | undefined) => WH;
/**
 * Returns the BoundingClientRect of the passed element.
 * @param elm The element of which the BoundingClientRect shall be returned.
 */
export declare const getBoundingClientRect: (elm: HTMLElement) => DOMRect;
/**
 * Determines whether the passed element has any dimensions.
 * @param elm The element.
 */
export declare const hasDimensions: (elm: HTMLElement | null | undefined) => boolean;
