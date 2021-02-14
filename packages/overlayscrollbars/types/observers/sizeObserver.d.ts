import { Cache } from 'support';
export declare type SizeObserverOptions = {
    _direction?: boolean;
    _appear?: boolean;
};
export declare const createSizeObserver: (target: HTMLElement, onSizeChangedCallback: (directionIsRTLCache?: Cache<boolean> | undefined) => any, options?: SizeObserverOptions | undefined) => (() => void);
