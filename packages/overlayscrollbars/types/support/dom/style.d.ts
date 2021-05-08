import { StyleObject } from 'typings';
export interface TRBL {
    t: number;
    r: number;
    b: number;
    l: number;
}
/**
 * Gets or sets the passed styles to the passed element.
 * @param elm The element to which the styles shall be applied to / be read from.
 * @param styles The styles which shall be set or read.
 */
export declare function style<CustomCssProps>(elm: HTMLElement | false | null | undefined, styles: StyleObject<CustomCssProps>): void;
export declare function style<CustomCssProps>(elm: HTMLElement | false | null | undefined, styles: string): string;
export declare function style<CustomCssProps>(elm: HTMLElement | false | null | undefined, styles: Array<string> | string): {
    [key: string]: string;
};
/**
 * Hides the passed element (display: none).
 * @param elm The element which shall be hidden.
 */
export declare const hide: (elm: HTMLElement | false | null | undefined) => void;
/**
 * Shows the passed element (display: block).
 * @param elm The element which shall be shown.
 */
export declare const show: (elm: HTMLElement | false | null | undefined) => void;
/**
 * Returns the top right bottom left values of the passed css property.
 * @param elm The element of which the values shall be returned.
 * @param propertyPrefix The css property prefix. (e.g. "border")
 * @param propertySuffix The css property suffix. (e.g. "width")
 */
export declare const topRightBottomLeft: (elm?: HTMLElement | false | null | undefined, propertyPrefix?: string | undefined, propertySuffix?: string | undefined) => TRBL;
