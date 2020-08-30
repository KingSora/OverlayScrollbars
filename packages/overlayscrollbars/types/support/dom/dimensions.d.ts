import { WH } from 'support/dom';
export declare const windowSize: () => WH;
export declare const offsetSize: (elm: HTMLElement | null) => WH;
export declare const clientSize: (elm: HTMLElement | null) => WH;
export declare const getBoundingClientRect: (elm: HTMLElement | null) => DOMRect;
