export interface TRBL {
    t: number;
    r: number;
    b: number;
    l: number;
}
declare type CssStyles = {
    [key: string]: string | number;
};
export declare function style(elm: HTMLElement | null | undefined, styles: CssStyles): void;
export declare function style(elm: HTMLElement | null | undefined, styles: string): string;
export declare function style(elm: HTMLElement | null | undefined, styles: Array<string> | string): {
    [key: string]: string;
};
export declare const hide: (elm: HTMLElement | null) => void;
export declare const show: (elm: HTMLElement | null | undefined) => void;
export declare const topRightBottomLeft: (elm: HTMLElement | null | undefined, property?: string | undefined) => TRBL;
export {};
