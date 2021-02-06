export interface Cache<T> {
    readonly _value?: T;
    readonly _previous?: T;
    readonly _changed: boolean;
}
export interface CacheOptions<T> {
    _equal?: EqualCachePropFunction<T>;
    _initialValue?: T;
    _alwaysUpdateValues?: boolean;
}
export declare type CacheUpdate<T, C> = undefined extends C ? (force?: boolean | 0, context?: C) => Cache<T> : (force: boolean | 0, context: C) => Cache<T>;
export declare type UpdateCachePropFunction<T, C> = undefined extends C ? (context?: C, current?: T, previous?: T) => T : C extends T ? ((context: C, current?: T, previous?: T) => T) | 0 : (context: C, current?: T, previous?: T) => T;
export declare type EqualCachePropFunction<T> = (currentVal?: T, newVal?: T) => boolean;
export declare const createCache: <T, C = undefined>(update: UpdateCachePropFunction<T, C>, options?: CacheOptions<T> | undefined) => CacheUpdate<T, C>;
