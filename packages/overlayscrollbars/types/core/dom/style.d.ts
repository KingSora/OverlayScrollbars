declare type cssStyleObj = {
    [key: string]: string | number;
};
export declare function style(elm: HTMLElement, styles: string | cssStyleObj): string;
export declare function style(elm: HTMLElement, styles: string | cssStyleObj, val: string | number): void;
export declare const hide: (elm: HTMLElement) => void;
export declare const show: (elm: HTMLElement) => void;
export {};
