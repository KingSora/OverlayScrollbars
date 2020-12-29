import { Cache } from 'support';
import { CSSDirection } from 'typings';
export declare type SizeObserverOptions = {
    _direction?: boolean;
    _appear?: boolean;
};
export declare const createSizeObserver: (target: HTMLElement, onSizeChangedCallback: (directionCache?: Cache<CSSDirection> | undefined) => any, options?: SizeObserverOptions | undefined) => (() => void);
