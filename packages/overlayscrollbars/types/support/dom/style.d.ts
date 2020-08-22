declare type CssStyles = {
    [key: string]: string | number;
};
export declare function style(elm: HTMLElement | null, styles: CssStyles): void;
export declare function style(elm: HTMLElement | null, styles: string): string;
export declare function style(elm: HTMLElement | null, styles: Array<string> | string): {
    [key: string]: string;
};
export declare const hide: (elm: HTMLElement | null) => void;
export declare const show: (elm: HTMLElement | null) => void;
export {};
