export interface WH<T = number> {
    w: T;
    h: T;
}
export declare const windowSize: () => WH;
export declare const offsetSize: (elm: HTMLElement | null) => WH;
export declare const clientSize: (elm: HTMLElement | null) => WH;
export declare const scrollSize: (elm: HTMLElement | null) => WH;
export declare const getBoundingClientRect: (elm: HTMLElement) => DOMRect;
export declare const hasDimensions: (elm: HTMLElement | null) => boolean;
