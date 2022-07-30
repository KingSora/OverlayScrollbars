/**
 * Determines whether the passed object has a property with the passed name.
 * @param obj The object.
 * @param prop The name of the property.
 */
export declare const hasOwnProperty: (obj: any, prop: string | number | symbol) => boolean;
/**
 * Returns the names of the enumerable string properties and methods of an object.
 * @param obj The object of which the properties shall be returned.
 */
export declare const keys: (obj: any) => Array<string>;
declare type AssignDeep = {
    <T, U>(target: T, object1: U): T & U;
    <T, U, V>(target: T, object1: U, object2: V): T & U & V;
    <T, U, V, W>(target: T, object1: U, object2: V, object3: W): T & U & V & W;
    <T, U, V, W, X>(target: T, object1: U, object2: V, object3: W, object4: X): T & U & V & W & X;
    <T, U, V, W, X, Y>(target: T, object1: U, object2: V, object3: W, object4: X, object5: Y): T & U & V & W & X & Y;
    <T, U, V, W, X, Y, Z>(target: T, object1?: U, object2?: V, object3?: W, object4?: X, object5?: Y, object6?: Z): T & U & V & W & X & Y & Z;
};
export declare const assignDeep: AssignDeep;
/**
 * Returns true if the given object is empty, false otherwise.
 * @param obj The Object.
 */
export declare const isEmptyObject: (obj: any) => boolean;
export {};
