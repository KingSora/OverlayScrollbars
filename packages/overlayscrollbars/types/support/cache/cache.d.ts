declare type UpdateCachePropFunction<T, P extends keyof T> = (current?: T[P], previous?: T[P]) => T[P];
declare type EqualCachePropFunction<T, P extends keyof T> = (a?: T[P], b?: T[P]) => boolean;
export interface CacheEntry<T> {
    _value?: T;
    _previous?: T;
    _changed: boolean;
}
export declare type Cache<T> = {
    [P in keyof T]: CacheEntry<T[P]>;
};
export declare type CacheUpdated<T> = Cache<T> & {
    _anythingChanged: boolean;
};
export declare type CachePropsToUpdate<T> = Array<keyof T> | keyof T;
export declare type CacheUpdate<T> = (propsToUpdate?: CachePropsToUpdate<T> | null, force?: boolean) => CacheUpdated<T>;
export declare type CacheUpdateInfo<T> = {
    [P in keyof T]: UpdateCachePropFunction<T, P> | [UpdateCachePropFunction<T, P>, EqualCachePropFunction<T, P>];
};
export declare function createCache<T>(cacheUpdateInfo: CacheUpdateInfo<T>): CacheUpdate<T>;
export declare function createCache<T>(referenceObj: T, isReference: true): CacheUpdate<T>;
export {};
