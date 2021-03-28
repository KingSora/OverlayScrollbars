import { CacheValues } from 'support';
export declare type SizeObserverOptions = {
    _direction?: boolean;
    _appear?: boolean;
};
export interface SizeObserver {
    _destroy(): void;
    _getCurrentCacheValues(force?: boolean): {
        _directionIsRTL: CacheValues<boolean>;
    };
}
export declare const createSizeObserver: (target: HTMLElement, onSizeChangedCallback: (directionIsRTLCache?: CacheValues<boolean> | undefined) => any, options?: SizeObserverOptions | undefined) => SizeObserver;
