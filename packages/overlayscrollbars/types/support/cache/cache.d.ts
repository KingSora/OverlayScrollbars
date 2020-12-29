export interface Cache<T> {
    readonly _value?: T;
    readonly _previous?: T;
    readonly _changed: boolean;
}
export interface CacheOptions<T> {
    _equal?: EqualCachePropFunction<T>;
    _initialValue?: T;
}
export declare type CacheUpdate<T, C> = (force?: boolean | 0, context?: C) => Cache<T>;
export declare type UpdateCachePropFunction<T, C> = (context?: C, current?: T, previous?: T) => T;
export declare type EqualCachePropFunction<T> = (a?: T, b?: T) => boolean;
export declare const createCache: <T, C = undefined>(update: UpdateCachePropFunction<T, C>, options?: CacheOptions<T> | undefined) => CacheUpdate<T, C>;
