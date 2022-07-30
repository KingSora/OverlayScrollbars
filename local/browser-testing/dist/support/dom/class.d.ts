declare type ClassContainingElement = Node | Element | false | null | undefined;
declare type ClassName = string | false | null | undefined;
/**
 * Check whether the given element has the given class name(s).
 * @param elm The element.
 * @param className The class name(s).
 */
export declare const hasClass: (elm: ClassContainingElement, className: ClassName) => boolean;
/**
 * Removes the given class name(s) from the given element.
 * @param elm The element.
 * @param className The class name(s) which shall be removed. (separated by spaces)
 */
export declare const removeClass: (elm: ClassContainingElement, className: ClassName) => void;
/**
 * Adds the given class name(s) to the given element.
 * @param elm The element.
 * @param className The class name(s) which shall be added. (separated by spaces)
 * @returns A function which removes the added class name(s).
 */
export declare const addClass: (elm: ClassContainingElement, className: ClassName) => (() => void);
/**
 * Takes two className strings, compares them and returns the difference as array.
 * @param classNameA ClassName A.
 * @param classNameB ClassName B.
 */
export declare const diffClass: (classNameA: ClassName, classNameB: ClassName) => string[];
export {};
