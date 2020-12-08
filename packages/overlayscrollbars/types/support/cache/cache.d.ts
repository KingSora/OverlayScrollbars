declare type UpdateCachePropFunction<T, P extends keyof T> = (current?: T[P], previous?: T[P]) => T[P];
declare type EqualCachePropFunction<T, P extends keyof T> = (a?: T[P], b?: T[P]) => boolean;
export declare type CachePropsToUpdate<T> = Array<keyof T> | keyof T;
export declare type CacheUpdate<T> = (propsToUpdate?: CachePropsToUpdate<T>, force?: boolean) => CacheUpdated<T>;
export declare type CacheUpdated<T> = {
    [P in keyof T]?: T[P];
};
export declare type CacheUpdateInfo<T> = {
    [P in keyof T]: UpdateCachePropFunction<T, P> | [UpdateCachePropFunction<T, P>, EqualCachePropFunction<T, P>];
};
export declare const createCache: <T>(cacheUpdateInfo: CacheUpdateInfo<T>) => CacheUpdate<T>;
export {};
