import { CacheValues } from 'support';
export interface TrinsicObserver {
    _destroy(): void;
    _getCurrentCacheValues(force?: boolean): {
        _heightIntrinsic: CacheValues<boolean>;
    };
}
/**
 * Creates a trinsic observer which observes changes to intrinsic or extrinsic sizing for the height of the target element.
 * @param target The element which shall be observed.
 * @param onTrinsicChangedCallback The callback which gets called after a change was detected.
 * @returns A object which represents the instance of the trinsic observer.
 */
export declare const createTrinsicObserver: (target: HTMLElement, onTrinsicChangedCallback: (heightIntrinsic: CacheValues<boolean>) => any) => TrinsicObserver;
