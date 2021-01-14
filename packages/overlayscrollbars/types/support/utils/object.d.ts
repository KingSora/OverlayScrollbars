export declare const hasOwnProperty: (obj: any, prop: string | number | symbol) => boolean;
export declare const keys: (obj: any) => Array<string>;
export declare function assignDeep<T, U>(target: T, object1: U): T & U;
export declare function assignDeep<T, U, V>(target: T, object1: U, object2: V): T & U & V;
export declare function assignDeep<T, U, V, W>(target: T, object1: U, object2: V, object3: W): T & U & V & W;
export declare function assignDeep<T, U, V, W, X>(target: T, object1: U, object2: V, object3: W, object4: X): T & U & V & W & X;
export declare function assignDeep<T, U, V, W, X, Y>(target: T, object1: U, object2: V, object3: W, object4: X, object5: Y): T & U & V & W & X & Y;
export declare function isEmptyObject(obj: any): boolean;
