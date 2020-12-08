declare type Direction = 'ltr' | 'rtl';
export declare type SizeObserverOptions = {
    _direction?: boolean;
    _appear?: boolean;
};
export declare const createSizeObserver: (target: HTMLElement, onSizeChangedCallback: (direction?: "ltr" | "rtl" | undefined) => any, options?: SizeObserverOptions | undefined) => (() => void);
export {};
