export interface XY<T = number> {
    x: T;
    y: T;
}
/**
 * Returns the offset- left and top coordinates of the passed element relative to the document. If the element is null the top and left values are 0.
 * @param elm The element of which the offset- top and left coordinates shall be returned.
 */
export declare const absoluteCoordinates: (elm: HTMLElement | null | undefined) => XY;
/**
 * Returns the offset- left and top coordinates of the passed element. If the element is null the top and left values are 0.
 * @param elm The element of which the offset- top and left coordinates shall be returned.
 */
export declare const offsetCoordinates: (elm: HTMLElement | null | undefined) => XY;
