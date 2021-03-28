import { CacheValues } from 'support';
export interface TrinsicObserver {
    _destroy(): void;
    _getCurrentCacheValues(force?: boolean): {
        _heightIntrinsic: CacheValues<boolean>;
    };
}
export declare const createTrinsicObserver: (target: HTMLElement, onTrinsicChangedCallback: (heightIntrinsic: CacheValues<boolean>) => any) => TrinsicObserver;
