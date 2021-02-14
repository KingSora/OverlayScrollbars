export interface TRBL {
    t: number;
    r: number;
    b: number;
    l: number;
}
declare type CssStyles = {
    [key: string]: string | number;
};
/**
 * Gets or sets the passed styles to the passed element.
 * @param elm The element to which the styles shall be applied to / be read from.
 * @param styles The styles which shall be set or read.
 */
export declare function style(elm: HTMLElement | null | undefined, styles: CssStyles): void;
export declare function style(elm: HTMLElement | null | undefined, styles: string): string;
export declare function style(elm: HTMLElement | null | undefined, styles: Array<string> | string): {
    [key: string]: string;
};
/**
 * Hides the passed element (display: none).
 * @param elm The element which shall be hidden.
 */
export declare const hide: (elm: HTMLElement | null) => void;
/**
 * Shows the passed element (display: block).
 * @param elm The element which shall be shown.
 */
export declare const show: (elm: HTMLElement | null | undefined) => void;
/**
 * Returns a top
 * @param elm
 * @param property
 */
export declare const topRightBottomLeft: (elm: HTMLElement | null | undefined, property?: string | undefined) => TRBL;
export {};
