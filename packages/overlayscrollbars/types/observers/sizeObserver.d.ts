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
/**
 * Creates a size observer which observes any size, padding, margin and border changes of the target element. Depending on the options also direction and appear can be observed.
 * @param target The target element which shall be observed.
 * @param onSizeChangedCallback The callback which gets called after a size change was detected.
 * @param options The options for size detection, whether to observe also direction and appear.
 * @returns A object which represents the instance of the size observer.
 */
export declare const createSizeObserver: (target: HTMLElement, onSizeChangedCallback: (directionIsRTLCache?: CacheValues<boolean> | undefined) => any, options?: SizeObserverOptions | undefined) => SizeObserver;
